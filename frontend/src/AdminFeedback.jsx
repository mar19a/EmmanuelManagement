import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminFeedback.css';

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = () => {
    axios.get('http://localhost:8081/feedbacks')
      .then(res => {
        setFeedbacks(res.data);
      })
      .catch(err => {
        setError('Error fetching feedbacks');
      });
  };

  return (
    <div className="container">
      <h2>Employee Feedback</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Content</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(feedback => (
            <tr key={feedback.id}>
              <td>{feedback.content}</td>
              <td>{new Date(feedback.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminFeedback;
