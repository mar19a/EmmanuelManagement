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
        <img src={`http://localhost:8081/images/` + employee.image} alt="" className='empImg' />
        <div className='d-flex align-items-center flex-column mt-5'>
          <h3>Name: {employee.name}</h3>
          <h3>Email: {employee.email}</h3>
          <h3>Salary: {employee.salary}</h3>
        </div>
        <div>
          <button className='btn btn-primary me-2'>Edit</button>
          <button className='btn btn-danger' onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
