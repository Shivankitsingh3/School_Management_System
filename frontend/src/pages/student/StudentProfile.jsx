import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getStudentProfileAPI } from "../../api/student.api";

function StudentProfile() {
  const [student, setStudent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentProfileAPI()
      .then((res) => {
        console.log(res.data);
        setStudent(res.data);
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
        <div className="text-center py-10">Loading Student Details...</div>
      ) : student ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">{student.user.name}</h1>
          <h3 className="text-xl font-bold mb-4">{student.user.email}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p>
              <strong>Classroom:</strong> {student.classroom_name}
            </p>
            <p>
              <strong>Registration ID:</strong> {student.registration_id}
            </p>
            <p>
              <strong>Date-of-Birth:</strong> {student.user.dob}
            </p>
            <p>
              <strong>City:</strong> {student.user.city}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Student not found.</div>
      )}
    </DashboardLayout>
  );
}

export default StudentProfile;
