# Emmanuel Management System

This project is an Employee Management System built with React for the frontend, Axios for handling HTTP requests, and SQL for the backend. It provides functionalities for managing employees, documents, announcements, performance data, and feedback. The application uses modals for adding and viewing details and ensures a responsive design with Bootstrap.

## Features

- **Dashboard**: Admin dashboard with navigation links to manage employees, profile, messages, calendar, performance, reports, attendance, documents, announcements, and feedback.
<img width="1440" alt="Screenshot 2024-05-30 at 1 07 36 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/ef55a60e-4d21-4596-af16-b408de4e2d28">

- **Employee Management**: Add, edit, delete, and view employee details.
<img width="1440" alt="Screenshot 2024-05-30 at 1 08 03 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/7b69a9ce-f602-482b-811b-e2aaead12366"> <img width="1440" alt="Screenshot 2024-05-30 at 1 08 09 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/e420b09a-abc8-49f7-abf2-29530c163b14"> <img width="1440" alt="Screenshot 2024-05-30 at 1 08 19 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/e8ce621c-1c23-4928-b72b-47ef336f9cb9">

- **Messages**: Share messages with your employees.
<img width="1440" alt="Screenshot 2024-05-30 at 1 08 34 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/ca04599a-405f-46af-aeca-6363063e9079">

- **Calendar**: Add company events in the calendar.
<img width="1440" alt="Screenshot 2024-05-30 at 1 08 52 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/ce96c3ae-c155-4554-ae00-79ddefe91351"> <img width="1440" alt="Screenshot 2024-05-30 at 1 09 02 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/f408d658-dd26-4191-ad44-37c76448d56c">

- **Documents**: Share documents with employees and view shared documents.
<img width="1440" alt="Screenshot 2024-05-30 at 1 11 06 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/51127232-8d5d-47fc-9226-9e18d453ce11"> <img width="1440" alt="Screenshot 2024-05-30 at 1 10 44 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/4d261a73-f7c4-415b-b290-c643d57c1ba4"> <img width="1440" alt="Screenshot 2024-05-30 at 1 10 57 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/5a26dbd5-af9e-4fa3-8c5a-7ee522978a42">

- **Announcements**: Add, filter, and view announcements. Users can comment on announcements.
<img width="1440" alt="Screenshot 2024-05-30 at 1 11 17 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/956bf26d-dda6-4a92-8381-8aeaf70becb3"> <img width="1440" alt="Screenshot 2024-05-30 at 1 11 26 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/8f2287fd-4c9c-4bc8-8f66-9777f88f9437">

- **Performance**: Add and view employee performance data.
<img width="1440" alt="Screenshot 2024-05-30 at 1 09 58 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/834d081f-da77-4342-a420-3327faff88db">

- **Reports**: View performance reports and message employees.
<img width="1440" alt="Screenshot 2024-05-30 at 1 10 06 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/7fda32be-ae83-4278-a97d-1ff2e4725eb9">

- **Attendance**: View and add attendance records.
<img width="1440" alt="Screenshot 2024-05-30 at 1 10 19 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/b93c9092-daf5-4bc0-99e1-7ecb91204401"> <img width="1440" alt="Screenshot 2024-05-30 at 1 10 27 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/b481ba99-0184-4e81-99c7-072eb9aa4d67">

- **Feedback**: View employee feedback.
<img width="1440" alt="Screenshot 2024-05-30 at 1 11 34 AM" src="https://github.com/mar19a/EmmanuelManagement/assets/84360137/600786f3-5944-4578-b623-7ef9a386499d">

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
