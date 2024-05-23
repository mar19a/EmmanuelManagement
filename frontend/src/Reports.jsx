import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Reports.css';

function Reports() {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = () => {
    axios.get('http://localhost:8081/reports/performance')
      .then(res => {
        setPerformanceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching performance report data');
        setLoading(false);
      });
  };

  const handleMessageClick = (employeeId) => {
    navigate(`/dashboard/adminMessages`, { state: { employeeId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Performance Report</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project Completion Rate</th>
            <th>Client Feedback</th>
            <th>Other Metrics</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map((data) => (
            <tr key={data.id}>
              <td>{data.employeeName}</td>
              <td>{data.projectCompletionRate}%</td>
              <td>{data.clientFeedback}</td>
              <td>{data.otherMetrics}</td>
              <td>
                <button onClick={() => handleMessageClick(data.employeeId)} className="btn btn-primary">Message</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
