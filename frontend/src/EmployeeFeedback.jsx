import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './EmployeeFeedback.css';

function EmployeeFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/feedback', { employee_id: id, content: feedback })
      .then(res => {
        if (res.data.Status === 'Success') {
          setSuccess('Feedback submitted successfully');
          setFeedback('');
        } else {
          setError('Error submitting feedback: ' + res.data.Error);
        }
      })
      .catch(err => {
        setError('Error submitting feedback');
      });
  };

  return (
    <div className="container">
      <h2>Submit Feedback</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="feedback">Your Feedback</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="form-control"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Submit</button>
      </form>
    </div>
  );
}

export default EmployeeFeedback;
