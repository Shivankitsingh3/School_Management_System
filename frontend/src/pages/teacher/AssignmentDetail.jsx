import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getAssignmentDetailAPI } from "../../api/assignment.api";

function AssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignmentDetailAPI(id)
        .then((res) => {
            console.log(res.data);
        setAssignment(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch assignment details", err);
        setLoading(false);
      });
  }, [id]);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="text-center py-10">Loading Assignment Details...</div>
      ) : assignment ? (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-4">{assignment.title}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <p>
              <strong>Classroom:</strong> {assignment.classroom_name}
            </p>
            <p>
              <strong>Subject:</strong> {assignment.subject_name}
            </p>
            <p>
              <strong>Max Marks:</strong> {assignment.max_marks}
            </p>
            <p>
              <strong>Due Date:</strong> {assignment.due_date}
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{assignment.description}</p>
          </div>
        </div>
      ) : (
        <div className="text-center text-red-500">Assignment not found.</div>
      )}
    </DashboardLayout>
  );
}

export default AssignmentDetail;
