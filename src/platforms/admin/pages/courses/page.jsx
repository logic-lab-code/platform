import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddCourse.css';
import { Link } from 'react-router-dom';

const AddCoursePage = () => {
  const [formData, setFormData] = useState({
    courseName: '',
    code: '',
    status: 'locked',
    courseIcon: '',
    courseLink: ''
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch existing courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/cobotKidsKenya/courses');
      // Sort courses: completed -> enrolled -> locked
      const sortedCourses = response.data.sort((a, b) => {
        const statusOrder = { completed: 0, enrolled: 1, locked: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
      setCourses(sortedCourses);
    } catch (err) {
      setError('Failed to fetch courses');
      console.error(err);
    }
  };

  // Initial fetch and set up real-time updates
  useEffect(() => {
    fetchCourses();
    
    // Set up polling for real-time updates (every 5 seconds)
    const intervalId = setInterval(fetchCourses, 5000);
    
    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const courseData = {
        courseName: formData.courseName.trim(),
        code: formData.code.trim().toUpperCase(),
        status: formData.status,
        courseIcon: formData.courseIcon.trim(),
        courseLink: formData.courseLink.trim()
      };

      let response;
      if (editingCourse) {
        // Update existing course
        response = await axios.put(
          `http://localhost:3001/cobotKidsKenya/courses/${editingCourse}`,
          courseData
        );
        setCourses(courses.map(c => c._id === editingCourse ? response.data : c));
        setSuccess('Course updated successfully!');
      } else {
        // Add new course
        response = await axios.post(
          'http://localhost:3001/cobotKidsKenya/courses',
          courseData
        );
        setCourses([...courses, response.data]);
        setSuccess('Course added successfully!');
      }

      // Reset form
      setFormData({ 
        courseName: '', 
        code: '', 
        status: 'locked', 
        courseIcon: '', 
        courseLink: '' 
      });
      setShowForm(false);
      setEditingCourse(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error:', error.response?.data);
      setError(error.response?.data?.error || 
        (editingCourse ? 'Failed to update course' : 'Failed to add course'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setFormData({
      courseName: course.courseName,
      code: course.code,
      status: course.status,
      courseIcon: course.courseIcon,
      courseLink: course.courseLink || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/cobotKidsKenya/courses/${courseId}`);
      setCourses(courses.filter(c => c._id !== courseId));
      setSuccess('Course deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete course');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourse(null);
    setFormData({ 
      courseName: '', 
      code: '', 
      status: 'locked', 
      courseIcon: '', 
      courseLink: '' 
    });
    setError('');
  };

  const handleViewCourse = (courseLink) => {
    if (courseLink) {
      window.open(courseLink, '_blank');
    }
  };

  const handleViewTopics = (courseId) => {
    // Implement navigation to topics page or show topics modal
    console.log('View topics for course:', courseId);
    // You can implement this based on your routing
    // For example: history.push(`/courses/${courseId}/topics`);
  };

  return (
    <div className="course-management">
      <h1>Course Management</h1>
      
      {/* Success Notification */}
      {success && (
        <div className="success-notification">
          {success}
        </div>
      )}
      
      {/* Add Course Button */}
      <button 
        className="add-course-btn"
        onClick={() => setShowForm(true)}
      >
        Add New Course
      </button>

      {/* Overlay Form */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
              <button 
                className="close-btn"
                onClick={handleCancel}
              >
                ×
              </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                  placeholder="MATH101"
                />
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="locked">Locked</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Course Icon URL *</label>
                <input
                  type="text"
                  name="courseIcon"
                  value={formData.courseIcon}
                  onChange={(e) => setFormData({...formData, courseIcon: e.target.value})}
                  required
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <div className="form-group">
                <label>Course Link</label>
                <input
                  type="text"
                  name="courseLink"
                  value={formData.courseLink}
                  onChange={(e) => setFormData({...formData, courseLink: e.target.value})}
                  placeholder="https://example.com/course"
                />
              </div>
              <div className="form-buttons">
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading 
                    ? (editingCourse ? 'Updating...' : 'Adding...') 
                    : (editingCourse ? 'Update Course' : 'Add Course')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="courses-table">
        <h2>Existing Courses</h2>
        {courses.length === 0 ? (
          <p>No courses found. Add your first course!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Code</th>
                <th>Status</th>
                <th>Icon</th>
                <th>Link</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseName}</td>
                  <td>{course.code}</td>
                  <td>
                    <span className={`status-badge ${course.status}`}>
                      {course.status}
                    </span>
                  </td>
                  <td>
                    {course.courseIcon && (
                      <img 
                        src={course.courseIcon} 
                        alt={course.courseName} 
                        className="course-icon"
                      />
                    )}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleViewCourse(course.courseLink)}
                      className="view-btn"
                      disabled={!course.courseLink}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                       <Link 
                  to={`/courses/${course._id}/topics`}
                  className="topics-btn"
                >
                  View Topics
                </Link>
                      <button 
                        onClick={() => handleEdit(course)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(course._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AddCoursePage;