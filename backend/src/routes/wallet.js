const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', walletController.getWalletDetails);

router.get('/transactions', walletController.getPartnerTransactions);

router.post('/add-funds', authorize('MCP'), walletController.addFunds);

router.post('/transfer', authorize('MCP'), walletController.transferToPartner);

router.post('/withdraw', walletController.withdrawFunds);

export default router;



