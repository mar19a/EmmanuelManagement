import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDocuments.css';

Modal.setAppElement('#root');

function EmployeeDocuments() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [id]);

  const fetchDocuments = () => {
    axios.get(`http://localhost:8081/employee/${id}/documents`)
      .then(res => {
        setDocuments(res.data);
      })
      .catch(err => {
        console.error('Error fetching documents:', err);
      });
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="container">
      <h2>Your Documents</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (
            <tr key={doc.id}>
              <td>{doc.title}</td>
              <td>{doc.content}</td>
              <td>
                <button onClick={() => handleViewDocument(doc)} className="btn btn-secondary">View File</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default EmployeeDocuments;
