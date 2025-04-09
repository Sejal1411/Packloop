import express from 'express';

import {
    updateOrderStatus,
    acceptOrRejectOrder,
  } from '../controllers/partners/order.controller.js';

import {
    getMyTransactions,
  } from '../controllers/partners/wallet.controller.js';
  
import {
    getNotifications,
    sendNewOrderNotification,
    sendPaymentNotification,
  } from '../controllers/partners/notification.controller.js';

import {
    getPartnerDashboard,
  } from '../controllers/partners/dashboard.controller.js';
  
const router = express.Router();

// Dashboard
router.get('/dashboard', getPartnerDashboard);

// Order Management
router.get('/orders', acceptOrRejectOrder);
router.patch('/orders/:orderId/status', updateOrderStatus);

// Wallet
router.get('/wallet', getMyTransactions);


// Notifications
router.get('/notifications', getNotifications);
router.post('/notifications/new-order', sendNewOrderNotification);
router.post('/notifications/payment', sendPaymentNotification);

export default router;