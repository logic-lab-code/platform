import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './class.css';

const ClassesPage = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({ 
    name: '', 
    level: 'Primary' // Default value

  });
  const [school, setSchool] = useState(null);

  // Fetch school and its classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Single API call to get school with embedded classes
        const response = await fetch(`http://localhost:3001/cobotKidsKenya/schools/${schoolId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch school data');
        }

        const schoolData = await response.json();
        setSchool(schoolData);
        setClasses(schoolData.classes || []);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [schoolId]);
const handleAddClass = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  
  try {
    const response = await axios.post(
      `http://localhost:3001/cobotKidsKenya/schools/${schoolId}/classes`,
      {
        name: newClass.name.trim(),
        level: newClass.level
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout
      }
    );

    if (response.data.success) {
      setClasses([...classes, response.data.data]);
      setNewClass({ name: '', level: 'Primary' });
      setShowAddForm(false);
    } else {
      throw new Error(response.data.details || 'Failed to add class');
    }
    
  } catch (err) {
    let errorMessage = 'Failed to add class';
    
    if (err.response) {
      // The request was made and the server responded with a status code
      errorMessage = err.response.data?.details || 
                    err.response.data?.error || 
                    err.response.statusText;
      
      console.error('Server responded with:', {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      });
    } else if (err.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server';
      console.error('No response received:', err.request);
    } else {
      // Something happened in setting up the request
      errorMessage = err.message;
      console.error('Request setup error:', err.message);
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/cobotKidsKenya/schools/${schoolId}/classes/${classId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete class');
      }

      // Refresh the classes list
      const updatedResponse = await fetch(`http://localhost:3001/cobotKidsKenya/schools/${schoolId}`);
      const updatedSchool = await updatedResponse.json();
      setClasses(updatedSchool.classes || []);
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading classes data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="classes-container">
      <div className="classes-header">
        <h1>Classes in {school?.name}</h1>
        <div className="header-actions">
          <button 
            onClick={() => navigate('/schools')}
            className="back-button"
          >
            Back to Schools
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="add-button"
            disabled={loading}
          >
            Add New Class
          </button>
        </div>
      </div>

      <div className="classes-table-container">
        {classes.length > 0 ? (
          <table className="classes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Level</th>
                <th>Students</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id}>
                  <td>{cls.name}</td>
                  <td>{cls.level}</td>
                  <td>{cls.students?.length || 0}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => navigate(`/schools/${schoolId}/classes/${cls._id}/edit`)}
                      className="edit-button"
                      disabled={loading}
                    >
                      Edit
                    </button>
                     <Link 
                  to={`/schools/${schoolId}/classes/${cls._id}/students`}
                  className="view-students-btn"
                >
                  View Students
                </Link>
                    <button 
                      onClick={() => handleDelete(cls._id)}
                      className="delete-button"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-classes-message">
            <p>No classes found for this school.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="add-button"
            >
              Add First Class
            </button>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Class to {school?.name}</h2>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                className="close-button"
              >
                &times;
              </button>
            </div>
            
            {error && <p className="form-error">{error}</p>}
            
            <form onSubmit={handleAddClass}>
              <div className="form-group">
                <label htmlFor="className">Class Name</label>
                <input
                  id="className"
                  type="text"
                  value={newClass.name}
                  onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="classLevel">Level</label>
                <select
                  id="classLevel"
                  value={newClass.level}
                  onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                  required
                  disabled={loading}
                >
                  <option value="Kindergarten">Kindergarten</option>
                  <option value="Primary">Primary</option>
                  <option value="Secondary">Secondary</option>
                  <option value="High School">High School</option>
                </select>
              </div>
              
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setError(null);
                  }}
                  className="cancel-button"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;