const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: {
    type: String,
    require: true,
  },
  userImg: {
    type: String,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  verified: {
    type: Boolean,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
  ],
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
