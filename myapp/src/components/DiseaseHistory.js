import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

// Function to get access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

// Set up the modal root element (required for react-modal)
Modal.setAppElement('#root');

const DiseaseHistory = () => {
  const [diseaseHistory, setDiseaseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentSeverity, setCurrentSeverity] = useState('M'); // Default value
  const [currentId, setCurrentId] = useState(null);

  // Function to fetch disease history from API
  const fetchDiseaseHistory = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setError('Access token is missing');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/view_diesease_history/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiseaseHistory(data);
      } else {
        const errorData = await response.json();
        setError('Failed to fetch disease history: ' + errorData.detail);
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred while fetching disease history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseaseHistory();
  }, []); // Fetch data once when component mounts

  const openModal = (id, severity) => {
    setCurrentId(id);
    setCurrentSeverity(severity);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleUpdateSeverity = async () => {
    const accessToken = getAccessToken();
  
    if (!accessToken) {
      setError('Access token is missing');
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/disease-history/${currentId}/`, { // Ensure the endpoint is correct
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ severity: currentSeverity }), // Ensure server accepts this format
      });
  
      if (!response.ok) {
        const responseData = await response.json();
        console.error('Update error:', responseData); // Log the error for debugging
        setError('Failed to update severity: ' + (responseData.detail || responseData));
        return; // Exit if update fails
      }
  
      // Fetch the updated disease history
      await fetchDiseaseHistory();
      closeModal(); // Close the modal after successful update
    } catch (err) {
      console.error('Network error:', err);
      setError('An error occurred while updating severity');
    }
  };
  
  
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="disease-history-container" style={{ padding: '20px' }}>
      <h2 style={{ color: '#1b1b27', marginBottom: '30px' }}>Disease History</h2>
      {diseaseHistory.length > 0 ? (
        <table
          className="disease-history-table"
          style={{
            color: '#1b1b27',
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>ID</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Patient Name</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Disease</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Hospital</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Date Diagnosed</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Status</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Severity</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Admitted</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #1b1b27' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {diseaseHistory.map((history) => (
              <tr key={history.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.id}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.patient_name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.disease_name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.hospital_name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.date_diagnosed}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.status}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.severity}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>{history.is_admitted ? 'Yes' : 'No'}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => openModal(history.id, history.severity)}>Update Severity</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No disease history found.</p>
      )}

      {/* Modal for updating severity */}
      <Modal 
        isOpen={modalIsOpen} 
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '300px', // Set width to 200px
            height: '300px', // Set height to 200px
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for the overlay
          },
        }}
      >
        <h2 style={{color:'#1b1b27',marginBottom:'20px'}}>Update Severity</h2>
        <label>
          Severity:
          <select
            value={currentSeverity}
            onChange={(e) => setCurrentSeverity(e.target.value)}
          >
            <option value="M">M</option>
            <option value="MO">MO</option>
            <option value="S">S</option>
          </select>
        </label>
        <button onClick={handleUpdateSeverity}>Update</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default DiseaseHistory;
