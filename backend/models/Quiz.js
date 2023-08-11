const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuizSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  question: {
    type: String,
  },
  options: {
    type: [String],
  },
  marks: {
    type: String,
  },
  correctOption: {
    type: String,
  },
});

const Quiz = mongoose.model("quiz", QuizSchema);
module.exports = Quiz;
