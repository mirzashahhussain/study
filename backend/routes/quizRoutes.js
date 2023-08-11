const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const QuizResponse = require("../models/QuizResponse");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Fetch all quizzes for a specific Course using: GET "/api/quiz/fetchQuizzes/:CourseId". login required
router.get("/fetchQuizzes/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // console.log("Course ID:", courseId);

    // Check if the Course exists and belongs to the user
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).send("Course Not Found or Not Allowed");
    }

    // Fetch all the quizzes for the specific Course
    const quizzes = await Quiz.find({ _id: { $in: course.CourseQuizzes } });
    // console.log(quizzes);
    res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new quiz to a Course using: POST "/api/quiz/addQuiz". login required
router.post(
  "/addQuiz",
  fetchuser,
  [
    body("question", "Question is required").notEmpty(),
    body("options", "Options must be an array of strings").isArray(),
    body("correctOption", "Correct option is required").notEmpty(),
    body("courseId", "Valid CourseId is required").isMongoId(),
  ],
  async (req, res) => {
    try {
      const { question, options, correctOption, marks, totalMarks, courseId } =
        req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if the Course exists and belongs to the user
      const course = await Course.findOne({
        _id: courseId,
      });
      if (!course) {
        return res.status(404).send("Course Not Found or Not Allowed");
      }

      const quiz = new Quiz({
        course: courseId,
        question,
        options,
        marks,
        totalMarks,
        correctOption,
      });

      const savedQuiz = await quiz.save();

      // Update the Course document with the new quiz ID
      course.CourseQuizzes.push(savedQuiz._id);
      await course.save();

      res.json(savedQuiz);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing quiz using: PUT "/api/quiz/updateQuiz/:id". login required
router.put("/updateQuiz/:id", async (req, res) => {
  const { question, options, correctOption, marks, totalMarks } = req.body;
  try {
    const updatedQuiz = {};

    if (question) {
      updatedQuiz.question = question;
    }
    if (options) {
      updatedQuiz.options = options;
    }
    if (correctOption) {
      updatedQuiz.correctOption = correctOption;
    }
    if (marks) {
      updatedQuiz.marks = marks;
    }
    if (totalMarks) {
      updatedQuiz.totalMarks = totalMarks;
    }

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send("Quiz Not Found");
    }

    // // Check if the quiz belongs to the user's Course
    // const courseId = req.body.courseId;
    // if (quiz.course !== courseId) {
    //   return res.status(401).send("Not Allowed");
    // }

    quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { $set: updatedQuiz },
      { new: true }
    );
    res.json({ quiz });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing quiz using: DELETE "/api/quiz/deleteQuiz/:id". login required
router.delete("/deleteQuiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found" });
    }

    // Check if the quiz belongs to the user's Course
    // const courseId = req.body.courseId;
    // if (quiz.course !== courseId) {
    //   return res.status(401).json({ error: "Not Allowed" });
    // }

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ Success: "Quiz has been deleted", Quiz: quiz });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 5: Submit user's MCQ answers for a quiz: POST "/api/quiz/submitAnswers/:quizId"
router.post("/submitAnswers/:quizId", fetchuser, async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { selectedOption } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found" });
    }

    // Check if the selectedOption is correct
    const isCorrect = selectedOption === quiz.correctOption;

    // Calculate total marks based on correctness
    const totalMarks = isCorrect ? parseInt(quiz.marks) : 0;

    // Create a new quiz response record
    const quizResponse = new QuizResponse({
      user: req.user.id,
      quiz: quizId,
      selectedOption,
      isCorrect,
      totalMarks,
    });

    await quizResponse.save();

    // Prepare the response message based on the correctness
    let responseMessage = "Quiz answers submitted successfully.";
    if (isCorrect) {
      responseMessage += " Your answer is correct!";
    } else {
      responseMessage += " Unfortunately, your answer is wrong.";
    }

    res.json({ message: responseMessage, isCorrect, totalMarks });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: Determine if a user has passed or failed a quiz: GET "/api/quiz/checkResult/:quizId"
router.get("/checkResult/:quizId", fetchuser, async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz Not Found" });
    }

    // Get the user's quiz response
    const quizResponse = await QuizResponse.findOne({
      user: req.user.id,
      quiz: quizId,
    });

    if (!quizResponse) {
      return res.status(404).json({ error: "Quiz Response Not Found" });
    }

    const passingPercentage = 70;
    const userPercentage =
      (quizResponse.totalMarks / parseInt(quiz.totalMarks)) * 100;

    const isPassed = userPercentage >= passingPercentage;

    res.json({
      quizId: quizId,
      userPercentage: userPercentage,
      passingPercentage: passingPercentage,
      isPassed: isPassed,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
