import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeDetail.css';

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('Fetching employee details for id:', id);
    axios.get('http://localhost:8081/get/' + id)
      .then(res => {
        console.log('Employee details response:', res.data);
        if (res.data.Status === 'Success' && res.data.Result.length > 0) {
          setEmployee(res.data.Result[0]);
        } else {
          setError('Employee not found');
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching employee details:', err);
        setError('Error fetching employee details');
        setLoading(false);
      });
  }, [id]);

  const handleLogout = () => {
    console.log('Logging out');
    axios.get('http://localhost:8081/logout')
      .then(res => {
        console.log('Logout response:', res.data);
        navigate('/start');
      }).catch(err => {
        console.log('Logout error:', err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    setEmployee({ ...employee, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('address', employee.address);
    formData.append('salary', employee.salary);
    if (employee.image) {
      formData.append('image', employee.image);
    }

    axios.put('http://localhost:8081/profile/' + id, formData)
      .then(res => {
        if (res.data.Status === 'Success') {
          alert('Profile updated successfully!');
          setIsEditing(false);
        } else {
          alert('Profile update failed: ' + res.data.Error);
        }
      })
      .catch(err => {
        alert('An error occurred during profile update.');
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!employee) {
    return <div>No employee data</div>;
  }

  return (
    <div>
      <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
        {isEditing ? (
          <form onSubmit={handleSubmit} className='p-3 rounded w-50 border'>
            <h2>Edit Profile</h2>
            <div className='mb-3'>
              <label className='form-label'>Name</label>
              <input type='text' name='name' value={employee.name} onChange={handleChange} className='form-control' required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Email</label>
              <input type='email' name='email' value={employee.email} onChange={handleChange} className='form-control' required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Address</label>
              <input type='text' name='address' value={employee.address} onChange={handleChange} className='form-control' required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Salary</label>
              <input type='number' name='salary' value={employee.salary} onChange={handleChange} className='form-control' required />
            </div>
            <div className='mb-3'>
              <label className='form-label'>Profile Image</label>
              <input type='file' name='image' onChange={handleFileChange} className='form-control' />
            </div>
            <button type='submit' className='btn btn-primary me-2'>Save</button>
            <button type='button' className='btn btn-secondary' onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <>
            <img src={`http://localhost:8081/images/` + employee.image} alt="" className='empImg' />
            <div className='d-flex align-items-center flex-column mt-5'>
              <h3>Name: {employee.name}</h3>
              <h3>Email: {employee.email}</h3>
              <h3>Salary: {employee.salary}</h3>
            </div>
            <div>
              <button className='btn btn-primary me-2' onClick={() => setIsEditing(true)}>Edit</button>
              <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeDetail;
