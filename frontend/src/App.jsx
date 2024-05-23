import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';
import Employee from './Employee.jsx';
import Profile from './Profile.jsx';
import Home from './Home.jsx';
import AddEmployee from './AddEmployee.jsx';
import EditEmployee from './EditEmployee.jsx';
import Start from './Start.jsx';
import EmployeeDetail from './EmployeeDetail.jsx';
import EmployeeLogin from './EmployeeLogin.jsx';
import SignUp from './SignUp.jsx';
import Messages from './Messages.jsx';
import AdminMessages from './AdminMessages.jsx';
import AdminCalendar from './AdminCalendar.jsx';
import Performance from './Performance';
import Reports from './Reports';
import Attendance from './Attendance';

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
          <Route path="calendar" element={<AdminCalendar />} />
          <Route path="performance" element={<Performance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
        <Route path="/employeedetail/:id" element={<EmployeeDetail />} />
        <Route path="/employeedetail/:id/messages" element={<Messages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
