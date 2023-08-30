import React, { useContext, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CourseContext } from "../context/CourseContext";
import CourseCards from "./CourseCards";
import DisplayChapters from "./DisplayChapters";
import Modal from "react-modal";
import "./style/display.css";
import DisplayQuiz from "./DisplayQuiz";
import CourseAbout from "./CourseAbout";
import CourseRatings from "./CourseRating";
import SearchComponent from "./SearchComponent";

const Display = () => {
  const {
    courses,

    fetchChaptersForCourse,
    generateCertificate,
    userId,
    loading,
  } = useContext(CourseContext);
  const [selectedCourseChapters, setSelectedCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseAbout, setShowCourseAbout] = useState(false);

  const handleCourseClick = async (courseId) => {
    console.log("Selected courseId:", courseId);
    setSelectedCourse(courses.find((course) => course._id === courseId));
    setLoadingChapters(true);
    setSelectedCourseId(courseId);
    const chaptersData = await fetchChaptersForCourse(courseId);
    setSelectedCourseChapters(chaptersData);
    setLoadingChapters(false);
    setShowCourseAbout(true); //t
    setModalIsOpen(true); // f
  };

  const downloadCertificate = async () => {
    const certificateData = {
      userName: "Mirza Shah Hussain",
      courseName: "React",
      courseDuration: "1 Week",
      completionDate: "14-Aug-2023",
    };

    await generateCertificate(userId, selectedCourseId, certificateData);
  };

  const closeModal = () => {
    setSelectedCourseChapters([]);
    setSelectedCourseId(null);
    setModalIsOpen(false);
  };

  return (
    <>
      <SearchComponent handleCourseClick={handleCourseClick} />

      <div className="course-main">
        {loading ? (
          <>
            <div className="course-cards-container">
              {[...Array(10)].map((_, index) => (
                <>
                  <div key={index}>
                    <Skeleton width={"100%"} height={"150px"} />
                    <Skeleton width={"100%"} height={"10px"} />
                    <Skeleton width={"20%"} height={"10px"} />
                  </div>
                </>
              ))}
            </div>
          </>
        ) : (
          <div className="course-cards-container">
            {courses.map((course) => (
              <div key={course._id}>
                <CourseCards
                  courseImg={course.CourseImg}
                  courseDisc={course.CourseDisc}
                  courseName={course.CourseName}
                  coursePrice={course.CoursePrice}
                  courseRatings={course.CourseRatings}
                  courseUserRatings={course.CourseRatings.length}
                  onClick={() => handleCourseClick(course._id)}
                />
              </div>
            ))}
          </div>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Course Chapters"
          ariaHideApp={false}
        >
          {loadingChapters ? (
            <p>Loading chapters...</p>
          ) : (
            <>
              {showCourseAbout && selectedCourse && (
                <CourseAbout
                  courseId={selectedCourse._id}
                  courseImg={selectedCourse.CourseImg}
                  courseName={selectedCourse.CourseName}
                  coursePrice={selectedCourse.CoursePrice}
                  courseDisc={selectedCourse.CourseDisc}
                  courseDiscHead={selectedCourse.CourseDiscHead}
                  courseEnroll={selectedCourse.CourseUsers.length}
                  courseRatings={selectedCourse.CourseRatings}
                  date={selectedCourse.date}
                  courseUserRatings={selectedCourse.CourseRatings.length}
                />
              )}
              {/* <CourseRatings courseId={selectedCourseId} /> */}
              <DisplayChapters chapters={selectedCourseChapters} />
              <DisplayQuiz courseId={selectedCourseId} />

              <button
                className="crtificate"
                onClick={downloadCertificate}
                disabled
              >
                View Certificate
              </button>
            </>
          )}
          <button className="display-modal-btn" onClick={closeModal}>
            Close
          </button>
        </Modal>
      </div>
    </>
  );
};

export default Display;
