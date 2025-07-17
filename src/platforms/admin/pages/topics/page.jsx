import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3001/cobotKidsKenya/courses';

export default function CourseTopicsPage() {
  // State
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [topics, setTopics] = useState([]);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [loading, setLoading] = useState({
    courses: false,
    topics: false,
    addTopic: false
  });
  const [error, setError] = useState({
    courses: null,
    topics: null,
    addTopic: null
  });

  // Fetch all courses
  useEffect(() => {
    setLoading(prev => ({ ...prev, courses: true }));
    setError(prev => ({ ...prev, courses: null }));
    
    axios.get(API_BASE)
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch courses:", err);
        setError(prev => ({ ...prev, courses: err.message }));
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, courses: false }));
      });
  }, []);

  // Fetch topics when course is selected
 // In your CourseTopicsPage component:

// Fetch topics for selected course
useEffect(() => {
  if (!selectedCourseId) {
    setTopics([]);
    return;
  }

  axios.get(`${API_BASE}/${selectedCourseId}`) // Changed from /topics
    .then(res => {
      // Assuming topics are stored directly in the course object
      setTopics(res.data.topics || []);
    })
    .catch(err => {
      console.error("Failed to fetch course:", err);
      setError(prev => ({ ...prev, topics: err.message }));
    });
}, [selectedCourseId]);


  // Add a new topic
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;

    setLoading(prev => ({ ...prev, addTopic: true }));
    setError(prev => ({ ...prev, addTopic: null }));

    axios.post(`${API_BASE}/${selectedCourseId}/topics`, { name: newTopicName })
      .then(() => {
        setNewTopicName('');
        setIsAddTopicModalOpen(false);
        // Re-fetch topics
        return axios.get(`${API_BASE}/${selectedCourseId}/topics`);
      })
      .then(res => {
        // Same structure as above
        setTopics(res.data || []);
        // setTopics(res.data?.topics || []);
      })
      .catch(err => {
        console.error("Failed to add topic:", err);
        setError(prev => ({ ...prev, addTopic: err.message }));
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, addTopic: false }));
      });
  };

  // Get current course name
  const selectedCourseName = courses.find(c => c._id === selectedCourseId)?.courseName || '';

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Topics</h1>

      {/* Course Dropdown */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="p-2 border rounded flex-1"
          disabled={loading.courses}
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        {/* Add Topic Button */}
        {selectedCourseId && (
          <button
            onClick={() => setIsAddTopicModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading.topics}
          >
            {loading.topics ? 'Loading...' : 'Add Topic'}
          </button>
        )}
      </div>

      {/* Error Messages */}
      {error.courses && (
        <p className="text-red-500 mb-4">Error loading courses: {error.courses}</p>
      )}
      {error.topics && (
        <p className="text-red-500 mb-4">Error loading topics: {error.topics}</p>
      )}

      {/* Topics List */}
      {selectedCourseId && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3">
            Topics in {selectedCourseName}
          </h2>
          
          {loading.topics ? (
            <p className="text-gray-500">Loading topics...</p>
          ) : error.topics ? (
            <p className="text-red-500">Failed to load topics</p>
          ) : topics.length === 0 ? (
            <p className="text-gray-500">No topics yet. Click "Add Topic" to create one.</p>
          ) : (
            <ul className="space-y-2">
              {topics.map((topic, index) => (
                <li key={topic._id || index} className="p-3 bg-gray-50 border rounded">
                  {topic.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Topic</h2>
              <button 
                onClick={() => setIsAddTopicModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading.addTopic}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddTopic}>
              <input
                type="text"
                placeholder="Topic Name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                required
                autoFocus
                disabled={loading.addTopic}
              />
              
              {error.addTopic && (
                <p className="text-red-500 mb-4">Error: {error.addTopic}</p>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                  disabled={loading.addTopic}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  disabled={loading.addTopic}
                >
                  {loading.addTopic ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}