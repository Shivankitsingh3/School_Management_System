import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTeacherAssignedSubjectsAPI } from "../../api/teacher.api";
import { listAssignmentsAPI } from "../../api/assignment.api";


const TeacherDashboard = () => {
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [activeAssignments, setActiveAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [subjectsRes, assignmentsRes] = await Promise.all([
          getTeacherAssignedSubjectsAPI(),
          listAssignmentsAPI(),
        ]);

        setAssignedSubjects(subjectsRes.data || []);
        const activeOnly = (assignmentsRes.data || []).filter(
          (asm) => asm.is_active,
        );
        setActiveAssignments(activeOnly);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <p className="text-sm text-gray-500 font-medium">
            Welcome back. Here is your overview.
          </p>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded bg-white p-5">
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-4 underline">
                My Classrooms
              </h2>
              <div className="space-y-4">
                {assignedSubjects.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No subjects assigned.
                  </p>
                ) : (
                  assignedSubjects.map((item) => (
                    <div
                      key={item.id}
                      className="border-b pb-3 last:border-0 last:pb-0"
                    >
                      <p className="font-semibold text-gray-800">
                        {item.subject_name}
                        <span className=" mx-1 text-sm text-gray-600">
                          ({item.classroom_name || item.classroom?.name})
                        </span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border rounded bg-white p-5">
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-4 underline">
                Active Assignments
              </h2>
              <div className="space-y-4">
                {activeAssignments.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No active assignments.
                  </p>
                ) : (
                  activeAssignments.map((a) => (
                    <div
                      key={a.id}
                      className="border-b pb-3 last:border-0 last:pb-0"
                    >
                      <h3 className="font-semibold text-gray-800">{a.title}</h3>
                      <p className="text-[11px] text-gray-500">
                        Due: {new Date(a.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border rounded bg-white p-5">
              <h2 className="text-sm font-bold text-indigo-600 uppercase mb-4 underline">
                Quick Links
              </h2>
              <div className="flex flex-col space-y-3">
                <Link
                  to="/teacher/assignments/create"
                  className="text-indigo-600 text-sm hover:underline font-medium"
                >
                  + Create New Assignment
                </Link>
                <Link
                  to="/teacher/assignments"
                  className="text-gray-700 text-sm hover:underline font-medium"
                >
                  Manage All Assignments
                </Link>
                <Link
                  to="/teacher/submissions"
                  className="text-gray-700 text-sm hover:underline font-medium"
                >
                  Check Student Submissions
                </Link>
                <Link
                  to="/teacher/attendance"
                  className="text-gray-700 text-sm hover:underline font-medium"
                >
                  Mark Class Attendance
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
