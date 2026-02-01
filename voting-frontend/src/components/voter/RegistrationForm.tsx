import React, { useState } from 'react';
import useWallet from '../../hooks/useWallet';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';

const RegistrationForm: React.FC = () => {
  const [organizationId, setOrganizationId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [electionId, setElectionId] = useState('1');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { account, isConnected, connectWallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isConnected || !account) {
      setError('Please connect your MetaMask wallet first');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/voters/register`, {
        election_id: parseInt(electionId),
        organization_id: organizationId,
        full_name: fullName,
        email: email,
        wallet_address: account
      });
      
      setSuccess('Registration successful! Wait for admin approval.');
      setOrganizationId('');
      setFullName('');
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <h2>🗓️ Voter Registration</h2>
      
      {!isConnected ? (
        <div className="wallet-prompt">
          <p>Please connect your MetaMask wallet to register</p>
          <button onClick={connectWallet} className="btn-primary">
            Connect MetaMask
          </button>
        </div>
      ) : (
        <>
          <p className="wallet-info">Wallet: {account}</p>
          
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label>Election ID:</label>
              <input
                type="number"
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Organization ID (e.g., S12345):</label>
              <input
                type="text"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                placeholder="S12345"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </>
      )}
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default RegistrationForm;