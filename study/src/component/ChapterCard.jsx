import React, { useState } from "react";
import "./style/chaptercard.css";
import demo from "./video/test.webm";

function ChapterCard(props) {
  const {
    chapterId,
    chapterVideo,
    chapterName,
    chapterLength,
    handleDeleteChapter,
    handleEditChapter,
    visibility,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleEditClick = () => {
    handleEditChapter(chapterId);
  };

  return (
    <div className={`chapter-card ${isOpen ? "open" : ""}`}>
      <h2 className="chapter-name" onClick={toggleDropdown}>
        {chapterName}
      </h2>
      <h3 className="chapter-length">{chapterLength}</h3>
      {isOpen && (
        <video width="100%" height="auto" controls>
          <source
            className="chapter-video"
            src={chapterVideo}
            // src={demo}
            type="video/mp4"
          />
        </video>
      )}
      {visibility && (
        <div className="chapter-card-options">
          {visibility.edit && (
            <button onClick={handleEditClick}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          )}
          {visibility.delete && (
            <button onClick={() => handleDeleteChapter(chapterId)}>
              <i className="fa-solid fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChapterCard;
