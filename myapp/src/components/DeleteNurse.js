import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteNurse = () => {
  const [nurseId, setNurseId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_nurse/${nurseId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete nurse');
      }

      alert('Nurse deleted successfully!');
      navigate('/view-nurse'); // Navigate back to the nurse list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delete-nurse-container">
      <h2>Delete Nurse</h2>
      <input
        type="text"
        placeholder="Enter Nurse ID"
        value={nurseId}
        onChange={(e) => setNurseId(e.target.value)}
      />
      <button onClick={handleDelete} className="btn">Delete Nurse</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteNurse;
