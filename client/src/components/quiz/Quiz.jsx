import { useState } from "react";
import { CheckCircle, X } from "lucide-react";
import { submitQuiz } from "../../services/api";
import QuizResults from "./QuizResults";

export default function Quiz({ quiz, onClose }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    // Check all questions answered
    if (Object.keys(answers).length !== quiz.questions.length) {
      alert("Please answer all questions before submitting!");
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const result = await submitQuiz(quiz.id, formattedAnswers);
      setResults(result.result);
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (results) {
    return <QuizResults results={results} onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col"
        style={{ height: "85vh" }}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-lg flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-white">Quiz Time! 🧠</h2>
            <p className="text-purple-100 text-sm mt-1">{quiz.pdfName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Questions - Scrollable with own scrollbar */}
        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                onAnswerChange={(answer) =>
                  handleAnswerChange(question.id, answer)
                }
              />
            ))}
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            Questions answered:{" "}
            <span className="font-semibold">{Object.keys(answers).length}</span>{" "}
            / {quiz.questions.length}
          </div>
          <button
            onClick={handleSubmit}
            disabled={
              submitting ||
              Object.keys(answers).length !== quiz.questions.length
            }
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, index, answer, onAnswerChange }) {
  const getBadgeColor = (type) => {
    switch (type) {
      case "MCQ":
        return "bg-blue-100 text-blue-800";
      case "SAQ":
        return "bg-green-100 text-green-800";
      case "LAQ":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
      {/* Question Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
          {index + 1}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                question.type
              )}`}
            >
              {question.type}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Answer Options */}
      <div className="ml-11">
        {question.type === "MCQ" && question.options.length > 0 ? (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <label
                key={idx}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  answer === option
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            value={answer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder={
              question.type === "SAQ"
                ? "Write your short answer here..."
                : "Write your detailed answer here..."
            }
            rows={question.type === "LAQ" ? 6 : 3}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-purple-600 focus:outline-none resize-none"
          />
        )}
      </div>
    </div>
  );
}
