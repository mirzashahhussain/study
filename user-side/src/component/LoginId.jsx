import React, { useState, useContext } from "react";
import "./style/createId.css";
import logo from "../assets/logo.png";
import student from "../assets/student.gif";
import { Link } from "react-router-dom";
import { CourseContext } from "../context/CourseContext";

function LoginId() {
  const { loginUser } = useContext(CourseContext);

  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async (event) => {
    event.preventDefault();
    const { email, password } = credentials;

    await loginUser(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getPasswordType = () => {
    return showPassword ? "text" : "password";
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
              <div className="form-button" type="submit">
                <button>Log in</button>
              </div>
            </form>
          </div>

          <div className="separator">
            <hr className="line" />
            <span>OR</span>
            <hr className="line" />
          </div>

          <div className="login">
            <p>
              Don't have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginId;
