import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";
import {
  parseStatement,
  parseSettlement,
} from "../services/excelParser.service.js";
import { identifyDuplicates } from "../services/duplicate.service.js";
import { tagShouldReconcile } from "../services/shouldReconcile.service.js";
import SOURCES from "../constants/sources.js";

export const uploadFile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { source } = req.body;

    // Check if source matches any value in SOURCES object
    if (!source || !Object.values(SOURCES).includes(source)) {
      return res
        .status(400)
        .json({ message: "Invalid source. Must be STATEMENT or SETTLEMENT" });
    }

    const buffer = req.file.buffer;
    let transactions = [];

    // 1. Parse Key Logic
    if (source === SOURCES.STATEMENT) {
      transactions = parseStatement(buffer);
    } else {
      transactions = parseSettlement(buffer);
    }

    if (transactions.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid transactions found in file" });
    }

    // 2. Identify Duplicates
    transactions = identifyDuplicates(transactions);

    // 3. Tag Should Reconcile
    transactions = tagShouldReconcile(transactions);

    // Add Upload Batch ID
    const uploadBatchId =
      new Date().toISOString() + "-" + Math.random().toString(36).substr(2, 9);
    transactions = transactions.map((t) => ({
      ...t,
      uploadBatchId,
    }));

    // 4. Save to DB with session
    await Transaction.insertMany(transactions, { session });

    await session.commitTransaction();

    res.status(200).json({
      message: "File processed and transactions saved successfully",
      count: transactions.length,
      uploadBatchId,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};
