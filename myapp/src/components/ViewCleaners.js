import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ViewCleaners.css'; // Import the CSS file

Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewCleaners = () => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCleaner, setEditingCleaner] = useState(null);
  const [updatedCleaner, setUpdatedCleaner] = useState({});

  useEffect(() => {
    const fetchCleaners = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_cleaners/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCleaners(data);
      } catch (error) {
        console.error('Error fetching cleaners:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCleaners();
  }, []);

  const handleDelete = async (cleanerId) => {
    if (!window.confirm('Are you sure you want to delete this cleaner?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_cleaner/${cleanerId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete cleaner');
      }

      // Remove the cleaner from the UI
      setCleaners((prevCleaners) => prevCleaners.filter((cleaner) => cleaner.id !== cleanerId));
      alert('Cleaner deleted successfully!');
    } catch (error) {
      console.error('Error deleting cleaner:', error);
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingCleaner) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cleaner_update/${editingCleaner.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedCleaner),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cleaner');
      }

      // Update the cleaner in the UI
      setCleaners((prevCleaners) =>
        prevCleaners.map((cleaner) =>
          cleaner.id === editingCleaner.id ? { ...cleaner, ...updatedCleaner } : cleaner
        )
      );
      alert('Cleaner updated successfully!');
      setEditingCleaner(null);
      setUpdatedCleaner({});
    } catch (error) {
      console.error('Error updating cleaner:', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCleaner({
      ...updatedCleaner,
      [name]: name === 'is_in_hospital' || name === 'on_duty' ? value === 'true' : value, // Ensure boolean values are properly handled
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="view-cleaners-container">
      <h2>Cleaners List</h2>
      {cleaners.length > 0 ? (
        <ul className="cleaners-list">
          {cleaners.map((cleaner) => (
            <li key={cleaner.id} className="cleaner-item">
              <h3>{cleaner.name || 'N/A'}</h3>
              <p><strong>ID:</strong> {cleaner.id}</p>
              <p><strong>Department Name:</strong> {cleaner.departments && cleaner.departments[0]?.name || 'N/A'}</p>
              <p><strong>Department Description:</strong> {cleaner.departments && cleaner.departments[0]?.description || 'N/A'}</p>
              <p><strong>Department Hospital:</strong> {cleaner.departments && cleaner.departments[0]?.hospital || 'N/A'}</p>
              <p><strong>Shift:</strong> {cleaner.shift || 'N/A'}</p>
              <p><strong>Status:</strong> {cleaner.status || 'N/A'}</p>
              <p><strong>Area Assigned:</strong> {cleaner.area_assigned || 'N/A'}</p>
              <p><strong>In Hospital:</strong> {cleaner.is_in_hospital ? 'Yes' : 'No'}</p>
              <p><strong>On Duty:</strong> {cleaner.on_duty ? 'Yes' : 'No'}</p>
              <div className="cleaner-actions">
              <button onClick={() => handleDelete(cleaner.id)} className="button-delete">
                  Delete
                </button>
                <button onClick={() => { setEditingCleaner(cleaner); setUpdatedCleaner(cleaner); }} className="button-update">
                  Update
                </button>
          
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cleaners available.</p>
      )}

      {/* Modal for updating cleaner details */}
      <Modal
        isOpen={!!editingCleaner}
        onRequestClose={() => setEditingCleaner(null)}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Update Cleaner</h2>
        <label>
          Area Assigned:
          <input
            type="text"
            name="area_assigned"
            value={updatedCleaner.area_assigned || ''}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Shift:
          <select
            name="shift"
            value={updatedCleaner.shift || ''}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Rotating">Rotating</option>
          </select>
        </label>
        <label>
          Status:
          <select
            name="status"
            value={updatedCleaner.status || ''}
            onChange={handleChange}
            required
          >
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
            value={updatedCleaner.is_in_hospital}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <label>
          On Duty:
          <select
            name="on_duty"
            value={updatedCleaner.on_duty}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <button onClick={handleUpdate} className="save-btn">
          Save Changes
        </button>
        <button onClick={() => setEditingCleaner(null)} className="cancel-btn">
          Cancel
        </button>
        {error && <p className="error">{error}</p>}
      </Modal>
    </div>
  );
};

export default ViewCleaners;
