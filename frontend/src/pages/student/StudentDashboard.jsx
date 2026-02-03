import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Link } from "react-router-dom";
import { listAssignmentsAPI } from "../../api/assignment.api";

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await listAssignmentsAPI();
      setAssignments(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-8">
          <p className="text-gray-600">Loading assignments...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        <div className="pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">My Assignments</h2>
          <p className="text-sm text-gray-500">
            View tasks and track your submission status
          </p>
        </div>

        {assignments.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No assignments found for your classroom.
          </div>
        ) : (
          assignments.map((asm) => (
            <div key={asm.id} className="border rounded p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {asm.title}
                    </h3>
                    {asm.is_submitted ? (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase border border-green-200">
                        Submitted
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold uppercase border border-amber-200">
                        Pending
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Subject: {asm.subject_name}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Classroom: {asm.classroom_name}
                  </p>

                  <p className="text-sm text-gray-600">
                    Due Date: {new Date(asm.due_date).toLocaleDateString()}
                  </p>

                  {asm.is_submitted && (
                    <p className="text-sm font-medium text-green-600 mt-2">
                      Marks:{" "}
                      {asm.marks_obtained !== null
                        ? asm.marks_obtained
                        : "Pending"}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">

                  {!asm.is_submitted && asm.is_active && (
                    <Link
                      to={`/student/assignments/${asm.id}/submit`}
                      className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded text-sm font-medium transition shadow-sm"
                    >
                      Submit Now
                    </Link>
                  )}
                </div>
              </div>

              {asm.description && (
                <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Instructions:
                  </p>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap line-clamp-2">
                    {asm.description}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
