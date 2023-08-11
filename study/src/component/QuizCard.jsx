import React, { useContext, useState, useEffect } from "react";
import "./style/quizcard.css";
import { CourseContext } from "../context/CourseContext";
import Modal from "react-modal";

function QuizCard({ courseId }) {
  const { addQuiz, updateQuiz, deleteQuiz, fetchQuizzesForCourse } =
    useContext(CourseContext);

  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(0);
  const [marks, setMarks] = useState(1);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  // const courseId = "64cbc4304f507f69abd34a31";

  useEffect(() => {
    fetchQuizzes();

    async function fetchQuizzes() {
      const quizzesData = await fetchQuizzesForCourse(courseId);
      setQuizzes(quizzesData);
    }
  }, [courseId]);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleDeleteOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddOrUpdateQuiz = async () => {
    const newQuiz = {
      question: newQuestion,
      options: options,
      correctOption: correctOption,
      marks: marks,
      courseId: courseId,
    };

    try {
      if (selectedQuiz) {
        await updateQuiz(selectedQuiz._id, newQuiz);
      } else {
        await addQuiz(newQuiz);
        console.log(newQuiz);
      }
      resetModal();
    } catch (error) {
      console.log("Failed to add/update quiz:", error);
    }
  };

  const resetModal = () => {
    setNewQuestion("");
    setOptions([""]);
    setCorrectOption(0);
    setMarks(1);
    setSelectedQuiz(null);
    setIsModalOpen(false);
  };

  const getOptionLabel = (index) => {
    return String.fromCharCode(97 + index);
  };

  const handleDeleteQuiz = (quizId) => {
    deleteQuiz(quizId);
  };

  const openEditModal = (quiz) => {
    setSelectedQuiz(quiz);
    setNewQuestion(quiz.question);
    setOptions([...quiz.options]);
    setCorrectOption(quiz.correctOption);
    setMarks(quiz.marks);
    setIsModalOpen(true);
  };

  // Function to open the modal
  const openModal = () => {
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <h2 className="open-quiz" onClick={openModal}>
        Quiz
      </h2>
      {modalOpen && (
        <div className="add-quiz-modal">
          <div className="quiz-card">
            <div>
              <button className="add-course-btn" onClick={closeModal}>
                X
              </button>
            </div>
            <h2>Current Quizzes</h2>
            <button
              className="add-quiz-btn"
              onClick={() => setIsModalOpen(true)}
            >
              Add
            </button>
            <div className="quizzes-list">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="quiz-item">
                  {" "}
                  <div>
                    <strong>Question:</strong> {quiz.question}
                  </div>
                  <div>
                    <strong>Options:</strong>
                    <ol type="a">
                      {quiz.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <strong>Correct Option:</strong> {quiz.correctOption}
                  </div>
                  <div>
                    <strong>Marks:</strong> {quiz.marks}
                  </div>
                  <div>
                    <button
                      id="delete"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      <i className="fa-solid fa-trash" />
                    </button>{" "}
                    <button onClick={() => openEditModal(quiz)}>
                      <i className="fa-solid fa-pen-to-square" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Modal
              isOpen={isModalOpen}
              onRequestClose={resetModal}
              contentLabel="Add Quiz Modal"
            >
              <div className="add-quiz-main">
                <label>
                  Question:
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </label>
                <div className="options-input">
                  <ol type="A">
                    {options.map((option, index) => (
                      <li key={index}>
                        <input
                          required={true}
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(index, e.target.value)
                          }
                        />
                        <button
                          id="delete"
                          onClick={() => handleDeleteOption(index)}
                          disabled={options.length === 1}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                        <button
                          onClick={handleAddOption}
                          disabled={!option.trim()}
                        >
                          <i className="fa-solid fa-plus" />
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
                <label>
                  Correct Option:
                  <select
                    class="minimal"
                    value={correctOption}
                    onChange={(e) => setCorrectOption(e.target.value)}
                  >
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {getOptionLabel(index)} {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Marks:
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                  />
                </label>
                <button onClick={handleAddOrUpdateQuiz}>
                  {selectedQuiz ? "Update" : "Save"}
                </button>
                <button onClick={resetModal}>Cancel</button>
              </div>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizCard;
