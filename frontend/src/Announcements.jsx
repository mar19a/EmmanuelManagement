import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    isImportant: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    axios.get('http://localhost:8081/announcements')
      .then(res => {
        setAnnouncements(res.data);
      })
      .catch(err => {
        console.error('Error fetching announcements:', err);
      });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAnnouncement({
      ...newAnnouncement,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/announcements', newAnnouncement)
      .then(res => {
        setAnnouncements([...announcements, res.data]);
        setNewAnnouncement({
          title: '',
          content: '',
          isImportant: false
        });
      })
      .catch(err => {
        console.error('Error adding announcement:', err);
      });
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter === 'all') return true;
    return filter === 'important' ? announcement.isImportant : !announcement.isImportant;
  });

  return (
    <div className="container">
      <h2>Announcements</h2>
      <div className="filter-container">
        <label htmlFor="filter">Filter: </label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="important">Important</option>
          <option value="normal">Normal</option>
        </select>
      </div>
      <form onSubmit={handleAddAnnouncement} className="mb-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={newAnnouncement.title}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            name="content"
            id="content"
            value={newAnnouncement.content}
            onChange={handleInputChange}
            className="form-control"
            required
          ></textarea>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="isImportant"
            id="isImportant"
            checked={newAnnouncement.isImportant}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label htmlFor="isImportant" className="form-check-label">Important</label>
        </div>
        <button type="submit" className="btn btn-primary">Add Announcement</button>
      </form>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Importance</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnnouncements.map(announcement => (
            <tr key={announcement.id}>
              <td>{announcement.title}</td>
              <td>{announcement.content}</td>
              <td>{announcement.isImportant ? 'Important' : 'Normal'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Announcements;
