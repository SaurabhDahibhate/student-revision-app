import { useState } from "react";
import { Brain, Loader } from "lucide-react";
import { generateQuiz } from "../../services/api";

export default function QuizGeneratorButton({ pdf, onQuizGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateQuiz = async () => {
    setGenerating(true);
    setError("");

    try {
      const result = await generateQuiz(pdf.id);
      onQuizGenerated(result.quiz);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setError(err.response?.data?.error || "Failed to generate quiz");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerateQuiz}
        disabled={generating}
        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors font-medium"
      >
        {generating ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            Generate Quiz
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
