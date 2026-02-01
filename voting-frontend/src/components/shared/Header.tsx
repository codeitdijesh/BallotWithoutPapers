import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const token = localStorage.getItem('token');

  return (
    <header className="header">
      <h1 className="header-title">🗳️ Ballot Without Papers</h1>
      <nav className="header-nav">
        <Link to="/">Voter Registration</Link>
        <Link to="/voting">Vote</Link>
        <Link to="/results">Results</Link>
        {token ? (
          <Link to="/admin/dashboard">Dashboard</Link>
        ) : (
          <Link to="/admin/login">Admin Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;