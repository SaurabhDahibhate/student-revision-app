import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    default: [],
  },
  pageNumber: {
    type: Number,
    default: 1,
  },
  startIndex: {
    type: Number,
    default: 0,
  },
  endIndex: {
    type: Number,
    default: 0,
  },
});

const pdfSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    textContent: {
      type: String,
      default: "",
    },
    chunks: [chunkSchema],
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PDF", pdfSchema);
