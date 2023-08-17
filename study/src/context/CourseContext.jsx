// CourseContext.jsx
import React, { createContext, useState, useEffect } from "react";

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch courses from the API
  const fetchCourses = async () => {
    try {
      const coursesResponse = await fetch(
        "http://localhost:5000/api/course/fetchallcourse",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const coursesData = await coursesResponse.json();
      setCourses(coursesData);
      console.log(coursesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  // Function to fetch chapters for a given course
  const fetchChaptersForCourse = async (courseId) => {
    try {
      const chaptersResponse = await fetch(
        `http://localhost:5000/api/course/fetchChapters/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const chaptersData = await chaptersResponse.json();
      // console.log(chaptersData);
      setChapters(chaptersData);
      return chaptersData;
    } catch (error) {
      console.error("Error fetching chapters:", error);
      return [];
    }
  };

  // Function to add a new course
  const addCourse = async (newCourseData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/course/addCourse",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
          body: JSON.stringify(newCourseData),
        }
      );

      const newCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, newCourse]);
    } catch (error) {
      console.error("Error adding new course:", error);
    }
  };

  // Function to update a course
  const updateCourse = async (courseId, updatedCourseData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/updateCourse/${courseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
          body: JSON.stringify(updatedCourseData),
        }
      );

      const updatedCourse = await response.json();
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course._id === courseId ? updatedCourse.course : course
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  // Function to delete a course
  const deleteCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/deleteCourse/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
        }
      );

      if (response.status === 200) {
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== courseId)
        );
      } else {
        console.error("Error deleting course:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Function to add a new chapter
  const addChapter = async (newChapterData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/addChapter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
          body: JSON.stringify(newChapterData),
        }
      );

      const newChapter = await response.json();
      setChapters((prevChapters) => [...prevChapters, newChapter]);
    } catch (error) {
      console.log(newChapterData);
      console.error("Error adding new chapter:", error);
    }
  };

  // Function to update a chapter
  const updateChapter = async (chapterId, updatedChapterData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/updateChapter/${chapterId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
          body: JSON.stringify(updatedChapterData),
        }
      );

      const updatedChapter = await response.json();
      setChapters((prevChapters) =>
        prevChapters.map((chapter) =>
          chapter._id === chapterId ? updatedChapter.chapter : chapter
        )
      );
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  // Function to delete a chapter
  const deleteChapter = async (chapterId, courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/deleteChapter/${chapterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ", // Replace with the actual token
          },
          body: JSON.stringify({ courseId }), // Sending the courseId in the request body
        }
      );

      if (response.status === 200) {
        setChapters((prevChapters) =>
          prevChapters.filter((chapter) => chapter._id !== chapterId)
        );
      } else {
        console.error("Error deleting chapter:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  // Function to fetch quizzes for a given course
  const fetchQuizzesForCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/fetchQuizzes/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const quizzesData = await response.json();
      setQuiz(quizzesData);
      console.log(quizzesData);
      return quizzesData;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  // Function to add a new quiz
  const addQuiz = async (newQuizData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/addQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ",
        },
        body: JSON.stringify(newQuizData),
      });
      // console.log("Adding new quiz:", newQuizData);
      const newQuiz = await response.json();
      setQuiz((prevQuiz) => [...prevQuiz, newQuiz]);
    } catch (error) {
      console.error("Failed to add new quiz:", error);
    }
  };

  // Function to update a quiz
  const updateQuiz = async (quizId, updatedQuizData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/updateQuiz/${quizId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ",
          },
          body: JSON.stringify(updatedQuizData),
        }
      );
      const updatedQuiz = await response.json();
      setQuiz((prevQuiz) =>
        prevQuiz.map((quiz) => (quiz._id === quizId ? updatedQuiz : quiz))
      );
    } catch (error) {
      console.error("Failed to update quiz:", error);
    }
  };

  // Function to delete a quiz
  const deleteQuiz = async (quizId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/deleteQuiz/${quizId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ",
          },
        }
      );
      if (response.status === 200) {
        setQuiz((prevQuiz) => prevQuiz.filter((quiz) => quiz._id !== quizId));
      } else {
        console.error("Error deleting quiz:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
    }
  };

  // Function to check if a user has passed or failed a quiz
  const checkQuizResult = async (quizResponses) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/checkQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ",
        },
        body: JSON.stringify({ quizResponses }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const resultData = await response.json();
      // console.log(resultData);
      return resultData.results;
    } catch (error) {
      console.error("Error checking quiz result:", error);
      return [];
    }
  };

  // Function to generate a certificate
  const generateCertificate = async (userId, courseId, certificateData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/generateCertificate/${userId}/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRiZjlmZTc4NzZlNmZmOTc0YzY4NWZlIn0sImlhdCI6MTY5MDI4NjgyOX0.2bU69aFYcTAT1YM1uADZCmwdxKwdpVMT2uMc4Fvk8MQ",
          },
          body: JSON.stringify(certificateData),
        }
      );

      const certificateBlob = await response.blob();
      const url = window.URL.createObjectURL(certificateBlob);
      window.open(url);
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  // Function to fetch certificate URLs for a specific user
  const fetchCertificates = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/quiz/certificates/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
      return data.certificateUrls;
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return [];
    }
  };
  useEffect(() => {
    fetchCourses();
    fetchChaptersForCourse();
    fetchQuizzesForCourse();
    fetchCertificates();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        chapters,
        quiz,
        fetchChaptersForCourse,
        fetchQuizzesForCourse,
        addCourse,
        updateCourse,
        deleteCourse,
        addChapter,
        updateChapter,
        deleteChapter,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        checkQuizResult,
        generateCertificate,
        fetchCertificates,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export { CourseContext, CourseProvider };
