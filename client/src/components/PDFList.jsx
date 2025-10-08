import { File, Trash2, Eye, Brain, Youtube } from "lucide-react";
import { deletePDF } from "../services/api";

export default function PDFList({
  pdfs,
  onDelete,
  onView,
  onGenerateQuiz,
  onYouTubeRecommend,
}) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      try {
        await deletePDF(id);
        onDelete(id);
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete PDF");
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (pdfs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p>No PDFs uploaded yet</p>
        <p className="text-sm mt-2">
          Upload your first coursebook to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50"
        >
          {/* PDF Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded">
              <File className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{pdf.name}</h3>
              <div className="flex gap-2 text-xs text-gray-500 mt-1">
                <span>{pdf.pages} pages</span>
                <span>•</span>
                <span>{formatFileSize(pdf.size)}</span>
                <span>•</span>
                <span>{formatDate(pdf.uploadedAt)}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            {/* GENERATE QUIZ BUTTON - FULL WIDTH */}
            <button
              onClick={() => {
                if (onYouTubeRecommend) {
                  onYouTubeRecommend(pdf);
                }
              }}
              className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <Youtube className="w-5 h-5" />
              <span>Find Videos</span>
            </button>

            <button
              onClick={() => {
                if (onGenerateQuiz) {
                  onGenerateQuiz(pdf);
                }
              }}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
              style={{ cursor: "pointer" }}
            >
              <Brain className="w-5 h-5" />
              <span>Generate Quiz</span>
            </button>

            {/* VIEW AND DELETE BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onView(pdf);
                }}
                className="flex-1 py-2 px-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">View</span>
              </button>

              <button
                onClick={() => {
                  handleDelete(pdf.id);
                }}
                className="flex-1 py-2 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
