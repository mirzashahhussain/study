const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const Chapter = require("./Chapter");
const Quiz = require("./Quiz");

const CourseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  CourseImg: {
    type: String,
  },
  CourseName: {
    type: String,
    require: true,
  },
  CourseDiscHead: {
    type: String,
  },
  CourseDisc: {
    type: String,
  },
  CoursePrice: {
    type: String,
  },
  CourseRatings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
  ],
  CourseUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  CourseChapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapter",
    },
  ],
  CourseQuizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz",
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("course", CourseSchema);
module.exports = Course;
