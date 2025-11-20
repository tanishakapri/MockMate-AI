import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

const Dashboard = () => {
  return (
    <div className="p-6 md:p-10">

      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Create and manage your AI-powered mock interviews
        </p>
      </div>

      {/* Add Interview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <AddNewInterview />
      </div>

     
      <InterviewList />
    </div>
  );
};

export default Dashboard;

