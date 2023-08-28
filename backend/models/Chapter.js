const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChapterSchema = new Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  ChapterName: {
    type: String,
    required: true,
  },
  ChapterLength: {
    type: String,
  },
  ChapterVideo: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

const Chapter = mongoose.model("chapter", ChapterSchema);
module.exports = Chapter;
