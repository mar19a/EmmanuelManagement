import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Employee from './Employee';
import Profile from './Profile';
import Home from './Home';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import Start from './Start';
import EmployeeDetail from './EmployeeDetail';
import EmployeeLogin from './EmployeeLogin';
import SignUp from './SignUp';
import Messages from './Messages';
import AdminMessages from './AdminMessages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/start" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/employeeLogin" element={<EmployeeLogin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="profile" element={<Profile />} />
          <Route path="create" element={<AddEmployee />} />
          <Route path="employeeEdit/:id" element={<EditEmployee />} />
          <Route path="employeedetail/:id" element={<EmployeeDetail />} />
          <Route path="messages" element={<Messages />} /> 
          <Route path="adminMessages" element={<AdminMessages />} /> 
        </Route>
        <Route path="/employeedetail/:id" element={<EmployeeDetail />} />
        <Route path="/employeedetail/:id/messages" element={<Messages />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
