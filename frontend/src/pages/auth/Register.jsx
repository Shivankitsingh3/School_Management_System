import { useEffect, useState } from "react";
import { getClassroomsAPI } from "../../api/classroom.api";
import { registerAPI } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "student",
    dob: "",
    mobile: "",
    city: "",
    classroom: "",
    preferred_subjects: [],
  });

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const AVAILABLE_SUBJECTS = [
    "Mathematics",
    "Science",
    "English",
    "Hindi",
    "Social Studies",
    "Computer Science",
  ];

  useEffect(() => {
    getClassroomsAPI()
      .then((res) => {
        const data = res.data?.results || res.data || [];
        setClassrooms(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Classroom Fetch Error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSubject = (subjectName) => {
    setForm((prev) => {
      const isSelected = prev.preferred_subjects.includes(subjectName);
      return {
        ...prev,
        preferred_subjects: isSelected
          ? prev.preferred_subjects.filter((s) => s !== subjectName)
          : [...prev.preferred_subjects, subjectName],
      };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password)
      return alert("Passwords do not match");

    const payload = { ...form };
    if (form.role === "student") {
      payload.classroom = form.classroom ? parseInt(form.classroom) : null;
      delete payload.preferred_subjects;
    } else if (form.role === "teacher") {
      if (!payload.preferred_subjects.length)
        return alert("Select at least one subject");
      delete payload.classroom;
    } else {
      delete payload.classroom;
      delete payload.preferred_subjects;
    }

    setLoading(true);
    try {
      await registerAPI(payload);
      alert("Registration successful. Please check your email to activate.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg p-8 space-y-5 shadow-sm"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-indigo-600">Create Account</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            className="input-style"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            className="input-style"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <input
            name="mobile"
            placeholder="Mobile Number"
            className="input-style"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <div className="w-full">
            <label className="block text-[10px] text-slate-400 ml-1 uppercase font-bold mb-1">
              Date of Birth
            </label>
            <input
              name="dob"
              type="date"
              className="input-style h-[42px]"
              value={form.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <input
          name="city"
          placeholder="City"
          className="input-style"
          value={form.city}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input-style"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            className="input-style"
            value={form.confirm_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="pt-2">
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Select Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input-style bg-slate-50"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="principal">Principal</option>
          </select>
        </div>

        {form.role === "student" && (
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <label className="block text-sm font-semibold mb-2">
              Classroom
            </label>
            <select
              name="classroom"
              value={form.classroom}
              onChange={handleChange}
              className="input-style"
              required
            >
              <option value="">-- Select Classroom --</option>
              {classrooms.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {form.role === "teacher" && (
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <label className="block text-sm font-bold mb-2">Subjects</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SUBJECTS.map((s) => (
                <label
                  key={s}
                  className="flex items-center space-x-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.preferred_subjects.includes(s)}
                    onChange={() => handleToggleSubject(s)}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded font-bold text-white transition ${
            loading ? "bg-slate-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Registering..." : "Register Account"}
        </button>
      </form>

      <style>{`
        .input-style {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          outline: none;
          font-size: 14px;
        }
        .input-style:focus {
          border-color: #6366f1;
        }
      `}</style>
    </div>
  );
};

export default Register;
