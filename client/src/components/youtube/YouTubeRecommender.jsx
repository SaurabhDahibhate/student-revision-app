import { useState, useEffect } from "react";
import { X, Youtube, ExternalLink, Loader, Play } from "lucide-react";
import { getYouTubeRecommendations } from "../../services/api";

export default function YouTubeRecommender({ pdf, onClose }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const data = await getYouTubeRecommendations(pdf.id);
      setVideos(data.videos || []);
      setQuery(data.query || "");
    } catch (error) {
      console.error("Failed to load YouTube videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-red-600 to-pink-600 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Youtube className="w-8 h-8 text-white" />
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Video Recommendations
                  </h2>
                  <p className="text-red-100 mt-1">
                    Educational videos for: {pdf.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-16 h-16 text-red-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">
                  Searching for relevant videos...
                </p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-20">
                <Youtube className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No videos found
                </h3>
                <p className="text-gray-500">
                  Try uploading a PDF with more text content or check your
                  YouTube API key.
                </p>
              </div>
            ) : (
              <>
                {query && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Search query:</strong> {query}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onOpen={openVideo}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {videos.length} video{videos.length !== 1 ? "s" : ""} found
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video, onOpen }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border-2 border-gray-200 hover:border-red-400 group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden bg-gray-900 aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
          <button
            onClick={() => onOpen(video.url)}
            className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transform hover:scale-110"
          >
            <Play className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
          {video.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="font-medium">{video.channelTitle}</span>
          <span>{formatDate(video.publishedAt)}</span>
        </div>

        <button
          onClick={() => onOpen(video.url)}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Watch on YouTube</span>
        </button>
      </div>
    </div>
  );
}
