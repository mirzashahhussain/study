import React, { useState, useContext } from "react";
import { CourseContext } from "../context/CourseContext";

import "./style/addchapter.css";

const AddChapter = ({ courseId }) => {
  const { addChapter, chapters } = useContext(CourseContext);

  const [chapterData, setChapterData] = useState({
    ChapterName: "",
    ChapterLength: "",
    ChapterVideo: null,
    courseId: courseId,
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChapterData({ ...chapterData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log("Selected File:", file);
    // Call the function to get video duration
    const videoDuration = await getVideoDuration(file);

    // setChapterData({ ...chapterData, ChapterVideo: file });
    setChapterData({
      ...chapterData,
      ChapterVideo: file,
      ChapterLength: videoDuration,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addChapter(chapterData);
    // Clear form fields after submitting
    setChapterData({
      ChapterName: "",
      ChapterLength: "",
      ChapterVideo: "",
      courseId: "",
    });
    setShowAddForm(false); // Hide the form after submitting
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  // Function to get video duration using ffmpeg
  const getVideoDuration = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = function () {
        const duration = video.duration; // duration in seconds
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes} min ${seconds} sec`);
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const filteredChapters = chapters.filter(
    (chapter) => chapter.courseId === courseId
  );

  return (
    <div>
      {showAddForm ? (
        <div className="modal-overlay">
          <div className="add-course-modal">
            <form
              className="form-body"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div>
                <label>Chapter Name:</label>
                <input
                  type="text"
                  name="ChapterName"
                  value={chapterData.ChapterName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label>Chapter Video:</label>
                <input
                  type="file"
                  name="ChapterVideo"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit">Add</button>
              <button onClick={handleCloseForm}>Close</button>
            </form>
          </div>
        </div>
      ) : (
        <button className="add-course-btn" onClick={() => setShowAddForm(true)}>
          <i className="fa-solid fa-plus"></i>
        </button>
      )}
    </div>
  );
};

export default AddChapter;
