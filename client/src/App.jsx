import { useState, useEffect } from "react";
import { BookOpen, Brain, TrendingUp } from "lucide-react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            📚 Student Revision App
          </h1>
          <p className="text-xl text-gray-600">
            Your AI-powered study companion for better learning
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-blue-600" />}
            title="Smart PDF Reading"
            description="Upload your coursebooks and study materials"
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-purple-600" />}
            title="AI Quiz Generator"
            description="Get personalized quizzes with instant feedback"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-green-600" />}
            title="Track Progress"
            description="Monitor your learning journey and improvements"
          />
        </div>

        {/* Status Check */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-lg shadow-lg p-6">
            <p className="text-lg font-semibold text-green-600">
              ✅ Frontend is running successfully!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Backend:{" "}
              <span
                className={
                  backendStatus.includes("✅")
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {backendStatus}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
}

export default App;
