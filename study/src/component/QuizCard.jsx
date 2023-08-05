import React, { useState, useContext } from "react";
import "./style/quizcard.css";
import { CourseContext } from "../context/CourseContext";

function QuizCard() {
  const { quiz, addQuiz, updateQuiz, deleteQuiz } = useContext(CourseContext);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [currentOption, setCurrentOption] = useState("");
  const [correctOption, setCorrectOption] = useState(null);
  const [marks, setMarks] = useState(0);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [editingOptionIndex, setEditingOptionIndex] = useState(null);

  const handleAddQuiz = async () => {
    if (
      currentQuestion.trim() === "" ||
      options.length === 0 ||
      correctOption === null ||
      marks <= 0
    ) {
      return;
    }

    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      const updatedQuestion = {
        question: currentQuestion,
        options: options,
        correctOption: correctOption,
        marks: marks,
      };
      updatedQuestions[editingQuestionIndex] = updatedQuestion;
      setQuestions(updatedQuestions);

      setEditingQuestionIndex(null);
    } else {
      const newQuestion = {
        question: currentQuestion,
        options: options,
        correctOption: correctOption,
        marks: marks,
      };
      setQuestions([...questions, newQuestion]);
    }

    setCurrentQuestion("");
    setOptions([]);
    setCurrentOption("");
    setCorrectOption(null);
    setShowAddQuiz(false);
    setMarks(0);
    setEditingOptionIndex(null);
  };

  const handleAddOption = () => {
    if (currentOption.trim() === "") {
      return;
    }

    if (editingOptionIndex !== null) {
      const updatedOptions = [...options];
      updatedOptions[editingOptionIndex] = currentOption;
      setOptions(updatedOptions);
      setEditingOptionIndex(null);
    } else {
      setOptions([...options, currentOption]);
    }

    setCurrentOption("");
  };

  const handleDeleteQuestion = async (index) => {
    const questionId = questions[index]._id;

    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    setEditingQuestionIndex(null);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    const updatedOptions = [...updatedQuestions[questionIndex].options];
    updatedOptions.splice(optionIndex, 1);
    updatedQuestions[questionIndex].options = updatedOptions;
    setQuestions(updatedQuestions);
    setEditingOptionIndex(null);
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setCurrentQuestion(question.question);
    setOptions([...question.options]);
    setCorrectOption(question.correctOption);
    setMarks(question.marks);
    setEditingQuestionIndex(index);
    setShowAddQuiz(true);
  };

  const handleEditOption = (optionIndex) => {
    setCurrentOption(options[optionIndex]);
    setEditingOptionIndex(optionIndex);
  };

  const calculateTotalMarks = () => {
    let totalMarks = 0;
    questions.forEach((question) => {
      totalMarks += question.marks;
    });
    return totalMarks;
  };

  return (
    <>
      <div>
        {showAddQuiz ? (
          <>
            <div className="add-course-modal">
              <div className="add-quiz-form">
                <div className="add-question">
                  <label>Question:</label>
                  <input
                    type="text"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <label>Options:</label>
                  <ol type="a">
                    {options.map((option, index) => (
                      <li key={index}>
                        {option}{" "}
                        {index === editingOptionIndex ? (
                          <>
                            <button onClick={handleAddOption}>
                              <i className="fa-solid fa-check"></i>
                            </button>
                            <button onClick={() => setEditingOptionIndex(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button onClick={() => handleEditOption(index)}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>
                        )}
                        {correctOption === index && (
                          <span>(Correct Option)</span>
                        )}
                      </li>
                    ))}
                  </ol>
                  <input
                    type="text"
                    value={currentOption}
                    onChange={(e) => setCurrentOption(e.target.value)}
                  />
                  <button onClick={handleAddOption}>
                    {editingOptionIndex !== null ? "Update" : "Add"}
                  </button>
                  <div>
                    <label>Correct Option:</label>
                    <select
                      value={correctOption}
                      onChange={(e) =>
                        setCorrectOption(parseInt(e.target.value))
                      }
                    >
                      <option value={null}>Select Correct Option</option>
                      {options.map((_, index) => (
                        <option key={index} value={index}>
                          Option {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label>Marks:</label>
                  <input
                    type="number"
                    min={1}
                    value={marks}
                    onChange={(e) => setMarks(parseInt(e.target.value))}
                  />
                </div>
                <button onClick={handleAddQuiz}>
                  {editingQuestionIndex !== null ? "Update " : "Add "}
                </button>
                <button onClick={() => setShowAddQuiz(false)}>close</button>
              </div>
            </div>
          </>
        ) : (
          <button className="add-quiz-btn" onClick={() => setShowAddQuiz(true)}>
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
        <div className="add-quiz-body">
          <h2>Added Quizzes</h2>
          {questions.map((question, questionIndex) => (
            <div key={questionIndex}>
              <p>
                Question {questionIndex + 1}: {question.question}
                <p>Marks: {question.marks}</p>
              </p>

              <ol type="a">
                {question.options.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    {option}{" "}
                    <button
                      onClick={() =>
                        handleDeleteOption(questionIndex, optionIndex)
                      }
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    {question.correctOption === optionIndex && (
                      <span>(Correct Option)</span>
                    )}
                  </li>
                ))}
              </ol>

              <button
                className="quiz-btn-style"
                onClick={() => handleEditQuestion(questionIndex)}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button
                className="quiz-btn-style"
                onClick={() => handleDeleteQuestion(questionIndex)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
          <p>Total Marks: {calculateTotalMarks()}</p>
        </div>
      </div>
    </>
  );
}

export default QuizCard;
