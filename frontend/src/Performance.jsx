import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';

function Performance() {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = () => {
    axios.get('http://localhost:8081/performance')
      .then(res => {
        setPerformanceData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching performance data');
        setLoading(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2>Employee Performance</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project Completion Rate</th>
            <th>Client Feedback</th>
            <th>Other Metrics</th>
          </tr>
        </thead>
        <tbody>
          {performanceData.map((data, index) => (
            <tr key={index}>
              <td>{data.employeeName}</td>
              <td>{data.projectCompletionRate}%</td>
              <td>{data.clientFeedback}</td>
              <td>{data.otherMetrics}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Performance;
