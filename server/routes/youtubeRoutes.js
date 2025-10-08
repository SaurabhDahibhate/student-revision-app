import express from "express";
import { getYouTubeRecommendations } from "../controllers/youtubeController.js";

const router = express.Router();

// Get YouTube recommendations for a PDF
router.get("/:pdfId", getYouTubeRecommendations);

export default router;
