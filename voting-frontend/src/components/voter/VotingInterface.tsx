import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import useWallet from '../../hooks/useWallet';
import { API_BASE_URL } from '../../utils/constants';
import axios from 'axios';
import ElectionABI from '../../contracts/Election.json';

interface Candidate {
  id: number;
  name: string;
}

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Update from deployment

const VotingInterface: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const [electionId, setElectionId] = useState('1');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [phase, setPhase] = useState('');
  const [hasCommitted, setHasCommitted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (electionId) {
      fetchElectionInfo();
    }
    checkLocalStorage();
  }, [electionId]);

  const fetchElectionInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/elections/${electionId}`);
      setCandidates(response.data.candidates || []);
      setPhase(response.data.phase || 'setup');
    } catch (err) {
      console.error('Failed to fetch election info:', err);
    }
  };

  const checkLocalStorage = () => {
    const committed = localStorage.getItem(`vote_committed_${electionId}`);
    const revealed = localStorage.getItem(`vote_revealed_${electionId}`);
    setHasCommitted(!!committed);
    setHasRevealed(!!revealed);
  };

  const generateSalt = (): string => {
    return ethers.hexlify(ethers.randomBytes(32));
  };

  const handleCommitVote = async () => {
    if (!isConnected || !account) {
      setError('Please connect wallet');
      return;
    }
    
    if (selectedCandidate === null) {
      setError('Please select a candidate');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Check eligibility
      const eligibilityCheck = await axios.get(
        `${API_BASE_URL}/api/voters/eligibility/${electionId}/${account}`
      );

      if (!eligibilityCheck.data.eligible) {
        throw new Error('You are not eligible to vote in this election');
      }

      // Generate salt and compute hash
      const salt = generateSalt();
      const abiCoder = ethers.AbiCoder.defaultAbiCoder();
      const encoded = abiCoder.encode(['uint256', 'bytes32'], [selectedCandidate, salt]);
      const hash = ethers.keccak256(encoded);

      // Connect to contract
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ElectionABI.abi, signer);

      // Commit vote
      const tx = await contract.commitVote(hash);
      setMessage('Transaction submitted. Waiting for confirmation...');
      await tx.wait();

      // Store salt locally
      localStorage.setItem(`vote_salt_${electionId}`, salt);
      localStorage.setItem(`vote_candidate_${electionId}`, selectedCandidate.toString());
      localStorage.setItem(`vote_committed_${electionId}`, 'true');
      
      setHasCommitted(true);
      setMessage('Vote committed successfully! Remember to reveal during reveal phase.');
    } catch (err: any) {
      setError(err.message || 'Failed to commit vote');
    } finally {
      setLoading(false);
    }
  };

  const handleRevealVote = async () => {
    if (!isConnected || !account) {
      setError('Please connect wallet');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Retrieve stored values
      const salt = localStorage.getItem(`vote_salt_${electionId}`);
      const candidateId = localStorage.getItem(`vote_candidate_${electionId}`);

      if (!salt || !candidateId) {
        throw new Error('No committed vote found. Please commit first.');
      }

      // Connect to contract
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ElectionABI.abi, signer);

      // Reveal vote
      const tx = await contract.revealVote(parseInt(candidateId), salt);
      setMessage('Revealing vote. Waiting for confirmation...');
      await tx.wait();

      localStorage.setItem(`vote_revealed_${electionId}`, 'true');
      setHasRevealed(true);
      setMessage('Vote revealed successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to reveal vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voting-container">
      <h2>🗳️ Cast Your Vote</h2>

      {!isConnected ? (
        <div className="wallet-prompt">
          <p>Please connect your MetaMask wallet to vote</p>
          <button onClick={connectWallet} className="btn-primary">
            Connect MetaMask
          </button>
        </div>
      ) : (
        <>
          <p className="wallet-info">Wallet: {account}</p>
          <p className="phase-info">Current Phase: <strong>{phase}</strong></p>

          <div className="election-selector">
            <label>Election ID:</label>
            <input
              type="number"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
            />
          </div>

          {candidates.length > 0 && (
            <div className="candidates-list">
              <h3>Select Candidate:</h3>
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-item">
                  <label>
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate.id}
                      checked={selectedCandidate === candidate.id}
                      onChange={() => setSelectedCandidate(candidate.id)}
                      disabled={hasCommitted}
                    />
                    {candidate.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="voting-actions">
            {phase === 'commit' && !hasCommitted && (
              <button
                onClick={handleCommitVote}
                disabled={loading || selectedCandidate === null}
                className="btn-primary"
              >
                {loading ? 'Committing...' : 'Commit Vote'}
              </button>
            )}

            {phase === 'reveal' && hasCommitted && !hasRevealed && (
              <button
                onClick={handleRevealVote}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Revealing...' : 'Reveal Vote'}
              </button>
            )}

            {hasCommitted && (
              <p className="info-message">✅ Vote committed</p>
            )}
            
            {hasRevealed && (
              <p className="success-message">✅ Vote revealed successfully!</p>
            )}
          </div>

          {message && <p className="info-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </>
      )}
    </div>
  );
};

export default VotingInterface;