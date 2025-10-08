import PDF from "../models/PDF.js";
import { searchYouTubeVideos } from "../services/youtubeService.js";

// Get YouTube recommendations for a PDF
export const getYouTubeRecommendations = async (req, res) => {
  try {
    const { pdfId } = req.params;

    const results = await searchYouTubeVideos(pdfId, PDF);

    res.json({
      message: "YouTube recommendations retrieved successfully",
      ...results,
    });
  } catch (error) {
    console.error("Get YouTube recommendations error:", error);
    res.status(500).json({ error: "Failed to get YouTube recommendations" });
  }
};
