import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import "./style/nav.css";
import certificate from "../assets/certificate.png";
import logout from "../assets/logout.png";
import userImgOff from "../assets/userImg.png";
import { CourseContext } from "../context/CourseContext";

function Navbar() {
  const { userName, userImage } = useContext(CourseContext);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const navContainerRef = useRef(null);
  const imageUrl = `${userImage || userImgOff}`;

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const closeNavbar = () => {
    setIsNavbarOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target)
      ) {
        closeNavbar();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar-container">
      <button className="navbar-toggle-button" onClick={toggleNavbar}>
        <i className="fa-solid fa-bars" />
      </button>
      <div
        ref={navContainerRef}
        className={`nav-container ${isNavbarOpen ? "open" : ""}`}
      >
        <div className="user-info-nav">
          <div
            className="circle-box-nav"
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
          <p>{userName}</p>
        </div>
        <Link to="/home" className="nav-link">
          <i className="fa-solid fa-house" /> Home
        </Link>
        <Link to="/payment" className="nav-link">
          <i className="fa-solid fa-cart-shopping" />
          Cart
        </Link>
        <Link to="/certi" className="nav-link">
          <img src={certificate} /> Certificate
        </Link>
        <Link to="/user" className="nav-link">
          <i className="fa-solid fa-user" /> User
        </Link>
        <Link to="/login" className="nav-link">
          <img src={logout} />
          Log Out
        </Link>
        <p className="version">Beta 1.0</p>
      </div>
    </div>
  );
}

export default Navbar;
