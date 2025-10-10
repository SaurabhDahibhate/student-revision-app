import { useState, useEffect } from "react";
import {
  BookOpen,
  Brain,
  TrendingUp,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import PDFUpload from "./components/PDFUpload";
import PDFList from "./components/PDFList";
import PDFViewer from "./components/PDFViewer";
import Quiz from "./components/quiz/Quiz";
import Dashboard from "./components/dashboard/Dashboard";
import ChatInterface from "./components/chat/ChatInterface";
import YouTubeRecommender from "./components/youtube/YouTubeRecommender";
import { getAllPDFs, generateQuiz, deletePDF } from "./services/api";

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
    fetch(
      `${
        import.meta.env.VITE_API_URL?.replace("/api", "") ||
        "http://localhost:5000"
      }/api/health`
    )
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

  // const handleDelete = (id) => {
  //   setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
  // };

  const handleDelete = async (id) => {
    try {
      await deletePDF(id);
      setPdfs((prev) => prev.filter((pdf) => pdf.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete PDF");
    }
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

  const handleYouTubeRecommend = (pdf) => {
    setYoutubePdf(pdf);
    setShowYouTube(true);
  };

  const handleCloseQuiz = () => {
    setCurrentQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto mb-6 gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="group w-full md:w-auto px-5 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              <span>AI Chat</span>
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-yellow-500 animate-pulse" />
                <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  ReviseAI
                </h1>
                <Sparkles className="w-8 md:w-10 h-8 md:h-10 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-lg md:text-xl text-gray-600 font-medium">
                Your AI-Powered Study Companion 🚀
              </p>
            </div>

            <button
              onClick={() => setShowDashboard(true)}
              className="group w-full md:w-auto px-5 py-3 bg-white text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md">
            <div
              className={`w-2 h-2 rounded-full ${
                backendStatus.includes("✅")
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">
              {backendStatus}
            </span>
          </div> */}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-blue-600" />}
            title="Smart PDFs"
            description="Upload & analyze coursebooks"
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-purple-600" />}
            title="AI Quizzes"
            description="Auto-generated tests"
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<MessageSquare className="w-12 h-12 text-indigo-600" />}
            title="Chat Assistant"
            description="Ask anything, anytime"
            onClick={() => setShowChat(true)}
            clickable
            gradient="from-indigo-500 to-purple-500"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-green-600" />}
            title="Track Progress"
            description="Monitor your growth"
            onClick={() => setShowDashboard(true)}
            clickable
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Upload Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 animate-slideUp h-auto lg:h-[650px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload PDF</h2>
            </div>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* PDF List Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300 animate-slideUp animation-delay-200 h-auto lg:h-[650px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">My Library</h2>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-bold shadow-md">
                {pdfs.length} PDFs
              </span>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">
                  Loading your library...
                </p>
              </div>
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

        {/* Stats Footer */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon="🎯"
            value={pdfs.length}
            label="PDFs Uploaded"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon="🧠"
            value="AI Powered"
            label="Smart Learning"
            color="from-purple-500 to-pink-500"
          />
          <StatCard
            icon="⚡"
            value="100% Free"
            label="No Limits"
            color="from-green-500 to-emerald-500"
          />
        </div>
      </div>

      {/* Modals */}
      {selectedPdf && !currentQuiz && (
        <PDFViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
      )}

      {generatingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl animate-scaleIn">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                🧠 Generating Quiz...
              </h3>
              <p className="text-gray-600">
                AI is analyzing your PDF and crafting questions
              </p>
            </div>
          </div>
        </div>
      )}

      {currentQuiz && <Quiz quiz={currentQuiz} onClose={handleCloseQuiz} />}
      {showDashboard && <Dashboard onClose={() => setShowDashboard(false)} />}
      {showChat && <ChatInterface onClose={() => setShowChat(false)} />}
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

function FeatureCard({
  icon,
  title,
  description,
  onClick,
  clickable,
  gradient,
}) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden ${
        clickable ? "cursor-pointer hover:scale-105" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>
      <div className="relative z-10">
        <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
          {title}
        </h3>
        <p className="text-gray-600 text-center text-sm">{description}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center gap-4">
        <div
          className={`text-4xl p-4 bg-gradient-to-br ${color} rounded-xl shadow-md`}
        >
          <span className="filter drop-shadow-lg">{icon}</span>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          <p className="text-gray-600 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
