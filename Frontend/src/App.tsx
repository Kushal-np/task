import React from "react";
import { Route, Routes } from "react-router-dom";
import PackageSelectionPage from "./srktaskpremium/SRKGROWONLY/PackageSelectionPage";
import Dashboard from "./srktaskpremium/Dashboard/Dashboard";
import GrowOnlyAdminDashboard from "./growonly/GrowOnlyAdminDashboard";
import TaskLandingPage from "./srktaskpremium/Task";
import GrowDashboard from "./srktaskpremium/Dashboard/GrowDashboard";
import AfterVerified from "./srktaskpremium/afterVerification";
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
