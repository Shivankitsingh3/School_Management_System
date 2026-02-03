import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { submitAssignmentAPI } from "../../api/assignment.api";

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    answer_text: "",
    answer_file: null,
  });

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const validateFile = (file) => {
    const fileErrors = {};

    if (file.size > MAX_FILE_SIZE) {
      fileErrors.file = `File size must not exceed 5MB. Your file is ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)}MB`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      fileErrors.file =
        "Invalid file type. Allowed: PDF, DOC, DOCX, TXT, JPG, PNG, XLS, XLSX";
    }

    return fileErrors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileErrors = validateFile(file);
      setErrors(fileErrors);
      if (Object.keys(fileErrors).length === 0) {
        setForm({ ...form, answer_file: file });
      } else {
        setForm({ ...form, answer_file: null });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!form.answer_text.trim() && !form.answer_file) {
      newErrors.general = "Please provide either an answer or upload a file";
    }

    if (form.answer_text.trim().length > 10000) {
      newErrors.answer_text = "Answer text must not exceed 10,000 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await submitAssignmentAPI(id, form);

      alert("✅ Assignment submitted successfully!");
      navigate("/student");
    } catch (err) {
      console.error("Submission error:", err);

      if (err.response?.data) {
        const errData = err.response.data;

        if (errData.answer_text) {
          newErrors.answer_text = errData.answer_text[0];
        }
        if (errData.answer_file) {
          newErrors.answer_file = errData.answer_file[0];
        }
        if (errData.detail) {
          newErrors.general = errData.detail;
        }
        if (errData.non_field_errors) {
          newErrors.general = errData.non_field_errors[0];
        }
      }

      if (Object.keys(newErrors).length === 0) {
        newErrors.general = "Submission failed. Please try again later.";
      }

      setErrors(newErrors);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Submit Assignment</h1>

        <div className="bg-white p-6 border rounded shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.general}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Answer
              </label>
              <textarea
                placeholder="Type your answer here... (max 10,000 characters)"
                className={`w-full border p-3 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                  errors.answer_text ? "border-red-500" : "border-gray-300"
                }`}
                rows="8"
                value={form.answer_text}
                onChange={(e) => {
                  setForm({ ...form, answer_text: e.target.value });
                  if (errors.answer_text) {
                    setErrors({ ...errors, answer_text: null });
                  }
                }}
                maxLength="10000"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {form.answer_text.length} / 10,000 characters
                </p>
                {errors.answer_text && (
                  <p className="text-xs text-red-600">{errors.answer_text}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload File (Optional)
              </label>
              <div
                className={`border-2 border-dashed p-6 rounded text-center cursor-pointer transition-colors ${
                  errors.answer_file
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, TXT, JPG, PNG, XLS, XLSX (Max 5MB)
                </p>
              </div>

              {form.answer_file && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      ✓ {form.answer_file.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Size: {(form.answer_file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, answer_file: null })}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}

              {errors.answer_file && (
                <p className="text-xs text-red-600 mt-2">
                  {errors.answer_file}
                </p>
              )}
            </div>

            {loading && (
              <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded">
                <p className="text-sm text-blue-700">
                  Uploading your submission...
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/student")}
                className="px-6 py-3 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubmitAssignment;
