import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentListAPI } from "../../api/student.api";

const ClassroomStudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentListAPI()
      .then((res) => {
        setStudents(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Classroom Students</h1>

        {loading ? (
          <p>Loading students…</p>
        ) : (
          <table className="w-full bg-white border">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-2 text-left">Registration ID</th>
                <th className="p-2 text-left">Student Name</th>
                <th className="p-2 text-left">Classroom</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.registration_id}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{s.classroom_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClassroomStudentList;
