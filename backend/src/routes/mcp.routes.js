import express from 'express';
import { getAllPartners,
    addPartner, 
    deletePartner, 
    updatePartnerRole, 
    trackPartnerStatus 
} from '../controllers/mcp/partner.controller.js';

import { getDashboardStats } from '../controllers/mcp/dashboard.controller.js';

import { assignOrder, 
    autoAssignOrder, 
    updateOrderStatus,
    getOrdersByPartners,
    getOrderReport,
} from '../controllers/mcp/order.controller.js';

import { addFundsToMCPWallet,
    transferToPartner,
    getTransactionHistory,
    getWalletBalance,
} from '../controllers/mcp/wallet.controller.js';

import { sendNotification,
    getNotification
} from '../controllers/mcp/notification.controller.js';


const router = express.Router();

// Dashboard
router.get('/dashboard', getDashboardStats);

// Partner Management
router.post('/partners', getAllPartners);
router.post('/partners/:partnerId', addPartner);
router.delete('/partners/:partnerId', deletePartner);
router.get('/partners/partner-status', trackPartnerStatus);
router.post('/partners/:partnerId', updatePartnerRole);

// Wallet
router.get('/wallet', getWalletBalance);
router.get('/wallet/transactions', getTransactionHistory);
router.post('/wallet/add', addFundsToMCPWallet);
router.post('/wallet/transfer', transferToPartner);

// Orders
router.post('/orders/:orderId/assign', assignOrder);
router.post('/orders/auto-assign', autoAssignOrder);
router.post('/orders/partner/:partnerId', getOrdersByPartners);
// router.get('/orders/reports', getOrderReport);

export default router;
