import AddChapter from "./component/AddChapter";
import AddCourse from "./component/AddCourse";
import CourseCards from "./component/CourseCards";
import Display from "./component/Display";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/Navbar";
import ChapterCard from "./component/ChapterCard";
import DisplayChapters from "./component/DisplayChapters";
import Test from "./component/test";
import QuizCard from "./component/QuizCard";
import CertificateDisplay from "./component/CertificateDisplay";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Display />} />
          <Route exact path="/displaych" element={<DisplayChapters />} />
          <Route exact path="/addcr" element={<AddCourse />} />
          <Route exact path="/addch" element={<AddChapter />} />
          <Route exact path="/crcard" element={<CourseCards />} />
          <Route exact path="/chcard" element={<ChapterCard />} />
          <Route exact path="/q" element={<QuizCard />} />
          <Route exact path="/certi" element={<CertificateDisplay />} />
          <Route exact path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
