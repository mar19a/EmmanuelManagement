# Emmanuel Management System

This project is an Employee Management System built with React for the frontend, Axios for handling HTTP requests, and SQL for the backend. It provides functionalities for managing employees, documents, announcements, performance data, and feedback. The application uses modals for adding and viewing details and ensures a responsive design with Bootstrap.

## Features

- **Dashboard**: Admin dashboard with navigation links to manage employees, profile, messages, calendar, performance, reports, attendance, documents, announcements, and feedback.
- **Employee Management**: Add, edit, delete, and view employee details.
- **Messages**: Share messages with your employees.
- **Calendar**: Add company events in the calendar.
- **Documents**: Share documents with employees and view shared documents.
- **Announcements**: Add, filter, and view announcements. Users can comment on announcements.
- **Performance**: Add and view employee performance data.
- **Reports**: View performance reports and message employees.
- **Attendance**: View and add attendance records.
- **Feedback**: View employee feedback.

## Project Structure

- **Dashboard.jsx**: Main dashboard component for navigating through different sections.
- **Home.jsx**: Displays admin and employee counts, total salary, and list of admins.
- **AddEmployee.jsx**: Form to add new employees.
- **EditEmployee.jsx**: Form to edit existing employee details.
- **Profile.jsx**: Displays admin profile information.
- **Employee.jsx**: Displays a list of employees with options to edit and delete.
- **AdminMessages.jsx**: Handles messaging between admin and employees.
- **AdminCalendar.jsx**: Displays a calendar with events and allows adding new events.
- **Performance.jsx**: Displays and manages employee performance data.
- **Reports.jsx**: Displays performance reports and allows messaging employees.
- **Attendance.jsx**: Displays and manages attendance records.
- **AdminDocuments.jsx**: Manages document sharing with employees.
- **Announcements.jsx**: Manages announcements and comments.
- **AdminFeedback.jsx**: Displays employee feedback.

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mar19a/EmmanuelManagement.git
   cd EmmanuelManagement

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

### Configuration

Ensure your backend is running and available at http://localhost:8081. Update the URLs in the
Axios requests if necessary.

# Usage

### Dashboard

The dashboard provides navigation links to different sections:

- Dashboard: Main overview.
  
- Manage Employees: Add, edit, and view employees.
  
- Profile: View Admin Profile
  
- Messages: Admin and employee messaging.
  
- Calendar: View and add events.
  
- Performance: Add and view performance data.

- Reports: View performance reports and message employees.

- Attendance: View and add attendance records.

- Documents: Share and view documents.

- Announcements: Add, filter, and view announcements with comments.

- Feedback: View employee feedback.

### Adding Employees

Navigate to the "Manage Employees" section and click "Add Employee". 
Fill in the form and submit to add a new employee.

### Editing Employees

In the "Manage Employees" section, click "edit" next to an employee 
to edit their details. Update the form and submit.

### Document Sharing

Navigate to the "Documents" section. Select an employee and click 
"Add Document" to share a document. View shared documents in the table.

### Announcements

Navigate to the "Announcements" section. Add new announcements 
using the form, filter announcements, and view comments by clicking 
the "Comments" button.

### Performance Data

Navigate to the "Performance" section. Add new performance data 
using the form and view existing data in the table.

### Reports

Navigate to the "Reports" section to view performance reports. Click 
"Message" to send a message to an employee.

### Attendance

Navigate to the "Attendance" section. Click "Add Attendance" to add 
a new attendance record and view attendance data by date.

### Feedback

Navigate to the "Feedback" section to view feedback submitted by employees.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

### License

This project is licensed under the MIT License.

### Contact 

For any inquiries, please contact mariano@bu.edu
