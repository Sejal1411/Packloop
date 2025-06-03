import express from 'express';
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, authorize } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', authorize('MCP'), orderController.createOrder);
router.get('/', orderController.getOrderDetails);

router.get('/:orderId', orderController.getOrderDetails);
router.get('/:stats/overview', orderController.getOrderStatistics);

router.post('/:orderId/assign', authorize('MCP'), orderController.assignOrder);

router.post('/:orderId/status', orderController.updateOrderStatus);

export default router;