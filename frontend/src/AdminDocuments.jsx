import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './AdminDocuments.css';

Modal.setAppElement('#root');

function AdminDocuments() {
  const [employees, setEmployees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null
  });
  const [selectedDocument, setSelectedDocument] = useState(null);

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
    setIsAddModalOpen(true);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('employeeId', selectedEmployee);
    if (formData.file) {
      data.append('file', formData.file);
    }
    axios.post('http://localhost:8081/documents', data)
      .then(res => {
        setIsAddModalOpen(false);
        setFormData({
          title: '',
          content: '',
          file: null
        });
        setSelectedEmployee('');
        fetchDocuments();
      })
      .catch(err => {
        console.error('Error uploading document:', err);
      });
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDocument(null);
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
            <th>Shared with</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id}>
              <td>{doc.title}</td>
              <td>{doc.content}</td>
              <td>{doc.employeeName}</td>
              <td>
                <button onClick={() => handleViewDocument(doc)} className="btn btn-secondary">View File</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} className="modal-content" overlayClassName="modal-overlay">
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
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
          <button type="button" onClick={closeAddModal} className="btn btn-secondary">Cancel</button>
        </form>
      </Modal>
      <Modal isOpen={isViewModalOpen} onRequestClose={closeViewModal} className="modal-content" overlayClassName="modal-overlay">
        {selectedDocument && (
          <>
            <h2>{selectedDocument.title}</h2>
            <p>{selectedDocument.content}</p>
            {selectedDocument.file_url ? (
              <iframe src={`http://localhost:8081${selectedDocument.file_url}`} width="100%" height="400px" title="Document File"></iframe>
            ) : (
              <p>No file attached</p>
            )}
            <button onClick={closeViewModal} className="btn btn-secondary mt-3">Close</button>
          </>
        )}
      </Modal>
    </div>
  );
}

export default AdminDocuments;
