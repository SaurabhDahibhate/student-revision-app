import express from "express";
import upload from "../config/multer.js";
import {
  uploadPDF,
  getAllPDFs,
  getPDFById,
  servePDF,
  deletePDF,
} from "../controllers/pdfController.js";

const router = express.Router();

// Upload PDF
router.post("/upload", upload.single("pdf"), uploadPDF);

// Get all PDFs
router.get("/", getAllPDFs);

// Get single PDF metadata
router.get("/:id", getPDFById);

// Serve PDF file
router.get("/:id/file", servePDF);

// Delete PDF
router.delete("/:id", deletePDF);

export default router;
