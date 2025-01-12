import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"; // Add CSS for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">Client Query Resolution Portal</Link>
      <Link to="/reports">Report Dashboard</Link>
    </nav>
  );
};

export default Navbar;
