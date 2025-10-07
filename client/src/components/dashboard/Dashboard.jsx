import { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  XCircle,
  BookOpen,
  X,
} from "lucide-react";
import { getProgressStats } from "../../services/api";

export default function Dashboard({ onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getProgressStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats || stats.totalAttempts === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Progress Dashboard
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No quiz attempts yet!</p>
            <p className="text-sm text-gray-500">
              Take your first quiz to see your progress here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-green-600 to-blue-600 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  📊 Progress Dashboard
                </h2>
                <p className="text-green-100 mt-1">
                  Track your learning journey
                </p>
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Target className="w-8 h-8 text-blue-600" />}
                label="Total Quizzes"
                value={stats.totalAttempts}
                bgColor="bg-blue-50"
              />
              <StatCard
                icon={<Award className="w-8 h-8 text-yellow-600" />}
                label="Average Score"
                value={`${stats.averageScore}%`}
                bgColor="bg-yellow-50"
              />
              <StatCard
                icon={<CheckCircle className="w-8 h-8 text-green-600" />}
                label="Correct Answers"
                value={stats.correctAnswers}
                bgColor="bg-green-50"
              />
              <StatCard
                icon={<XCircle className="w-8 h-8 text-red-600" />}
                label="Incorrect Answers"
                value={stats.incorrectAnswers}
                bgColor="bg-red-50"
              />
            </div>

            {/* Performance by Type */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Performance by Question Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PerformanceCard
                  type="MCQ"
                  label="Multiple Choice"
                  correct={stats.performanceByType.MCQ.correct}
                  total={stats.performanceByType.MCQ.total}
                  percentage={stats.performanceByType.MCQ.percentage}
                  color="blue"
                />
                <PerformanceCard
                  type="SAQ"
                  label="Short Answer"
                  correct={stats.performanceByType.SAQ.correct}
                  total={stats.performanceByType.SAQ.total}
                  percentage={stats.performanceByType.SAQ.percentage}
                  color="green"
                />
                <PerformanceCard
                  type="LAQ"
                  label="Long Answer"
                  correct={stats.performanceByType.LAQ.correct}
                  total={stats.performanceByType.LAQ.total}
                  percentage={stats.performanceByType.LAQ.percentage}
                  color="purple"
                />
              </div>
            </div>

            {/* Recent Attempts */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Recent Quiz Attempts
              </h3>
              <div className="space-y-3">
                {stats.recentAttempts.map((attempt) => (
                  <AttemptCard key={attempt.id} attempt={attempt} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium"
            >
              Close Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border-2 border-gray-100`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
}

function PerformanceCard({ type, label, correct, total, percentage, color }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
  };

  const progressColors = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
  };

  return (
    <div className={`${colorClasses[color]} rounded-xl p-6 border-2`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold">{type}</span>
        <span className="text-2xl font-bold">{percentage}%</span>
      </div>
      <p className="text-sm font-medium mb-3">{label}</p>

      {/* Progress Bar */}
      <div className="w-full bg-white rounded-full h-2 mb-2">
        <div
          className={`${progressColors[color]} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className="text-xs">
        {correct} correct out of {total} questions
      </p>
    </div>
  );
}

function AttemptCard({ attempt }) {
  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{attempt.pdfName}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(attempt.completedAt)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Score</p>
            <p className="text-lg font-bold text-gray-900">
              {attempt.score}/{attempt.totalQuestions}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-lg ${getScoreColor(
              attempt.percentage
            )}`}
          >
            <p className="text-2xl font-bold">{attempt.percentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
