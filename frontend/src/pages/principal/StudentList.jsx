import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentListAPI } from "../../api/student.api";
import { getClassroomsAPI } from "../../api/classroom.api";
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const res = await getClassroomsAPI();
        setClassrooms(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch classrooms");
      }
    };
    fetchClassrooms();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const loadStudents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedClassroom) params.classroom = selectedClassroom;
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;

        const res = await getStudentListAPI(params);
        setStudents(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Error filtering students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [selectedClassroom, debouncedSearchTerm]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Students List</h1>

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Classroom:
            </label>
            <select
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
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
            <table className="w-full text-left">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4 text-sm font-semibold">Reg ID</th>
                  <th className="p-4 text-sm font-semibold">Student Name</th>
                  <th className="p-4 text-sm font-semibold">Email</th>
                  <th className="p-4 text-sm font-semibold">Class</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-indigo-700 underline">
                      <Link
                        to={`/principal/users/${s.id}`}
                        state={{ id: s.id, userType: "student" }}
                      >
                        {s.registration_id}
                      </Link>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentList;
