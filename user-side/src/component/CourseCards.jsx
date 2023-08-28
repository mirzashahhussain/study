import React, { useState, useEffect, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseContext } from "../context/CourseContext";
import "./style/card.css";

function CourseCards(props) {
  const {
    courseImg,
    courseName,
    coursePrice,
    courseRatings,
    courseUserRatings,
    onClick,
  } = props;
  const { loading } = useContext(CourseContext);
  const maxWords = 7;
  const [truncatedText, setTruncatedText] = useState(courseName);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const words = courseName.split(" ");

    if (words.length > maxWords) {
      setTruncatedText(words.slice(0, maxWords).join(" ") + " ...more");
    }
  }, [courseName]);

  useEffect(() => {
    // Calculate the average rating if courseRatings is defined
    if (courseRatings && courseRatings.length > 0) {
      const totalRatings = courseRatings.length;
      const sumRatings = courseRatings.reduce(
        (total, rating) => total + rating.rating,
        0
      );
      const newAverageRating = sumRatings / totalRatings;
      setAverageRating(newAverageRating);
    }
  }, [courseRatings]);

  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;
  return (
    <>
      <div className="course-card">
        <img src={courseImg} className="course-card-img" onClick={onClick} />

        <h5 className="course-card-name">{truncatedText}</h5>

        <div className="rating">
          {averageRating.toFixed(1) || 0}
          {Array.from({ length: filledStars }, (_, index) => (
            <i key={index} className={`fa-solid fa-star filled`} />
          ))}
          {hasHalfStar && <i className="fa-solid fa-star-half-alt filled" />}
          {Array.from(
            { length: Math.floor(5 - (filledStars + (hasHalfStar ? 1 : 0))) },
            (_, index) => (
              <i key={index} className="fa-regular fa-star" />
            )
          )}
          ({courseUserRatings || 0})
        </div>

        <h5 className="course-card-price">₹{coursePrice}</h5>

        {props.children}
      </div>
    </>
  );
}

export default CourseCards;
