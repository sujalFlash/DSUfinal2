import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './ViewDoctors.css'; // Import the CSS file

Modal.setAppElement('#root'); // Set the root element for accessibility

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/view_doctors/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Doctors data:', data); // Log the API response
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDelete = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this nurse?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/delete_doctor/${doctorId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete doctor');
      }

      // Remove the doctor from the UI
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
      alert('Doctor deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingDoctor) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/doctor_update/${editingDoctor.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(updatedDoctor),
      });

      if (!response.ok) {
        console.log(response);
        console.log(await response.json());
        throw new Error('Failed to update doctor');
      }

      // Update the doctor in the UI
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.id === editingDoctor.id ? { ...doctor, ...updatedDoctor } : doctor
        )
      );
      alert('Doctor updated successfully!');
      setEditingDoctor(null);
      setUpdatedDoctor({});
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctor({
      ...updatedDoctor,
      [name]: name === 'is_in_hospital' || name === 'on_duty' ? value === 'true' : value, // Ensure boolean values are properly handled
    });
  };

  const handleCancel = () => {
    setEditingDoctor(null); // Close the modal
    setUpdatedDoctor({}); // Reset the updated doctor data
  };

  if (loading) {
    return <div style={{ textAlign: 'center', fontSize: '20px', color: '#555' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center' }}>Error fetching data: {error}</div>;
  }

  return (
    <div className="view-doctors-container">
      <h1>Doctors List</h1>
      {doctors.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {doctors.map((doctor) => (
            <li key={doctor.id} className="doctor-card">
              <h3>Doctor ID: {doctor.id}</h3>
              <p><strong>Name:</strong> {doctor.name || 'N/A'}</p>
              <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
              <p><strong>Hospital:</strong> {doctor.hospital || 'N/A'}</p>
              <p><strong>Shift:</strong> {doctor.shift || 'N/A'}</p>
              <p><strong>Status:</strong> {doctor.status || 'N/A'}</p>
              <p><strong>In Hospital:</strong> {doctor.is_in_hospital ? 'Yes' : 'No'}</p>
              <p><strong>On Duty:</strong> {doctor.on_duty ? 'Yes' : 'No'}</p>
              <button className="button button-delete" onClick={() => handleDelete(doctor.id)}>
                Delete
              </button>
              <button
                className="button button-update"
                onClick={() => {
                  setEditingDoctor(doctor);
                  setUpdatedDoctor(doctor);
                }}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: 'center', color: '#555' }}>No doctors available.</p>
      )}

      <Modal
        isOpen={!!editingDoctor}
        onRequestClose={handleCancel}
        style={{
          content: {
            ...Modal.defaultStyles.content,
            ...{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '500px',
              padding: '20px',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              border: 'none',
            },
          },
        }}
      >
        <div className="modal-content">
          <h2>Update Doctor</h2>
          <p>{editingDoctor ? `Updating: ${editingDoctor.name}` : 'No doctor selected'}</p>
          <label>
            Shift:
            <select
              name="shift"
              value={updatedDoctor.shift || ''}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Rotating">Rotating</option>
            </select>
          </label>
          <label>
            Status:
            <select
              name="status"
              value={updatedDoctor.status || ''}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="free">Free</option>
              <option value="working">Working</option>
              <option value="on_leave">On Leave</option>
            </select>
          </label>
          <label>
            In Hospital:
            <select
              name="is_in_hospital"
              value={updatedDoctor.is_in_hospital}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          <label>
            On Duty:
            <select
              name="on_duty"
              value={updatedDoctor.on_duty}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </label>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button className="button button-save" onClick={handleUpdate}>
              Save
            </button>
            <button className="button button-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewDoctors;
