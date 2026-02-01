import express from "express";
import {
  getTransactions,
  triggerReconciliation,
  getSummary,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", getTransactions);
router.post("/reconcile", triggerReconciliation);
router.get("/summary", getSummary);

export default router;
