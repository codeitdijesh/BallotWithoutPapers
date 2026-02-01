import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';

type Phase = 'setup' | 'commit' | 'reveal' | 'ended';

const PhaseManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [electionId, setElectionId] = useState(id || '1');
  const [currentPhase, setCurrentPhase] = useState<Phase>('setup');
  const [newPhase, setNewPhase] = useState<Phase>('setup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchCurrentPhase = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/elections/${electionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const phase = response.data.data?.election?.current_phase || 'setup';
      setCurrentPhase(phase);
      setNewPhase(phase);
    } catch (err) {
      console.error('Failed to fetch current phase', err);
      setError('Failed to fetch election data');
    }
  };

  useEffect(() => {
    if (electionId) {
      fetchCurrentPhase();
    }
  }, [electionId]);

  const handlePhaseChange = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `${API_BASE_URL}/api/elections/${electionId}/phase`,
        { phase: newPhase },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage(`Election phase updated to: ${newPhase}`);
      setCurrentPhase(newPhase);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update phase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phase-manager-container">
      <h2>⚡ Manage Election Phase</h2>

      <div className="election-selector">
        <label>Election ID:</label>
        <input
          type="number"
          value={electionId}
          onChange={(e) => setElectionId(e.target.value)}
        />
        <button onClick={fetchCurrentPhase} className="btn-secondary">
          Refresh
        </button>
      </div>

      <div className="phase-info">
        <p><strong>Current Phase:</strong> {currentPhase}</p>
      </div>

      <div className="phase-selector">
        <h3>Select New Phase:</h3>
        <div className="phase-options">
          <label className="phase-option">
            <input
              type="radio"
              name="phase"
              value="setup"
              checked={newPhase === 'setup'}
              onChange={(e) => setNewPhase(e.target.value as Phase)}
            />
            <div>
              <strong>Setup</strong>
              <p>Initial phase - voters register and get approved</p>
            </div>
          </label>

          <label className="phase-option">
            <input
              type="radio"
              name="phase"
              value="commit"
              checked={newPhase === 'commit'}
              onChange={(e) => setNewPhase(e.target.value as Phase)}
            />
            <div>
              <strong>Commit</strong>
              <p>Voters submit encrypted votes</p>
            </div>
          </label>

          <label className="phase-option">
            <input
              type="radio"
              name="phase"
              value="reveal"
              checked={newPhase === 'reveal'}
              onChange={(e) => setNewPhase(e.target.value as Phase)}
            />
            <div>
              <strong>Reveal</strong>
              <p>Voters reveal their votes</p>
            </div>
          </label>

          <label className="phase-option">
            <input
              type="radio"
              name="phase"
              value="ended"
              checked={newPhase === 'ended'}
              onChange={(e) => setNewPhase(e.target.value as Phase)}
            />
            <div>
              <strong>Ended</strong>
              <p>Election complete - results available</p>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handlePhaseChange}
        disabled={loading || newPhase === currentPhase}
        className="btn-primary"
      >
        {loading ? 'Updating...' : 'Update Phase'}
      </button>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default PhaseManager;