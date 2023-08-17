const mongoose = require("mongoose");
const { Schema } = mongoose;

const QuizResponseSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quiz",
  },

  selectedOption: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
  },
  marks: {
    type: Number,
  },
});

const QuizResponse = mongoose.model("quizresponse", QuizResponseSchema);
module.exports = QuizResponse;
