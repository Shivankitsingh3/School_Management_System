import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { changePasswordAPI } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.new_password !== form.confirm_password) {
      return alert("New passwords do not match!");
    }

    setLoading(true);
    setError({});
    
    try {
      await changePasswordAPI(form);
      alert("Password updated successfully! Please login again with your new password.");
      setForm({ old_password: "", new_password: "", confirm_password: "" });
      logout();
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        alert("Error: An error occured. Please try again.");
      }  
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">
            Update Password
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password
            </label>
            <input
              name="old_password"
              type="password"
              required
              placeholder="••••••••"
              value={form.old_password}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <hr className="border-slate-100" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password
            </label>
            <input
              name="new_password"
              type="password"
              required
              placeholder="••••••••"
              value={form.new_password}
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              name="confirm_password"
              type="password"
              required
              placeholder="••••••••"
              value={form.confirm_password}
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
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
