import { useState, useEffect } from "react";
import { BookOpen, Brain, TrendingUp } from "lucide-react";
import PDFUpload from "./components/PDFUpload";
import PDFList from "./components/PDFList";
import PDFViewer from "./components/PDFViewer";
import { getAllPDFs } from "./services/api";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test backend connection
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(`✅ ${data.status}`);
      })
      .catch((err) => {
        setBackendStatus("❌ Backend not connected");
      });

    // Load PDFs
    loadPDFs();
  }, []);

  const loadPDFs = async () => {
    try {
      const data = await getAllPDFs();
      setPdfs(data.pdfs);
    } catch (error) {
      console.error("Failed to load PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newPdf) => {
    setPdfs((prev) => [newPdf, ...prev]);
  };

  const handleDelete = (id) => {
    setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  };

  const handleView = (pdf) => {
    setSelectedPdf(pdf);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📚 Student Revision App
          </h1>
          <p className="text-gray-600">Your AI-powered study companion</p>
          <p className="text-sm text-gray-500 mt-2">
            Backend:{" "}
            <span
              className={
                backendStatus.includes("✅") ? "text-green-600" : "text-red-600"
              }
            >
              {backendStatus}
            </span>
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-10 h-10 text-blue-600" />}
            title="Smart PDF Reading"
            description="Upload your coursebooks"
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10 text-purple-600" />}
            title="AI Quiz Generator"
            description="Get personalized quizzes"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-green-600" />}
            title="Track Progress"
            description="Monitor your learning"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Upload PDF
            </h2>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* PDF List Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              My PDFs ({pdfs.length})
            </h2>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
              <PDFList
                pdfs={pdfs}
                onDelete={handleDelete}
                onView={handleView}
              />
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <PDFViewer
            pdf={selectedPdf}
            onClose={() => {
              setSelectedPdf(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
}

export default App;
