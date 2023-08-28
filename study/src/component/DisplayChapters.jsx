import { useState, useContext } from "react";
import Modal from "react-modal";
import ChapterCard from "./ChapterCard";
import { CourseContext } from "../context/CourseContext";

function DisplayChapters({
  chapters,
  handleDeleteChapter,
  visibility,
  courseId,
}) {
  const { updateChapter } = useContext(CourseContext);
  const [editChapterId, setEditChapterId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chapterData, setChapterData] = useState({
    ChapterName: "",
    ChapterLength: "",
    ChapterVideo: null,
    courseId: courseId,
  });

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const handleEditChapter = (chapterId) => {
    const chapterToEdit = chapters.find((chapter) => chapter._id === chapterId);
    if (chapterToEdit) {
      setChapterData({
        ChapterName: chapterToEdit.ChapterName,
        ChapterLength: chapterToEdit.ChapterLength,
        ChapterVideo: chapterToEdit.ChapterVideo,
        courseId: chapterToEdit.courseId,
      });
      setEditChapterId(chapterId);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setEditChapterId(null);
    setModalIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateChapter(editChapterId, {
      ...chapterData,
      courseId: selectedCourseId,
    });
    setChapterData({
      ChapterName: "",
      ChapterLength: "",
      ChapterVideo: "",
      courseId: "",
    });
  };

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

  return (
    <>
      {chapters ? (
        chapters.map((chapter) => (
          <ChapterCard
            key={chapter._id}
            chapterId={chapter._id}
            chapterVideo={chapter.ChapterVideo}
            chapterName={chapter.ChapterName}
            chapterLength={chapter.ChapterLength}
            handleDeleteChapter={handleDeleteChapter}
            handleEditChapter={handleEditChapter}
            visibility={visibility}
          />
        ))
      ) : (
        <p>No chapters available for the selected course.</p>
      )}
      {/* Modal for editing chapters */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Chapter"
        ariaHideApp={false}
      >
        {modalIsOpen && (
          <div>
            <h2>Edit Chapter</h2>
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

              <button type="submit">Update</button>
            </form>
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default DisplayChapters;
