import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { CourseProvider } from "./context/CourseContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CourseProvider>
        <App />
      </CourseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
