const express = require('express');
const router = express.Router();
const voterController = require('../controllers/voterController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes (voter registration)
router.post('/register', voterController.register);
router.get('/eligibility/:election_id/:wallet_address', voterController.checkEligibility);

// Admin routes
router.get('/:election_id/pending', authenticateToken, requireAdmin, voterController.getPendingVoters);
router.get('/:election_id/all', authenticateToken, requireAdmin, voterController.getAllVoters);
router.post('/:voter_id/approve', authenticateToken, requireAdmin, voterController.approveVoter);
router.post('/:voter_id/reject', authenticateToken, requireAdmin, voterController.rejectVoter);
router.post('/:election_id/sync', authenticateToken, requireAdmin, voterController.syncToBlockchain);

module.exports = router;
