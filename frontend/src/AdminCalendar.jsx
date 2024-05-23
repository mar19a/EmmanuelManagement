import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';

const localizer = momentLocalizer(moment);

Modal.setAppElement('#root');  

function AdminCalendar() {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [adminId, setAdminId] = useState(null);

    useEffect(() => {
        fetchAdminProfile();
        fetchEvents();
    }, []);

    const fetchAdminProfile = () => {
        axios.get('http://localhost:8081/profile')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAdminId(res.data.Profile.id);
                } else {
                    console.error('Error fetching profile data');
                }
            })
            .catch(err => console.error('Error fetching profile data', err));
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

    const handleAddEvent = () => {
        if (!adminId) {
            alert('Admin ID is not available');
            return;
        }

        const eventToAdd = {
            ...newEvent,
            start_date: new Date(newEvent.start_date).toISOString(),
            end_date: new Date(newEvent.end_date).toISOString(),
            created_by: adminId
        };

        console.log('Adding Event:', eventToAdd);

        axios.post('http://localhost:8081/events', eventToAdd)
            .then(res => {
                fetchEvents();
                setNewEvent({
                    title: '',
                    description: '',
                    start_date: '',
                    end_date: ''
                });
            })
            .catch(err => {
                console.error('Error adding event:', err);
                alert('Error adding event. Check the console for details.');
            });
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

    return (
        <div className="container mt-5">
            <h2>Calendar</h2>
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="form-control"
                />
                <textarea
                    placeholder="Event Description"
                    value={newEvent.description}
                    onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="form-control mt-2"
                />
                <input
                    type="datetime-local"
                    value={newEvent.start_date}
                    onChange={e => setNewEvent({ ...newEvent, start_date: e.target.value })}
                    className="form-control mt-2"
                />
                <input
                    type="datetime-local"
                    value={newEvent.end_date}
                    onChange={e => setNewEvent({ ...newEvent, end_date: e.target.value })}
                    className="form-control mt-2"
                />
                <button onClick={handleAddEvent} className="btn btn-primary mt-2">Add Event</button>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleEventSelect}
            />
            {selectedEvent && (
                <Modal
                    isOpen={!!selectedEvent}
                    onRequestClose={closeModal}
                    contentLabel="Event Details"
                >
                    <h2>{selectedEvent.title}</h2>
                    <p>{selectedEvent.description}</p>
                    <p><strong>Created by:</strong> {selectedEvent.creatorEmail}</p>
                    <button onClick={closeModal} className="btn btn-secondary">Close</button>
                </Modal>
            )}
        </div>
    );
}

export default AdminCalendar;
