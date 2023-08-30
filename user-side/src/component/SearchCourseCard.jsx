import React from "react";
import "./style/search-course-card.css";

function SearchCourseCard(props) {
  const {
    courseImg,
    courseName,
    coursePrice,
    courseRatings,
    courseUserRatings,
    onClick,
  } = props;

  const averageRating = courseRatings ? courseRatings.toFixed(1) : 0;

  return (
    <div className="search-course-card" onClick={onClick}>
      <img src={courseImg} className="search-course-card-img" />
      <h5 className="search-course-card-name">{courseName}</h5>
      <div className="search-course-card-rating">
        {/* {averageRating} ({courseUserRatings}) */}
      </div>
      <h5 className="search-course-card-price">₹{coursePrice}</h5>
    </div>
  );
}

export default SearchCourseCard;
