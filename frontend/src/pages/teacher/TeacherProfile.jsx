import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTeacherProfileAPI } from "../../api/teacher.api";

function TeacherProfile() {
  const [teacher, setTeacher] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeacherProfileAPI()
      .then((res) => {
        console.log(res.data);
        setTeacher(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error in fetching student details", err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-10">Loading Profile...</div>
      ) : teacher ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">{teacher.user.name}</h1>
          <h3 className="text-xl font-bold mb-4">{teacher.user.email}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p>
              <strong>Expertise:</strong>{" "}
              {teacher.preferred_subjects.join(", ")}
            </p>
            <p>
              <strong>Registration ID:</strong> {teacher.registration_id}
            </p>
            <p>
              <strong>Mobile:</strong> {teacher.user.mobile}
            </p>
            <p>
              <strong>City:</strong> {teacher.user.city}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Teacher not found.</div>
      )}
    </DashboardLayout>
  );
}

export default TeacherProfile;
