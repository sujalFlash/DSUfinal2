import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateNurse = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Store selected department ID
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('newUserId'); // Get user ID from localStorage

  useEffect(() => {
    // Fetch department data for the dropdown
    fetch('http://127.0.0.1:8000/api/view_department/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
      })
      .catch(error => console.error('Error fetching departments:', error));
  }, [accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparing the nurse data to be sent in the API request
    const nurseData = {
      user: userId, // Ensure user ID is included
      employee_id: employeeId,
      name: name,
      specialization: specialization,
      departments: [parseInt(selectedDepartment)], // Wrap department ID in an array
      role: 'nurse', // Set the role to 'nurse'
    };

    try {
      // Sending the POST request to create a nurse
      const response = await fetch('http://127.0.0.1:8000/api/create_customUser/add_nurse/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(nurseData), // Send nurse data as JSON
      });

      // Check if the response is not successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from server:", errorData);
        const errorMessage = errorData.message || 'Failed to create nurse';
        throw new Error(errorMessage);
      }

      // Handle successful response
      alert('Nurse created successfully!');
      navigate('/view-nurse'); // Redirect after nurse creation
    } catch (err) {
      console.error('Error creating nurse:', err.message || err);
      alert(`Failed to create nurse: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Create Nurse</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
          style={inputStyle}
        />
        <select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          required
          style={selectStyle}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button type="submit" style={submitButtonStyle}>Create Nurse</button>
      </form>
    </div>
  );
};

const containerStyle = {
  maxWidth: '450px',
  margin: '0 auto',
  padding: '20px',
  borderRadius: '20px',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: '50px',
  backgroundColor:'#f9f9f9',

};

const headerStyle = {
  fontSize: '24px',
  marginBottom: '20px',
  textAlign: 'center',
  color: '#1b1b27',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #1b1b27',
  marginBottom: '15px',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #1b1b27',
  marginBottom: '15px',
};

const submitButtonStyle = {
  width: '100%',
  padding: '12px 20px',
  backgroundColor: '#1b1b27',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s ease',
};

export default CreateNurse;
