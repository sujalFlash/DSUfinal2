import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleCreateUser = (e, role) => {
    e.preventDefault();

    fetch('http://127.0.0.1:8000/api/create_customUser/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username: username,
        password: password,
        role: role,
      }),
    })
      .then(response => response.json())
      .then(data => {
        const userId = data.id;
        if (userId) {
          localStorage.setItem('newUserId', userId);
          console.log('User ID stored:', userId);
          alert('User Created Successfully');
        } else {
          alert(`${role.charAt(0).toUpperCase() + role.slice(1)} created successfully!`);
        }
      })
      .catch(error => {
        console.error(`Error creating ${role}:`, error);
        alert(`Error creating ${role}. Please try again.`);
      });
  };

  const handleUser = (e, role) => {
    if (role === 'doctor') navigate('../create-doctor');
    else if (role === 'nurse') navigate('../create-nurse');
    else if (role === 'receptionist') navigate('../create-receptionist');
    else if (role === 'cleaner') navigate('../create-cleaner');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      gap: '30px' // Gap between the two containers
    }}>
      <div
        style={containerStyle}
      >
        <style>
          {`
            ::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', color: '#1b1b27' }}>
          Create New User
        </h1>

        <form onSubmit={(e) => handleCreateUser(e, 'user')} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '16px', color: '#1b1b27' }}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <label style={{ fontSize: '16px', color: '#1b1b27' }}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            style={{ ...buttonStyle, width: '100%' }} // Set width to 100% for full width
          >
            Create User
          </button>
        </form>
      </div>

      {/* Role Buttons Container */}
   
      <div style={containerStyle}>
        <h2 style={{ fontSize: '20px', marginBottom: '10px', color: '#1b1b27', textAlign: 'center' }}>
          Create with Specific Roles
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={(e) => handleUser(e, 'doctor')} style={buttonStyle}>
            Create Doctor
          </button>
          <button onClick={(e) => handleUser(e, 'nurse')} style={buttonStyle}>
            Create Nurse
          </button>
          <button onClick={(e) => handleUser(e, 'receptionist')} style={buttonStyle}>
            Create Receptionist
          </button>
          <button onClick={(e) => handleUser(e, 'cleaner')} style={buttonStyle}>
            Create Cleaner
          </button>
        </div>
      </div>

    </div>
  );
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#1b1b27',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s ease',
  width: '100%', // Set width to 100% for role buttons
  textAlign: 'center',
};

const containerStyle={
  maxWidth: '600px',
          padding: '20px',
          borderRadius: '20px',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: '#f9f9f9',
}
export default CreateUser;
