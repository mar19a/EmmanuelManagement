import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin' 
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
        alert('Signup successful!');
      } else {
        alert('Signup failed: ' + response.data.Error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during signup.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <form onSubmit={handleSubmit} className='p-3 rounded w-50 border'>
        <h2>Admin Signup</h2>
        <div className='mb-3'>
          <label className='form-label'>Email</label>
          <input type='email' name='email' value={formData.email} onChange={handleChange} className='form-control' required />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <input type='password' name='password' value={formData.password} onChange={handleChange} className='form-control' required />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Role</label>
          <input type='text' name='role' value={formData.role} onChange={handleChange} className='form-control' />
        </div>
        <button type='submit' className='btn btn-primary'>Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
