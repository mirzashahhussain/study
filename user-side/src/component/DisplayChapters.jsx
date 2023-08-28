import ChapterCard from "./ChapterCard";

function DisplayChapters({ chapters, handleDeleteChapter, visibility }) {
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
            visibility={visibility}
          />
        ))
      ) : (
        <p>No chapters available for the selected course.</p>
      )}
    </>
  );
}

export default DisplayChapters;
