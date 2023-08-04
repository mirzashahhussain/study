import React, { useContext, useState } from "react";
import { CourseContext } from "../context/CourseContext";
import CourseCards from "./CourseCards";
import DisplayChapters from "./DisplayChapters";
import Modal from "react-modal";
import "./style/display.css";

const Display = () => {
  const { courses, fetchChaptersForCourse } = useContext(CourseContext);
  const [selectedCourseChapters, setSelectedCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleCourseClick = async (courseId) => {
    console.log("Selected courseId:", courseId); // Add this console log
    setLoadingChapters(true);
    setSelectedCourseId(courseId);
    const chaptersData = await fetchChaptersForCourse(courseId);
    setSelectedCourseChapters(chaptersData);
    setLoadingChapters(false);
    setModalIsOpen(true); // Open the modal after fetching the chapters
  };

  const closeModal = () => {
    setSelectedCourseChapters([]); // Clear the chapters data when closing the modal
    setSelectedCourseId(null);
    setModalIsOpen(false);
  };

  return (
    <div className="course-main">
      <div className="course-cards-container">
        {courses.map((course) => (
          <div key={course._id}>
            <CourseCards
              courseImg={course.CourseImg}
              courseDisc={course.CourseDisc}
              courseName={course.CourseName}
              coursePrice={course.CoursePrice}
              onClick={() => handleCourseClick(course._id)}
            />
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Course Chapters"
        ariaHideApp={false}
      >
        {loadingChapters ? (
          <p>Loading chapters...</p>
        ) : (
          <DisplayChapters chapters={selectedCourseChapters} />
        )}
        <button className="display-modal-btn" onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default Display;
