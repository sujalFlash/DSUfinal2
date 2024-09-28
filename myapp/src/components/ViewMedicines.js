import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewMedicines.css'; // Import CSS file

const ViewMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/medicine_view/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
        });
        setMedicines(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [accessToken]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div
    className="medicine-container"
    style={{
      height: '100vh',
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      position: 'relative', // Make sure this is relative
      paddingRight: '15px', // To account for scrollbar width
    }}
  >
      <h1 className="mtitle">Medicine List</h1>
      {medicines.length === 0 ? (
        <p className="no-medicines">No medicines available</p>
      ) : (
        <table className="medicine-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand Name</th>
              <th>Chemical Name</th>
              <th>Manufacturer</th>
              <th>Manufacturing Date</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td>{medicine.id}</td>
                <td>{medicine.brand_name}</td>
                <td>{medicine.chemical_name}</td>
                <td>{medicine.manufacturer_company_name}</td>
                <td>{medicine.manufacturing_date}</td>
                <td>{medicine.expiry_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewMedicine;
