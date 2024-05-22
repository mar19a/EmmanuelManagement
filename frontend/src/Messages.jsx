import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Messages.css';

function Messages() {
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

  return (
    <div className='messages-container'>
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
  );
}

export default Messages;
