import { useEffect, useState } from "react";
import { getTeacherSubmissionsAPI } from "../../api/assignment.api";
import DashboardLayout from "../../layouts/DashboardLayout";
import SubmissionEvaluateModal from "./SubmissionEvaluateModal";

const SubmissionList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getTeacherSubmissionsAPI();
      setSubmissions(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      setError("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateSuccess = (data) => {
    setSubmissions((prevSubmissions) =>
      prevSubmissions.map((submission) =>
        submission.id === data.submissionId
          ? {
              ...submission,
              marks_obtained: data.marks,
              teacher_feedback: data.feedback,
            }
          : submission,
      ),
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  if (submissions.length === 0) {
    return (
      <DashboardLayout>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
          No submissions yet.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Student Submissions</h1>

        <div className="space-y-4">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`border p-4 rounded bg-white flex justify-between items-start transition-colors ${
                s.marks_obtained !== null
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg">{s.assignment_title}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Student:</strong> {s.student_name} (
                  {s.student_registration_id})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Subject:</strong> {s.subject}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Submitted:</strong>{" "}
                  {new Date(s.submitted_at).toLocaleDateString()}
                </p>

                {s.marks_obtained !== null && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-semibold text-green-700">
                      ✓ Marks: {s.marks_obtained}/{s.max_marks}
                    </p>
                    {s.teacher_feedback && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        <strong>Feedback:</strong> {s.teacher_feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setActive(s)}
                className={`px-4 py-2 rounded font-medium whitespace-nowrap ml-4 transition-colors ${
                  s.marks_obtained !== null
                    ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {s.marks_obtained !== null ? "Re-evaluate" : "Evaluate"}
              </button>
            </div>
          ))}
        </div>

        {active && (
          <SubmissionEvaluateModal
            submission={active}
            onClose={() => setActive(null)}
            onEvaluateSuccess={handleEvaluateSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SubmissionList;
