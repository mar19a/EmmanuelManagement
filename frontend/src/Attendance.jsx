import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Attendance.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Attendance() {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    clockIn: '',
    clockOut: ''
  });
  const [employeeEmails, setEmployeeEmails] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
    fetchEmployeeEmails();
  }, []);

  const fetchAttendanceData = () => {
    axios.get('http://localhost:8081/attendance')
      .then(res => {
        console.log('Attendance data from backend:', res.data);
        setAttendanceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching attendance data:', err);
        setError('Error fetching attendance data');
        setLoading(false);
      });
  };

  const fetchEmployeeEmails = () => {
    axios.get('http://localhost:8081/employees/emails')
      .then(res => {
        console.log('Employee emails from backend:', res.data);
        setEmployeeEmails(res.data);
      })
      .catch(err => {
        console.error('Error fetching employee emails:', err);
        setError('Error fetching employee emails');
      });
  };

  const handleAddAttendance = () => {
    setIsAddModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/attendance/add', formData)
      .then(res => {
        console.log('Attendance added:', res.data);
        setIsAddModalOpen(false);
        fetchAttendanceData();
        setFormData({
          email: '',
          clockIn: '',
          clockOut: ''
        });
      })
      .catch(err => {
        console.error('Error adding attendance:', err);
        setError('Error adding attendance');
      });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleDateClick = (date) => {
    console.log('Clicked on date header:', date);
    setSelectedDate(date);
    setSelectedAttendance(attendanceData[date] || []);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
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
      <div className="agenda">
        {Object.keys(attendanceData).map(date => (
          <div key={date} className="agenda-day">
            <div className="agenda-day-header" onClick={() => handleDateClick(date)}>
              <h3>{date}</h3>
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={isDetailModalOpen} onRequestClose={closeDetailModal} className="modal-content" overlayClassName="modal-overlay">
        {selectedDate && (
          <>
            <h2>Attendance for {selectedDate}</h2>
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
                {selectedAttendance.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.email}</td>
                    <td>{new Date(entry.clock_in).toLocaleDateString()}</td>
                    <td>{new Date(entry.clock_in).toLocaleTimeString()}</td>
                    <td>{entry.clock_out ? new Date(entry.clock_out).toLocaleTimeString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={closeDetailModal} className="btn btn-secondary">Close</button>
          </>
        )}
      </Modal>
      <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} className="modal-content" overlayClassName="modal-overlay">
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
          <button type="button" onClick={closeAddModal} className="btn btn-secondary">Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default Attendance;
