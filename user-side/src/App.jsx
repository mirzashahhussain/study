import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CreateId from "./component/CreateId";
import LoginId from "./component/LoginId";
import Display from "./component/Display";
import CertificateDisplay from "./component/CertificateDisplay";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import CourseAbout from "./component/CourseAbout";
import User from "./component/User";
import PaymentPage from "./component/PaymentPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<CreateId />} />
        <Route exact path="/login" element={<LoginId />} />
        <Route exact path="/home" element={<Display />} />
        <Route exact path="/certi" element={<CertificateDisplay />} />
        <Route exact path="/certi" element={<Home />} />
        <Route exact path="/course-about" element={<CourseAbout />} />
        <Route exact path="/payment" element={<PaymentPage />} />
        <Route exact path="/user" element={<User />} />
      </Routes>
    </>
  );
}

export default App;
