const { query } = require('../config/database');
const blockchainService = require('../services/blockchain');
const { ethers } = require('ethers');

/**
 * Register as voter
 */
const register = async (req, res) => {
  try {
    const { election_id, organization_id, full_name, email, wallet_address } = req.body;

    // Validation
    if (!election_id || !organization_id || !full_name || !wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'All fields required: election_id, organization_id, full_name, wallet_address',
      });
    }

    // Validate wallet address
    if (!ethers.isAddress(wallet_address)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address',
      });
    }

    // Check if election exists and is in registration phase
    const electionResult = await query(
      'SELECT * FROM elections WHERE id = $1',
      [election_id]
    );

    if (electionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    const election = electionResult.rows[0];

    // Allow registration during setup and registration phases
    if (election.current_phase !== 'registration' && election.current_phase !== 'setup') {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this election',
      });
    }

    // Check for duplicates
    const duplicateCheck = await query(
      `SELECT * FROM voters 
       WHERE election_id = $1 
       AND (organization_id = $2 OR wallet_address = $3)`,
      [election_id, organization_id, wallet_address]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID or wallet address already registered for this election',
      });
    }

    // Insert voter
    const result = await query(
      `INSERT INTO voters (election_id, organization_id, full_name, email, wallet_address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [election_id, organization_id, full_name, email, wallet_address]
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful. Awaiting admin approval.',
      data: {
        voter: {
          id: result.rows[0].id,
          organization_id: result.rows[0].organization_id,
          full_name: result.rows[0].full_name,
          wallet_address: result.rows[0].wallet_address,
          registration_status: result.rows[0].registration_status,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

/**
 * Get pending voters (admin only)
 */
const getPendingVoters = async (req, res) => {
  try {
    const { election_id } = req.params;

    const result = await query(
      `SELECT * FROM voters 
       WHERE election_id = $1 AND registration_status = 'pending'
       ORDER BY registered_at DESC`,
      [election_id]
    );

    res.json({
      success: true,
      data: {
        voters: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get pending voters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending voters',
    });
  }
};

/**
 * Get all voters for election (admin only)
 */
const getAllVoters = async (req, res) => {
  try {
    const { election_id } = req.params;
    const { status } = req.query;

    let queryText = 'SELECT * FROM voters WHERE election_id = $1';
    const params = [election_id];

    if (status) {
      queryText += ' AND registration_status = $2';
      params.push(status);
    }

    queryText += ' ORDER BY registered_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: {
        voters: result.rows,
        count: result.rows.length,
      },
    });
  } catch (error) {
    console.error('Get voters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch voters',
    });
  }
};

/**
 * Approve voter (admin only)
 */
const approveVoter = async (req, res) => {
  try {
    const { voter_id } = req.params;

    // Get voter
    const voterResult = await query(
      'SELECT * FROM voters WHERE id = $1',
      [voter_id]
    );

    if (voterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voter not found',
      });
    }

    const voter = voterResult.rows[0];

    if (voter.registration_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Voter already processed',
      });
    }

    // Update voter status
    await query(
      `UPDATE voters 
       SET registration_status = 'approved', 
           approved_by = $1, 
           approved_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [req.admin.id, voter_id]
    );

    res.json({
      success: true,
      message: 'Voter approved successfully',
      data: {
        voter_id,
        note: 'Voter will be synced to blockchain in next batch',
      },
    });
  } catch (error) {
    console.error('Approve voter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve voter',
    });
  }
};

/**
 * Reject voter (admin only)
 */
const rejectVoter = async (req, res) => {
  try {
    const { voter_id } = req.params;
    const { reason } = req.body;

    // Get voter
    const voterResult = await query(
      'SELECT * FROM voters WHERE id = $1',
      [voter_id]
    );

    if (voterResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Voter not found',
      });
    }

    const voter = voterResult.rows[0];

    if (voter.registration_status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Voter already processed',
      });
    }

    // Update voter status
    await query(
      `UPDATE voters 
       SET registration_status = 'rejected', 
           rejection_reason = $1,
           approved_by = $2, 
           approved_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [reason || 'Invalid credentials', req.admin.id, voter_id]
    );

    res.json({
      success: true,
      message: 'Voter rejected',
      data: {
        voter_id,
        reason: reason || 'Invalid credentials',
      },
    });
  } catch (error) {
    console.error('Reject voter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject voter',
    });
  }
};

/**
 * Sync approved voters to blockchain (admin only)
 */
const syncToBlockchain = async (req, res) => {
  try {
    const { election_id } = req.params;

    // Get election
    const electionResult = await query(
      'SELECT * FROM elections WHERE id = $1',
      [election_id]
    );

    if (electionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    const election = electionResult.rows[0];

    // Get approved voters not yet synced
    const votersResult = await query(
      `SELECT * FROM voters 
       WHERE election_id = $1 
       AND registration_status = 'approved' 
       AND blockchain_synced = false`,
      [election_id]
    );

    if (votersResult.rows.length === 0) {
      return res.json({
        success: true,
        message: 'No voters to sync',
        data: {
          synced: 0,
        },
      });
    }

    const addresses = votersResult.rows.map(v => v.wallet_address);

    console.log(`🔄 Syncing ${addresses.length} voters to blockchain...`);

    // Add to blockchain
    const results = await blockchainService.addVotersBatch(
      election.contract_address,
      addresses
    );

    // Mark as synced
    const voterIds = votersResult.rows.map(v => v.id);
    await query(
      `UPDATE voters 
       SET blockchain_synced = true 
       WHERE id = ANY($1::int[])`,
      [voterIds]
    );

    res.json({
      success: true,
      message: 'Voters synced to blockchain',
      data: {
        synced: addresses.length,
        transactions: results,
      },
    });
  } catch (error) {
    console.error('Sync to blockchain error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync to blockchain',
      error: error.message,
    });
  }
};

/**
 * Check voter eligibility
 */
const checkEligibility = async (req, res) => {
  try {
    const { election_id, wallet_address } = req.params;

    // Get election
    const electionResult = await query(
      'SELECT * FROM elections WHERE id = $1',
      [election_id]
    );

    if (electionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Election not found',
      });
    }

    const election = electionResult.rows[0];

    // Check in database
    const voterResult = await query(
      `SELECT * FROM voters 
       WHERE election_id = $1 AND wallet_address = $2`,
      [election_id, wallet_address]
    );

    const dbEligible = voterResult.rows.length > 0 
      && voterResult.rows[0].registration_status === 'approved';

    // Check on blockchain
    const blockchainEligible = await blockchainService.isEligible(
      election.contract_address,
      wallet_address
    );

    res.json({
      success: true,
      data: {
        eligible: dbEligible && blockchainEligible,
        registration_status: voterResult.rows[0]?.registration_status || 'not_registered',
        blockchain_synced: blockchainEligible,
      },
    });
  } catch (error) {
    console.error('Check eligibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility',
    });
  }
};

module.exports = {
  register,
  getPendingVoters,
  getAllVoters,
  approveVoter,
  rejectVoter,
  syncToBlockchain,
  checkEligibility,
};
