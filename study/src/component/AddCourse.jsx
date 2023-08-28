import React, { useState, useContext, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import AddChapter from "./AddChapter";
import DisplayChapters from "./DisplayChapters";
import "./style/addcourse.css";
import Modal from "react-modal";
import QuizCard from "./QuizCard";

const AddCourse = () => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    fetchChaptersForCourse,
    deleteChapter,
  } = useContext(CourseContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [courseData, setCourseData] = useState({
    CourseName: "",
    CourseDisc: "",
    CourseDiscHead: "",
    CoursePrice: "",
    courseImage: null,
  });

  const [selectedCourseChapters, setSelectedCourseChapters] = useState([]);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [courseImage, setCourseImage] = useState("");
  const [addedCourse, setAddedCourse] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const [editCourseId, setEditCourseId] = useState(null);

  const handleEditCourse = (courseId) => {
    const courseToEdit = courses.find((course) => course._id === courseId);
    if (courseToEdit) {
      setCourseData({
        CourseName: courseToEdit.CourseName,
        CourseDisc: courseToEdit.CourseDisc,
        CourseDiscHead: courseToEdit.CourseDiscHead,
        CoursePrice: courseToEdit.CoursePrice,
        CourseImg: courseToEdit.CourseImg,
      });
      setEditCourseId(courseId);
      setSelectedChapterId(null);
      openForm();
    }
  };

  // Function to handle deleting a chapter
  const handleDeleteChapter = async (chapterId) => {
    try {
      await deleteChapter(chapterId, selectedCourseId);

      setChapters((prevChapters) =>
        prevChapters.filter((chapter) => chapter._id !== chapterId)
      );
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  const openModal = async (courseId) => {
    console.log("Selected courseId:", courseId); // Add this console log
    setLoadingChapters(true);
    setSelectedCourseId(courseId);
    const chaptersData = await fetchChaptersForCourse(courseId);
    setSelectedCourseChapters(chaptersData);
    setLoadingChapters(false);
    setSelectedCourseId(courseId);
    setModalIsOpen(true);
    handleContextMenuClose();
  };

  const closeModal = () => {
    setSelectedCourseChapters([]); // Clear the chapters data when closing the modal
    setSelectedCourseId(null);
    setModalIsOpen(false);
  };

  const handleContextMenu = (e, course) => {
    e.preventDefault();
    setSelectedCourse(course);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuClose = () => {
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !courseData.CourseName ||
      !courseData.CourseDisc ||
      !courseData.CourseDiscHead ||
      !courseData.CoursePrice
    ) {
      return console.log("Error");
    }

    if (editCourseId) {
      // If editCourseId has a value, update the existing course
      const updatedCourseData = { ...courseData, CourseImg: courseImage };
      handleUpdateCourse(editCourseId, updatedCourseData);
    } else {
      // If editCourseId is null, add a new course
      const courseDataWithImage = { ...courseData, CourseImg: courseImage };
      const newCourse = addCourse(courseDataWithImage);
      setAddedCourse(newCourse);
    }

    // Reset the editCourseId and courseData state to add a new course
    setEditCourseId(null);
    setCourseData({
      CourseName: "",
      CourseDisc: "",
      CourseDiscHead: "",
      CoursePrice: "",
      CourseImg: null,
    });

    setIsFormVisible(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCourseImage(event.target.result);
        setImagePreviewUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateCourse = (courseId, updatedCourseData) => {
    // Call the updateCourse function (Replace with the actual function from your CourseContext)
    updateCourse(courseId, updatedCourseData);
    openForm();
    setEditCourseId(null);
  };

  const handleDeleteCourse = (courseId) => {
    deleteCourse(courseId);
    handleContextMenuClose();
  };

  const handleWindowMouseDown = (e) => {
    if (e.button === 0 && selectedCourse) {
      // Close the context menu when the left button is clicked outside the context menu
      const contextMenu = document.querySelector(".context-menu");
      if (contextMenu && !contextMenu.contains(e.target)) {
        handleContextMenuClose();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", handleWindowMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleWindowMouseDown);
    };
  }, [selectedCourse]);

  const openForm = () => {
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setIsFormVisible(false);
    setCourseData("");
    setImagePreviewUrl("");
  };

  return (
    <>
      {!isFormVisible ? (
        <button className="add-course-btn" onClick={openForm}>
          <i className="fa-solid fa-plus"></i>
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="modal-overlay">
            <div className="add-course-modal">
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Course Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              )}
              <label htmlFor="input-img">Select Food Image</label>
              <input
                style={{ visibility: "hidden" }}
                id="input-img"
                type="file"
                accept="image/*"
                name="CourseImg"
                onChange={handleFileChange}
                multiple={false}
              />
              <input
                placeholder="name"
                type="text"
                name="CourseName"
                value={courseData.CourseName}
                onChange={handleInputChange}
              />
              <input
                placeholder="disc Head"
                type="text"
                name="CourseDiscHead"
                value={courseData.CourseDiscHead}
                onChange={handleInputChange}
              />
              <input
                placeholder="disc"
                type="text"
                name="CourseDisc"
                value={courseData.CourseDisc}
                onChange={handleInputChange}
              />
              <input
                placeholder="price"
                type="text"
                name="CoursePrice"
                value={courseData.CoursePrice}
                onChange={handleInputChange}
              />
              <button type="submit">
                {editCourseId ? "Update" : "Add"}{" "}
                {/* Change button text based on whether editing or adding */}
              </button>
              <button type="button" onClick={closeForm}>
                Close
              </button>{" "}
              {/* Close button inside the form */}
            </div>
          </div>
        </form>
      )}
      <div className="course-cards-container">
        {/* Display the existing courses */}
        {courses.map((course) => (
          <div
            key={course._id}
            className="course-card"
            onContextMenu={(e) => handleContextMenu(e, course)}
          >
            <h3 className="course-card-name">{course.CourseName}</h3>
            <p className="course-card-disc">{course.CourseDisc}</p>
            <img
              src={course.CourseImg}
              className="course-card-img"
              alt="Course"
            />
            <p className="total-enroll">
              <i
                className="fa-solid fa-user"
                style={{ display: "inline", marginRight: "5px" }}
              />
              1,000
            </p>
            <p className="course-card-price">{course.CoursePrice}</p>

            {/* Additional options */}
            {selectedCourse && selectedCourse._id === course._id && (
              <div
                className="context-menu"
                style={{
                  top: contextMenuPosition.y,
                  left: contextMenuPosition.x,
                }}
              >
                <button
                  className="context-menu-option"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditCourse(course._id);
                  }}
                >
                  Edit
                </button>

                <button
                  className="context-menu-option"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(course._id);
                  }}
                >
                  Manage Chapters
                </button>
                <button
                  id="delete-course-btn"
                  className="context-menu-option"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCourse(course._id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Modal for managing chapters */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Manage Chapters"
          ariaHideApp={false}
        >
          {modalIsOpen && (
            <>
              {loadingChapters ? (
                <p>Loading chapters...</p>
              ) : (
                <>
                  <DisplayChapters
                    chapters={selectedCourseChapters}
                    handleDeleteChapter={handleDeleteChapter}
                    handleEditChapter={(chapterId) =>
                      setSelectedChapterId(chapterId)
                    }
                    visibility={{
                      edit: true,
                      delete: true,
                    }}
                    courseId={selectedCourseId}
                  />
                  <QuizCard courseId={selectedCourseId} />
                </>
              )}

              <AddChapter courseId={selectedCourseId} closeModal={closeModal} />
            </>
          )}
          <button className="close-course-btn" onClick={closeModal}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </Modal>
      </div>
    </>
  );
};

export default AddCourse;
