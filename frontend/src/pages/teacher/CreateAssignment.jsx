import { useEffect, useState } from "react";
import { createAssignmentAPI } from "../../api/assignment.api";
import { getTeacherAssignedClassroomsAPI } from "../../api/teacher.api";
import { getTeacherAssignedSubjectsAPI } from "../../api/teacher.api";
import DashboardLayout from "../../layouts/DashboardLayout";

const CreateAssignment = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    classroom: "",
    subject: "",
    due_date: "",
    max_marks: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTeacherAssignedClassroomsAPI()
      .then((res) => setClassrooms(res.data))
      .catch((err) => console.error("Error fetching classrooms:", err));
  }, []);

  useEffect(() => {
    getTeacherAssignedSubjectsAPI()
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, []);

  const filteredSubjects = form.classroom
    ? subjects.filter((s) => s.classroom === Number(form.classroom))
    : subjects;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "classroom") {
      setForm({ ...form, classroom: value, subject: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createAssignmentAPI({
        title: form.title,
        description: form.description,
        classroom: Number(form.classroom),
        subject: Number(form.subject),
        due_date: form.due_date,
        max_marks: Number(form.max_marks),
      });

      alert("Assignment created successfully!");
      setForm({
        title: "",
        description: "",
        classroom: "",
        subject: "",
        due_date: "",
        max_marks: "",
      });
    } catch (error) {
      console.error(error.response?.data || error);
      const errorMsg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.detail ||
        "Failed to create assignment.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {" "}
      <div className="max-w-2xl mx-auto bg-white p-6 rounded border shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          Create New Assignment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Classroom</label>
            <select
              name="classroom"
              className="w-full border p-2 rounded"
              value={form.classroom}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Class --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <select
              name="subject"
              className="w-full border p-2 rounded"
              value={form.subject}
              onChange={handleChange}
              disabled={!form.classroom}
              required
            >
              <option value="">-- Select Subject --</option>
              {filteredSubjects.map((s) => (
                <option key={s.id} value={s.subject}>
                  {s.subject_name}
                </option>
              ))}
            </select>
          </div>

          <input
            className="w-full border p-2 rounded"
            name="title"
            placeholder="Assignment Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Instructions..."
            className="w-full border p-2 rounded"
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="datetime-local"
                name="due_date"
                className="w-full border p-2 rounded"
                value={form.due_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Marks
              </label>
              <input
                type="number"
                name="max_marks"
                placeholder="100"
                className="w-full border p-2 rounded"
                value={form.max_marks}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.classroom || !form.subject}
            className={`w-full py-2.5 rounded font-bold text-white ${
              loading || !form.classroom || !form.subject
                ? "bg-gray-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateAssignment;