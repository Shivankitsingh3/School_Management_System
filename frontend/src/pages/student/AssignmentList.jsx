import { useEffect, useState } from "react";
import { listAssignmentsAPI } from "../../api/assignment.api";
import { getStudentSubmissionsAPI } from "../../api/assignment.api";
import { Link } from "react-router-dom";

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const assignmentsRes = await listAssignmentsAPI();
        setAssignments(assignmentsRes.data);

        const submissionsRes = await getStudentSubmissionsAPI();

        const submissionsMap = {};
        submissionsRes.data.forEach((submission) => {
          submissionsMap[submission.assignment] = {
            submitted: true,
            submittedAt: submission.submitted_at,
            id: submission.id,
          };
        });
        setSubmissions(submissionsMap);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.detail || "Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-600">Loading assignments...</p>
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

  if (!assignments.length) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
        No active assignments at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const isSubmitted = submissions[assignment.id]?.submitted;
        const submittedAt = submissions[assignment.id]?.submittedAt;

        return (
          <div
            key={assignment.id}
            className={`border rounded p-4 bg-white shadow-sm transition-all ${
              isSubmitted ? "border-green-200 bg-green-50" : ""
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{assignment.title}</h3>

                {assignment.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {assignment.description}
                  </p>
                )}

                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-500">
                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                  {isSubmitted && submittedAt && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Submitted on{" "}
                      {new Date(submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {isSubmitted ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded font-medium text-sm whitespace-nowrap">
                  <span>✓</span>
                  <span>Submitted</span>
                </div>
              ) : (
                <Link
                  to={`/student/assignments/${assignment.id}/submit`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-indigo-700 whitespace-nowrap transition-colors"
                >
                  Submit Assignment →
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentList;
