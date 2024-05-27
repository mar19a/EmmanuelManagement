import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeAnnouncements.css';

Modal.setAppElement('#root');

function EmployeeAnnouncements() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    fetchEmployeeEmail();
  }, [id]);

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

  const fetchEmployeeEmail = () => {
    axios.get(`http://localhost:8081/get/${id}`)
      .then(res => {
        if (res.data.Status === 'Success' && res.data.Result.length > 0) {
          setUserEmail(res.data.Result[0].email);
        } else {
          console.error('Error fetching employee email:', res.data);
        }
      })
      .catch(err => {
        console.error('Error fetching employee email:', err);
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
              <li>
                <a href="#" onClick={() => navigate(`/employeedetail/${id}/feedback`)} className="nav-link text-white px-0 align-middle">
                  <i className="fs-4 bi-chat-dots"></i> <span className="ms-1 d-none d-sm-inline">Feedback</span>
                </a>
              </li>
              <li onClick={() => axios.get('http://localhost:8081/logout').then(() => navigate('/start')).catch(err => console.log(err))}>
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
                    className="form-control mt-2"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                  />
                  <button onClick={() => handleAddComment(selectedAnnouncement.id)} className="btn btn-primary mt-2">
                    Add Comment
                  </button>
                  <button onClick={closeCommentModal} className="btn btn-secondary mt-2">Close</button>
                </>
              )}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAnnouncements;
