import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeAttendance.css';

Modal.setAppElement('#root');

function EmployeeAttendance() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    fetchEmployeeEmail();
  }, [id]);

  const fetchEmployeeEmail = () => {
    axios.get(`http://localhost:8081/get/${id}`)
      .then(res => {
        if (res.data.Status === 'Success' && res.data.Result.length > 0) {
          const employeeEmail = res.data.Result[0].email;
          setFormData(prevState => ({ ...prevState, email: employeeEmail }));
          fetchAttendanceData(employeeEmail);
        } else {
          console.error('Error fetching employee email:', res.data);
          setError('Error fetching employee email');
          navigate('/employeeLogin'); // Redirect to login if not authenticated
        }
      })
      .catch(err => {
        console.error('Error fetching employee email:', err);
        setError('Error fetching employee email');
        navigate('/employeeLogin'); // Redirect to login if not authenticated
      });
  };

  const fetchAttendanceData = (email) => {
    axios.get(`http://localhost:8081/attendance/${email}`, { withCredentials: true })
      .then(res => {
        if (Array.isArray(res.data)) {
          setAttendanceData(res.data);
        } else {
          setAttendanceData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching attendance data:', err);
        setError('Error fetching attendance data');
        setLoading(false);
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
    axios.post('http://localhost:8081/attendance/add', formData, { withCredentials: true })
      .then(res => {
        setIsModalOpen(false);
        fetchAttendanceData(formData.email);
        setFormData(prevState => ({
          ...prevState,
          clockIn: '',
          clockOut: ''
        }));
      })
      .catch(err => {
        console.error('Error adding attendance:', err);
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
      <h2>My Attendance</h2>
      <div className="attendance-actions">
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
          {attendanceData.length > 0 ? (
            attendanceData.map((data, index) => (
              <tr key={index}>
                <td>{new Date(data.clockIn).toLocaleDateString()}</td>
                <td>{new Date(data.clockIn).toLocaleTimeString()}</td>
                <td>{data.clockOut ? new Date(data.clockOut).toLocaleTimeString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No attendance records found</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
        <h2>Add Attendance</h2>
        <form onSubmit={handleFormSubmit}>
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

export default EmployeeAttendance;

