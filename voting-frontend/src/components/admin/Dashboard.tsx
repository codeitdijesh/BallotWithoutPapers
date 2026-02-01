import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="dashboard-container">
      <h1>🏛️ Admin Dashboard</h1>
      
      <div className="dashboard-grid">
        <Link to="/admin/election/create" className="dashboard-card">
          <h3>🗳️ Create Election</h3>
          <p>Set up a new election with candidates</p>
        </Link>

        <Link to="/admin/voters/pending" className="dashboard-card">
          <h3>✅ Approve Voters</h3>
          <p>Review and approve pending voter registrations</p>
        </Link>

        <Link to="/admin/elections/1/phase" className="dashboard-card">
          <h3>⚡ Manage Phases</h3>
          <p>Control election phases (setup/commit/reveal/ended)</p>
        </Link>
      </div>

      <button onClick={handleLogout} className="btn-secondary">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;