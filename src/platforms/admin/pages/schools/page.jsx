import React, { useState, useEffect } from 'react';
import './Schools.css';
import { useNavigate } from 'react-router-dom';

const SchoolsPage = () => {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchool, setNewSchool] = useState({ 
    name: '', 
    code: '', 
    location: '' 
  });



// Inside your component
const navigate = useNavigate();

// In your table row


  // Fetch schools from backend
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('http://localhost:3001/cobotKidsKenya/schools');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch schools:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleAddSchool = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/cobotKidsKenya/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });

      if (!response.ok) {
        throw new Error('Failed to add school');
      }

      const addedSchool = await response.json();
      setSchools([...schools, addedSchool]);
      setNewSchool({ name: '', code: '', location: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/cobotKidsKenya/schools/${id}`, 
        { method: 'DELETE' }
      );

      if (!response.ok) {
        throw new Error('Failed to delete school');
      }

      setSchools(schools.filter(school => school._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading schools data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
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
    <div className="schools-container">
      <div className="schools-header">
        <h1>Schools Managdsement</h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="add-button"
        >
          Add New School
        </button>
      </div>

      <div className="schools-table-container">
          <table className="schools-table">
        <tbody>
          {schools.map((school) => (
            <tr 
              key={school._id} 
              onClick={() => navigate(`/schools/${school._id}/classes`)}
              style={{ cursor: 'pointer' }}
            >
              <td>{school._id}</td>
              <td>{school.name}</td>
              <td>{school.code}</td>
              <td>{school.location}</td>
              <td className="actions-cell">
                <button 
                  className="edit-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(school._id);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New School</h2>
            <form onSubmit={handleAddSchool}>
              <div className="form-group">
                <label>School Name</label>
                <input
                  type="text"
                  value={newSchool.name}
                  onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>School Code</label>
                <input
                  type="text"
                  value={newSchool.code}
                  onChange={(e) => setNewSchool({...newSchool, code: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newSchool.location}
                  onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-button"
                >
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsPage;