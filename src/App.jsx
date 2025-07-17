import React, { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FloatingShape from "./components/FloatingShapes";
import Landpage from "./pages/Landpage";

// student imports
import ClassAccess from "./components/ClassAccess";
import WebCoding from "./pages/WebCoding";
import ExamRoom from "./components/ExamRoom";
import WebTopics from "./components/WebTopics";
import StudentLogInPage from "./platforms/student/pages/LogInPage";
import StudentDashBoard from "./platforms/student/pages/StudentDashBoard";
import Scratch from "./platforms/student/pages/notesArea/scrathNotesArea/lowerClass/Scratch";
import HTML from "./platforms/student/pages/notesArea/webNotesArea/lower/html/HTML";

// admin imports
import AdminDashbord from "./platforms/admin/page";
import SchoolsPage from "./platforms/admin/pages/schools/page";
import Dashboard from "./platforms/admin/pages/dashboard/page";
import ClassesPage from "./platforms/admin/pages/classes/page";

// Tutors Imports
import TutorLoginPage from "./platforms/tutor/TutorLoginPage";
import TutorCreateAccount from "./platforms/tutor/TutorCreateAccount";
import ClassCodeGenarator from "./platforms/tutor/ClassCodeGenarator";
import TutorDashboard from "./platforms/tutor/TutorDashboard";

// In your main routing file (e.g., App.jsx)
import AddCoursePage from "./platforms/admin/pages/courses/page";
import StudentManagement from "./platforms/admin/pages/students/page";
import TopicsPage from "./platforms/admin/pages/topics/page";

// school import
import SchoolAuth from "./components/SchoolAuth";

// Add this route

import "./App.css";
const router = createBrowserRouter([
  { path: "/", element: <Landpage /> },
  { path: "studentauth", element: <StudentLogInPage /> },
  { path: "tutorLogInAuth", element: <TutorLoginPage /> },
  { path: "tutorCreateAuth", element: <TutorCreateAccount /> },
  { path: "studentClassAccess", element: <ClassAccess /> },
  { path: "classCodeGenarator", element: <ClassCodeGenarator /> },
  { path: "studentDashBoard", element: <StudentDashBoard /> },
  { path: "webcodingpage", element: <WebCoding /> },
  { path: "scratch", element: <Scratch /> },
  { path: "html", element: <HTML /> },
  { path: "ExamRoom", element: <ExamRoom /> },
  { path: "webtopics", element: <WebTopics /> },
  { path: "schoolAuth", element: <SchoolAuth /> },
  { path: "schoolAuth", element: <SchoolAuth /> },
  { path: "tutorDashBoard", element: <TutorDashboard /> },
  { path: "adminDashbord", element: <AdminDashbord /> },
  { path: "schoolsPage", element: <SchoolsPage /> },
  { path: "dashboard", element: <Dashboard /> },
  { path: "/schools/:schoolId/classes", element: <ClassesPage /> },
  {
    path: "/schools/:schoolId/classes/:classId/students",
    element: <StudentManagement />,
  },
  { path: "coursePage", element: <AddCoursePage /> },
  { path: "/courses/:courseId/topics", element: <TopicsPage /> },
]);

function App() {
  return (
    <>
      <div className="">
        <StrictMode>
          <RouterProvider router={router} />
          <FloatingShape />
        </StrictMode>
      </div>
    </>
  );
}

export default App;
