import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import SOURCES from "../constants/sources.js";
import CLASSIFICATION from "../constants/classification.js";
import { calculateVariance } from "./variance.service.js";

export const reconcileTransactions = async () => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch all transactions that should reconcile
    const allTransactions = await Transaction.find({
      shouldReconcile: true,
    }).session(session);

    const statementOps = [];
    const settlementOps = [];

    // Separate by source
    const statementMap = new Map(); // Pin -> Transaction
    const settlementMap = new Map(); // Pin -> Transaction

    // Check for multiple records per pin?
    // If multiple exist, we might overwrite in Map.
    // Ideally we'd handle arrays.

    const statementTxns = allTransactions.filter(
      (t) => t.source === SOURCES.STATEMENT,
    );
    const settlementTxns = allTransactions.filter(
      (t) => t.source === SOURCES.SETTLEMENT,
    );

    statementTxns.forEach((t) => {
      if (!statementMap.has(t.partnerPin)) {
        statementMap.set(t.partnerPin, []);
      }
      statementMap.get(t.partnerPin).push(t);
    });

    settlementTxns.forEach((t) => {
      if (!settlementMap.has(t.partnerPin)) {
        settlementMap.set(t.partnerPin, []);
      }
      settlementMap.get(t.partnerPin).push(t);
    });

    // Lists for bulk update
    const updates = [];

    // 1. Check entries in Statement
    for (const [pin, sTxns] of statementMap) {
      const settTxns = settlementMap.get(pin);

      if (settTxns) {
        // Present in BOTH -> Class 5
        sTxns.forEach((sTxn) => {
          // Find corresponding settlement txn for variance?
          // We just take the first one or sum?
          // Simple approach: Use first settlement txn's amount
          const matchingSettlement = settTxns[0];
          const variance = calculateVariance(
            matchingSettlement.settlementAmountUSD,
            sTxn.statementAmount,
          );

          updates.push({
            updateOne: {
              filter: { _id: sTxn._id },
              update: {
                classification: CLASSIFICATION.PRESENT_IN_BOTH,
                varianceAmount: variance,
              },
            },
          });
        });
      } else {
        // Present in Statement Only -> Class 7
        sTxns.forEach((sTxn) => {
          updates.push({
            updateOne: {
              filter: { _id: sTxn._id },
              update: {
                classification: CLASSIFICATION.PRESENT_IN_STATEMENT_ONLY,
              },
            },
          });
        });
      }
    }

    // 2. Check entries in Settlement
    for (const [pin, settTxns] of settlementMap) {
      const sTxns = statementMap.get(pin);

      if (sTxns) {
        // Present in BOTH (Already handled Statement side, need to update Settlement side)
        settTxns.forEach((settTxn) => {
          const matchingStatement = sTxns[0];
          const variance = calculateVariance(
            settTxn.settlementAmountUSD,
            matchingStatement.statementAmount,
          );

          updates.push({
            updateOne: {
              filter: { _id: settTxn._id },
              update: {
                classification: CLASSIFICATION.PRESENT_IN_BOTH,
                varianceAmount: variance,
              },
            },
          });
        });
      } else {
        // Present in Settlement Only -> Class 6
        settTxns.forEach((settTxn) => {
          updates.push({
            updateOne: {
              filter: { _id: settTxn._id },
              update: {
                classification: CLASSIFICATION.PRESENT_IN_SETTLEMENT_ONLY,
              },
            },
          });
        });
      }
    }

    if (updates.length > 0) {
      await Transaction.bulkWrite(updates, { session });
    }

    await session.commitTransaction();

    return {
      paramsProcessed: allTransactions.length,
      updatesMade: updates.length,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
