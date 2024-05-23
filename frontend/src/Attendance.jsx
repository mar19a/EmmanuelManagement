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
    userId: '',
    clockIn: '',
    clockOut: ''
  });

  useEffect(() => {
    fetchAttendanceData();
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

  const handleClockIn = () => {
    axios.post('http://localhost:8081/attendance/clock-in')
      .then(res => {
        setStatus('Clocked In');
        fetchAttendanceData();
      })
      .catch(err => {
        setError('Error clocking in');
      });
  };

  const handleClockOut = () => {
    axios.post('http://localhost:8081/attendance/clock-out')
      .then(res => {
        setStatus('Clocked Out');
        fetchAttendanceData();
      })
      .catch(err => {
        setError('Error clocking out');
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
          userId: '',
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
        <button onClick={handleClockIn} className="btn btn-success">Clock In</button>
        <button onClick={handleClockOut} className="btn btn-danger">Clock Out</button>
        <button onClick={handleAddAttendance} className="btn btn-primary">Add Attendance</button>
        {status && <p>{status}</p>}
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((data, index) => (
            <tr key={index}>
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
            <label htmlFor="userId">User ID</label>
            <input type="number" name="userId" value={formData.userId} onChange={handleInputChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="clockIn">Clock In</label>
            <input type="datetime-local" name="clockIn" value={formData.clockIn} onChange={handleInputChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label htmlFor="clockOut">Clock Out</label>
            <input type="datetime-local" name="clockOut" value={formData.clockOut} onChange={handleInputChange} className="form-control" />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Attendance;
