import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import AudioRecorder from "./components/AudioRecorder";
import ReportDashboard from "./report_gen/ReportDashboard";

const AppRoutes = () => {
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<AudioRecorder />} />
      <Route path="/reports" element={<ReportDashboard />} />
    </Routes>
  </Router>
  );
};

export default AppRoutes;
