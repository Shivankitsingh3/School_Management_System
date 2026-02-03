import DashboardLayout from "../../layouts/DashboardLayout";
import StudentSubmissionsList from "./StudentSubmissionsList";

const StudentSubmissions = () => {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-2xl font-bold">My Submissions</h1>

        <section>
          <h2 className="text-xl font-semibold mb-4">Assignment Submissions</h2>
          <StudentSubmissionsList />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentSubmissions;
