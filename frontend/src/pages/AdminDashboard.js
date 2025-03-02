import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import UserManagement from './UserManagement';
import ExamManagement from './ExamManagement';
import DashboardOverview from '../components/DashboardOverview';

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('overview');

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar onPageChange={handlePageChange} />
        <div style={{ marginLeft: '240px', padding: '20px', flexGrow: 1 }}>
          <Navbar />
          <div className="content">
            {/* Conditionally render the active page */}
            {activePage === 'overview' && <DashboardOverview />}
            {activePage === 'users' && <UserManagement />}
            {activePage === 'exams' && <ExamManagement />}
          </div>
        </div>
      </div>
      <footer className="footer">
    <button className="logout-button" onClick={onLogout}>
    Logout
  </button>
</footer>

    </div>
  );
};

export default AdminDashboard;
