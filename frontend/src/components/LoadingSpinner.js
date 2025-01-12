import React from "react";
import "./LoadingSpinner.css"; // Import the CSS for the spinner

const LoadingSpinner = ({ message }) => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
