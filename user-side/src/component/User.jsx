import React, { useState, useContext, useEffect } from "react";
import { CourseContext } from "../context/CourseContext";
import copy from "copy-to-clipboard";
import "./style/user.css";
import userImgOff from "../assets/userImg.png";

function User() {
  const { fetchUser, updateUser, deleteUser, userId } =
    useContext(CourseContext);

  const [userInfo, setUserInfo] = useState({});
  const [editing, setEditing] = useState(false);
  const [analysis, setAnalysis] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newImg, setNewImg] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchData() {
      const user = await fetchUser();
      if (user) {
        setUserInfo(user);
      }
    }
    fetchData();
  }, []);

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setNewEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleSaveChanges = async () => {
    const updatedUser = await updateUser(
      newName,
      newEmail,
      newPassword,
      newImg
    );
    if (updatedUser.status === "SUCCESS") {
      setUserInfo({
        ...userInfo,
        userImg: newImg,
        fullName: newName,
        email: newEmail,
      });

      setEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    const deletedUser = await deleteUser();
    if (deletedUser.status === "SUCCESS") {
      console.log("Account deleted successfully.");
    }
  };

  const handleUserInfoClick = () => {
    if (editing) {
      setEditing(false);
    }

    if (analysis) {
      setAnalysis(false);
    }
  };

  const handleCopy = () => {
    copy(userId);
    setIsCopied(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertImageToBase64(file);
    }
  };

  const convertImageToBase64 = (imageFile) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setNewImg(base64String);
      setImagePreviewUrl(base64String);
    };
    reader.readAsDataURL(imageFile);
  };

  return (
    <div className="user-container">
      <div className="user-navbar">
        <a
          href="#user-info"
          onClick={handleUserInfoClick}
          className="user-nav-link"
        >
          <i className="fa-solid fa-circle-user" />
          Profile
        </a>
        <a
          href="#user-analysis"
          onClick={() => {
            setEditing(false);
            setAnalysis(true);
          }}
          className="user-nav-link"
        >
          <i className="fa-solid fa-chart-line" />
          Analysis report
        </a>
        <a className="user-nav-link">
          <i className="fa-solid fa-file-lines" />
          Billing Info
        </a>

        <a
          href="#change-info"
          onClick={() => {
            setEditing(true);
            setAnalysis(false);
          }}
          className="user-nav-link"
        >
          <i className="fa-solid fa-sliders" />
          General
        </a>
        <div className="user-copy">
          <p>ID: {userId}</p>
          <button onClick={handleCopy} disabled={isCopied}>
            {isCopied ? (
              <i className="fa-solid fa-check" />
            ) : (
              <i className="fa-solid fa-copy" />
            )}
          </button>
        </div>
      </div>
      <div className="settings">
        {!editing && userInfo && !analysis && (
          <section id="user-info">
            <div
              className="circle-box"
              style={{
                backgroundImage: `url(${userInfo.userImg || userImgOff})`,
              }}
            ></div>
            <div>
              <p>{userInfo.fullName || newName}</p>
              <p> {userInfo.email}</p>
              <button className="del-btn" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </section>
        )}
        {editing && userInfo && (
          <section id="change-info">
            <div className="uplodad-image">
              <div
                className="circle-box"
                style={{
                  backgroundImage: `url(${imagePreviewUrl || userImgOff})`,
                }}
              ></div>
              <label htmlFor="input-img">Select Food Image</label>
              <input
                style={{ visibility: "hidden" }}
                id="input-img"
                type="file"
                accept="image/*"
                name="newImg"
                onChange={handleFileChange}
                multiple={false}
              />
            </div>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newName || userInfo.fullName}
                onChange={handleNameChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newEmail}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <button className="save-btn" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </section>
        )}
        {analysis && userInfo && (
          <section id="user-analysis">
            <div className="user-courses">
              <div className="analysis-box">
                <p className="user-enrolled-courses">
                  {userInfo.enrolledCourses.length}
                </p>
                <label>Enrolled Courses</label>
              </div>
              <div className="analysis-box">
                <p className="user-enrolled-courses">
                  {userInfo.enrolledCourses.length}
                </p>
                <label>Complete Courses </label>
              </div>
              <div className="analysis-box">
                <p className="user-enrolled-courses">1Hr</p>
                <label>Total Watch Time</label>
              </div>
            </div>
            <div className="analysis-graph"></div>
          </section>
        )}
      </div>
    </div>
  );
}

export default User;
