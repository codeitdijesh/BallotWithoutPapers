import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './components/voter/RegistrationForm';
import VotingInterface from './components/voter/VotingInterface';
import ResultsDisplay from './components/voter/ResultsDisplay';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import ElectionCreator from './components/admin/ElectionCreator';
import VoterApproval from './components/admin/VoterApproval';
import PhaseManager from './components/admin/PhaseManager';
import Header from './components/shared/Header';
import ProtectedRoute from './components/shared/ProtectedRoute';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<RegistrationForm />} />
          <Route path="/voting" element={<VotingInterface />} />
          <Route path="/results" element={<ResultsDisplay />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/election/create" element={<ProtectedRoute><ElectionCreator /></ProtectedRoute>} />
          <Route path="/admin/voters/pending" element={<ProtectedRoute><VoterApproval /></ProtectedRoute>} />
          <Route path="/admin/elections/:id/phase" element={<ProtectedRoute><PhaseManager /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;