const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const pickupController = require('../controllers/pickupController');

router.use(verifyToken);

router.get('/my', pickupController.getMyPickups);

router.post('/create', authorize('MCP'), pickupController.createPickup);

router.get('/filter', authorize('MCP'), pickupController.filterPickups);

router.put('/:id/status', pickupController.updatePickupStatus);