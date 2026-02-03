import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { listAssignmentsAPI } from "../../api/assignment.api";

const TeacherAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Fetching teacher assignments...");

    listAssignmentsAPI()
      .then((res) => {
        console.log("✅ API Response:", res.data);
        setAssignments(res.data);
      })
      .catch((err) => {
        console.error("❌ Error:", err);
        console.error("❌ Error response:", err.response);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Assignments</h1>
          <Link
            to="/teacher/assignments/create"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            + Create New
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : assignments.length === 0 ? (
          <p className="text-gray-500">No assignments created yet.</p>
        ) : (
          <div className="space-y-4">
            {assignments.map((a) => (
              <div key={a.id} className="border p-4 rounded bg-white">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">
                  {a.subject_name} — {a.classroom_name}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(a.due_date).toLocaleDateString()}
                </p>
                <div className="mt-3 flex gap-3">
                  <Link
                    to={`/teacher/submissions?assignment=${a.id}`}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    View Submissions
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherAssignments;
