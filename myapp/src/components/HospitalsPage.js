import React, { useState, useEffect } from 'react';
import './HospitalsPage.css';

const HospitalsPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState({});
  const [departments, setDepartments] = useState({});
  const [managers, setManagers] = useState({});
  const [clickCounts, setClickCounts] = useState({});
  const accessToken = localStorage.getItem('accessToken'); // Retrieve access token from localStorage

  useEffect(() => {
    fetch('http://127.0.0.1:8000/hospitals/')
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching hospitals:', error);
        setLoading(false);
      });
  }, []);

  const viewFacilities = (hospitalId) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [hospitalId]: (prevCounts[hospitalId] || 0) + 1,
    }));

    if ((clickCounts[hospitalId] || 0) % 2 === 0) {
      fetch('http://127.0.0.1:8000/view_facilities/')
        .then((response) => response.json())
        .then((data) => {
          const hospitalFacilities = data.filter(
            (facility) => facility.hospital === hospitalId
          );
          setFacilities((prevFacilities) => ({
            ...prevFacilities,
            [hospitalId]:
              hospitalFacilities.length > 0 ? hospitalFacilities : null,
          }));
        })
        .catch((error) => {
          console.error('Error fetching facilities:', error);
        });
    } else {
      setFacilities((prevFacilities) => ({
        ...prevFacilities,
        [hospitalId]: undefined,
      }));
    }
  };

  const viewDepartments = (hospitalName) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [hospitalName]: (prevCounts[hospitalName] || 0) + 1,
    }));

    if ((clickCounts[hospitalName] || 0) % 2 === 0) {
      fetch('http://127.0.0.1:8000/departments/')
        .then((response) => response.json())
        .then((data) => {
          const hospitalDepartments = data
            .filter(
              (hospital) =>
                hospital.hospital.toLowerCase() === hospitalName.toLowerCase()
            )
            .flatMap((hospital) => hospital.departments);
          setDepartments((prevDepartments) => ({
            ...prevDepartments,
            [hospitalName]:
              hospitalDepartments.length > 0 ? hospitalDepartments : null,
          }));
        })
        .catch((error) => {
          console.error('Error fetching departments:', error);
        });
    } else {
      setDepartments((prevDepartments) => ({
        ...prevDepartments,
        [hospitalName]: undefined,
      }));
    }
  };

  const viewManagers = (hospitalId) => {
    setClickCounts((prevCounts) => ({
      ...prevCounts,
      [hospitalId]: (prevCounts[hospitalId] || 0) + 1,
    }));

    const fetchManagers = () => {
      return fetch('http://127.0.0.1:8000/api/view_managers/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    };

    if ((clickCounts[hospitalId] || 0) % 2 === 1) {
      fetchManagers()
        .then((response) => response.json())
        .then((data) => {
          setManagers((prevManagers) => ({
            ...prevManagers,
            [hospitalId]: Array.isArray(data) && data.length > 0 ? data : null,
          }));
        })
        .catch((error) => {
          console.error('Error fetching managers:', error);
        });
    } else {
      setManagers((prevManagers) => ({
        ...prevManagers,
        [hospitalId]: undefined,
      }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ overflowY: 'scroll', padding: '20px', height: '100vh' }}>
      <h1 className="hp-title">Hospital List</h1>
      <ul>
        {hospitals.map((hospital) => (
          <li key={hospital.id} className="hospital-item">
            <h2>{hospital.name}</h2>
            <p>Address: {hospital.address}</p>
            <p>Contact: {hospital.contact_number}</p>
            <p>Email: {hospital.email}</p>

            <button
              className="btn"
              onClick={() => viewFacilities(hospital.id)}
            >
              View Facilities
            </button>

            <button
              className="btn"
              onClick={() => viewDepartments(hospital.name)}
            >
              View Departments
            </button>

            <button
              className="btn"
              onClick={() => viewManagers(hospital.id)}
            >
              View Managers
            </button>

            {facilities[hospital.id] && (
              <div className="hospital-facilities">
                <h3>Facilities:</h3>
                <ul>
                  {facilities[hospital.id].map((facility) => (
                    <li key={facility.id}>
                      <strong>Disease:</strong> {facility.name}
                      <br />
                      <strong>Available Facilities:</strong> {facility.facilities}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {departments[hospital.name] && (
              <div className="hospital-departments">
                <h3>Departments:</h3>
                <ul>
                  {departments[hospital.name].map((department) => (
                    <li key={department.id}>
                      <strong>Department Name:</strong> {department.name}
                      <br />
                      <strong>Description:</strong> {department.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

             {managers[hospital.id] && (
              <div className="hospital-managers">
                <h3>All Managers:</h3>
                <ul>
                  {managers[hospital.id].map((manager) => (
                    <li key={manager.id}>
                      <strong>ID:</strong> {manager.id}
                      <br />
                      <strong>Name:</strong> {manager.name}
                      <br />
                      <strong>Contact:</strong> {manager.contact_number}
                      <br />
                      <strong>Departments:</strong>{' '}
                      {manager.departments.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {facilities[hospital.id] === null && (
              <p>No facilities available for this hospital.</p>
            )}

            {departments[hospital.name] === null && (
              <p>No departments available for this hospital.</p>
            )}

            {managers[hospital.id] === null && (
              <p>No managers available for this hospital.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HospitalsPage;
