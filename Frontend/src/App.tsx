import React from "react";
import { Route, Routes } from "react-router-dom";
import TaskLandingPage from "./srktaskpremium/Task";
import PackageSelectionPage from "./growonly/PackageSelectionPage";
import GrowOnlyAdminDashboard from "./growonly/GrowOnlyAdminDashboard";
import GrowDashboard from "./growonly/GrowDashboard";
import AfterVerified from "./srktaskpremium/afterVerification";
import Dashboard from "./srktaskpremium/Dashboard/Dashboard";
const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Routes>
        <Route path="/taskLanding" element={<TaskLandingPage/>} />
        <Route path="/package" element={<PackageSelectionPage/>} />
        <Route
          path="/growadmindashboard"
          element={<GrowOnlyAdminDashboard />}
        />
        <Route path="/growdashboard" element={<GrowDashboard />} />
        <Route path="/afterVerified" element={<AfterVerified />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
