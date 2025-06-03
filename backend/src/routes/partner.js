const express = require('/express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const partnerController = require('../controllers/partnerController');

router.use((req, res, next) => {
    console.log(`Partner route accesses: ${req.method} ${req.originalUrl}`);
    console.log('Request body:', req.body);
    console.log('User', req.user);
    next();
});

router.use(verifyToken);

router.get('/', getAllPartners);

router.post('/add', addPartner);

router.put('/:id', authorize('MCP'), deletePartner);
router.put('/:id', authorize('MCP'), updatePartner);

export default router;