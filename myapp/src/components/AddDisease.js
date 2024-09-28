import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddDisease = () => {
  const [diseaseName, setDiseaseName] = useState('');
  const [facilities, setFacilities] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleAddDisease = (e) => {
    e.preventDefault();

    const diseaseData = {
      name: diseaseName,
      facilities,
    };

    console.log('Disease data being sent:', diseaseData);

    fetch('http://127.0.0.1:8000/api/add_disease/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(diseaseData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((errData) => {
            console.error('Error details:', errData);
            throw new Error(`Error ${response.status}: ${errData.message || response.statusText}`);
          });
        }
      })
      .then((data) => {
        alert('Disease added successfully');
        setDiseaseName('');
        setFacilities('');
        navigate('/hospitals');
      })
      .catch((error) => {
        console.error('Error adding disease:', error.message);
        alert('There was an error adding the disease. Please try again.');
      });
  };

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '50px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#1b1b27' }}>
        Add a New Disease
      </h2>
      <form onSubmit={handleAddDisease}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="diseaseName" style={{ fontSize: '16px', color: '#1b1b27' }}>Disease Name</label>
          <input
            type="text"
            id="diseaseName"
            value={diseaseName}
            onChange={(e) => setDiseaseName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #1b1b27',
              marginTop: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="facilities" style={{ fontSize: '16px', color: '#1b1b27' }}>Facilities</label>
          <input
            type="text"
            id="facilities"
            value={facilities}
            onChange={(e) => setFacilities(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #1b1b27',
              marginTop: '5px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            backgroundColor: '#1b1b27',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
            width: '40%', // Full width for the button
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          Add Disease
        </button>
      </form>
    </div>
  );
};

export default AddDisease;
