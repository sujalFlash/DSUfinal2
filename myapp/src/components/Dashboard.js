import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/'); // Redirect to login after logout
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="mdashboard">
        <div className="image-management-container">
          <h2 >Image Management</h2>
          <div className="action-buttons">
            <Link to="/image-management/augmentation" className="btn">Image Augmentation</Link>
            <Link to="/image-management/processing" className="btn">Image Processing</Link>
            <Link to="/breast-cancer-detection" className="btn">BreaseCancer Detection</Link>
          </div>
        </div>

        <div className="staff-management-container">
          <h2>Staff Management</h2>
          <div className="action-buttons">
            <Link to="/create-user" className="btn">Create User</Link>
            <Link to="/view-doctor" className="btn">View Doctor</Link>
            <Link to="/view-nurse" className="btn">View Nurse</Link>
            <Link to="/view-receptionists" className="btn">View Receptionist</Link>
            <Link to="/view-cleaners" className="btn">View Cleaner</Link>
            <Link to="/create-department" className="btn">Create Department</Link>
            <Link to="/view-department" className='btn'>View Department</Link>
          </div>
        </div>

        <div className="patient-management-container">
          <h2>Patient Management</h2>
          <div className="action-buttons">
            <Link to="/add-disease" className="btn">Add Disease</Link>
            <Link to="/disease-history" className="btn">View Disease History</Link>
          </div>
        </div>


        <div className="medicine-management-container">
          <h2>Medicine Management</h2>
          <div className="action-buttons">
            <Link to="/view-medicines" className="btn">View Medicines</Link>
            <Link to="/source-medicine" className="btn">Source Medicine</Link>
          </div>
        </div>


      </div>
    </div>
  );
};

export default Dashboard;
