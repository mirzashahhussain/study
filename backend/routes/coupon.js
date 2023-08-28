const express = require("express");
const { body, validationResult } = require("express-validator");
const Coupon = require("../models/Coupon");
const Course = require("../models/Course"); // Assuming you have a Course model
const router = express.Router();

// ROUTE 1: Fetch all coupon codes: GET "/api/coupon/fetch-coupons".
router.get("/fetch-coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find();

    res.json({ coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ROUTE 2:  Create a new coupon code: POST "/api/coupon/create-coupon".
router.post(
  "/create-coupon",
  [
    body("couponCode").notEmpty().withMessage("Coupon code is required"),
    body("couponDiscount")
      .notEmpty()
      .withMessage("Coupon discount is required"),
    body("couponCourses")
      .isArray({ min: 1 })
      .withMessage("At least one course is required"),
    body("couponExpireDate")
      .notEmpty()
      .withMessage("Coupon expiration date is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { couponCode, couponDiscount, couponCourses, couponExpireDate } =
        req.body;

      // Check if the specified courses exist
      const courses = await Course.find({ _id: { $in: couponCourses } });
      if (courses.length !== couponCourses.length) {
        return res.status(400).json({ error: "Invalid course(s)" });
      }

      // Create a new coupon
      const newCoupon = new Coupon({
        couponCode,
        couponDiscount,
        couponCourses,
        couponExpireDate,
      });

      await newCoupon.save();

      res.json({ message: "Coupon created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ROUTE 3: Update coupon code: POST "/api/coupon/update-coupon/:couponId".
router.put("/update-coupon/:couponId", async (req, res) => {
  try {
    const { couponId } = req.params;
    const { couponDiscount, couponExpireDate } = req.body;

    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      {
        $set: {
          couponDiscount,
          couponExpireDate,
        },
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon updated successfully", coupon: updatedCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// ROUTE 4: Verify a coupon code: GET "/api/coupon/verify-coupon/:couponCode".
router.get("/verify-coupon/:couponCode/:courseId", async (req, res) => {
  try {
    const { couponCode, courseId } = req.params;

    const coupon = await Coupon.findOne({
      couponCode,
      couponCourses: { $in: [courseId] },
    });

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    // Check if the coupon has expired
    const currentDate = new Date().toISOString();
    if (coupon.couponExpireDate < currentDate) {
      return res.status(400).json({ error: "Coupon has expired" });
    }

    res.json({ valid: true, discount: coupon.couponDiscount });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error", detailedError: error.message });
  }
});

// ROUTE 5: Delete a coupon code: GET "/api/coupon/delete-coupon/:couponId".
router.delete("/delete-coupon/:couponId", async (req, res) => {
  try {
    const { couponId } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
