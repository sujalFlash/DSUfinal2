import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ViewNurse.css';

// Set the root element for accessibility
Modal.setAppElement('#root');

const ViewNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNurse, setEditingNurse] = useState(null);
  const [updatedNurse, setUpdatedNurse] = useState({});

  // Fetch nurses data on component mount
  useEffect(() => {
    const fetchNurses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/view_nurses/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Nurses data:', data); // Log the API response
        setNurses(data);
      } catch (error) {
        console.error('Error fetching nurses:', error);
        setError(error.message || 'Error fetching nurses');
      } finally {
        setLoading(false);
      }
    };

    fetchNurses();
  }, []);

  // Handle nurse deletion
  const handleDelete = async (nurseId) => {
    if (!window.confirm('Are you sure you want to delete this nurse?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_nurse/${nurseId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete nurse');
      }

      // Remove the nurse from the UI
      setNurses((prevNurses) => prevNurses.filter((nurse) => nurse.id !== nurseId));
      alert('Nurse deleted successfully!');
    } catch (error) {
      setError(error.message || 'Error deleting nurse');
    }
  };

  // Handle nurse update
  const handleUpdate = async () => {
    if (!editingNurse) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/nurse_update/${editingNurse.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedNurse),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to update nurse';
        throw new Error(errorMessage);
      }

      // Update the nurse in the UI
      setNurses((prevNurses) =>
        prevNurses.map((nurse) =>
          nurse.id === editingNurse.id ? { ...nurse, ...updatedNurse } : nurse
        )
      );
      alert('Nurse updated successfully!');
      setEditingNurse(null);
      setUpdatedNurse({});
    } catch (error) {
      setError(error.message || 'Error updating nurse');
    }
  };

  // Handle input changes in the update modal
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle boolean fields
    let parsedValue = value;
    if (name === 'is_in_hospital' || name === 'on_duty') {
      parsedValue = value === 'true';
    }

    setUpdatedNurse({
      ...updatedNurse,
      [name]: parsedValue,
    });
  };

  // Render loading state
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="view-nurses-container">
      <h2>Nurses List</h2>
      {nurses.length > 0 ? (
        <ul className="nurse-list">
          {nurses.map((nurse) => (
            <li key={nurse.id} className="nurse-item">
              <h3>Nurse ID: {nurse.id}</h3>
              <p><strong>Employee ID:</strong> {nurse.employee_id || 'N/A'}</p>
              <p><strong>Name:</strong> {nurse.name || 'N/A'}</p>
              <p><strong>Shift: </strong>{nurse.shift || 'N/A'}</p>
              <p><strong>Status: </strong>{nurse.status || 'N/A'}</p>
              <p><strong>Is In Hospital:</strong> {nurse.is_in_hospital ? 'Yes' : 'No'}</p>
              <p><strong>On Duty:</strong> {nurse.on_duty ? 'Yes' : 'No'}</p>
              <p>
               <strong>Departments:</strong>{' '}
                {nurse.departments && nurse.departments.length > 0
                  ? nurse.departments.map((dept) => dept.name).join(', ')
                  : 'N/A'}
              </p>
              <button className="button-delete" onClick={() => handleDelete(nurse.id)}>
                Delete
              </button>
              <button
                className="button-update"
                onClick={() => {
                  setEditingNurse(nurse);
                  setUpdatedNurse(nurse);
                }}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No nurses available.</p>
      )}

      {/* Modal for updating nurse details */}
      <Modal
        isOpen={!!editingNurse}
        onRequestClose={() => setEditingNurse(null)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Update Nurse</h2>
        <form>
          <label>
            Shift:
            <select name="shift" value={updatedNurse.shift || ''} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Rotating">Rotating</option>
            </select>
          </label>

          <label>
            Status:
            <select name="status" value={updatedNurse.status || ''} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="free">Free</option>
              <option value="working">Working</option>
              <option value="on_leave">On Leave</option>
            </select>
          </label>

          <label>
            In Hospital:
            <select
              name="is_in_hospital"
              value={updatedNurse.is_in_hospital !== undefined ? updatedNurse.is_in_hospital.toString() : ''}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <label>
            On Duty:
            <select
              name="on_duty"
              value={updatedNurse.on_duty !== undefined ? updatedNurse.on_duty.toString() : ''}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </label>

          <div className="modal-buttons">
            <button type="button" className="save-button" onClick={handleUpdate}>
              Save 
            </button>
            <button type="button" className="cancel-button" onClick={() => setEditingNurse(null)}>
              Cancel
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </Modal>
    </div>
  );
};

export default ViewNurse;
