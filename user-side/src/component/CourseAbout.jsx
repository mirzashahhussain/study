import React, { useContext, useEffect, useState } from "react";
import "./style/courseabout.css";
import certificate from "../assets/certificate.png";
import { CourseContext } from "../context/CourseContext";

function CourseAbout(props) {
  const {
    courseImg,
    courseName,
    coursePrice,
    courseDisc,
    courseDiscHead,
    courseEnroll,
    courseRatings,
    courseUserRatings,
  } = props;

  const maxWords = 5;
  const [truncatedText, setTruncatedText] = useState(courseName);

  useEffect(() => {
    const words = courseName.split(" ");

    if (words.length > maxWords) {
      setTruncatedText(words.slice(0, maxWords).join(" ") + " ...more");
    }
  }, [courseName]);

  const { enrollInCourse, courses, userId } = useContext(CourseContext);
  const [averageRating, setAverageRating] = useState(0);

  const courseId = props.courseId;

  const userEnrolled = courses
    .find((course) => course._id === courseId)
    ?.CourseUsers.includes(userId);

  const handleEnrollClick = async () => {
    if (!userEnrolled) {
      try {
        await enrollInCourse(courseId);
      } catch (error) {
        console.error("Error enrolling in course:", error);
      }
    }
  };

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
      <div className="about-container">
        <div className="about-course">
          <div className="about-course-info">
            <img src={courseImg || "Hello"} />
            <h2>{truncatedText || "Hello"} </h2>

            {!userEnrolled && (
              <button onClick={handleEnrollClick}>
                {coursePrice || "FREE"}
              </button>
            )}
            {userEnrolled && (
              <button >
                {"Viwe Course"}
              </button>
            )}
            <button id="add-cart">ADD TO CART</button>
          </div>
        </div>
        <div className="about-context">
          <div className="disc-head">
            <h1>{courseDiscHead || "Course Head"} </h1>
            <p>{courseDisc}</p>
          </div>

          <div className="about-rating">
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
            )}{" "}
            ( {courseUserRatings || 0} ratings)
            <p id="users">{courseEnroll || 0} students</p>
          </div>
          <div className="other-detils">
            <p>
              <i className="fa-solid fa-circle-exclamation" /> Last updated
              7/2023
            </p>
            <p>
              <i className="fa-solid fa-globe" /> English
            </p>
            <p id="certi-p">
              <img src={certificate} id="certi" /> Certificate
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseAbout;
