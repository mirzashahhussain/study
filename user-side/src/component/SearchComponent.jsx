import React, { useState, useContext } from "react";
import { CourseContext } from "../context/CourseContext";
import CourseCards from "./CourseCards";
import "./style/search.css";
import SearchCourseCard from "./SearchCourseCard";

const SearchComponent = ({ handleCourseClick }) => {
  const { courses, loading } = useContext(CourseContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const updateSearchResults = (query) => {
    const filteredResults = query
      ? courses.filter((course) =>
          course.CourseName.toLowerCase().includes(query.toLowerCase())
        )
      : [];
    setSearchResults(filteredResults);
  };

  const handleSearchQueryChange = (e) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    updateSearchResults(newQuery);
  };

  const handleCourseClickWithReset = (courseId) => {
    handleCourseClick(courseId);
    setSearchResults([]); 
    setSearchQuery("")
  };

  return (
    <div className="search-main">
      <div className="search-component">
        <input
          type="text"
          placeholder="Search for courses..."
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <div className="search-results">
          {loading ? (
            <p>Loading search results...</p>
          ) : (
            searchResults.map((course) => (
              <div key={course._id} className="results">
                <SearchCourseCard
                  courseImg={course.CourseImg}
                  courseName={course.CourseName}
                  coursePrice={course.CoursePrice}
                  courseRatings={course.AverageRating}
                  courseUserRatings={course.CourseRatings.length}
                  onClick={() => handleCourseClickWithReset(course._id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
