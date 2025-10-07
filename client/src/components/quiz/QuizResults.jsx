import { CheckCircle, XCircle, Trophy, X } from "lucide-react";

export default function QuizResults({ results, onClose }) {
  const {
    score,
    totalQuestions,
    percentage,
    results: questionResults,
  } = results;

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = () => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">Quiz Results</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Score Summary */}
        <div className={`m-6 p-6 border-2 rounded-lg ${getScoreBgColor()}`}>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
              {percentage}%
            </div>
            <div className="text-xl text-gray-700 mb-1">
              {score} out of {totalQuestions} correct
            </div>
            <div className="text-gray-600">
              {percentage >= 80
                ? "🎉 Excellent work!"
                : percentage >= 60
                ? "👍 Good job!"
                : "💪 Keep practicing!"}
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Detailed Results:
          </h3>
          <div className="space-y-4">
            {questionResults.map((result, index) => (
              <div
                key={result.questionId}
                className={`p-4 border-2 rounded-lg ${
                  result.isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                {/* Question */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-700">
                        Question {index + 1}:
                      </span>
                      <span className="px-2 py-1 bg-white rounded text-xs font-semibold text-gray-600">
                        {result.type}
                      </span>
                    </div>
                    <p className="text-gray-800 mb-3">{result.question}</p>

                    {/* Your Answer */}
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-600">
                        Your Answer:{" "}
                      </span>
                      <span
                        className={
                          result.isCorrect ? "text-green-700" : "text-red-700"
                        }
                      >
                        {result.userAnswer}
                      </span>
                    </div>

                    {/* Correct Answer (if wrong) */}
                    {!result.isCorrect && (
                      <div className="mb-2">
                        <span className="text-sm font-semibold text-gray-600">
                          Correct Answer:{" "}
                        </span>
                        <span className="text-green-700 font-medium">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm font-semibold text-gray-600">
                        💡 Explanation:{" "}
                      </span>
                      <p className="text-sm text-gray-700 mt-1">
                        {result.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
}
