import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// Extract key topics from PDF text
function extractTopics(text, pdfName) {
  // Simple topic extraction - take first 500 chars and PDF name
  const snippet = text.substring(0, 500);

  // Basic keyword extraction (you can make this smarter)
  const words = snippet.split(/\s+/);
  const commonWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
  ];
  const keywords = words
    .filter(
      (word) => word.length > 4 && !commonWords.includes(word.toLowerCase())
    )
    .slice(0, 5);

  // Combine PDF name and keywords for better search
  const searchQuery = `${pdfName.replace(".pdf", "")} ${keywords.join(
    " "
  )} tutorial explanation`;

  return searchQuery.substring(0, 100); // Limit query length
}

// Search YouTube for educational videos
export async function searchYouTubeVideos(pdfId, PDF) {
  try {
    // Get PDF details
    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      throw new Error("PDF not found");
    }

    // Check if YouTube API key exists
    if (!YOUTUBE_API_KEY) {
      console.log("⚠️ No YouTube API key - returning sample data");
      return {
        query: pdf.originalName,
        videos: [],
      };
    }

    // Extract topics from PDF
    const searchQuery = extractTopics(pdf.textContent, pdf.originalName);
    console.log("🔍 YouTube search query:", searchQuery);

    // Call YouTube API
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 6,
        key: YOUTUBE_API_KEY,
        videoCategoryId: "27", // Education category
        relevanceLanguage: "en",
        safeSearch: "strict",
      },
    });

    // Format results
    const videos = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    console.log(`✅ Found ${videos.length} YouTube videos`);

    return {
      query: searchQuery,
      videos,
    };
  } catch (error) {
    console.error("YouTube search error:", error.message);

    // Return empty results on error
    return {
      query: "",
      videos: [],
    };
  }
}
