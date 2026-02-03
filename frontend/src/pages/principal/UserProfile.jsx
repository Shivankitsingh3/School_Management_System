import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getTeacherDetailAPI } from "../../api/teacher.api";
import { getStudentDetailAPI } from "../../api/student.api";
import { useLocation } from "react-router-dom";

function UserProfile() {
  const location = useLocation();
  const { id, userType } = location.state || {};

  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !userType) return;

    const fetchUser = async () => {
      userType === "teacher"
        ? getTeacherDetailAPI(id)
            .then((res) => {
              console.log(res.data);
              setUser(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching teacher details.", err);
              setLoading(false);
            })
        : getStudentDetailAPI(id)
            .then((res) => {
              console.log(res.data);
              setUser(res.data);
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching student details.", err);
              setLoading(false);
            });
    };

    fetchUser();
  }, [id, userType]);

  if (loading) {
    return <div className="text-center py-10">Loading user details...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-red-500">User not found!</div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">{user.user.name}</h1>
        <h3 className="text-xl font-bold mb-4">{user.user.email}</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <p>
            <strong>Date-of-Birth:</strong> {user.user.dob}
          </p>
          <p>
            <strong>Registration ID:</strong> {user.registration_id}
          </p>
          <p>
            <strong>Role:</strong> {user.user.role}
          </p>
          <p>
            <strong>Mobile:</strong> {user.user.mobile}
          </p>
          <p>
            <strong>City:</strong> {user.user.city}
          </p>

          {userType === "teacher" ? (
            <p>
              <strong>Expertise:</strong> {user.preferred_subjects.join(', ')}
            </p>
          ) : (
            <p>
              <strong>Classroom:</strong> {user.classroom_name}
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default UserProfile;

//   return (
//     <DashboardLayout>
//       {loading ? (
//         <div className="text-center py-10">Loading Student Details...</div>
//       ) : student ? (
//         <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
//           <h1 className="text-3xl font-bold mb-4">{student.user.name}</h1>
//           <h3 className="text-xl font-bold mb-4">{student.user.email}</h3>
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <p>
//               <strong>Classroom:</strong> {student.classroom_name}
//             </p>
//             <p>
//               <strong>Registration ID:</strong> {student.registration_id}
//             </p>
//             <p>
//               <strong>Date-of-Birth:</strong> {student.user.dob}
//             </p>
//             <p>
//               <strong>City:</strong> {student.user.city}
//             </p>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center text-red-500">Student not found.</div>
//       )}
//     </DashboardLayout>
//   );
// }

// export default StudentProfile;
