const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Course = require("../models/Course");
const Certificate = require("../models/Certificates");
const Quiz = require("../models/Quiz");
const QuizResponse = require("../models/QuizResponse");
const { body, validationResult } = require("express-validator");
const pug = require("pug");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const puppeteer = require("puppeteer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dffav7sdj",
  api_key: "972785836826929",
  api_secret: "3bMgYnOQfoPjd0E3aDNh_i5vp0A",
});

async function generatePdfFromHtml(html) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
}

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
      const { question, options, correctOption, marks, courseId } = req.body;

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
  const { question, options, correctOption, marks } = req.body;
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

    let quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).send("Quiz Not Found");
    }

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

    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ Success: "Quiz has been deleted", Quiz: quiz });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 5: Check multiple quiz submissions and results: POST "/api/quiz/checkQuiz"
router.post("/checkQuiz", fetchuser, async (req, res) => {
  try {
    const quizResponses = req.body.quizResponses;

    const results = [];

    for (const quizResponse of quizResponses) {
      const quizId = quizResponse.quizId;
      const selectedOption = quizResponse.selectedOption;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        results.push({
          quizId: quizId,
          error: "Quiz Not Found",
        });
        continue;
      }

      // Check if the selectedOption is correct
      const isCorrect = selectedOption === quiz.correctOption;

      const question = quiz.question;
      const correctOption = quiz.correctOption;

      // Calculate total marks based on correctness
      const marks = isCorrect ? parseInt(quiz.marks) : 0;

      // Create a new quiz response record
      const newQuizResponse = new QuizResponse({
        user: req.user.id,
        quiz: quizId,
        selectedOption,
        isCorrect,
        marks,
      });

      await newQuizResponse.save();

      // Determine if the user has passed or failed the quiz
      const passingPercentage = 70;

      results.push({
        quizId: quizId,
        question: question,
        selectedOption: selectedOption,
        correctOption: correctOption,
        isCorrect: isCorrect,
        marks: marks,
        passingPercentage: passingPercentage,
      });
    }

    res.json({
      results: results,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: Genrate User certificate: POST "/api/quiz/generateCertificate/:userId/:courseId"
router.post(
  "/generateCertificate/:userId/:courseId",
  upload.none(),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const courseId = req.params.courseId;

      const userName = req.body.userName;
      const courseName = req.body.courseName;
      const courseDuration = req.body.courseDuration;
      const completionDate = req.body.completionDate;

      // Validate the userId before using it
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).send("Invalid userId");
      }

      // Compile the Pug template
      const templatePath = path.join(__dirname, "views", "certificate.pug");
      const compiledTemplate = pug.compileFile(templatePath);

      // Render the template with data
      const certificateHtml = compiledTemplate({
        userId,
        userName,
        courseName,
        courseDuration,
        completionDate,
      });

      // Create a PDF from the rendered HTML (you'll need a library like `puppeteer` for this)
      const pdfBuffer = await generatePdfFromHtml(certificateHtml);

      // Save the PDF to a file (you may want to create a 'certificates' folder)
      const pdfPath = path.join(
        __dirname,
        "..",
        "certificates",
        `${userId}_${courseId}_certificate.pdf`
      );

      fs.writeFileSync(pdfPath, pdfBuffer);

      // Upload the PDF to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader
        .upload_stream(
          {
            folder: `certificates/${userId}_${courseId}`,
            public_id: `${userId}_${courseId}_certificate`,
            resource_type: "auto",
            format: "png",
          },
          async (error, result) => {
            if (error) {
              console.error(error.message);
              return res.status(500).send("Cloudinary Upload Error");
            }

            // Save the PDF URL to the certificate document in MongoDB
            const certificate = new Certificate({
              user: userId,
              certificateUrl: result.secure_url,
            });

            await certificate.save();

            // Serve the generated PDF to the user
            res.contentType("application/pdf");
            res.send(pdfBuffer);
          }
        )
        .end(pdfBuffer);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Fetch certificate URLs for a specific user and course
router.get("/certificates/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const certificates = await Certificate.find({
      user: userId,
    });

    const certificateUrls = certificates.map(
      (certificate) => certificate.certificateUrl
    );

    res.status(200).json({ certificateUrls });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
