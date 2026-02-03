import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getAllTeachersAPI,
  getSubjectsByClassroomAPI,
  assignTeacherAPI,
} from "../../api/principal.api";
import { getClassroomsAPI } from "../../api/classroom.api";

const AssignTeacher = () => {
  const [searchParams] = useSearchParams();
  const teacherIdFromURL = searchParams.get("teacher");

  const [teachers, setTeachers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teacher: teacherIdFromURL || "",
    classroom: "",
    subject: "",
  });
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    getAllTeachersAPI()
      .then((res) => {
        const data = res.data.results || res.data;
        setTeachers(data);

        if (teacherIdFromURL) {
          const teacher = data.find((t) => t.id === parseInt(teacherIdFromURL));
          if (teacher) {
            setSelectedTeacher(teacher);
          }
        }
      })
      .catch((err) => {
        console.error("Error loading teachers", err);
        alert("Failed to load teachers");
      });

    getClassroomsAPI()
      .then((res) => {
        const data = res.data.results || res.data;
        setClassrooms(data);
      })
      .catch((err) => {
        console.error("Error loading classrooms", err);
        alert("Failed to load classrooms");
      });
  }, [teacherIdFromURL]);

  const handleClassChange = (classId) => {
    setFormData({ ...formData, classroom: classId, subject: "" });
    setSubjects([]);

    if (classId) {
      getSubjectsByClassroomAPI(classId)
        .then((res) => {
          const data = res.data.results || res.data;
          setSubjects(data);

          if (data.length === 0) {
            alert(
              "No subjects found for this classroom. Please add subjects first.",
            );
          }
        })
        .catch((err) => {
          console.error("Error loading subjects:", err);
          alert("Failed to load subjects for this classroom");
        });
    }
  };

  const handleTeacherChange = (teacherId) => {
    setFormData({ ...formData, teacher: teacherId });
    const teacher = teachers.find((t) => t.id === parseInt(teacherId));
    setSelectedTeacher(teacher);
  };

  const handleAssign = async () => {
    if (!formData.teacher || !formData.classroom || !formData.subject) {
      return alert("Please select all fields");
    }
    setLoading(true);

    try {
      const response = await assignTeacherAPI(formData);
      console.log("✅ Assignment successful:", response.data);
      alert("Faculty assigned successfully!");

      setFormData({ teacher: "", classroom: "", subject: "" });
      setSelectedTeacher(null);
      setSubjects([]);
    } catch (err) {
      console.error("❌ Assignment failed:", err.response?.data);

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Failed to assign faculty. Check console for details.";

      alert(`Assignment Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">
          Assign Faculty to Classroom
        </h2>

        <div className="grid gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Teacher
            </label>
            <select
              className="p-3 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.teacher}
              onChange={(e) => handleTeacherChange(e.target.value)}
            >
              <option value="">-- Select Teacher --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.registration_id ? `(${t.registration_id})` : ""}
                </option>
              ))}
            </select>

            {selectedTeacher?.expertise &&
              selectedTeacher.expertise.length > 0 && (
                <div className="mt-2 p-3 bg-purple-50 rounded border border-purple-200">
                  <p className="text-xs text-purple-700 font-medium mb-1">
                    ✨ Teacher's Expertise:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTeacher.expertise.map((subject, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Classroom
            </label>
            <select
              className="p-3 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={formData.classroom}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">-- Select Classroom --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">
              Subject
            </label>
            <select
              className="p-3 border rounded-md bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              disabled={!formData.classroom}
            >
              <option value="">
                {!formData.classroom
                  ? "-- Select Classroom First --"
                  : subjects.length > 0
                    ? "-- Select Subject --"
                    : "No subjects available for this classroom"}
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {formData.classroom && subjects.length === 0 && (
              <p className="text-xs text-red-600 mt-1">
                ⚠️ This classroom has no subjects. Please add subjects to this
                classroom first.
              </p>
            )}
          </div>

          <button
            onClick={handleAssign}
            disabled={
              loading ||
              !formData.teacher ||
              !formData.classroom ||
              !formData.subject
            }
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-md font-bold transition-colors shadow-lg active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Assigning..." : "Assign Now"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignTeacher;
