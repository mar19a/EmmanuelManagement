import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all');

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
      <table className="table table-striped mt-3">
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
