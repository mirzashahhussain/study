import React, { useState, useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import "./style/addchapter.css";

const AddChapter = ({ courseId }) => {
  const { addChapter } = useContext(CourseContext);

  const [chapterData, setChapterData] = useState({
    courseId: courseId,
    ChapterName: "",
    ChapterLength: "",
    ChapterVideo: null,
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
    setChapterData({
      ...chapterData,
      ChapterVideo: file,
      ChapterLength: videoDuration,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addChapter(chapterData);
    console.log("Add Chapter", chapterData);
    // Clear form fields after submitting
    setChapterData({
      ChapterName: "",
      ChapterLength: "",
      ChapterVideo: null,
      courseId: courseId,
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
        URL.revokeObjectURL(video.src);
        const duration = video.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes} min ${seconds} sec`);
      };
      video.onerror = function () {
        reject(new Error("Error loading video."));
      };
      video.src = URL.createObjectURL(file);
    });
  };

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
