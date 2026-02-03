import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentListAPI } from "../../api/student.api";
import { getClassroomsAPI } from "../../api/classroom.api";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentRes, classroomRes] = await Promise.all([
        getStudentListAPI(),
        getClassroomsAPI(),
      ]);
      setStudents(studentRes.data);
      setClassrooms(classroomRes.data);
    } catch (err) {
      setError("Unable to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (classroomId, search) => {
    setLoading(true);
    try {
      const params = {};
      if (classroomId) params.student__classroom_id = classroomId;
      if (search) params.search = search;

      const res = await getStudentListAPI(params);
      setStudents(res.data);
      setError("");
    } catch (err) {
      setError("Error filtering students", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Students List</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded border shadow-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Search Students:
            </label>
            <input
              type="text"
              placeholder="Search name or ID..."
              className="border p-2 rounded w-full outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                loadStudents(selectedClassroom, e.target.value);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Classroom:
            </label>
            <select
              value={selectedClassroom}
              onChange={(e) => {
                setSelectedClassroom(e.target.value);
                loadStudents(e.target.value, searchTerm);
              }}
              className="border p-2 rounded w-full md:w-64 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classrooms</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : (
          <div className="bg-white border rounded shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50 text-left">
                  <th className="p-4 text-sm font-semibold">Reg ID</th>
                  <th className="p-4 text-sm font-semibold">Student Name</th>
                  <th className="p-4 text-sm font-semibold">Email</th>
                  <th className="p-4 text-sm font-semibold">Class</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 text-sm text-gray-700">
                        {s.registration_id || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {s.name || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {s.email || "N/A"}
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {s.classroom_name || "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-center text-gray-500" colSpan="4">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentsList;
