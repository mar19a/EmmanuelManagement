import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
import './AdminDocuments.css';

Modal.setAppElement('#root');

function AdminDocuments() {
  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchDocuments();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:8081/employees')
      .then(res => {
        setEmployees(res.data);
      })
      .catch(err => {
        console.error('Error fetching employees:', err);
      });
  };

  const fetchDocuments = () => {
    axios.get('http://localhost:8081/documents')
      .then(res => {
        setDocuments(res.data);
      })
      .catch(err => {
        console.error('Error fetching documents:', err);
      });
  };

  const handleAddDocument = () => {
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('content', formData.content);
    uploadData.append('employeeId', selectedEmployee);
    if (file) {
      uploadData.append('file', file);
    }

    axios.post('http://localhost:8081/documents', uploadData)
      .then(res => {
        setIsModalOpen(false);
        setFormData({
          title: '',
          content: ''
        });
        setFile(null);
        setSelectedEmployee('');
        fetchDocuments();
      })
      .catch(err => {
        console.error('Error uploading document:', err);
      });
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container">
      <h2>Share Document</h2>
      <div className="mb-3">
        <label htmlFor="employeeSelect" className="form-label">Select Employee</label>
        <select
          id="employeeSelect"
          className="form-select"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Choose...</option>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
      </div>
      <button onClick={handleAddDocument} className="btn btn-primary">Add Document</button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>File</th>
            <th>Shared with</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id}>
              <td>{doc.title}</td>
              <td>{doc.content}</td>
              <td>{doc.fileUrl ? <a href={doc.fileUrl} download>Download</a> : 'No File'}</td>
              <td>{doc.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
        <h2>Add Document</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">File</label>
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop a file here, or click to select a file</p>
            </div>
            {file && <p>Selected file: {file.name}</p>}
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDocuments;
