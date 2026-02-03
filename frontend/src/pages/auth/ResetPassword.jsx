import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordAPI } from "../../api/auth.api";

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm_password) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      await resetPasswordAPI(uid, token, { password: form.password });
      alert("Password reset successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert("Link expired or invalid. Please request a new reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">
            Set New Password
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Choose a strong password to protect your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-md font-semibold text-white transition-all ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
