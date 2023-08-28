import React, { useState, useContext } from "react";
import "./style/courserating.css";
import { CourseContext } from "../context/CourseContext";

function CourseRating({ courseId }) {
  const [rating, setRating] = useState(0);
  const { rateCourse } = useContext(CourseContext);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmitRating = async () => {
    try {
      await rateCourse(courseId, rating);

      // You might want to update the course data or fetch courses again after submitting the rating
      fetchCourses();
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  return (
    <div className="course-rating">
      <h2>Rate This Course</h2>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`fa-stack fa-2x ${star <= rating ? "checked" : ""}`}
            onClick={() => handleRatingChange(star)}
          >
            <i className="fa-solid fa-star fa-stack-2x"></i>
          </span>
        ))}
      </div>
      <button className="submit-rating" onClick={handleSubmitRating}>
        Submit Rating
      </button>
    </div>
  );
}

export default CourseRating;
