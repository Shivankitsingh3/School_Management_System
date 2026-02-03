import { useParams, useNavigate } from "react-router-dom";
import { activateAccountAPI } from "../../api/auth.api";
import { useEffect, useState } from "react";

const ActivateAccount = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    activateAccountAPI(uid, token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [uid, token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            <h2 className="text-xl font-semibold text-slate-800">
              Verifying your account...
            </h2>
            <p className="text-slate-500 text-sm">
              Please wait while we confirm your email address.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Account Activated!
            </h2>
            <p className="text-slate-500 text-sm">
              Your email has been verified. Redirecting you to login...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Click here if you aren't redirected
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-800">
              Activation Failed
            </h2>
            <p className="text-slate-500 text-sm">
              The link is invalid or has already expired.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all"
            >
              Back to Registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateAccount;
