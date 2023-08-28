import React, { useContext, useState, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import "./style/displayquiz.css";
import "./style/quizcard.css";
import CourseRating from "./CourseRating";

function DisplayQuiz({ courseId }) {
  const { quiz, fetchQuizzesForCourse, checkQuizResult } =
    useContext(CourseContext);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizResponses, setQuizResponses] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quizResult, setQuizResult] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [studentMarks, setStudentMarks] = useState(0);
  const [userPercentage, setUserPercentage] = useState(0);
  const [passOrFail, setPassOrFail] = useState("Fail");
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  useEffect(() => {
    fetchQuizzesForCourse(courseId);
  }, []);

  useEffect(() => {
    // Calculate total marks based on results data
    const calculatedTotalMarks = quiz.reduce((total, q) => total + q.marks, 0);
    setTotalMarks(calculatedTotalMarks);
  }, [quiz]);

  useEffect(() => {
    // Calculate student marks and user percentage
    const calculatedStudentMarks = quizResult.reduce((totalMarks, result) => {
      if (result.isCorrect) {
        return totalMarks + result.marks;
      }
      return totalMarks;
    }, 0);

    const calculatedUserPercentage =
      (calculatedStudentMarks / totalMarks) * 100;
    setUserPercentage(
      isNaN(calculatedUserPercentage) ? 0 : calculatedUserPercentage
    );

    setStudentMarks(calculatedStudentMarks);
    setPassOrFail(
      calculatedUserPercentage >= 70
        ? "🎉 Congratulations! You have successfully passed the challenge."
        : "🙁 We regret to inform you that your quiz results did not meet the passing criteria this time."
    );
  }, [quizResult, totalMarks]);

  const currentQuiz = quiz[currentQuizIndex];

  const handleOptionChange = (selectedOption) => {
    const updatedResponses = [...quizResponses];
    updatedResponses[currentQuizIndex] = {
      quizId: currentQuiz._id,
      selectedOption: selectedOption,
    };
    setQuizResponses(updatedResponses);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    }
  };

  const handleSubmitAllQuizzes = async () => {
    const results = await checkQuizResult(quizResponses);
    setQuizResult(results);
    setQuizCompleted(true);
  };

  const openModal = () => {
    setCurrentQuizIndex(0);
    setQuizResponses([]);
    setQuizResult([]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openResultsModal = () => {
    setResultsModalOpen(true);
  };

  const closeResultsModal = () => {
    setResultsModalOpen(false);
  };

  return (
    <div>
      <h2 className="open-quiz" onClick={openModal}>
        Quiz
      </h2>
      {modalOpen && (
        <div className="add-quiz-modal">
          {quizCompleted ? (
            <div className="quiz-result">
              <h2>Quiz Completed!</h2>
              <div className="quiz-result-percentage">
                <div className="circle-background ">
                  <h3>{userPercentage.toFixed(0)}% </h3>
                </div>
              </div>

              <h3>{passOrFail}</h3>
              <CourseRating courseId={courseId} />
              <button onClick={openResultsModal}>View Quiz Results</button>

              {resultsModalOpen && (
                <div className="add-course-modal">
                  <div className="results-modal-content">
                    <button
                      className="add-course-btn"
                      onClick={closeResultsModal}
                    >
                      close
                    </button>
                    {quizResult.map((result, index) => (
                      <div key={index} className="quiz-result-details">
                        <h3>
                          Question {index + 1}: {result.question}
                        </h3>
                        <p>
                          {result.selectedOption} -{" "}
                          {result.isCorrect ? "Correct" : "Incorrect"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              {currentQuiz && (
                <div className="display-quiz">
                  <h3>
                    Question {currentQuizIndex + 1}: {currentQuiz.question}
                  </h3>
                  <form className="options-box">
                    {currentQuiz.options.map((option, index) => (
                      <div key={index}>
                        <label>
                          <input
                            id="options"
                            type="radio"
                            value={option}
                            checked={
                              quizResponses[currentQuizIndex]
                                ?.selectedOption === option
                            }
                            onChange={() => handleOptionChange(option)}
                          />
                          {option}
                        </label>
                      </div>
                    ))}
                  </form>
                  <div className="btn-box">
                    {currentQuizIndex > 0 && (
                      <button
                        onClick={() =>
                          setCurrentQuizIndex(currentQuizIndex - 1)
                        }
                      >
                        Back
                      </button>
                    )}
                    {currentQuizIndex === quiz.length - 1 ? (
                      <button
                        onClick={handleSubmitAllQuizzes}
                        disabled={
                          !quizResponses[currentQuizIndex]?.selectedOption
                        }
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        disabled={
                          !quizResponses[currentQuizIndex]?.selectedOption
                        }
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="add-course-btn" onClick={closeModal}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default DisplayQuiz;

const results = [];
