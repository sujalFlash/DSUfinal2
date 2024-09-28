import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteCleaner = () => {
  const [cleanerId, setCleanerId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_cleaner/${cleanerId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete cleaner');
      }

      alert('Cleaner deleted successfully!');
      navigate('/view-cleaners'); // Navigate back to the cleaner list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delete-cleaner-container">
      <h2>Delete Cleaner</h2>
      <input
        type="text"
        placeholder="Enter Cleaner ID"
        value={cleanerId}
        onChange={(e) => setCleanerId(e.target.value)}
      />
      <button onClick={handleDelete} className="btn">Delete Cleaner</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteCleaner;
