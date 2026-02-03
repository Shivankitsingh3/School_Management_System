import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
    } catch (error) {
      console.error(error);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="name@university.edu"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="flex justify-between text-sm font-medium text-slate-700 mb-1">
              <span>Password</span>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot?
              </Link>
            </label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
