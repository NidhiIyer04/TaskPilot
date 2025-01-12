import React from "react";
import './App.css';
import ReportDashboard from "./report_gen/ReportDashboard"; 
import AudioRecorder from "./components/AudioRecorder";

function App() {
  return (
    <div className="App">
      <AudioRecorder />
      <ReportDashboard />
    </div>
  );
}

export default App;