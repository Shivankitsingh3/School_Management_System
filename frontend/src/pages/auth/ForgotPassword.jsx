import { useState } from "react";
import { forgotPasswordAPI } from "../../api/auth.api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPasswordAPI( email );
      setIsSent(true);
    } catch (error) {
      alert("Failed to send reset link. Please check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-indigo-600">Reset Password</h2>
          <p className="text-slate-500 text-sm mt-2">
            Enter your email and we'll send you a link to get back into your
            account.
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@university.edu"
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-100">
              A recovery link has been sent to <strong>{email}</strong>.
            </div>
            <button
              onClick={() => setIsSent(false)}
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <a
            href="/login"
            className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
          >
            ← Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
