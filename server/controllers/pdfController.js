import PDF from "../models/PDF.js";
import { createRequire } from "module";
import fs from "fs";
import path from "path";

// Fix for pdf-parse CommonJS module
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Upload PDF
export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read and parse PDF to get page count and text
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    // Save PDF metadata to database
    const newPDF = new PDF({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      pageCount: pdfData.numpages,
      textContent: pdfData.text, // Store extracted text for later use
    });

    await newPDF.save();

    res.status(201).json({
      message: "PDF uploaded successfully",
      pdf: {
        id: newPDF._id,
        name: newPDF.originalName,
        pages: newPDF.pageCount,
        size: newPDF.fileSize,
        uploadedAt: newPDF.uploadedAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload PDF" });
  }
};

// Get all PDFs
export const getAllPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadedAt: -1 });

    const pdfList = pdfs.map((pdf) => ({
      id: pdf._id,
      name: pdf.originalName,
      pages: pdf.pageCount,
      size: pdf.fileSize,
      uploadedAt: pdf.uploadedAt,
    }));

    res.json({ pdfs: pdfList });
  } catch (error) {
    console.error("Get PDFs error:", error);
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
};

// Get single PDF
export const getPDFById = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    res.json({
      id: pdf._id,
      name: pdf.originalName,
      pages: pdf.pageCount,
      size: pdf.fileSize,
      uploadedAt: pdf.uploadedAt,
      textContent: pdf.textContent,
    });
  } catch (error) {
    console.error("Get PDF error:", error);
    res.status(500).json({ error: "Failed to fetch PDF" });
  }
};

// Serve PDF file
export const servePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Check if file exists
    if (!fs.existsSync(pdf.filePath)) {
      return res.status(404).json({ error: "PDF file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${pdf.originalName}"`
    );

    const fileStream = fs.createReadStream(pdf.filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Serve PDF error:", error);
    res.status(500).json({ error: "Failed to serve PDF" });
  }
};

// Delete PDF
export const deletePDF = async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);

    if (!pdf) {
      return res.status(404).json({ error: "PDF not found" });
    }

    // Delete file from disk
    if (fs.existsSync(pdf.filePath)) {
      fs.unlinkSync(pdf.filePath);
    }

    // Delete from database
    await PDF.findByIdAndDelete(req.params.id);

    res.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Delete PDF error:", error);
    res.status(500).json({ error: "Failed to delete PDF" });
  }
};
