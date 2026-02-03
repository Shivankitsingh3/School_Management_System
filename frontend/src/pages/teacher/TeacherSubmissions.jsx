import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getTeacherSubmissionsAPI,
  evaluateSubmissionAPI,
  getAISuggestionAPI,
} from "../../api/assignment.api";

const TeacherSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const [marks, setMarks] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await getTeacherSubmissionsAPI();
      console.log("✅ Submissions:", res.data);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      alert("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleGetAISuggestion = async (submissionId) => {
    setLoadingAI(true);
    setAiSuggestion(null);

    try {
      const res = await getAISuggestionAPI(submissionId);
      console.log("AI Response:", res.data);
      setAiSuggestion(res.data.suggestion);
    } catch (err) {
      console.error("AI Error:", err);
      alert(err.response?.data?.detail || "Failed to get AI suggestion");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleEvaluate = async () => {
    if (!selectedSubmission) return;

    if (!marks || marks < 0 || marks > (selectedSubmission.max_marks || 100)) {
      alert(
        `Marks must be between 0 and ${selectedSubmission.max_marks || 100}`
      );
      return;
    }

    try {
      await evaluateSubmissionAPI(selectedSubmission.id, {
        marks_obtained: parseInt(marks),
        teacher_feedback: feedback,
      });
      alert("Evaluation saved successfully!");
      setSelectedSubmission(null);
      setMarks("");
      setFeedback("");
      setAiSuggestion(null);
      fetchSubmissions();
    } catch (err) {
      console.error("Evaluation error:", err);
      alert(err.response?.data?.detail || "Failed to save evaluation");
    }
  };

  const openEvaluationModal = (submission) => {
    setSelectedSubmission(submission);
    setMarks(submission.marks_obtained || "");
    setFeedback(submission.teacher_feedback || "");
    setAiSuggestion(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto">
          <p className="text-center py-8">Loading submissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Student Submissions</h1>

        {submissions.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No submissions yet.
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border rounded-lg p-6 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {sub.assignment_title}
                    </h3>
                    <p className="text-sm text-gray-600">{sub.subject}</p>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Student:</span>{" "}
                        {sub.student_name}
                      </p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                          ID: {sub.student_registration_id}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                          Class: {sub.student_classroom}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      Submitted: {new Date(sub.submitted_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    {sub.marks_obtained !== null ? (
                      <div>
                        <span className="text-2xl font-bold text-green-600">
                          {sub.marks_obtained}
                        </span>
                        <span className="text-gray-500">
                          {" "}
                          / {sub.max_marks || "N/A"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Evaluated</p>
                      </div>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {sub.answer_text && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700">
                        Answer:
                      </p>
                      <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                        {sub.answer_text.length > 300
                          ? `${sub.answer_text.substring(0, 300)}...`
                          : sub.answer_text}
                      </p>
                    </div>
                  )}

                  {sub.answer_file_url && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Attached File:
                      </p>
                      <a
                        href={sub.answer_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        View File →
                      </a>
                    </div>
                  )}

                  {sub.teacher_feedback && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-medium text-blue-900">
                        Your Feedback:
                      </p>
                      <p className="text-sm text-blue-800 mt-1 whitespace-pre-wrap">
                        {sub.teacher_feedback}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => openEvaluationModal(sub)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
                  >
                    {sub.marks_obtained !== null ? "Re-evaluate" : "Evaluate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Evaluation Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Evaluate Submission</h2>

                <div className="mb-4 bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assignment</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedSubmission.assignment_title}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Subject</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedSubmission.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Student</p>
                      <p className="text-sm font-medium text-gray-800">
                        {selectedSubmission.student_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Registration ID
                      </p>
                      <p className="text-sm font-medium text-indigo-600">
                        {selectedSubmission.student_registration_id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Classroom</p>
                      <p className="text-sm font-medium text-green-600">
                        {selectedSubmission.student_classroom}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                      <p className="text-sm font-medium text-gray-800">
                        {new Date(
                          selectedSubmission.submitted_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Show student's work */}
                <div className="mb-6 space-y-3">
                  {selectedSubmission.answer_text && (
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Student's Answer:
                      </p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {selectedSubmission.answer_text}
                      </p>
                    </div>
                  )}

                  {selectedSubmission.answer_file_url && (
                    <div className="bg-gray-50 p-4 rounded border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Attached File:
                      </p>
                      <a
                        href={selectedSubmission.answer_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-sm font-medium"
                      >
                        📎 View/Download File →
                      </a>
                    </div>
                  )}
                </div>

                {/* AI Suggestion Section */}
                <div className="mb-6">
                  <button
                    onClick={() => handleGetAISuggestion(selectedSubmission.id)}
                    disabled={loadingAI}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 text-sm flex items-center gap-2"
                  >
                    {loadingAI ? (
                      <>
                        <span className="animate-spin">⚙️</span> Generating AI
                        Feedback...
                      </>
                    ) : (
                      <>🤖 Get AI Feedback</>
                    )}
                  </button>

                  {aiSuggestion && (
                    <div className="mt-3 bg-purple-50 border border-purple-200 p-4 rounded">
                      <p className="text-sm font-medium text-purple-900 mb-2">
                        AI Suggestion:
                      </p>
                      <pre className="text-sm text-purple-800 whitespace-pre-wrap font-sans">
                        {aiSuggestion}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Evaluation Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Marks (Max: {selectedSubmission.max_marks || 100})
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={selectedSubmission.max_marks || 100}
                      className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter marks"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Feedback
                    </label>
                    <textarea
                      className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows="6"
                      placeholder="Provide constructive feedback to the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setSelectedSubmission(null);
                      setMarks("");
                      setFeedback("");
                      setAiSuggestion(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEvaluate}
                    disabled={!marks}
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Save Evaluation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherSubmissions;
