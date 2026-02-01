import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';

interface Voter {
  id: number;
  organization_id: string;
  full_name: string;
  email: string;
  wallet_address: string;
  registration_status: string;
}

const VoterApproval: React.FC = () => {
  const [electionId, setElectionId] = useState('6');
  const [pendingVoters, setPendingVoters] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showAll, setShowAll] = useState(false);

  const fetchPendingVoters = async () => {
    if (!electionId) return;
    
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const endpoint = showAll 
        ? `${API_BASE_URL}/api/voters/${electionId}/all`
        : `${API_BASE_URL}/api/voters/${electionId}/pending`;
      
      const response = await axios.get(
        endpoint,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingVoters(response.data.data.voters || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch voters');
      console.error('Error fetching voters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVoters();
  }, [electionId, showAll]);

  const handleApprove = async (voterId: number) => {
    const token = localStorage.getItem('token');
    setMessage('');
    setError('');

    try {
      await axios.post(
        `${API_BASE_URL}/api/voters/${voterId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Voter ${voterId} approved successfully`);
      fetchPendingVoters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve voter');
    }
  };

  const handleReject = async (voterId: number) => {
    const token = localStorage.getItem('token');
    setMessage('');
    setError('');

    const reason = prompt('Enter rejection reason (optional):');

    try {
      await axios.post(
        `${API_BASE_URL}/api/voters/${voterId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Voter ${voterId} rejected`);
      fetchPendingVoters();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject voter');
    }
  };

  const handleSync = async (voterId: number) => {
    const token = localStorage.getItem('token');
    setMessage('');
    setError('');

    try {
      await axios.post(
        `${API_BASE_URL}/api/voters/${voterId}/sync`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Voter ${voterId} synced to blockchain`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sync voter');
    }
  };

  return (
    <div className="voter-approval-container">
      <div className="page-header">
        <h2>👥 Voter Management</h2>
        <p className="subtitle">Review and approve voter registrations</p>
      </div>

      <div className="controls-bar">
        <div className="election-selector">
          <label htmlFor="electionId">Election ID:</label>
          <input
            id="electionId"
            type="number"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
            className="election-input"
          />
        </div>

        <div className="filter-toggle">
          <input
            type="checkbox"
            id="showAll"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="toggle-checkbox"
          />
          <label htmlFor="showAll" className="toggle-label">
            Show all voters
          </label>
        </div>

        <button onClick={fetchPendingVoters} className="btn-refresh">
          🔄 Refresh
        </button>
      </div>

      {message && (
        <div className="alert alert-success">
          ✅ {message}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading voters...</p>
        </div>
      )}

      {!loading && pendingVoters.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>{showAll ? 'No Voters Found' : 'No Pending Approvals'}</h3>
          <p>
            {showAll 
              ? 'No voters have registered for this election yet.' 
              : 'All voters have been processed. Check back later!'}
          </p>
        </div>
      )}

      {!loading && pendingVoters.length > 0 && (
        <>
          <div className="voters-summary">
            <span className="summary-badge">
              {pendingVoters.length} {showAll ? 'total' : 'pending'} voter{pendingVoters.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="table-container">
            <table className="voters-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Organization ID</th>
                  <th>Email</th>
                  <th>Wallet Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVoters.map((voter) => (
                  <tr key={voter.id} className={`voter-row ${voter.registration_status}`}>
                    <td className="voter-id">#{voter.id}</td>
                    <td className="voter-name">
                      <strong>{voter.full_name}</strong>
                    </td>
                    <td className="org-id">{voter.organization_id}</td>
                    <td className="voter-email">{voter.email}</td>
                    <td className="wallet-address">
                      <code>{voter.wallet_address.slice(0, 6)}...{voter.wallet_address.slice(-4)}</code>
                    </td>
                    <td>
                      <span className={`status-badge status-${voter.registration_status}`}>
                        {voter.registration_status === 'pending' && '⏳'}
                        {voter.registration_status === 'approved' && '✅'}
                        {voter.registration_status === 'rejected' && '❌'}
                        {' '}{voter.registration_status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      {voter.registration_status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleApprove(voter.id)}
                            className="btn btn-approve"
                            title="Approve this voter"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(voter.id)}
                            className="btn btn-reject"
                            title="Reject this voter"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {voter.registration_status === 'approved' && (
                        <button
                          onClick={() => handleSync(voter.id)}
                          className="btn btn-sync"
                          title="Sync to blockchain"
                        >
                          🔗 Sync to Chain
                        </button>
                      )}
                      {voter.registration_status === 'rejected' && (
                        <span className="rejected-text">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default VoterApproval;