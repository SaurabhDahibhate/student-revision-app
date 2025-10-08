import PDF from "../models/PDF.js";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { chunkText, createEmbedding } from "../services/embeddingService.js";

// Fix for pdf-parse CommonJS module
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Upload PDF
export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📤 Processing PDF upload:", req.file.originalname);

    // Read PDF file
    const dataBuffer = fs.readFileSync(req.file.path);

    console.log("📦 Buffer size:", dataBuffer.length, "bytes");

    let pageCount = 1;
    let textContent = "";

    // Method 1: Try pdf-lib first (more reliable for page count)
    try {
      const pdfDoc = await PDFDocument.load(dataBuffer);
      pageCount = pdfDoc.getPageCount();
      console.log("✅ pdf-lib: Found", pageCount, "pages");
    } catch (pdfLibError) {
      console.error("⚠️ pdf-lib error:", pdfLibError.message);
    }

    // Method 2: Try pdf-parse for text extraction
    try {
      const pdfData = await pdfParse(dataBuffer, {
        max: 0, // Parse all pages
      });

      // If pdf-lib failed, use pdf-parse page count
      if (pageCount === 1 && pdfData.numpages > 1) {
        pageCount = pdfData.numpages;
        console.log("✅ pdf-parse: Found", pageCount, "pages");
      }

      textContent = pdfData.text || "";
      console.log(
        "✅ Extracted text length:",
        textContent.length,
        "characters"
      );
    } catch (parseError) {
      console.error("⚠️ pdf-parse error:", parseError.message);
    }

    console.log("📊 Final PDF Info:", {
      filename: req.file.originalname,
      pages: pageCount,
      textLength: textContent.length,
      size: req.file.size,
    });

    // CREATE CHUNKS (optional embeddings)
    console.log("📦 Creating text chunks...");
    const chunks = chunkText(textContent, 300, 50);
    console.log(`✅ Created ${chunks.length} chunks`);

    const chunksWithEmbeddings = [];

    // Only create embeddings if OpenAI key is available
    if (process.env.OPENAI_API_KEY) {
      console.log("🔍 Creating embeddings (this may take a minute)...");
      const chunksToEmbed = chunks.slice(0, 20); // Reduced to 20 for speed

      for (let i = 0; i < chunksToEmbed.length; i++) {
        try {
          const embedding = await createEmbedding(chunksToEmbed[i].text);

          const estimatedPage = Math.ceil(
            (i / chunksToEmbed.length) * pageCount
          );

          chunksWithEmbeddings.push({
            text: chunksToEmbed[i].text,
            embedding: embedding,
            pageNumber: estimatedPage,
            startIndex: chunksToEmbed[i].startIndex,
            endIndex: chunksToEmbed[i].endIndex,
          });

          if ((i + 1) % 5 === 0) {
            console.log(
              `  ✅ Embedded ${i + 1}/${chunksToEmbed.length} chunks`
            );
          }
        } catch (error) {
          console.error(`  ⚠️ Error embedding chunk ${i}:`, error.message);
        }
      }

      console.log(`✅ Created ${chunksWithEmbeddings.length} embeddings`);
    } else {
      console.log("⚠️ No OpenAI API key - skipping embeddings (RAG disabled)");
      // Store chunks without embeddings
      chunks.slice(0, 20).forEach((chunk, i) => {
        const estimatedPage = Math.ceil((i / 20) * pageCount);
        chunksWithEmbeddings.push({
          text: chunk.text,
          embedding: [],
          pageNumber: estimatedPage,
          startIndex: chunk.startIndex,
          endIndex: chunk.endIndex,
        });
      });
    }

    // Save PDF metadata to database
    const newPDF = new PDF({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      pageCount: pageCount,
      textContent: textContent,
    });

    await newPDF.save();

    console.log("💾 Saved to database with", newPDF.pageCount, "pages");

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
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Failed to upload PDF: " + error.message });
  }
};

// Get all PDFs
export const getAllPDFs = async (req, res) => {
  try {
    const pdfs = await PDF.find().sort({ uploadedAt: -1 });

    console.log("📚 Fetching PDFs from DB:", pdfs.length);

    const pdfList = pdfs.map((pdf) => {
      console.log("  -", pdf.originalName, ":", pdf.pageCount, "pages");
      return {
        id: pdf._id,
        name: pdf.originalName,
        pages: pdf.pageCount,
        size: pdf.fileSize,
        uploadedAt: pdf.uploadedAt,
      };
    });

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
