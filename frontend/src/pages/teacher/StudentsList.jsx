import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentListAPI } from "../../api/student.api";
import { getTeacherAssignedClassroomsAPI } from "../../api/teacher.api";
import { Link } from "react-router-dom";

const StudentsList = () => {
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
        const res = await getTeacherAssignedClassroomsAPI();
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
    loadStudents(selectedClassroom, debouncedSearchTerm);
  }, [selectedClassroom, debouncedSearchTerm]);

  const loadStudents = async (classroomId, search) => {
    setLoading(true);
    try {
      const params = {};
      if (classroomId) params.classroom = classroomId;
      if (search) params.search = search;

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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleClassroomChange = (e) => setSelectedClassroom(e.target.value);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClassroom("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Students List</h1>
        </div>

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
              placeholder="Search name, ID or email..."
              className="border p-2 rounded w-full outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Classroom:
            </label>
            <select
              value={selectedClassroom}
              onChange={handleClassroomChange}
              className="border p-2 rounded w-full md:w-64 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All My Classrooms</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">
            Loading students...
          </div>
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
                      <td className="p-4 text-sm font-medium text-indigo-700">
                        <Link
                          to={`/teacher/student/${s.id}`}
                          className="hover:underline"
                        >
                          {s.registration_id}
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-900">{s.name}</td>
                      <td className="p-4 text-sm text-gray-600">{s.email}</td>
                      <td className="p-4 text-sm text-gray-600">
                        {s.classroom_name}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-8 text-center text-gray-500" colSpan="4">
                      No students found for the selected criteria.
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
