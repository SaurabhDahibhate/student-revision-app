import { useState } from "react";
import {
  X,
  CheckCircle,
  XCircle,
  Send,
  RotateCcw,
  Award,
  Target,
} from "lucide-react";
import { submitQuiz } from "../../services/api";

export default function Quiz({ quiz, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (questionIndex, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < quiz.questions.length) {
      const unanswered = quiz.questions.length - answeredCount;
      if (
        !window.confirm(
          `You have ${unanswered} unanswered question(s). Submit anyway?`
        )
      ) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const response = await submitQuiz(quiz.id, answers);
      setResult(response.result);
      setSubmitted(true);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-50 border-green-200";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start justify-center p-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl animate-fadeIn">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  📝 Quiz Time!
                </h2>
                <p className="text-purple-100">
                  {quiz.pdfName} • {quiz.questions.length} Questions
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Result Summary */}
          {submitted && result && (
            <div
              className={`m-6 p-6 rounded-2xl border-2 ${getScoreBgColor(
                result.percentage
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white rounded-full">
                    <Award
                      className={`w-12 h-12 ${getScoreColor(
                        result.percentage
                      )}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                      Score: {result.score}/{result.totalQuestions}
                    </h3>
                    <p
                      className={`text-3xl font-bold ${getScoreColor(
                        result.percentage
                      )}`}
                    >
                      {result.percentage}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">
                      {result.correctAnswers} Correct
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 font-semibold">
                      {result.incorrectAnswers} Incorrect
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="p-6 space-y-8 max-h-[60vh] overflow-y-auto">
            {quiz.questions.map((question, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-200"
              >
                {/* Question Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                        {question.type}
                      </span>
                      {submitted &&
                        answers[index] === question.correctAnswer && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                            ✓ Correct
                          </span>
                        )}
                      {submitted &&
                        answers[index] &&
                        answers[index] !== question.correctAnswer && (
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                            ✗ Incorrect
                          </span>
                        )}
                    </div>
                    <p className="text-lg font-semibold text-gray-800">
                      {question.question}
                    </p>
                  </div>
                </div>

                {/* MCQ Options */}
                {question.type === "MCQ" && (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const optionLabel = String.fromCharCode(65 + optionIndex);
                      const isSelected = answers[index] === option;
                      const isCorrect =
                        submitted && option === question.correctAnswer;
                      const isWrong =
                        submitted &&
                        isSelected &&
                        option !== question.correctAnswer;

                      return (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            !submitted && handleAnswer(index, option)
                          }
                          disabled={submitted}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            submitted
                              ? isCorrect
                                ? "border-green-500 bg-green-50 shadow-md"
                                : isWrong
                                ? "border-red-500 bg-red-50 shadow-md"
                                : "border-gray-200 bg-gray-50"
                              : isSelected
                              ? "border-purple-500 bg-purple-50 shadow-md transform scale-[1.02]"
                              : "border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex-shrink-0 w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
                                submitted
                                  ? isCorrect
                                    ? "border-green-500 bg-green-500 text-white"
                                    : isWrong
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-gray-300 text-gray-500"
                                  : isSelected
                                  ? "border-purple-500 bg-purple-500 text-white"
                                  : "border-gray-400 text-gray-600"
                              }`}
                            >
                              {optionLabel}
                            </div>
                            <span className="flex-1 text-gray-800 font-medium">
                              {option}
                            </span>
                            {submitted && isCorrect && (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            )}
                            {submitted && isWrong && (
                              <XCircle className="w-6 h-6 text-red-500" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* SAQ/LAQ Input */}
                {(question.type === "SAQ" || question.type === "LAQ") && (
                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswer(index, e.target.value)}
                    disabled={submitted}
                    placeholder="Type your answer here..."
                    rows={question.type === "LAQ" ? 6 : 3}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 disabled:bg-gray-50 disabled:text-gray-600 transition-all duration-200"
                  />
                )}

                {/* Explanation (shown after submit) */}
                {submitted && (
                  <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      💡 Explanation:
                    </p>
                    <p className="text-sm text-blue-700">
                      {question.explanation}
                    </p>
                    {question.type !== "MCQ" && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm font-semibold text-blue-800 mb-1">
                          ✓ Model Answer:
                        </p>
                        <p className="text-sm text-blue-700">
                          {question.correctAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <Target className="w-4 h-4 inline mr-1" />
                {Object.keys(answers).length} of {quiz.questions.length}{" "}
                answered
              </div>
              <div className="flex gap-3">
                {submitted ? (
                  <>
                    <button
                      onClick={handleRetry}
                      className="px-6 py-3 bg-white border-2 border-purple-500 text-purple-600 rounded-xl hover:bg-purple-50 transition-all duration-200 font-semibold flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Retry Quiz
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md"
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={submitting || Object.keys(answers).length === 0}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold flex items-center gap-2 shadow-md"
                    >
                      {submitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Quiz
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
