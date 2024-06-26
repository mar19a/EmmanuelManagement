import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Employee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8081/getEmployee', { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
          setLoading(false);
        } else {
          alert("Error fetching employees");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Error fetching employees");
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete('http://localhost:8081/delete/' + id, { withCredentials: true })
      .then(res => {
        if (res.data.Status === "Success") {
          window.location.reload(true);
        } else {
          alert("Error deleting employee");
        }
      })
      .catch(err => {
        console.log(err);
        alert("Error deleting employee");
      });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/create" className='btn btn-success'>Add Employee</Link>
      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return <tr key={index}>
                <td>{employee.name}</td>
                <td>{
                  <img src={`http://localhost:8081/images/` + employee.image} alt="" className='employee_image' />
                }</td>
                <td>{employee.email}</td>
                <td>{employee.address}</td>
                <td>{employee.salary}</td>
                <td>
                  <Link to={`/dashboard/employeeEdit/` + employee.id} className='btn btn-primary btn-sm me-2'>edit</Link>
                  <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>delete</button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employee;
