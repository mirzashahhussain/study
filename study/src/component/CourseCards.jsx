import React from "react";
import "./style/card.css";

function CourseCards(props) {
  const { courseImg, courseDisc, courseName, coursePrice, onClick } = props; // Fix destructuring here
  return (
    <>
      <div className="course-card" onClick={onClick}>
        <h4 className="course-card-name">{courseName}</h4>
        <p className="course-card-disc">{courseDisc}</p>
        <img src={courseImg} className="course-card-img" />
        <p className="total-enroll">
          <i
            className="fa-solid fa-user"
            style={{ display: "inline", marginRight: "5px" }}
          />
          1,000
        </p>
        <p className="course-card-price">{coursePrice}</p>
        {props.children}
      </div>
    </>
  );
}

export default CourseCards;
