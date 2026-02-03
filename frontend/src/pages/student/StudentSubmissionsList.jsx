import { useEffect, useState } from "react";
import { getStudentSubmissionsAPI } from "../../api/assignment.api";

const StudentSubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await getStudentSubmissionsAPI();
        console.log(res.data)
        setSubmissions(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setError(error.response?.data?.detail || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!submissions.length) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        You haven't submitted any assignments yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="border rounded p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {submission.assignment_title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Subject: {submission.subject}
              </p>
              <p className="text-sm text-gray-600">
                Submitted:{" "}
                {new Date(submission.submitted_at).toLocaleDateString()}
              </p>

              {submission.marks_obtained !== null && (
                <p className="text-sm font-medium text-green-600 mt-2">
                  Marks: {submission.marks_obtained} / {submission.max_marks}
                </p>
              )}

              {submission.teacher_feedback && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded mt-3">
                  <p className="text-sm font-medium text-blue-900">
                    Teacher Feedback:
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    {submission.teacher_feedback}
                  </p>
                </div>
              )}
            </div>

            {submission.answer_file && (
              <a
                href={submission.answer_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                View File →
              </a>
            )}
          </div>

          {submission.answer_text && (
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm font-medium text-gray-700">Your Answer:</p>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                {submission.answer_text}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentSubmissionsList;
