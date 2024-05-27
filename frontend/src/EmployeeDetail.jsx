import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import './EmployeeDetail.css'; 

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');

function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEmployeeDetails();
    fetchEvents();
  }, [id]);

  const fetchEmployeeDetails = () => {
    axios.get(`http://localhost:8081/get/${id}`)
      .then(res => {
        if (res.data.Status === 'Success' && res.data.Result.length > 0) {
          setEmployee(res.data.Result[0]);
        } else {
          setError('Employee not found');
        }
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching employee details');
        setLoading(false);
      });
  };

  const fetchEvents = () => {
    axios.get('http://localhost:8081/events')
      .then(res => {
        setEvents(res.data.map(event => ({
          ...event,
          start: new Date(event.start_date),
          end: new Date(event.end_date)
        })));
      })
      .catch(err => console.error(err));
  };

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        navigate('/start');
      }).catch(err => console.log(err));
  };

  const handleEventSelect = (event) => {
    axios.get(`http://localhost:8081/users/${event.created_by}`)
      .then(res => {
        setSelectedEvent({ ...event, creatorEmail: res.data.email });
      })
      .catch(err => console.error('Error fetching creator email', err));
  };

  const closeModal = () => {
    setSelectedEvent(null);
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

    axios.put(`http://localhost:8081/profile/${id}`, formData)
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
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="#" onClick={() => navigate(`/employeedetail/${id}`)} className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-5 fw-bolder d-none d-sm-inline">Employee Dashboard</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Profile</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}/messages`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-chat"></i> <span className="ms-1 d-none d-sm-inline">Messages</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}/attendance`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-calendar-check"></i> <span className="ms-1 d-none d-sm-inline">Attendance</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}/documents`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-file-earmark"></i> <span className="ms-1 d-none d-sm-inline">Documents</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}/announcements`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-megaphone"></i> <span className="ms-1 d-none d-sm-inline">Announcements</span>
                </a>
              </li>
              <li onClick={handleLogout}>
                <a href="#" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span></a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>
          <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
            {isEditing ? (
              <form onSubmit={handleSubmit} className='p-3 rounded w-50 border'>
                <h2>Edit Profile</h2>
                <div className='mb-3'>
                  <label className='form-label'>Name</label>
                  <input type='text' name='name' value={employee.name} onChange={handleChange} className='form-control' readOnly />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Email</label>
                  <input type='email' name='email' value={employee.email} onChange={handleChange} className='form-control' readOnly />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Address</label>
                  <input type='text' name='address' value={employee.address} onChange={handleChange} className='form-control' required />
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
                <img src={`http://localhost:8081/images/${employee.image}`} alt="" className='empImg' />
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
          <div className='mt-5'>
            <h2>Calendar</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, zIndex: 1 }} 
              onSelectEvent={handleEventSelect}
            />
            {selectedEvent && (
              <Modal
                isOpen={!!selectedEvent}
                onRequestClose={closeModal}
                overlayClassName="modal-overlay"
                className="modal-content"
                contentLabel="Event Details"
              >
                <button onClick={closeModal} className="modal-close-button">&times;</button>
                <h2>{selectedEvent.title}</h2>
                <p>{selectedEvent.description}</p>
                <p><strong>Created by:</strong> {selectedEvent.creatorEmail}</p>
                <button onClick={closeModal} className="btn btn-secondary mt-3">Close</button>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
