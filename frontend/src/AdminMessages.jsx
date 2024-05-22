import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Messages.css';

function AdminMessages() {
  const { id } = useParams();  // Assume adminId is passed as id
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(localStorage.getItem('selectedEmployee') || '');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/getEmployees')
      .then(res => {
        console.log('Employees response:', res.data);
        setEmployees(res.data);
        if (res.data.length > 0 && !selectedEmployee) {
          const firstEmployeeId = res.data[0].id;
          setSelectedEmployee(firstEmployeeId);
          localStorage.setItem('selectedEmployee', firstEmployeeId);
          fetchMessages(id, firstEmployeeId);
        }
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setError('Error fetching employees');
      });
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchMessages(id, selectedEmployee);
    }
  }, [selectedEmployee, id]);

  const fetchMessages = (adminId, employeeId) => {
    axios.get(`http://localhost:8081/messages/${employeeId}/${adminId}`)
      .then(res => {
        console.log('Messages response:', res.data);
        setMessages(res.data);
      })
      .catch(err => {
        console.error("Error fetching messages:", err);
        setError('Error fetching messages');
      });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const payload = { senderId: id, message: newMessage, recipientId: selectedEmployee };
      console.log('Sending message with payload:', payload);
      axios.post('http://localhost:8081/sendMessage', payload)
        .then(res => {
          console.log('Send message response:', res.data);
          if (res.data.Status === 'Success') {
            setMessages([...messages, res.data.message]);
            setNewMessage('');
          } else {
            alert('Failed to send message: ' + res.data.Error);
          }
        })
        .catch(err => {
          console.error('Error sending message:', err);
          alert('An error occurred while sending the message.');
        });
    }
  };

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        navigate('/start');
      }).catch(err => console.log(err));
  };

  const handleEmployeeChange = (e) => {
    const newEmployeeId = e.target.value;
    setSelectedEmployee(newEmployeeId);
    localStorage.setItem('selectedEmployee', newEmployeeId);
    fetchMessages(id, newEmployeeId);
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="#" onClick={() => navigate(`/dashboard`)} className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-5 fw-bolder d-none d-sm-inline">Admin Dashboard</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li>
                <a href="#" onClick={() => navigate(`/dashboard`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/dashboard/employee`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Manage Employees</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/dashboard/profile`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Profile</span>
                </a>
              </li>
              <li>
                <a href="#" onClick={() => navigate(`/dashboard/adminMessages`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-chat"></i> <span className="ms-1 d-none d-sm-inline">Messages</span>
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
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>Messages</h2>
            <div className='message-form mb-3'>
              <select value={selectedEmployee} onChange={handleEmployeeChange} className='form-control mb-3'>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>{employee.email}</option>
                ))}
              </select>
            </div>
            <div className='chatroom'>
              <div className='messages-list'>
                {messages.map((msg, index) => (
                  <div key={index} className={`message-item ${msg.senderId == id ? 'sent' : 'received'}`}>
                    <strong>{msg.senderName}:</strong> {msg.content}
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className='message-form'>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className='form-control mb-3'
                  placeholder='Type your message here...'
                />
                <button onClick={handleSendMessage} className='btn btn-primary'>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMessages;
