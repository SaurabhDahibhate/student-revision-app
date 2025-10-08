import axios from "axios";

const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// DON'T read env var here - read it inside the function
// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; 

// Extract key topics from PDF text
function extractTopics(text, pdfName) {
  const snippet = text.substring(0, 500);

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

  const searchQuery = `${pdfName.replace(".pdf", "")} ${keywords.join(
    " "
  )} tutorial explanation`;

  return searchQuery.substring(0, 100);
}

// Search YouTube for educational videos
export async function searchYouTubeVideos(pdfId, PDF) {
  try {
    // Read API key HERE, inside the function (after dotenv has loaded)
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

    console.log(
      "🔑 YouTube API Key in function:",
      YOUTUBE_API_KEY
        ? `✅ Yes (${YOUTUBE_API_KEY.substring(0, 10)}...)`
        : "❌ No"
    );

    const pdf = await PDF.findById(pdfId);
    if (!pdf) {
      throw new Error("PDF not found");
    }

    if (!YOUTUBE_API_KEY) {
      console.log("⚠️ No YouTube API key - returning empty results");
      return {
        query: pdf.originalName,
        videos: [],
      };
    }

    const searchQuery = extractTopics(pdf.textContent, pdf.originalName);
    console.log("🔍 YouTube search query:", searchQuery);

    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        q: searchQuery,
        type: "video",
        maxResults: 6,
        key: YOUTUBE_API_KEY,
        videoCategoryId: "27",
        relevanceLanguage: "en",
        safeSearch: "strict",
      },
    });

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

    return {
      query: "",
      videos: [],
    };
  }
}
