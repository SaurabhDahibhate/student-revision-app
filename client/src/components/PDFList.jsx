import {
  File,
  Trash2,
  Eye,
  Brain,
  Youtube,
  FileText,
  Calendar,
} from "lucide-react";

export default function PDFList({
  pdfs,
  onDelete,
  onView,
  onGenerateQuiz,
  onYouTubeRecommend,
}) {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-2">No PDFs uploaded yet</p>
        <p className="text-sm text-gray-400">
          Upload your first coursebook to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-400 overflow-y-auto pr-2">
      {pdfs.map((pdf, index) => (
        <div
          key={pdf.id}
          className="group bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-xl border-2 border-gray-200 hover:border-purple-300 p-5 transition-all duration-300 animate-slideUp"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* PDF Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <File className="w-7 h-7 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 truncate mb-1 group-hover:text-purple-600 transition-colors">
                {pdf.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {pdf.pages} pages
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(pdf.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onDelete(pdf.id)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 text-red-500 rounded-lg transition-all duration-200 hover:scale-110"
              title="Delete PDF"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onYouTubeRecommend(pdf)}
              className="py-2.5 px-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Youtube className="w-4 h-4" />
              <span className="text-sm">Videos</span>
            </button>

            <button
              onClick={() => onGenerateQuiz(pdf)}
              className="py-2.5 px-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm">Quiz</span>
            </button>

            <button
              onClick={() => onView(pdf)}
              className="py-2.5 px-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">View</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
