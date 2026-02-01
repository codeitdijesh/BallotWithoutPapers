import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';

interface Candidate {
  id: number;
  name: string;
}

interface Result {
  candidate_id: number;
  candidate_name: string;
  vote_count: number;
}

const ResultsDisplay: React.FC = () => {
  const [electionId, setElectionId] = useState('1');
  const [results, setResults] = useState<Result[]>([]);
  const [electionName, setElectionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    if (!electionId) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/api/elections/${electionId}/results`);
      setResults(response.data.results || []);
      setElectionName(response.data.election_name || `Election ${electionId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const totalVotes = results.reduce((sum, r) => sum + r.vote_count, 0);

  return (
    <div className="results-container">
      <h2>📊 Election Results</h2>

      <div className="election-selector">
        <label>Election ID:</label>
        <input
          type="number"
          value={electionId}
          onChange={(e) => setElectionId(e.target.value)}
        />
        <button onClick={fetchResults} className="btn-primary">
          Load Results
        </button>
      </div>

      {loading && <p>Loading results...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && results.length > 0 && (
        <>
          <h3>{electionName}</h3>
          <p className="total-votes">Total Votes: {totalVotes}</p>

          <div className="results-list">
            {results.map((result) => {
              const percentage = totalVotes > 0 
                ? ((result.vote_count / totalVotes) * 100).toFixed(1)
                : 0;

              return (
                <div key={result.candidate_id} className="result-item">
                  <div className="result-header">
                    <span className="candidate-name">{result.candidate_name}</span>
                    <span className="vote-count">{result.vote_count} votes ({percentage}%)</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && !error && results.length === 0 && electionId && (
        <p className="info-message">No results available yet. Votes may not have been revealed.</p>
      )}
    </div>
  );
};

export default ResultsDisplay;