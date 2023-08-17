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
  CourseName: {
    type: String,
    require: true,
  },
  CourseDisc: {
    type: String,
  },

  CoursePrice: {
    type: String,
  },
  CourseImg: {
    type: String,
  },

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
