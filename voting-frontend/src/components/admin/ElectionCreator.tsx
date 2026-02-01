import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';

interface Candidate {
  id: number;
  name: string;
}

const ElectionCreator: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>([{ id: 0, name: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index].name = value;
    setCandidates(newCandidates);
  };

  const addCandidate = () => {
    setCandidates([...candidates, { id: candidates.length, name: '' }]);
  };

  const removeCandidate = (index: number) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates.map((c, i) => ({ ...c, id: i })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/elections`,
        { name, description, candidates },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess(`Election created successfully! ID: ${response.data.id}`);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="election-creator-container">
      <h2>🗳️ Create New Election</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="election-form">
        <div className="form-group">
          <label>Election Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Student Council Election 2026"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the election purpose and rules..."
            rows={4}
            required
          />
        </div>

        <div className="candidates-section">
          <h3>Candidates</h3>
          {candidates.map((candidate, index) => (
            <div key={index} className="candidate-input">
              <input
                type="text"
                value={candidate.name}
                onChange={(e) => handleCandidateChange(index, e.target.value)}
                placeholder={`Candidate ${index + 1} Name`}
                required
              />
              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCandidate(index)}
                  className="btn-remove"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addCandidate} className="btn-secondary">
            + Add Candidate
          </button>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Creating...' : 'Create Election'}
        </button>
      </form>
    </div>
  );
};

export default ElectionCreator;