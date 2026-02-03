import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getPrincipalProfileAPI } from "../../api/principal.api";

function PrincipalProfile() {
  const [principal, setPrincipal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrincipalProfileAPI()
      .then((res) => {
        console.log(res.data);
        setPrincipal(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error in fetching student details", err);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-10">Loading Profile...</div>
      ) : principal ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">{principal.user.name}</h1>
          <h3 className="text-xl font-bold mb-4">{principal.user.email}</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p>
              <strong>Role:</strong>{" "}
              {principal.user.role}
            </p>
            <p>
              <strong>Registration ID:</strong> {principal.registration_id}
            </p>
            <p>
              <strong>Mobile:</strong> {principal.user.mobile}
            </p>
            <p>
              <strong>City:</strong> {principal.user.city}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Principal not found.</div>
      )}
    </DashboardLayout>
  );
}

export default PrincipalProfile;
