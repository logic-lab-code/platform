import React, { useState, useEffect } from "react";
import "./StudentDashBoard.css";
import StudentProfile from "../components/profile/StudentProfile";
import ComingSoon from "../../../components/comingSoon/ComingSoon";
import Header from "../components/header/Header";


const StudentDashBoard= () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showExamModal, setShowExamModal] = useState(false);
  const [examCode, setExamCode] = useState("");

  const challenges = [
    { id: 1, title: "Build a Calculator", deadline: "2023-12-15", icon: "🧮" },
  ];

  const performanceData = {
    completed: 12,
    inProgress: 5,
    averageScore: 84,
  };

  const followers = [
    { id: 1, name: "Alex Johnson", avatar: "👨‍💻" },
    { id: 2, name: "Samira Khan", avatar: "👩‍🎓" },
    { id: 3, name: "Taylor Wong", avatar: "👨‍🔬" },
  ];

  // Fetch courses from backend when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/cobotKidsKenya/courses"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return (
      <div className="student-dashboard-container">
        <div className="loading-spinner">Loading courses...</div>
      </div>
    );
  }

  const handleExamSubmit = (e) => {
    e.preventDefault();
    // Validate and process exam code
    alert(`Entering exam room with code: ${examCode}`);
    setShowExamModal(false);
    setExamCode("");
  };

  if (error) {
    return (
      <div className="student-dashboard-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="student-dashboard-container">
      {/* Header */}
         <Header/>
       <StudentProfile />

      {/* Main Content */}
      <div className="student-dashboard-content">
        {/* Sidebar */}
       <aside className="student-sidebar">
          <nav>
            <button
              className={`student-sidebar-btn ${
                activeTab === "courses" ? "active" : ""
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <span className="icon"><i class="fa-solid fa-chalkboard-user"></i></span>
              <span className="icon-name">All Courses</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "challenges" ? "active" : ""
              }`}
              onClick={() => setActiveTab("challenges")}
            >
              <span className="icon"><i class="fa-solid fa-chalkboard"></i></span>
              <span className="icon-name">Challenges</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "performance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("performance")}
            >
              <span className="icon"><i class="fa-solid fa-graduation-cap"></i></span>
              <span className="icon-name">My Performance</span>
            </button>

            <button
              className={`student-sidebar-btn ${
                activeTab === "followers" ? "active" : ""
              }`}
              onClick={() => setActiveTab("followers")}
            >
              <span className="icon"><i class="fa-solid fa-people-group"></i></span>
              <span className="icon-name">Followers</span>
            </button>

            <button
              className="exam-room-btn"
              onClick={() => setShowExamModal(true)}
            >
              <span className="icon"><i class="fa-solid fa-door-open"></i></span>
              <span>Enter Exam Room</span>
            </button>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="main-panel">
          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="courses-grid">
              <h2 className="student-courses-title">
                <span class="typing-effect">My Courses</span>
              </h2>
              <div className="courses-list">
                {courses.map((course) => (
                  <div
                    key={course._id || course.id}
                    className="animated-course-card"
                    onClick={(e) => {
                      e.preventDefault();
                      if (course.courseLink) {
                        window.open(course.courseLink, "_blank");
                      }
                    }}
                  >
                    <div className="card-image-box">
                      <img
                        src={course.courseIcon}
                        alt={course.courseName}
                        className="card-image"
                      />
                      <div
                        className="card-progress"
                        style={{
                          width:
                            course.status === "completed"
                              ? "100%"
                              : course.status === "enrolled"
                              ? "50%"
                              : "0%",
                        }}
                      ></div>
                    </div>
                    <h3 className="card-title">{course.courseName}</h3>
                    <div className="card-badges">
                      <span
                        className={`badge status ${course.status.toLowerCase()}`}
                      >
                        {course.status}
                      </span>
                      <span className="badge code"> {course.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div className="challenges-section">
              <h2>Current Challenges</h2>
              <div className="challenges-list">
                {challenges.map((challenge) => (
                  // <div key={challenge.id} className="challenge-card">
                  //   <div className="challenge-icon">{challenge.icon}</div>
                  //   <div className="challenge-details">
                  //     <h3>{challenge.title}</h3>
                  //     <p>Deadline: {challenge.deadline}</p>
                  //   </div>
                  //   <button className="submit-btn">Submit Work</button>
                  // </div>
                  <ComingSoon />
                ))}
              </div>

              {/* <div className="post-challenge">
                <h3>Post a New Challenge</h3>
                <textarea placeholder="Describe your challenge..."></textarea>
                <button className="post-btn">Post Challenge</button>
              </div> */}
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === "performance" && (
            <div className="performance-section">
              <h2>My Performance</h2>
              {/* <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{performanceData.completed}</div>
                  <div className="stat-label">Courses Completed</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⌛</div>
                  <div className="stat-value">{performanceData.inProgress}</div>
                  <div className="stat-label">Courses in Progress</div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">
                    {performanceData.averageScore}%
                  </div>
                  <div className="stat-label">Average Score</div>
                </div>
              </div> */}

              {/* <div className="performance-graph"> */}
              {/* <h3>Progress Over Time</h3> */}
              {/* <div className="graph-placeholder"> */}
              {/* This would be replaced with an actual chart component */}
              {/* <p>📈 Performance graph visualization would appear here</p> */}
              {/* </div> */}
              {/* </div> */}
              <ComingSoon />
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === "followers" && (
            <div className="followers-section">
              <h2>My Followers</h2>
              {/* <div className="followers-list">
                {followers.map((follower) => (
                  <div key={follower.id} className="follower-card">
                    <div className="follower-avatar">{follower.avatar}</div>
                    <div className="follower-name">{follower.name}</div>
                    <button className="message-btn">Message</button>
                  </div>
                ))}
              </div> */}
              <ComingSoon />
            </div>
          )}
        </main>
      </div>

      {/* Exam Room Modal */}
      {showExamModal && (
        <div className="modal-overlay">
          <div className="exam-modal">
            {/* <h2>Enter Exam Room</h2>
            <p>Please enter the exam code provided by your instructor</p> */}

            <form onSubmit={handleExamSubmit}>
              {/* <input
                type="text"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value)}
                placeholder="Exam Code"
                required
              /> */}
              <ComingSoon />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowExamModal(false)}
                >
                  Cancel
                </button>
                {/* <button type="submit" className="submit-btn">
                  <Link to="/ExamRoom">Enter Exam</Link>
                </button> */}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashBoard;      