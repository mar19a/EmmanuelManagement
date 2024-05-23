import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';

function Performance() {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    project_completion_rate: '',
    client_feedback: '',
    other_metrics: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchPerformanceData();
    fetchEmployees();
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

  const fetchEmployees = () => {
    axios.get('http://localhost:8081/employees')
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => {
        setError('Error fetching employees');
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/performance', formData)
      .then(res => {
        if (res.data.Status === 'Success') {
          fetchPerformanceData();
          setFormData({
            employee_id: '',
            project_completion_rate: '',
            client_feedback: '',
            other_metrics: ''
          });
          alert('Performance data added successfully');
        } else {
          alert('Error adding performance data: ' + res.data.Error);
        }
      })
      .catch(err => {
        alert('Error adding performance data');
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
      <form onSubmit={handleSubmit} className="performance-form">
        <div className="form-group">
          <label htmlFor="employee_id">Employee</label>
          <select name="employee_id" value={formData.employee_id} onChange={handleChange} required>
            <option value="">Select an employee</option>
            {employees.map(employee => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="project_completion_rate">Project Completion Rate (%)</label>
          <input type="number" name="project_completion_rate" value={formData.project_completion_rate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="client_feedback">Client Feedback</label>
          <input type="text" name="client_feedback" value={formData.client_feedback} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="other_metrics">Other Metrics</label>
          <input type="text" name="other_metrics" value={formData.other_metrics} onChange={handleChange} required />
        </div>
        <button type="submit">Add Performance</button>
      </form>
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
