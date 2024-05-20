import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Start() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage and session storage
    console.log("Clearing local storage and session storage");
    localStorage.clear();
    sessionStorage.clear();

    // Remove all cookies
    console.log("Removing cookies");
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // Send a logout request to the server
    console.log("Sending logout request");
    axios.get('http://localhost:8081/logout', { withCredentials: true })
      .then(res => {
        console.log('Logged out successfully');
      })
      .catch(err => {
        console.log('Error during logout', err);
      });
  }, []);

  const handleNavigation = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm text-center'>
        <h2>Login As</h2>
        <div className='d-flex justify-content-between mt-5'>
          <button className='btn btn-primary btn-lg' onClick={() => handleNavigation('/employeeLogin')}>Employee</button>
          <button className='btn btn-success btn-lg' onClick={() => handleNavigation('/login')}>Admin</button>
        </div>
      </div>
    </div>
  );
}

export default Start;
