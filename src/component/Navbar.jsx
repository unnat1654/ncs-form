// components/Navbar.jsx
import React, { useState } from "react";
import logo from "../assets/NCS_Logo.svg";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../authContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [auth,setAuth]=useAuth();

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="NCS Logo" className="logo" />
      </div>
      <div className="navbar-right">
        <div className="navbar-links">
          <Link to="https://hackncs.in" className="navbar-link">
            Home
          </Link>
          <Link to="https://hackncs.in/projects" className="navbar-link">
            Projects
          </Link>
          <Link to="https://hackncs.in/team" className="navbar-link">
            Team
          </Link>
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </div>
        <Link to="https://hackncs.in/#connect"><button className="connect-btn">Connect</button></Link>

      </div>
    </div>
  );
};

export default Navbar;
