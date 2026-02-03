import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPendingTeachersAPI } from "../../api/principal.api";
import { Link } from "react-router-dom";

const PendingTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingTeachersAPI()
      .then((res) => setTeachers(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load pending teachers");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Teachers</h1>

        {loading && <p>Loading pending teachers...</p>}

        {!loading && teachers.length === 0 && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            🎉 All teachers are assigned.
          </div>
        )}

        {!loading && teachers.length > 0 && (
          <div className="grid gap-4">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-white border rounded-lg p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <h3 className="font-bold text-lg text-indigo-700">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Registration ID: {t.registration_id}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {t.expertise?.length > 0 ? (
                      t.expertise.map((subj, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded"
                        >
                          {subj}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        No preferred subjects
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/principal/assign?teacher=${t.id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-semibold transition"
                >
                  Assign
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingTeachers;
