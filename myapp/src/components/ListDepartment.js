// src/components/ListDepartment.js
import React, { useEffect, useState } from 'react';
import './ListDepartment.css';

const ListDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/departments/')
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading departments...</p>;
  }

  if (error) {
    return <p>Error fetching departments: {error}</p>;
  }

  return (
    <div className="list-department-container">
      <h1 className='ld-title'>List of Departments</h1>
      {departments.length > 0 ? (
        <ul>
          {departments.map((hospital, index) => (
            <li key={index}>
              <h3>Hospital: {hospital.hospital}</h3>
              <ul>
                {hospital.departments.map((department) => (
                  <li key={department.id}>
                    <p><strong>Name:</strong> {department.name}</p>
                    <p><strong>Description:</strong> {department.description}</p>
                    <p><strong>Hospital ID:</strong> {department.hospital}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No departments found.</p>
      )}
    </div>
  );
};

export default ListDepartment;