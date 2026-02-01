import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Reconciliation API is running");
});

app.use("/api/upload", uploadRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
