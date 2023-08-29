import React, { useState, useEffect, useContext } from "react";
import "./style/payment.css";
import { CourseContext } from "../context/CourseContext";

function PaymentPage() {
  const { verifyCoupon } = useContext(CourseContext);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const courseRatings = [5, 4, 3, 4, 5];
  const courseId = "64de3b0cfad66a03477744d6";

  const coursePrice = 1000;
  const couponDiscountPercentage = 15;

  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [totalAfterCoupon, setTotalAfterCoupon] = useState(coursePrice);

  useEffect(() => {
    // Calculate the average rating if courseRatings is defined
    if (courseRatings && courseRatings.length > 0) {
      const totalRatings = courseRatings.length;
      const sumRatings = courseRatings.reduce(
        (total, rating) => total + rating,
        0
      );
      const newAverageRating = sumRatings / totalRatings;
      setAverageRating(newAverageRating);
    }
  }, [courseRatings]);

  const applyCoupon = async () => {
    try {
      if (appliedCoupons.includes(coupon)) {
        setCouponError("Coupon code is already added to your bill.");
      } else {
        const couponValidation = await verifyCoupon(coupon, courseId);
        if (couponValidation.valid) {
          const couponDiscount = parseInt(couponValidation.discount);
          setAppliedCoupons([...appliedCoupons, coupon]);
          // setCoupons([...coupons, coupon]);
          setCoupon("");
          applyDiscounts(appliedCoupons, coursePrice, couponDiscountPercentage);
          setCouponError("");
          setCouponSuccess(true);
        } else {
          setCouponError("Coupon is not valid or has expired.");
        }
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  useEffect(() => {
    applyDiscounts(appliedCoupons, coursePrice, couponDiscountPercentage);
  }, [appliedCoupons]);

  const applyDiscounts = (appliedCoupons, initialPrice, discountPercentage) => {
    let totalDiscountedPrice = initialPrice;
    for (const appliedCoupon of appliedCoupons) {
      // Calculate discount based on percentage
      totalDiscountedPrice =
        totalDiscountedPrice -
        (totalDiscountedPrice * discountPercentage) / 100;
    }
    setTotalAfterCoupon(totalDiscountedPrice);
  };

  const removeCoupon = (removedCoupon) => {
    const updatedAppliedCoupons = appliedCoupons.filter(
      (coupon) => coupon !== removedCoupon
    );
    setAppliedCoupons(updatedAppliedCoupons);

    applyDiscounts(
      updatedAppliedCoupons,
      coursePrice,
      couponDiscountPercentage
    );
  };

  const filledStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;

  return (
    <>
      <div className="course-buy-container">
        <div className="course-buy">
          <div className="course-details">
            <img
              src={
                "https://trisectinstitute.com/wp-content/uploads/2021/12/best-python-training.png"
              }
              alt="User"
            />
            <div className="course-buy-details">
              <h1>Python</h1>
              <div className="rating-buy">
                {averageRating.toFixed(1) || 0}
                {Array.from({ length: filledStars }, (_, index) => (
                  <i key={index} className={`fa-solid fa-star filled`} />
                ))}
                {hasHalfStar && (
                  <i className="fa-solid fa-star-half-alt filled" />
                )}
                {Array.from(
                  {
                    length: Math.floor(
                      5 - (filledStars + (hasHalfStar ? 1 : 0))
                    ),
                  },
                  (_, index) => (
                    <i key={index} className="fa-regular fa-star" />
                  )
                )}
              </div>
            </div>
          </div>

          <table className="price-table">
            <tbody>
              <tr>
                <th>Price</th>
                <td>₹{coursePrice}</td>
              </tr>
              <tr>
                {appliedCoupons.map((appliedCoupon, index) => (
                  <tr key={index}>
                    <th>Discount {index + 1}</th>
                    <td>
                      {appliedCoupon} ({couponDiscountPercentage}%)
                    </td>
                  </tr>
                ))}
              </tr>
              <tr>
                <th>Total Price</th>
                <td>
                  ₹{coursePrice - (coursePrice * discountPercentage) / 100}
                </td>
              </tr>
              <tr>
                <th>Discount After Coupon</th>
                <td>₹{coursePrice - totalAfterCoupon}</td>
              </tr>
              <tr>
                <th>Total Price After Coupon</th>
                <td>₹{totalAfterCoupon}</td>
              </tr>
            </tbody>
          </table>
          <div className="applied-coupons">
            {appliedCoupons.map((appliedCoupon) => (
              <div key={appliedCoupon} className="applied-coupon">
                <button onClick={() => removeCoupon(appliedCoupon)}>
                  {appliedCoupon}
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="coupon-input">
            <input
              type="text"
              placeholder="Discount Coupon"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={applyCoupon}>Apply</button>
          </div>
          {couponError && <p className="error-message">{couponError}</p>}
          {couponSuccess && (
            <p className="success-message">Coupon applied successfully!</p>
          )}

          <button>Buy</button>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
