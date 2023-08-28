import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div>
        <Link to="/">Home</Link>
        <Link to="addcr">Add Course</Link>
        <Link to="certi">Certificate</Link>
        <Link to="coupon">Coupon Management</Link>
      </div>
    </>
  );
}

export default Navbar;
