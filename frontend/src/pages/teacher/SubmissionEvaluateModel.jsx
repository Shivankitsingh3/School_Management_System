import { useState } from "react";
import {
  evaluateSubmissionAPI,
  getAISuggestionAPI,
} from "../../api/assignment.api";


const SubmissionEvaluateModal = ({
  submission,
  onClose,
  onEvaluateSuccess,
}) => {
  const [marks, setMarks] = useState(submission.marks_obtained || "");
  const [feedback, setFeedback] = useState(submission.teacher_feedback || "");
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [savingEvaluation, setSavingEvaluation] = useState(false);

  const handleGetAI = async () => {
    setLoadingAI(true);
    try {
      const res = await getAISuggestionAPI(submission.id);
      setAiSuggestion(res.data.suggestion);
    } catch (err) {
      console.error("AI Error:", err);
      alert(err.response?.data?.error || "Failed to get AI suggestion");
    } finally {
      setLoadingAI(false);
    }
  };

  const submit = async () => {
    if (marks === "" || marks < 0) {
      alert("Please enter valid marks");
      return;
    }

    if (parseInt(marks) > (submission.max_marks || 100)) {
      alert(`Marks cannot exceed ${submission.max_marks || 100}`);
      return;
    }

    setSavingEvaluation(true);

    try {
      await evaluateSubmissionAPI(submission.id, {
        marks_obtained: parseInt(marks),
        teacher_feedback: feedback,
      });

      alert("Evaluation saved successfully");

      onEvaluateSuccess({
        submissionId: submission.id,
        marks: parseInt(marks),
        feedback: feedback,
      });

      onClose();
    } catch (err) {
      console.error("Evaluation Error:", err);
      alert(err.response?.data?.detail || "Error saving evaluation");
    } finally {
      setSavingEvaluation(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Evaluate Submission</h2>

        <div className="text-sm mb-4 space-y-1">
          <p>
            <strong>Student:</strong> {submission.student_name}
          </p>
          <p>
            <strong>Assignment:</strong> {submission.assignment_title}
          </p>
        </div>

        <div className="border p-3 rounded bg-gray-50 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-purple-800 font-sans">
              AI Assistant
            </span>
            <button
              onClick={handleGetAI}
              disabled={loadingAI}
              className="bg-purple-600 text-white text-xs px-2 py-1 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loadingAI ? "Processing..." : "Get AI Suggestion"}
            </button>
          </div>

          {aiSuggestion && (
            <div className="text-xs text-gray-700 mt-2">
              <div className="p-2 border-l-2 border-purple-300 bg-white italic mb-2">
                {aiSuggestion}
              </div>
              <button
                onClick={() => setFeedback(aiSuggestion)}
                className="text-purple-700 font-bold underline cursor-pointer hover:text-purple-900"
              >
                Use this as Feedback
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Feedback
            </label>
            <textarea
              className="w-full border p-2 rounded h-24 text-sm outline-none focus:border-indigo-500"
              placeholder="Enter feedback for student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={savingEvaluation}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Marks (Max: {submission.max_marks || 100})
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm outline-none focus:border-indigo-500"
              placeholder="0"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              disabled={savingEvaluation}
              min="0"
              max={submission.max_marks || 100}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={savingEvaluation}
            className="px-4 py-2 border rounded text-sm hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={savingEvaluation}
            className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {savingEvaluation ? "Saving..." : "Save Evaluation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionEvaluateModal;
