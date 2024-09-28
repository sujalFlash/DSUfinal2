import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeleteDoctor = () => {
  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_doctor/${doctorId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      alert('Doctor deleted successfully!');
      navigate('/view-doctor'); // Navigate back to the doctor list after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="delete-doctor-container">
      <h2>Delete Doctor</h2>
      <input
        type="text"
        placeholder="Enter Doctor ID"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
      />
      <button onClick={handleDelete} className="btn">Delete Doctor</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default DeleteDoctor;
