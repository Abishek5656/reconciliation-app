import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  // Identifies which file this record came from
  source: {
    type: String,
    enum: ["STATEMENT", "SETTLEMENT"],
    required: true,
  },

  // Extracted from Statement Col D / Settlement Col D
  partnerPin: {
    type: String,
    required: true,
    index: true,
  },

  // Transaction type (Sale, Cancel, Dollar Received, etc.)
  transactionType: {
    type: String, // Kept as String to accommodate various values
    required: true, // Assuming type is always present
  },

  // Statement file amount (Col L - Settle.Amt)
  statementAmount: {
    type: Number,
    default: null,
  },

  // Settlement file calculated amount (Col K / Col M)
  settlementAmountUSD: {
    type: Number,
    default: null,
  },

  // Whether the PartnerPin appeared more than once
  isDuplicate: {
    type: Boolean,
    default: false,
  },

  // Business-rule filter
  // true  → eligible for reconciliation
  // false → ignored
  shouldReconcile: {
    type: Boolean,
    required: true,
  },

  // Final reconciliation classification
  // 5 → Present in Both
  // 6 → Present in Settlement but not in Statement
  // 7 → Present in Statement but not in Settlement
  classification: {
    type: Number,
    enum: [5, 6, 7],
    default: null,
  },

  // Only populated for classification = 5
  varianceAmount: {
    type: Number,
    default: null,
  },

  // Groups records belonging to the same upload
  uploadBatchId: {
    type: String,
    required: true,
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

transactionSchema.index({ partnerPin: 1 });
transactionSchema.index({ classification: 1 });
transactionSchema.index({ uploadBatchId: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
