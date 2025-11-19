import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./Components/NavBar/NavigationBar";
import Homepage from "./pages/HomePage/Layout";
import SideBar from "./Components/SideBar/SideBar";
import FeedPage from "./Components/FeedComponent/FeedPage";
import RightBar from "./Components/RightBar/RightBar";
import SignupPage from "./pages/AuthPages/SignupPage";
import LoginPage from "./pages/AuthPages/LoginPage";
import PageDoesntExist from "./pages/Error/PageDoesntExist";

const App: React.FC = () => {
  return (
    
    <div className="h-screen flex flex-col bg-black text-white">



   

          <Routes>
              <Route path="/signup" element={<SignupPage/>} />
              <Route path="/login" element={<LoginPage/>} />
          <Route path="/" element={<Homepage />}>
            {/* Default child: FeedPage */}
            <Route index element={<FeedPage />} />
            {/* Other nested routes (optional) */}
            <Route path="feed" element={<FeedPage />} />
          </Route>
              <Route path="*" element={<PageDoesntExist/>} />
              
          </Routes>

 

    </div>
  );
};

export default App;
