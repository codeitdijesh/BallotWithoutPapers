const { query } = require('../config/database');
const blockchainService = require('../services/blockchain');

/**
 * Create new election
 */
const createElection = async (req, res) => {
  try {
    const { name, description, candidates } = req.body;

    // Validation
    if (!name || !candidates || candidates.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Election name and at least 2 candidates required',
      });
    }

    // Deploy smart contract
    console.log('🚀 Deploying election contract...');
    const candidateNames = candidates.map(c => c.name);
    const contractAddress = await blockchainService.deployElection(name, candidateNames);

    // Store in database
    const result = await query(
      `INSERT INTO elections (contract_address, name, description, candidates, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [contractAddress, name, description, JSON.stringify(candidates), req.admin.id]
    );

    res.status(201).json({
      success: true,
      message: 'Election created successfully',
      data: {
        election: result.rows[0],
      },
    });
  } catch (error) {
    console.error('Create election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create election',
      error: error.message,
    });
  }
};

/**
 * Get all elections
 */
const getAllElections = async (req, res) => {
  try {
    const result = await query(
      `SELECT e.*, a.full_name as created_by_name
       FROM elections e
       LEFT JOIN admins a ON e.created_by = a.id
       ORDER BY e.created_at DESC`
    );

    res.json({
      success: true,
      data: {
        elections: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get elections error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch elections',
    });
  }
};

/**
 * Get single election
 */
const getElection = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT e.*, a.full_name as created_by_name,
       (SELECT COUNT(*) FROM voters WHERE election_id = e.id) as total_voters,
       (SELECT COUNT(*) FROM voters WHERE election_id = e.id AND registration_status = 'approved') as approved_voters,
       (SELECT COUNT(*) FROM voters WHERE election_id = e.id AND registration_status = 'pending') as pending_voters
       FROM elections e
       LEFT JOIN admins a ON e.created_by = a.id
       WHERE e.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    // Get blockchain stats
    const election = result.rows[0];
    try {
      const stats = await blockchainService.getStats(election.contract_address);
      election.blockchain_stats = stats;
    } catch (error) {
      console.error('Failed to fetch blockchain stats:', error.message);
    }

    res.json({
      success: true,
      data: {
        election,
      },
    });
  } catch (error) {
    console.error('Get election error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch election',
    });
  }
};

/**
 * Update election phase
 */
const updatePhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;

    // Valid phases: setup, registration, commit, reveal, ended
    const validPhases = ['setup', 'registration', 'commit', 'reveal', 'ended'];
    if (!validPhases.includes(phase)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phase',
      });
    }

    // Get election
    const electionResult = await query(
      'SELECT * FROM elections WHERE id = $1',
      [id]
    );

    if (electionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    const election = electionResult.rows[0];

    // Update blockchain (only needed for commit, reveal, and ended phases)
    try {
      if (phase === 'commit') {
        await blockchainService.startCommitPhase(election.contract_address);
      } else if (phase === 'reveal') {
        await blockchainService.startRevealPhase(election.contract_address);
      } else if (phase === 'ended') {
        await blockchainService.endElection(election.contract_address);
      }
      // setup and registration phases don't need blockchain updates
    } catch (error) {
      console.error('Blockchain update error:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to update blockchain phase',
        error: error.message,
      });
    }

    // Update database
    await query(
      'UPDATE elections SET current_phase = $1 WHERE id = $2',
      [phase, id]
    );

    res.json({
      success: true,
      message: `Phase updated to ${phase}`,
      data: {
        phase,
      },
    });
  } catch (error) {
    console.error('Update phase error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update phase',
    });
  }
};

/**
 * Get election results
 */
const getResults = async (req, res) => {
  try {
    const { id } = req.params;

    // Get election
    const electionResult = await query(
      'SELECT * FROM elections WHERE id = $1',
      [id]
    );

    if (electionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    const election = electionResult.rows[0];

    // Get results from blockchain
    const results = await blockchainService.getResults(election.contract_address);
    const stats = await blockchainService.getStats(election.contract_address);
    
    let winner = null;
    if (election.current_phase === 'ended') {
      winner = await blockchainService.getWinner(election.contract_address);
    }

    res.json({
      success: true,
      data: {
        election: {
          id: election.id,
          name: election.name,
          phase: election.current_phase,
        },
        results,
        stats,
        winner,
      },
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch results',
      error: error.message,
    });
  }
};

module.exports = {
  createElection,
  getAllElections,
  getElection,
  updatePhase,
  getResults,
};
