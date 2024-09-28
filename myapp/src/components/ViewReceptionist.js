import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ViewReceptionist.css';

Modal.setAppElement('#root');

const ViewReceptionist = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReceptionist, setEditingReceptionist] = useState(null);
  const [updatedReceptionist, setUpdatedReceptionist] = useState({});

  useEffect(() => {
    const fetchReceptionists = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_reception_staff/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReceptionists(data);
      } catch (error) {
        console.error('Error fetching receptionists:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceptionists();
  }, []);

  const handleDelete = async (receptionistId) => {
    if (!window.confirm('Are you sure you want to delete this receptionist?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_reception_staff/${receptionistId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete receptionist');
      }

      setReceptionists((prevReceptionists) => prevReceptionists.filter((receptionist) => receptionist.id !== receptionistId));
      alert('Receptionist deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingReceptionist) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/update_reception_staff/${editingReceptionist.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedReceptionist),
      });

      if (!response.ok) {
        throw new Error('Failed to update receptionist');
      }

      setReceptionists((prevReceptionists) =>
        prevReceptionists.map((receptionist) =>
          receptionist.id === editingReceptionist.id ? { ...receptionist, ...updatedReceptionist } : receptionist
        )
      );
      alert('Receptionist updated successfully!');
      setEditingReceptionist(null);
      setUpdatedReceptionist({});
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReceptionist({
      ...updatedReceptionist,
      [name]: name === 'is_in_hospital' || name === 'on_duty' ? value === 'true' : value,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  return (
    <div className="view-receptionists-container">
      <h2>Receptionists List</h2>
      {receptionists.length > 0 ? (
        <ul className="receptionist-list">
          {receptionists.map((receptionist) => (
            <li key={receptionist.id} className="receptionist-item">
              <h3>Receptionist ID: {receptionist.id}</h3>
              <p><strong>Name:</strong> {receptionist.name || 'N/A'}</p>
              <p><strong>Department:</strong> {receptionist.departments && receptionist.departments[0]?.name || 'N/A'}</p>
              <p><strong>Desk Assigned:</strong> {receptionist.desk_assigned || 'N/A'}</p>
              <p><strong>Shift:</strong> {receptionist.shift || 'N/A'}</p>
              <p><strong>Status:</strong> {receptionist.status || 'N/A'}</p>
              <p><strong>In Hospital: </strong>{receptionist.is_in_hospital ? 'Yes' : 'No'}</p>
              <p><strong>On Duty:</strong> {receptionist.on_duty ? 'Yes' : 'No'}</p>
              <button onClick={() => handleDelete(receptionist.id)} className="button-delete">
                Delete
              </button>
              <button
                onClick={() => {
                  setEditingReceptionist(receptionist);
                  setUpdatedReceptionist(receptionist);
                }}
                className="button-update"
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No receptionists available.</p>
      )}

      <Modal
        isOpen={!!editingReceptionist}
        onRequestClose={() => setEditingReceptionist(null)}
        className="modal-content"
      >
        <h2>Update Receptionist</h2>
        <label className="label-container">
          Shift:
          <select name="shift" value={updatedReceptionist.shift || ''} onChange={handleChange} className="select-field">
            <option value="">Select</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
            <option value="Rotating">Rotating</option>
          </select>
        </label>
        <label className="label-container">
          Status:
          <select name="status" value={updatedReceptionist.status || ''} onChange={handleChange} className="select-field">
            <option value="">Select</option>
            <option value="free">Free</option>
            <option value="working">Working</option>
            <option value="on_leave">On Leave</option>
          </select>
        </label>
        <label className="label-container">
          Desk Assigned:
          <input type="text" name="desk_assigned" value={updatedReceptionist.desk_assigned || ''} onChange={handleChange} className="input-field" />
        </label>
        <label className="label-container">
          In Hospital:
          <select name="is_in_hospital" value={updatedReceptionist.is_in_hospital} onChange={handleChange} className="select-field">
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <label className="label-container">
          On Duty:
          <select name="on_duty" value={updatedReceptionist.on_duty} onChange={handleChange} className="select-field">
            <option value="">Select</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
        </label>
        <button onClick={handleUpdate} className="save-button">
          Save Changes
        </button>
        <button onClick={() => setEditingReceptionist(null)} className="cancel-button">
          Cancel
        </button>
        {error && <p className="error">{error}</p>}
      </Modal>
    </div>
  );
};

export default ViewReceptionist;
