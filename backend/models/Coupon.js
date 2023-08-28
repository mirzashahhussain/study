const { default: userEvent } = require("@testing-library/user-event");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CouponSchema = new Schema({
  couponCode: {
    type: String,
    required: true,
  },
  couponDiscount: {
    type: Number,
    required: true,
  },
  couponCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
  ],
  couponExpireDate: {
    type: Date,
    required: true,
  },
});

const Coupon = mongoose.model("coupon", CouponSchema);
module.exports = Coupon;
