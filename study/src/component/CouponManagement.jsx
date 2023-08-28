import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style/coupon.css";
import { CourseContext } from "../context/CourseContext";

const CouponManagement = () => {
  const { fetchAllCoupons, updateCoupon, deleteCoupon, addCoupon, coupons } =
    useContext(CourseContext);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [newCouponData, setNewCouponData] = useState({
    couponCode: "",
    couponDiscount: "",
    couponCourses: [], // An array for storing multiple course IDs
    couponExpireDate: formatDate(new Date()),
  });

  const [newCourseId, setNewCourseId] = useState(""); // Temporarily store new course ID

  const [editingCouponId, setEditingCouponId] = useState("");
  const [updatedCouponData, setUpdatedCouponData] = useState({
    couponCode: "",
    couponDiscount: "",
    couponCourse: "",
    couponExpireDate: formatDate(new Date()),
  });
  const [deletingCouponId, setDeletingCouponId] = useState("");

  useEffect(() => {
    fetchAllCoupons();
  }, []);

  const handleCreateClick = () => {
    setCreatingCoupon(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCouponData({
      ...newCouponData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setNewCouponData({
      ...newCouponData,
      couponExpireDate: formatDate(date),
    });
  };

  const handleAddCourseId = () => {
    if (newCourseId.trim() !== "") {
      setNewCouponData({
        ...newCouponData,
        couponCourses: [...newCouponData.couponCourses, newCourseId],
      });
      setNewCourseId(""); // Clear the input
    }
  };

  const handleRemoveCourseId = (index) => {
    const updatedCourseIds = [...newCouponData.couponCourses];
    updatedCourseIds.splice(index, 1);
    setNewCouponData({
      ...newCouponData,
      couponCourses: updatedCourseIds,
    });
  };

  const handleCreateCoupon = async () => {
    try {
      await addCoupon(newCouponData);
      setCreatingCoupon(false);
      setNewCouponData({
        couponCode: "",
        couponDiscount: "",
        couponCourses: [], // Reset course IDs
        couponExpireDate: "",
      });
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const handleUpdateClick = (couponId) => {
    setEditingCouponId(couponId);
    // You can also pre-fill the input fields with existing data if needed
    const couponToUpdate = coupons.find((coupon) => coupon._id === couponId);
    setUpdatedCouponData(couponToUpdate);
  };

  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCouponData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateDateChange = (date) => {
    setUpdatedCouponData({
      ...updatedCouponData,
      couponExpireDate: formatDate(date),
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCoupon(editingCouponId, updatedCouponData);
      setEditingCouponId("");
      setUpdatedCouponData({});
      fetchAllCoupons();
    } catch (error) {
      console.error("Error updating coupon:", error);
    }
  };

  const handleDeleteClick = async (couponId) => {
    try {
      setDeletingCouponId(couponId);
      await deleteCoupon(couponId);
      setDeletingCouponId("");
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleCloseClick = () => {
    setCreatingCoupon(false);
    setNewCouponData({
      couponCode: "",
      couponDiscount: "",
      couponCourse: "",
      couponExpireDate: new Date(),
    });
  };
  return (
    <div className="container">
      <h2 className="title">Coupon Management</h2>
      {creatingCoupon ? (
        <div className="form">
          <div className="button-group">
            <button
              className="button button-secondary"
              onClick={handleCloseClick}
            >
              Cancel
            </button>
            <input
              type="text"
              name="couponCode"
              value={newCouponData.couponCode}
              onChange={handleInputChange}
              placeholder="Coupon Code"
            />
            <input
              type="text"
              name="couponDiscount"
              value={newCouponData.couponDiscount}
              onChange={handleInputChange}
              placeholder="Coupon Discount"
            />
            <input
              type="text"
              name="newCourseId"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              placeholder="Enter Course ID"
            />
            <button onClick={handleAddCourseId}>Add</button>

            {/* Display selected course IDs */}
            {newCouponData.couponCourses.length > 0 && (
              <div>
                <p>Selected Course IDs:</p>
                <ul>
                  {newCouponData.couponCourses.map((courseId, index) => (
                    <li key={courseId}>
                      {courseId}{" "}
                      <button onClick={() => handleRemoveCourseId(index)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DatePicker
              selected={
                newCouponData.couponExpireDate
                  ? new Date(newCouponData.couponExpireDate)
                  : new Date()
              }
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Expiration Date"
            />

            <button onClick={handleCreateCoupon}>Create</button>
          </div>
        </div>
      ) : (
        <button onClick={handleCreateClick}>Create New Coupon</button>
      )}
      {coupons && coupons.length > 0 ? (
        <ol type="1">
          {coupons.map((coupon) => (
            <li key={coupon._id} className="coupon-item ">
              {editingCouponId === coupon._id ? (
                <form onSubmit={handleUpdateSubmit} className="form">
                  <input
                    type="text"
                    name="couponCode"
                    value={updatedCouponData.couponCode || ""}
                    onChange={handleUpdateInputChange}
                  />
                  <input
                    type="text"
                    name="couponDiscount"
                    value={updatedCouponData.couponDiscount || ""}
                    onChange={handleUpdateInputChange}
                  />

                  <DatePicker
                    selected={
                      updatedCouponData.couponExpireDate
                        ? new Date(updatedCouponData.couponExpireDate)
                        : new Date()
                    }
                    onChange={handleUpdateDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Expiration Date"
                  />

                  <button type="submit" className="button">
                    Update
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleUpdateClick()}
                  >
                    Close
                  </button>
                </form>
              ) : (
                <>
                  <div className="coupon-details">
                    <span>Coupon Code: {coupon.couponCode}</span>
                    <div>Course IDs: {coupon.couponCourses.join(", ")}</div>
                    <span>Discount: {coupon.couponDiscount}</span>
                    <span>Expire Date: {coupon.couponExpireDate}</span>
                    <span>
                      {new Date(coupon.couponExpireDate) < new Date()
                        ? "Expired"
                        : "Active"}
                    </span>
                    <button
                      className="edit-button"
                      onClick={() => handleUpdateClick(coupon._id)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDeleteClick(coupon._id)}
                      disabled={deletingCouponId === coupon._id}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <p>No coupons available.</p>
      )}
    </div>
  );
};

export default CouponManagement;
