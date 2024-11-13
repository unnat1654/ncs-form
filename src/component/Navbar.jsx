// components/Navbar.jsx
import React, { useState } from "react";
import logo from "../assets/NCS_Logo.svg";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="NCS Logo" className="logo" />
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
          <a href="/" className="navbar-link">
            Home
          </a>
          <a href="/projects" className="navbar-link">
            Projects
          </a>
          <a href="/team" className="navbar-link">
            Team
          </a>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </div>
        <button className="connect-btn">Connect</button>
        {/* Hamburger icon */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
