const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Course = require("../models/Course");
const Chapter = require("../models/Chapter");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads"; // Directory name for uploads
    const uploadPath = path.join(__dirname, uploadDir);

    // Check if the "uploads" directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = file.originalname.split(".").slice(0, -1).join(".");
    cb(null, `${filename}-${uniqueSuffix}.mp4`);
  },
  fileFilter: function (req, file, cb) {
    // Check if the file is a valid video file with .mp4 extension
    const filetypes = /mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only .mp4 video files are allowed!"));
    }
  },
});

const upload = multer({ storage: storage });

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
      const { CourseName, CoursePrice, CourseDisc } = req.body;
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
  const { CourseName, CoursePrice, CourseDisc } = req.body;
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
      { new: true }
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
    const courseId = req.params.courseId;

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
  upload.single("ChapterVideo"), // added
  [
    body("ChapterName", "Chapter name is required").notEmpty(),
    body("courseId", "Valid courseId is required").isMongoId(),
  ],
  async (req, res) => {
    try {
      const { ChapterName, ChapterLength, courseId } = req.body;

      // Check if the file was uploaded successfully and get the file path
      const chapterVideo = req.file ? req.file.path : null;

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

      const chapter = new Chapter({
        course: courseId,
        ChapterName,
        ChapterLength,
        ChapterVideo: chapterVideo,
      });

      const savedChapter = await chapter.save();
      // Add the chapter to the course's chapters array
      course.CourseChapters.push(savedChapter);
      await course.save();
      res.json(savedChapter);
    } catch (error) {
      console.error(error.message);
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

module.exports = router;
