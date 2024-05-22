import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Messages.css';

function AdminMessages() {
    const { id } = useParams();  
    const navigate = useNavigate();
    const [adminId, setAdminId] = useState(null); 
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(localStorage.getItem('selectedEmployee') || '');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8081/profile')
            .then(res => {
                if (res.data.Status === 'Success') {
                    const adminData = res.data.Profile;
                    setAdminId(adminData.id);
                    axios.get('http://localhost:8081/getEmployees')
                        .then(res => {
                            console.log('Employees response:', res.data);
                            setEmployees(res.data);
                            if (res.data.length > 0 && !selectedEmployee) {
                                const firstEmployeeId = res.data[0].id;
                                setSelectedEmployee(firstEmployeeId);
                                localStorage.setItem('selectedEmployee', firstEmployeeId);
                                fetchMessages(firstEmployeeId, adminData.id);
                            }
                        })
                        .catch(err => {
                            console.error("Error fetching employees:", err);
                            setError('Error fetching employees');
                        });
                } else {
                    alert('Error fetching admin profile data');
                }
            })
            .catch(err => {
                console.error('Error fetching admin profile data:', err);
                alert('Error fetching admin profile data');
            });
    }, [selectedEmployee]);

    useEffect(() => {
        if (selectedEmployee && adminId) {
            fetchMessages(selectedEmployee, adminId);
        }
    }, [selectedEmployee, adminId]);

    const fetchMessages = (employeeId, adminId) => {
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
        if (newMessage.trim() !== '' && adminId) {
            const payload = {
                senderId: parseInt(selectedEmployee),
                message: newMessage,
                recipientId: adminId
            };
            console.log('Sending message with payload:', payload);
            axios.post('http://localhost:8081/sendMessageAdminToEmployee', payload)
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

    const handleEmployeeChange = (e) => {
        const newEmployeeId = e.target.value;
        setSelectedEmployee(newEmployeeId);
        localStorage.setItem('selectedEmployee', newEmployeeId);
        fetchMessages(newEmployeeId, adminId);
    };

    return (
        <div className="container-fluid">
            <div className="row flex-nowrap">
                <div className="col p-0 m-0">
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
                                    <div key={index} className={`message-item ${msg.senderId === adminId ? 'sent' : 'received'}`}>
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
