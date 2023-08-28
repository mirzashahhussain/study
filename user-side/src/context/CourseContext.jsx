// CourseContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CourseContext = createContext();

const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);
  let navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        // Save the auth token and redirect
        localStorage.setItem("token", data.authtoken);
        navigate("/home");
      }
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, error: "An error occurred" };
    }
  };

  // Function to create a new user
  const createUser = async (fullName, email, password) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/createuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, password }),
        }
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        localStorage.setItem(`token ${email}`, data.authtoken);
        navigate("/login");
      }
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "An error occurred" };
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();
      setLoading(false);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  const updateUser = async (fullName, email, password, userImg) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/updateuser",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ fullName, email, password, userImg }),
        }
      );

      console.log("context", fullName, email, password, userImg);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      return { status: "FAILED", message: "An error occurred" };
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/deleteuser",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting user:", error);
      return { status: "FAILED", message: "An error occurred" };
    }
  };

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

      return quizzesData;
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return [];
    }
  };

  // Function to check if a user has passed or failed a quiz
  const checkQuizResult = async (quizResponses) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/checkQuiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
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
            "auth-token": localStorage.getItem("token"),
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

  // Function to enroll in a course
  const enrollInCourse = async (courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/enrollCourse/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );

      const data = await response.json();

      // You might want to fetch updated courses or update the courses state after enrolling
      fetchCourses();
    } catch (error) {
      console.error("Error enrolling in course:", error);
    }
  };

  // Function to rate a course
  const rateCourse = async (courseId, rating) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/rateCourse/${courseId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ rating }),
        }
      );

      const data = await response.json();

      // You might want to fetch updated courses or update the courses state after rating
      fetchCourses();
      navigate("/home");
    } catch (error) {
      console.error("Error rating course:", error);
    }
  };

  // Function to verify a coupon code
  const verifyCoupon = async (couponCode, courseId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/coupon/verify-coupon/${couponCode}/${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const couponData = await response.json();
      return couponData;
    } catch (error) {
      console.error("Error verifying coupon:", error);
    }
  };

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchData() {
      const user = await fetchUser();
      if (user) {
        setUserId(user._id);
        setUserName(user.fullName);
        setUserImage(user.userImg);
      }
    }
    fetchData();
  }, []);

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
        userId,
        userName,
        userImage,
        loginUser,
        createUser,
        fetchUser,
        updateUser,
        deleteUser,
        fetchChaptersForCourse,
        fetchQuizzesForCourse,
        checkQuizResult,
        generateCertificate,
        fetchCertificates,
        enrollInCourse,
        rateCourse,
        verifyCoupon,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export { CourseContext, CourseProvider };
