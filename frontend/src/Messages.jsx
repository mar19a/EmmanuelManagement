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
  const [selectedAdmin, setSelectedAdmin] = useState('');

  useEffect(() => {
    // Fetch messages
    axios.get('http://localhost:8081/messages')
      .then(res => {
        setMessages(res.data);
      })
      .catch(err => console.log(err));

    // Fetch list of admins
    axios.get('http://localhost:8081/getAdmins')
      .then(res => {
        setAdmins(res.data);
        if (res.data.length > 0) {
          setSelectedAdmin(res.data[0].id); // Select the first admin by default
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      axios.post('http://localhost:8081/sendMessage', { message: newMessage, recipientId: selectedAdmin })
        .then(res => {
          if (res.data.Status === 'Success') {
            setMessages([...messages, res.data.message]);
            setNewMessage('');
          } else {
            alert('Failed to send message: ' + res.data.Error);
          }
        })
        .catch(err => {
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
            <h2>Messages</h2>
            <div className='messages-list'>
              {messages.map((msg, index) => (
                <div key={index} className='message-item'>
                  <strong>{msg.senderName}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div className='message-form'>
              <select value={selectedAdmin} onChange={(e) => setSelectedAdmin(e.target.value)} className='form-control mb-3'>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.id}>{admin.email}</option>
                ))}
              </select>
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
  );
}

export default Messages;