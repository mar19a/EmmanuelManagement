import React, { useState } from 'react';
import axios from 'axios';

function AddAdmin({ onAdminAdded }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' // Set default role to admin
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/signup', formData);
      if (response.data.Status === 'Success') {
        alert('Admin added successfully!');
        onAdminAdded(); // Callback to refresh the list of admins
      } else {
        alert('Signup failed: ' + response.data.Error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during signup.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-3 rounded w-50 border'>
      <h2>Add Admin</h2>
      <div className='mb-3'>
        <label className='form-label'>Email</label>
        <input type='email' name='email' value={formData.email} onChange={handleChange} className='form-control' required />
      </div>
      <div className='mb-3'>
        <label className='form-label'>Password</label>
        <input type='password' name='password' value={formData.password} onChange={handleChange} className='form-control' required />
      </div>
      <button type='submit' className='btn btn-primary'>Add Admin</button>
    </form>
  );
}

export default AddAdmin;
