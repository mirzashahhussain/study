import React, { useState, useContext } from "react";
import "./style/createId.css";
import logo from "../assets/logo.png";
import student from "../assets/student.gif";
import { Link } from "react-router-dom";
import { CourseContext } from "../context/CourseContext";

function CreateId() {
  const { createUser } = useContext(CourseContext);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { fullName, email, password } = credentials;

    await createUser(fullName, email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getPasswordType = () => {
    return showPassword ? "text" : "password";
  };

  const getPasswordStrengthColor = (password) => {
    const strength = calculatePasswordStrength(password);

    switch (strength) {
      case "Weak":
        return "password-weak";
      case "Moderate":
        return "password-moderate";
      case "Strong":
        return "password-strong";
      case "Very Strong":
        return "password-very-strong";
      default:
        return "";
    }
  };

  const calculatePasswordStrength = (password) => {
    const length = password.length;

    // Define your criteria and scoring here
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (length >= 8) {
      score += 2;
    }

    if (length >= 10) {
      score += 4;
    }

    if (hasUppercase) {
      score += 2;
    }

    if (hasLowercase) {
      score += 2;
    }

    if (hasNumber) {
      score += 2;
    }

    if (hasSpecial) {
      score += 2;
    }

    if (length === 0) {
      return "";
    }
    if (score < 6) {
      return "Weak";
    } else if (score < 10) {
      return "Moderate";
    } else if (score < 14) {
      return "Strong";
    } else if (score < 16) {
      return "Very Strong";
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="form-body">
        <div className="study-img">
          <img src={student} />
        </div>
        <div className="form-card">
          <div className="from-img">
            <img src={logo} className="logo" />
          </div>
          <div className="form-input">
            <form onSubmit={handleSignUp}>
              <input
                placeholder="Full Name"
                type="text"
                value={credentials.fullName}
                onChange={onChange}
                name="fullName"
              />
              <input
                placeholder="Email"
                type="email"
                value={credentials.email}
                onChange={onChange}
                name="email"
              />

              <input
                placeholder="Password"
                type={getPasswordType()}
                value={credentials.password}
                onChange={onChange}
                name="password"
              />

              <button
                className="password-toggle"
                type="button"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye-slash" />
                ) : (
                  <i className="fa-solid fa-eye" />
                )}{" "}
              </button>
              <div
                className={`password-strength ${getPasswordStrengthColor(
                  credentials.password
                )}`}
              >
                {calculatePasswordStrength(credentials.password)}
              </div>
              <div className="form-button">
                <button type="submit">Sign up</button>
              </div>
            </form>
          </div>

          <div className="separator">
            <hr className="line" />
            <span>OR</span>
            <hr className="line" />
          </div>

          <div className="google">
            <button>
              <i className="fa-brands fa-google" />
              {"  "}
              Sign up with Google
            </button>
          </div>
          <div className="login">
            <p>
              Have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateId;
