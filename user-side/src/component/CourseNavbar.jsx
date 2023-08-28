import React from "react";
import "./style/coursenav.css";
import { Link } from "react-router-dom";

function CourseNavbar(props) {
  return (
    <div className="nav-main">
      <div className="course-nav-container">
        <Link to="/home" className="course-nav-link">
          Study
        </Link>
        <Link to="/course-about" className="course-nav-link">
          About
        </Link>
      </div>
    </div>
  );
}

export default CourseNavbar;
