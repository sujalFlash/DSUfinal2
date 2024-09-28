import React, { useEffect, useState } from 'react';
import './SourceMedicine.css'; // Import the CSS file

const SourceMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [quantities, setQuantities] = useState({}); // State to track quantity input

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/medicine_from_nearbyhospital/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const handleRequest = async (medicine) => {
    const requestedQuantity = quantities[medicine.hospital] || 1; // Default to 1 if no quantity is entered

    const requestData = {
      brand_name: medicine.brand_name,
      chemical_name: medicine.chemical_name,
      quantity_needed: requestedQuantity.toString(), // Convert to string
      target_hospital: medicine.hospital, // Send the hospital ID as target_hospital
    };
    console.log(requestData);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/medicine_from_nearbyhospital/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert(`Request sent successfully for ${requestData.brand_name}.`);
      } else {
        alert('Failed to send the request.');
      }
    } catch (error) {
      console.error('Error while sending request:', error);
      alert('Error sending request.');
    }
  };

  const handleQuantityChange = (hospitalId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [hospitalId]: quantity, // Update the quantity for the corresponding hospital
    }));
  };

  // Filter medicines based on the chemical name
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.chemical_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className='source-medicine-container'>
      <h1 className='stitle'>Medicines from Nearby Hospitals</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search by chemical name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredMedicines.length === 0 ? (
        <p className='no-medicines'>No medicines available matching the search criteria.</p>
      ) : (
        <table className='medicine-table'>
          <thead>
            <tr>
              <th className='table-header'>Hospital ID</th>
              <th className='table-header'>Brand Name</th>
              <th className='table-header'>Hospital</th>
              <th className='table-header'>Chemical Name</th>
              <th className='table-header'>Manufacturer</th>
              <th className='table-header'>Manufacturing Date</th>
              <th className='table-header'>Expiry Date</th>
              <th className='table-header'>Is Expired</th>
              <th className='table-header'>Quantity Needed</th> {/* New column for input */}
              <th className='table-header'>Request</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine.id} className='medicine-row'>
                <td className='table-cell'>{medicine.hospital}</td> {/* Hospital ID */}
                <td className='table-cell'>{medicine.brand_name}</td>
                <td className='table-cell'>{medicine.hospital}</td>
                <td className='table-cell'>{medicine.chemical_name}</td>
                <td className='table-cell'>{medicine.manufacturer_company_name}</td>
                <td className='table-cell'>{medicine.manufacturing_date}</td>
                <td className='table-cell'>{medicine.expiry_date}</td>
                <td className='table-cell'>{medicine.is_expired ? 'Yes' : 'No'}</td>

                {/* Quantity Input Field */}
                <td className='table-cell'>
                  <input
                    type="number"
                    className='quantity-input'
                    min="1"
                    value={quantities[medicine.hospital] || ''} // Track using hospital ID
                    onChange={(e) => handleQuantityChange(medicine.hospital, e.target.value)}
                    placeholder="Enter"
                  />
                </td>

                <td className='table-cell'>
                  <button
                    className='request-button'
                    onClick={() => handleRequest(medicine)}
                  >
                    Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SourceMedicine;
