import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attendance.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    clockIn: '',
    clockOut: ''
  });
  const [employeeEmails, setEmployeeEmails] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
    fetchEmployeeEmails();
  }, []);

  const fetchAttendanceData = () => {
    axios.get('http://localhost:8081/attendance')
      .then(res => {
        setAttendanceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching attendance data');
        setLoading(false);
      });
  };

  const fetchEmployeeEmails = () => {
    axios.get('http://localhost:8081/employees/emails')
      .then(res => {
        setEmployeeEmails(res.data);
      })
      .catch(err => {
        setError('Error fetching employee emails');
      });
  };

  const handleAddAttendance = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/attendance/add', formData)
      .then(res => {
        setIsModalOpen(false);
        fetchAttendanceData();
        setFormData({
          email: '',
          clockIn: '',
          clockOut: ''
        });
      })
      .catch(err => {
        setError('Error adding attendance');
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Employee Attendance</h2>
      <div className="attendance-actions">
        <button onClick={handleAddAttendance} className="btn btn-primary">Add Attendance</button>
        {status && <p>{status}</p>}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Email</th>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((data, index) => (
            <tr key={index}>
              <td>{data.email}</td>
              <td>{new Date(data.clockIn).toLocaleDateString()}</td>
              <td>{new Date(data.clockIn).toLocaleTimeString()}</td>
              <td>{data.clockOut ? new Date(data.clockOut).toLocaleTimeString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
        <h2>Add Attendance</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <select
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select Email</option>
              {employeeEmails.map((employee, index) => (
                <option key={index} value={employee.email}>
                  {employee.email}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="clockIn">Clock In</label>
            <input
              type="datetime-local"
              name="clockIn"
              value={formData.clockIn}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clockOut">Clock Out</label>
            <input
              type="datetime-local"
              name="clockOut"
              value={formData.clockOut}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Attendance;
