import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Messages.css';

function Messages() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(localStorage.getItem('selectedAdmin') || '');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081/getAdmins')
      .then(res => {
        console.log('Admins response:', res.data);
        setAdmins(res.data);
        if (res.data.length > 0 && !selectedAdmin) {
          const firstAdminId = res.data[0].id;
          setSelectedAdmin(firstAdminId);
          localStorage.setItem('selectedAdmin', firstAdminId);
          fetchMessages(id, firstAdminId);
        }
      })
      .catch(err => {
        console.error("Error fetching admins:", err);
        setError('Error fetching admins');
      });
  }, []);

  useEffect(() => {
    if (selectedAdmin) {
      fetchMessages(id, selectedAdmin);
    }
  }, [selectedAdmin, id]);

  const fetchMessages = (userId, adminId) => {
    axios.get(`http://localhost:8081/messages/${userId}/${adminId}`)
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
      const payload = { senderId: id, message: newMessage, recipientId: selectedAdmin };
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

  const handleAdminChange = (e) => {
    const newAdminId = e.target.value;
    setSelectedAdmin(newAdminId);
    localStorage.setItem('selectedAdmin', newAdminId);
    fetchMessages(id, newAdminId);
  };

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
            {error && <div className="alert alert-danger">{error}</div>}
            <h2>Messages</h2>
            <div className='message-form mb-3'>
              <select value={selectedAdmin} onChange={handleAdminChange} className='form-control mb-3'>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.id}>{admin.email}</option>
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

export default Messages;
