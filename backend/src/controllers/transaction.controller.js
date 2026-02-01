import Transaction from "../models/transaction.model.js";
import { reconcileTransactions as reconcileService } from "../services/reconciliation.service.js";

export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 50, classification, source, search } = req.query;
    const query = {};

    if (classification) query.classification = parseInt(classification);
    if (source) query.source = source;
    if (search) query.partnerPin = { $regex: search, $options: "i" };

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const triggerReconciliation = async (req, res) => {
  try {
    const result = await reconcileService();
    res.status(200).json({
      message: "Reconciliation process completed",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $group: {
          _id: "$classification",
          count: { $sum: 1 },
          totalVariance: { $sum: "$varianceAmount" },
        },
      },
    ]);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
