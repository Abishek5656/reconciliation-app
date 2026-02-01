import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import uploadMiddleware from "../config/multer.js";

const router = express.Router();

router.post("/", uploadMiddleware.single("file"), uploadFile);

export default router;
