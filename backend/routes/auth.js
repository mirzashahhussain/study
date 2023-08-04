const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
// const path = require("path");
// require("dotenv").config();

// const jwtSecret = process.env.JWT_SECRET;
const jwtSecret = "Mirza@786";

const router = express.Router();

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("username", "Enter a valid username").isLength({ min: 4 }),
    body("email", "Enter a valid username").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          error: "Sorry a user with this email already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: secPass,
        verified: false,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwtSecret);
      // res.json({ user });
      res.json({ success: true, authtoken });
    } catch (error) {
      console.error(error.message);
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("username", "Enter a valid username").isLength({ min: 4 }),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors,return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userusername, password } = req.body;
    try {
      let user = await User.findOne({ userusername });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ error: "Please try to login with correct Credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "Please try to login with correct Credentials",
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwtSecret);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// ROUTE 4: Update User Info using: POST "/api/auth/updateuser". login required
router.put("/updateuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstname && !lastName && !username && !email && !password) {
      throw new Error("Empty user details are not allowed");
    } else {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(
          "User record doesn't exist or has been already deleted."
        );
      } else {
        const updatedUser = {};
        if (firstName) {
          updatedUser.firstName = firstName;
        }
        if (lastName) {
          updatedUser.lastName = lastName;
        }
        if (username) {
          updatedUser.username = username;
        }
        if (email) {
          if (email !== user.email) {
            // Check if the email exists already
            const otherUser = await User.findOne({ email });
            if (otherUser) {
              throw new Error(
                "Sorry, a user with this email already exists. Please use a different email."
              );
            }
          }
          updatedUser.email = email;
        }
        if (password) {
          const salt = await bcrypt.genSalt(10);
          const secPass = await bcrypt.hash(password, salt);
          updatedUser.password = secPass;
        }

        await User.findByIdAndUpdate(userId, { $set: updatedUser });
        res.json({
          status: "SUCCESS",
          message: "User info updated successfully.",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// ROUTE 5: Delete User using: POST "/api/auth/deleteuser". login required
router.delete("/deleteuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new Error("Empty user details are not allowed");
    } else {
      await User.findByIdAndDelete(userId);
      res.json({
        status: "SUCCESS",
        message: "User deleted successfully.",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "FAILED",
      message: error.message,
    });
  }
});

module.exports = router;
