import { useState, useEffect } from "react";
import { BookOpen, Brain, TrendingUp, MessageSquare } from "lucide-react";
import PDFUpload from "./components/PDFUpload";
import PDFList from "./components/PDFList";
import PDFViewer from "./components/PDFViewer";
import Quiz from "./components/quiz/Quiz";
import Dashboard from "./components/dashboard/Dashboard";
import ChatInterface from "./components/chat/ChatInterface";
import { getAllPDFs, generateQuiz } from "./services/api";
import YouTubeRecommender from "./components/youtube/YouTubeRecommender";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [pdfs, setPdfs] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const [youtubePdf, setYoutubePdf] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus(`✅ ${data.status}`);
      })
      .catch((err) => {
        setBackendStatus("❌ Backend not connected");
      });

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

  const handleGenerateQuiz = async (pdf) => {
    setGeneratingQuiz(true);

    try {
      const result = await generateQuiz(pdf.id);
      setCurrentQuiz(result.quiz);
    } catch (error) {
      console.error("Quiz generation error:", error);
      alert(
        "Failed to generate quiz: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleCloseQuiz = () => {
    setCurrentQuiz(null);
  };

  const handleYouTubeRecommend = (pdf) => {
    setYoutubePdf(pdf);
    setShowYouTube(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Dashboard & Chat Buttons */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between max-w-5xl mx-auto mb-4">
            <button
              onClick={() => setShowChat(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium shadow-md"
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Chat</span>
            </button>

            <h1 className="text-4xl font-bold text-gray-800">
              📚 Student Revision App
            </h1>

            <button
              onClick={() => setShowDashboard(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium shadow-md"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div>
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
        <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-10 h-10 text-blue-600" />}
            title="PDF Reading"
            description="Upload coursebooks"
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10 text-purple-600" />}
            title="Quiz Generator"
            description="AI-powered quizzes"
          />
          <FeatureCard
            icon={<MessageSquare className="w-10 h-10 text-indigo-600" />}
            title="AI Chat"
            description="Ask questions"
            onClick={() => setShowChat(true)}
            clickable
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-green-600" />}
            title="Track Progress"
            description="Monitor learning"
            onClick={() => setShowDashboard(true)}
            clickable
          />
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Upload PDF
            </h2>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </div>

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
                onGenerateQuiz={handleGenerateQuiz}
                onYouTubeRecommend={handleYouTubeRecommend}
              />
            )}
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedPdf && !currentQuiz && (
        <PDFViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {/* Generating Quiz Loading */}
      {generatingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Generating Quiz...
              </h3>
              <p className="text-gray-600">
                AI is analyzing your PDF and creating questions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {currentQuiz && <Quiz quiz={currentQuiz} onClose={handleCloseQuiz} />}

      {/* Dashboard Modal */}
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}

      {/* Chat Interface */}
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}

      {/* YouTube Recommender Modal */}
      {showYouTube && youtubePdf && (
        <YouTubeRecommender
          pdf={youtubePdf}
          onClose={() => {
            setShowYouTube(false);
            setYoutubePdf(null);
          }}
        />
      )}
    </div>
  );
}

function FeatureCard({ icon, title, description, onClick, clickable }) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
        clickable ? "cursor-pointer hover:scale-105 transition-transform" : ""
      }`}
    >
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-800 mb-1 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center text-sm">{description}</p>
    </div>
  );
}

export default App;
