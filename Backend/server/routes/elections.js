const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Election management
router.post('/', electionController.createElection);
router.get('/', electionController.getAllElections);
router.get('/:id', electionController.getElection);
router.put('/:id/phase', electionController.updatePhase);
router.get('/:id/results', electionController.getResults);

module.exports = router;
