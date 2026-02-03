import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getClassroomsAPI } from "../../api/classroom.api";
import { getTeacherListAPI } from "../../api/teacher.api";
import { Link } from "react-router-dom";

const TeachersList = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
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
    const loadTeachers = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedClassroom) params.classroom = selectedClassroom;
        if (debouncedSearchTerm) params.search = debouncedSearchTerm;

        const res = await getTeacherListAPI(params);
        setTeachers(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Error filtering teachers");
      } finally {
        setLoading(false);
      }
    };

    loadTeachers();
  }, [selectedClassroom, debouncedSearchTerm]);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teachers List</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded border shadow-sm">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Search Teachers:
            </label>
            <input
              type="text"
              placeholder="Search name, ID or email..."
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
                  <th className="p-4 text-sm font-semibold">Registration ID</th>
                  <th className="p-4 text-sm font-semibold">Teacher Name</th>
                  <th className="p-4 text-sm font-semibold">Email</th>
                  <th className="p-4 text-sm font-semibold">Expertise</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-indigo-700 underline">
                      <Link
                        to={`/principal/users/${t.id}`}
                        state={{ id: t.id, userType: "teacher" }}
                      >
                        {t.registration_id}
                      </Link>
                    </td>
                    <td className="p-4 text-sm text-gray-900">{t.name}</td>
                    <td className="p-4 text-sm text-gray-600">{t.email}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {Array.isArray(t.expertise)
                        ? t.expertise.join(", ")
                        : "N/A"}
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

export default TeachersList;
