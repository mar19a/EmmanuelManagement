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

  const handleLogout = () => {
    axios.get('http://localhost:8081/logout')
      .then(res => {
        navigate('/start');
      }).catch(err => console.log(err));
  };

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
              <li onClick={handleLogout}>
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
        </div>
      </div>
    </div>
  );
}

export default EmployeeDocuments;
