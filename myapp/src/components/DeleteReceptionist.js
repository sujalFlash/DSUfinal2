import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteReceptionist = () => {
  const [receptionistId, setReceptionistId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_reception_staff/${receptionistId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete receptionist');
      }

      alert('Receptionist deleted successfully!');
      navigate('/view-receptionist'); // Navigate back to the receptionist list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delete-receptionist-container">
      <h2>Delete Receptionist</h2>
      <input
        type="text"
        placeholder="Enter Receptionist ID"
        value={receptionistId}
        onChange={(e) => setReceptionistId(e.target.value)}
      />
      <button onClick={handleDelete} className="btn">Delete Receptionist</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteReceptionist;
