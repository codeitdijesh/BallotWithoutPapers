// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Election
 * @dev Implements a secure voting system with commit-reveal scheme for vote privacy
 * @notice This contract manages elections with voter eligibility, two-phase voting, and transparent results
 */
contract Election is Ownable, ReentrancyGuard {
    
    // ============ Enums ============
    
    enum Phase {
        Registration,  // Admin can add voters
        Commit,       // Voters submit vote commitments
        Reveal,       // Voters reveal their votes
        Ended         // Election finished, results available
    }
    
    // ============ Structs ============
    
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }
    
    struct Commitment {
        bytes32 commitHash;
        bool revealed;
    }
    
    // ============ State Variables ============
    
    string public electionName;
    Phase public currentPhase;
    
    // Voter management
    mapping(address => bool) public eligibleVoters;
    mapping(address => bool) public hasCommitted;
    mapping(address => Commitment) public commitments;
    uint256 public totalEligibleVoters;
    uint256 public totalCommitments;
    uint256 public totalRevealed;
    
    // Candidates
    Candidate[] public candidates;
    mapping(uint256 => bool) public validCandidateId;
    
    // ============ Events ============
    
    event ElectionCreated(string name, uint256 candidateCount);
    event VoterAdded(address indexed voter);
    event VoterRemoved(address indexed voter);
    event VotersAddedBatch(uint256 count);
    event PhaseChanged(Phase newPhase);
    event VoteCommitted(address indexed voter);
    event VoteRevealed(address indexed voter, uint256 candidateId);
    event ElectionEnded(uint256 totalVotes);
    
    // ============ Modifiers ============
    
    modifier inPhase(Phase _phase) {
        require(currentPhase == _phase, "Invalid phase for this operation");
        _;
    }
    
    modifier onlyEligibleVoter() {
        require(eligibleVoters[msg.sender], "Not an eligible voter");
        _;
    }
    
    // ============ Constructor ============
    
    /**
     * @dev Initialize election with name and candidates
     * @param _electionName Name of the election
     * @param _candidateNames Array of candidate names
     */
    constructor(
        string memory _electionName,
        string[] memory _candidateNames
    ) Ownable(msg.sender) {
        require(_candidateNames.length >= 2, "Need at least 2 candidates");
        require(_candidateNames.length <= 50, "Too many candidates");
        require(bytes(_electionName).length > 0, "Election name required");
        
        electionName = _electionName;
        currentPhase = Phase.Registration;
        
        // Initialize candidates
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            require(bytes(_candidateNames[i]).length > 0, "Empty candidate name");
            candidates.push(Candidate({
                id: i,
                name: _candidateNames[i],
                voteCount: 0
            }));
            validCandidateId[i] = true;
        }
        
        emit ElectionCreated(_electionName, _candidateNames.length);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @dev Add a single eligible voter
     * @param _voter Address of the voter to add
     */
    function addVoter(address _voter) external onlyOwner inPhase(Phase.Registration) {
        require(_voter != address(0), "Invalid address");
        require(!eligibleVoters[_voter], "Already registered");
        
        eligibleVoters[_voter] = true;
        totalEligibleVoters++;
        
        emit VoterAdded(_voter);
    }
    
    /**
     * @dev Add multiple voters in batch (gas efficient)
     * @param _voters Array of voter addresses
     */
    function addVotersBatch(address[] calldata _voters) external onlyOwner inPhase(Phase.Registration) {
        require(_voters.length > 0, "Empty array");
        require(_voters.length <= 100, "Batch too large");
        
        uint256 addedCount = 0;
        for (uint256 i = 0; i < _voters.length; i++) {
            address voter = _voters[i];
            if (voter != address(0) && !eligibleVoters[voter]) {
                eligibleVoters[voter] = true;
                addedCount++;
                emit VoterAdded(voter);
            }
        }
        
        totalEligibleVoters += addedCount;
        emit VotersAddedBatch(addedCount);
    }
    
    /**
     * @dev Remove a voter during registration phase
     * @param _voter Address of the voter to remove
     */
    function removeVoter(address _voter) external onlyOwner inPhase(Phase.Registration) {
        require(eligibleVoters[_voter], "Not registered");
        
        eligibleVoters[_voter] = false;
        totalEligibleVoters--;
        
        emit VoterRemoved(_voter);
    }
    
    /**
     * @dev Start the commit phase (voting begins)
     */
    function startCommitPhase() external onlyOwner inPhase(Phase.Registration) {
        require(totalEligibleVoters > 0, "No voters registered");
        currentPhase = Phase.Commit;
        emit PhaseChanged(Phase.Commit);
    }
    
    /**
     * @dev Start the reveal phase
     */
    function startRevealPhase() external onlyOwner inPhase(Phase.Commit) {
        require(totalCommitments > 0, "No votes committed");
        currentPhase = Phase.Reveal;
        emit PhaseChanged(Phase.Reveal);
    }
    
    /**
     * @dev End the election
     */
    function endElection() external onlyOwner inPhase(Phase.Reveal) {
        currentPhase = Phase.Ended;
        emit PhaseChanged(Phase.Ended);
        emit ElectionEnded(totalRevealed);
    }
    
    // ============ Voting Functions ============
    
    /**
     * @dev Commit a vote (phase 1 of voting)
     * @param _commitHash Hash of (candidateId + salt)
     * @notice Generate hash off-chain: keccak256(abi.encodePacked(candidateId, salt))
     */
    function commitVote(bytes32 _commitHash) 
        external 
        onlyEligibleVoter 
        inPhase(Phase.Commit) 
        nonReentrant 
    {
        require(!hasCommitted[msg.sender], "Already committed");
        require(_commitHash != bytes32(0), "Invalid hash");
        
        commitments[msg.sender] = Commitment({
            commitHash: _commitHash,
            revealed: false
        });
        
        hasCommitted[msg.sender] = true;
        totalCommitments++;
        
        emit VoteCommitted(msg.sender);
    }
    
    /**
     * @dev Reveal a vote (phase 2 of voting)
     * @param _candidateId The candidate ID voted for
     * @param _salt The secret salt used in commitment
     */
    function revealVote(uint256 _candidateId, bytes32 _salt) 
        external 
        onlyEligibleVoter 
        inPhase(Phase.Reveal) 
        nonReentrant 
    {
        require(hasCommitted[msg.sender], "No commitment found");
        require(!commitments[msg.sender].revealed, "Already revealed");
        require(validCandidateId[_candidateId], "Invalid candidate");
        
        // Verify the commitment
        bytes32 computedHash = keccak256(abi.encodePacked(_candidateId, _salt));
        require(
            commitments[msg.sender].commitHash == computedHash,
            "Hash mismatch - invalid reveal"
        );
        
        // Mark as revealed and count the vote
        commitments[msg.sender].revealed = true;
        candidates[_candidateId].voteCount++;
        totalRevealed++;
        
        emit VoteRevealed(msg.sender, _candidateId);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get election results
     * @return Array of candidates with vote counts
     */
    function getResults() external view returns (Candidate[] memory) {
        return candidates;
    }
    
    /**
     * @dev Get total number of candidates
     */
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }
    
    /**
     * @dev Get specific candidate details
     */
    function getCandidate(uint256 _candidateId) 
        external 
        view 
        returns (uint256 id, string memory name, uint256 voteCount) 
    {
        require(_candidateId < candidates.length, "Invalid candidate ID");
        Candidate memory c = candidates[_candidateId];
        return (c.id, c.name, c.voteCount);
    }
    
    /**
     * @dev Check if an address is eligible to vote
     */
    function isEligible(address _voter) external view returns (bool) {
        return eligibleVoters[_voter];
    }
    
    /**
     * @dev Check if an address has committed a vote
     */
    function hasVoted(address _voter) external view returns (bool) {
        return hasCommitted[_voter];
    }
    
    /**
     * @dev Check if an address has revealed their vote
     */
    function hasRevealed(address _voter) external view returns (bool) {
        return commitments[_voter].revealed;
    }
    
    /**
     * @dev Get current election phase
     */
    function getCurrentPhase() external view returns (string memory) {
        if (currentPhase == Phase.Registration) return "Registration";
        if (currentPhase == Phase.Commit) return "Commit";
        if (currentPhase == Phase.Reveal) return "Reveal";
        return "Ended";
    }
    
    /**
     * @dev Get election statistics
     */
    function getStats() external view returns (
        uint256 eligible,
        uint256 committed,
        uint256 revealed,
        string memory phase
    ) {
        return (
            totalEligibleVoters,
            totalCommitments,
            totalRevealed,
            this.getCurrentPhase()
        );
    }
    
    /**
     * @dev Get the winner (only after election ended)
     * @return winnerId The ID of the winning candidate
     * @return winnerName The name of the winner
     * @return winnerVotes Number of votes received
     */
    function getWinner() external view returns (
        uint256 winnerId,
        string memory winnerName,
        uint256 winnerVotes
    ) {
        require(currentPhase == Phase.Ended, "Election not ended");
        require(candidates.length > 0, "No candidates");
        
        uint256 maxVotes = 0;
        uint256 winningId = 0;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningId = i;
            }
        }
        
        return (winningId, candidates[winningId].name, maxVotes);
    }
}
