import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EmployeeAnnouncements.css';

Modal.setAppElement('#root');

function EmployeeAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchAnnouncements();
    fetchUserProfile();
  }, []);

  const fetchAnnouncements = () => {
    axios.get('http://localhost:8081/announcements')
      .then(res => {
        setAnnouncements(res.data);
        res.data.forEach(announcement => {
          fetchComments(announcement.id);
        });
      })
      .catch(err => {
        console.error('Error fetching announcements:', err);
      });
  };

  const fetchComments = (announcement_id) => {
    axios.get(`http://localhost:8081/comments/${announcement_id}`)
      .then(res => {
        setComments(prevComments => ({
          ...prevComments,
          [announcement_id]: res.data
        }));
      })
      .catch(err => {
        console.error('Error fetching comments:', err);
      });
  };

  const fetchUserProfile = () => {
    axios.get('http://localhost:8081/profile', { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Success') {
          setUserEmail(res.data.Profile.email);
        } else {
          console.error('Error fetching user profile');
        }
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
      });
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAddComment = (announcement_id) => {
    axios.post('http://localhost:8081/comments', { announcement_id, email: userEmail, content: newComment })
      .then(res => {
        setComments(prevComments => ({
          ...prevComments,
          [announcement_id]: [...prevComments[announcement_id], res.data]
        }));
        setNewComment('');
      })
      .catch(err => {
        console.error('Error adding comment:', err);
      });
  };

  const openCommentModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsCommentModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (filter !== 'all') {
      return filter === 'important' ? announcement.isImportant : !announcement.isImportant;
    }
    if (startDate && new Date(announcement.created_at) < startDate) return false;
    if (endDate && new Date(announcement.created_at) > endDate) return false;
    return true;
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
        <div className="date-picker-container">
          <label htmlFor="startDate">Start Date: </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            isClearable
            placeholderText="Select start date"
          />
          <label htmlFor="endDate">End Date: </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            isClearable
            placeholderText="Select end date"
          />
        </div>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Importance</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnnouncements.map(announcement => (
            <tr key={announcement.id}>
              <td>{announcement.title}</td>
              <td>{announcement.content}</td>
              <td>{announcement.isImportant ? 'Important' : 'Normal'}</td>
              <td>{new Date(announcement.created_at).toLocaleString()}</td>
              <td>
                <button onClick={() => openCommentModal(announcement)} className="btn btn-secondary">Comments</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isCommentModalOpen}
        onRequestClose={closeCommentModal}
        contentLabel="Comments"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedAnnouncement && (
          <>
            <h2>Comments for {selectedAnnouncement.title}</h2>
            <div className="comments">
              {comments[selectedAnnouncement.id] && comments[selectedAnnouncement.id].map(comment => (
                <div key={comment.id} className="comment">
                  <p><strong>{comment.email}</strong></p>
                  <p>{comment.content}</p>
                  <p>{new Date(comment.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={() => handleAddComment(selectedAnnouncement.id)}>
              Add Comment
            </button>
            <button onClick={closeCommentModal} className="btn btn-secondary">Close</button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default EmployeeAnnouncements;
