import React, { useState } from 'react';
import './CreateDepartment.css';

// Function to get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const CreateDepartment = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const departmentData = {
      name: name,
      description: description,
    };

    try {
      const accessToken = getAccessToken(); // Get the token from localStorage
      console.log(accessToken)

      const response = await fetch('http://127.0.0.1:8000/api/create-department/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Include access token in header
        },
        body: JSON.stringify(departmentData), // Send the form data in JSON format
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log('Department created successfully:', data);
        // Reset the form after successful submission
        setName('');
        setDescription('');
        alert('Department created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || 'Failed to create department'}`);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="create-department-container">
      <div className="dept">
        <h1 style={{color:'#1b1b27',marginBottom:'25px'}}>Create Department</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;
