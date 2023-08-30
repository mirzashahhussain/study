const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dffav7sdj",
  api_key: "972785836826929",
  api_secret: "3bMgYnOQfoPjd0E3aDNh_i5vp0A",
});

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTE 0: Search for Courses - GET "/api/course/search"
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    // Search for courses using the query parameter
    const courses = await Course.find({
      $or: [
        { CourseName: { $regex: `${query}`, $options: "i" } }, // Case-insensitive course name search
      ],
    });

    const coursesWithSelectedDetails = courses.map((course) => ({
      CourseName: course.CourseName,
      CoursePrice: course.CoursePrice,
      CourseImg: course.CourseImg,
    }));

    res.json(coursesWithSelectedDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 1: Fetch All Courses - GET "/api/course/fetchallcourse"
router.get("/fetchallcourse", async (req, res) => {
  try {
    const courses = await Course.find().populate("CourseChapters");
    const coursesWithChapterCount = courses.map((course) => ({
      ...course._doc,
      chapterCount: course.CourseChapters.length,
    }));
    res.json(coursesWithChapterCount);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 2: Add a new Course using: POST "/api/course/addCourse". login required
router.post(
  "/addCourse",
  fetchuser,
  [
    body("CoursePrice", "Course price must be at least 5 numbers").isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    try {
      const { CourseName, CoursePrice, CourseDisc, CourseDiscHead } = req.body;
      let { CourseImg } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Process the Course image
      if (req.files && req.files.CourseImg) {
        const file = req.files.CourseImg;
        const fileName = uuidv4() + path.extname(file.name);
        const filePath = path.join(__dirname, "../uploads", fileName);

        // Move the uploaded file to the server
        await file.mv(filePath);

        // Read the file and convert it to base64
        const fileData = fs.readFileSync(filePath);
        CourseImg = fileData.toString("base64");

        // Delete the temporary file
        fs.unlinkSync(filePath);
      }

      const newCourse = new Course({
        CourseImg,
        CourseName,
        CourseDisc,
        CoursePrice,
        CourseDiscHead,
        CourseRatings: [],
        CourseUsers: [],
        user: req.user.id,
      });
      const savedCourse = await newCourse.save();
      res.json(savedCourse);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Update an existing Course using: PUT "/api/course/updateCourse/:id". login required
router.put("/updateCourse/:id", fetchuser, async (req, res) => {
  const { CourseName, CoursePrice, CourseDisc, CourseDiscHead } = req.body;
  let { CourseImg } = req.body;
  try {
    // Create a newCourse object
    const newCourse = {};
    if (CourseImg) {
      // Process the Course image
      if (req.files && req.files.CourseImg) {
        const file = req.files.CourseImg;
        const fileName = uuidv4() + path.extname(file.name);
        const filePath = path.join(__dirname, "../uploads", fileName);

        // Move the uploaded file to the server
        await file.mv(filePath);

        // Read the file and convert it to base64
        const fileData = fs.readFileSync(filePath);
        CourseImg = fileData.toString("base64");

        // Delete the temporary file
        fs.unlinkSync(filePath);
      }

      newCourse.CourseImg = CourseImg;
    }
    if (CourseName) {
      newCourse.CourseName = CourseName;
    }
    if (CourseDisc) {
      newCourse.CourseDisc = CourseDisc;
    }
    if (CourseDiscHead) {
      newCourse.CourseDiscHead = CourseDiscHead;
    }
    if (CoursePrice) {
      newCourse.CoursePrice = CoursePrice;
    }

    // Find the Course to be updated and update it
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send("Course Not Found");
    }

    if (course.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    // {new : true} = if Course not exist create new Course
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: newCourse },
      { new: true, fields: { CourseRatings: 0, CourseUsers: 0 } }
    );
    res.json({ course });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Delete an existing Course using: DELETE "/api/course/deleteCourse/:id". login required
router.delete("/deleteCourse/:id", fetchuser, async (req, res) => {
  try {
    // Find the Course to be deleted and delete it
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).send("Course Not Found");
    }

    // Allow deletion only if user owns this Course
    if (course.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    // {new : true} = if Course not exist create new Course
    course = await Course.findByIdAndDelete(req.params.id);
    res.json({ Success: "Course has been deleted", Course: course });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 5: Get all chapters for a specific Course using: GET "/api/course/fetchChapters/:courseId". login required
router.get("/fetchChapters/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId.trim();

    // Check if the course exists and belongs to the user
    const course = await Course.findOne({
      _id: courseId,
    });
    if (!course) {
      return res.status(404).send("Course Not Found or Not Allowed");
    }

    // Fetch all the chapters for the specific course
    const chapters = await Chapter.find({ course: courseId });
    res.json(chapters);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 6: Add a new Chapter to a Course using: POST "/api/course/addChapter". login required
router.post(
  "/addChapter",
  fetchuser,
  [
    body("ChapterName", "Chapter name is required").notEmpty(),
    body("courseId", "Valid courseId is required").isMongoId(),
  ],
  upload.single("ChapterVideo"),
  async (req, res) => {
    try {
      const { ChapterName, ChapterLength, courseId } = req.body;

      // Check if the file was uploaded successfully
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      // Get the file path
      const chapterVideoPath = req.file.path;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if the course exists and belongs to the user
      const course = await Course.findOne({
        _id: courseId,
        user: req.user.id,
      });
      if (!course) {
        return res.status(404).send("Course Not Found or Not Allowed");
      }

      // Upload the video to Cloudinary
      const cloudinaryUploadResult = await cloudinary.uploader.upload(
        chapterVideoPath,
        {
          folder: "Chapter Videos",
          resource_type: "video",
          public_id: `${ChapterName}`,
        }
      );

      // Remove the temporary file from the server
      fs.unlinkSync(req.file.path);

      const chapter = new Chapter({
        course: courseId,
        ChapterName,
        ChapterLength,
        ChapterVideo: cloudinaryUploadResult.secure_url,
      });

      const savedChapter = await chapter.save();
      // Add the chapter to the course's chapters array
      course.CourseChapters.push(savedChapter);
      await course.save();
      res.json(savedChapter);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 7: Update an existing Chapter using: PUT "/api/chapter/updateChapter/:id". login required
router.put("/updateChapter/:id", fetchuser, async (req, res) => {
  const { ChapterName, ChapterLength, ChapterVideo } = req.body;
  try {
    const updatedChapter = {};

    if (ChapterName) {
      updatedChapter.ChapterName = ChapterName;
    }
    if (ChapterLength) {
      updatedChapter.ChapterLength = ChapterLength;
    }
    if (ChapterVideo) {
      updatedChapter.ChapterVideo = ChapterVideo;
    }

    let chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).send("Chapter Not Found");
    }

    // Check if the chapter belongs to the user's course
    const courseId = req.body.courseId; // Assuming you will provide the courseId from the frontend when updating a chapter.
    if (chapter.course.toString() !== courseId) {
      return res.status(401).send("Not Allowed");
    }

    chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { $set: updatedChapter },
      { new: true }
    );
    res.json({ chapter });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 8: Delete an existing Chapter using: DELETE "/api/chapter/deleteChapter/:id". login required
router.delete("/deleteChapter/:id", fetchuser, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ error: "Chapter Not Found" });
    }

    // Check if the chapter belongs to the user's course
    const courseId = req.body.courseId; // Assuming you will provide the courseId from the frontend when deleting a chapter.
    if (chapter.course.toString() !== courseId) {
      return res.status(401).json({ error: "Not Allowed" });
    }

    await Chapter.findByIdAndDelete(req.params.id);
    res.json({ Success: "Chapter has been deleted", Chapter: chapter });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 9: Rate a Course - POST "/api/course/rateCourse/:id". login required
router.post("/rateCourse/:id", fetchuser, async (req, res) => {
  try {
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Invalid rating value" });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course Not Found" });
    }

    // Check if the user has already rated this course
    const userRating = course.CourseRatings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (userRating) {
      return res
        .status(400)
        .json({ error: "You have already rated this course" });
    }

    course.CourseRatings.push({ user: req.user.id, rating });
    await course.save();

    res.json({ message: "Rating added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 10: Enroll in a Course - POST "/api/course/enrollCourse/:id". login required
router.post("/enrollCourse/:id", fetchuser, async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course Not Found" });
    }

    // Check if the user is already enrolled in this course
    if (course.CourseUsers.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "You are already enrolled in this course" });
    }

    // Add the course to the user's enrolledCourses array
    const user = await User.findById(req.user.id);
    user.enrolledCourses.push(courseId);
    await user.save();

    course.CourseUsers.push(req.user.id);
    await course.save();

    res.json({ message: "Enrolled in the course successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
