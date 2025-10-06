import { File, Trash2, Eye } from "lucide-react";
import { deletePDF } from "../services/api";

export default function PDFList({ pdfs, onDelete, onView }) {
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
    <div className="space-y-3">
      {pdfs.map((pdf) => (
        <div
          key={pdf.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-blue-50 rounded-lg">
                <File className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{pdf.name}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>{pdf.pages} pages</span>
                  <span>•</span>
                  <span>{formatFileSize(pdf.size)}</span>
                  <span>•</span>
                  <span>{formatDate(pdf.uploadedAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onView(pdf)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View PDF"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(pdf.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete PDF"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
