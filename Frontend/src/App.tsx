import React from "react";
import { Route, Routes } from "react-router-dom";
import PageDoesntExist from "./srktaskpremium/Task";
import AfterVerified from "./srktaskpremium/afterVerification";
import PackageSelectionPage from "./srktaskpremium/SRKGROWONLY/PackageSelectionPage";
import Dashboard from "./srktaskpremium/Dashboard/Dashboard";
import GrowOnlyAdminDashboard from "./growonly/GrowOnlyAdminDashboard";
const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Routes>
        <Route path="/pageDoesntExist" element={<PageDoesntExist />} />
        <Route path="/package" element={<PackageSelectionPage />} />
        <Route
          path="/growadmindashboard"
          element={<GrowOnlyAdminDashboard />}
        />
        <Route path="/afterVerified" element={<AfterVerified />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
