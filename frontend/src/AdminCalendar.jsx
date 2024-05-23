import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function AdminCalendar() {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

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
        axios.post('http://localhost:8081/events', newEvent)
            .then(res => {
                fetchEvents();
                setNewEvent({
                    title: '',
                    description: '',
                    start_date: '',
                    end_date: ''
                });
            })
            .catch(err => console.error(err));
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
            />
        </div>
    );
}

export default AdminCalendar;
