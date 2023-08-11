import React, { useContext, useState, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import "./style/displayquiz.css";

function DisplayQuiz({ courseId }) {
  const { quiz, fetchQuizzesForCourse, checkQuizResult, submitQuizAnswer } =
    useContext(CourseContext);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quizResult, setQuizResult] = useState([]);
  // const courseId = "64cbc4304f507f69abd34a31";

  useEffect(() => {
    fetchQuizzesForCourse(courseId);
  }, []);

  const currentQuiz = quiz[currentQuizIndex];

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedOption("");
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedOption) {
      return; // Don't proceed without selecting an option
    }

    // Submit quiz answer and check result
    const { isCorrect, message } = await submitQuizAnswer(
      currentQuiz._id,
      selectedOption
    );

    // Display correctness message
    console.log(message);
    setQuizResult({ isCorrect });

    // Check quiz result
    const result = await checkQuizResult(currentQuiz._id);
    console.log(result);

    setQuizResult(result);
    handleNextQuestion();

    // If all questions are completed, setQuizCompleted(true)
    if (currentQuizIndex === quiz.length - 1) {
      setQuizCompleted(true);
    }
  };

  // Function to open the modal
  const openModal = () => {
    setCurrentQuizIndex(0);
    setSelectedOption("");
    setQuizResult([]);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
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
              <h3>
                Quiz Results: {quizResult.isPassed ? "Pass" : "Fail"}
              </h3>{" "}
              <ul>
                <h3>
                  Total Marks:{" "}
                  {quiz.reduce((totalMarks, q) => {
                    return q.correctOption === selectedOption
                      ? totalMarks + q.marks
                      : "";
                  }, 0)}
                </h3>
                {quiz.map((q, index) => (
                  <li key={index}>
                    Question {index + 1}: {q.question} -{" "}
                    {q.correctOption === selectedOption ? (
                      <span>Correct</span>
                    ) : (
                      <span>Incorrect</span>
                    )}
                  </li>
                ))}
              </ul>
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
                            checked={selectedOption === option}
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
                        onClick={handleSubmitQuiz}
                        disabled={!selectedOption}
                      >
                        Submit
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        disabled={!selectedOption}
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
