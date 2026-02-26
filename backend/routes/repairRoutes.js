const express = require('express');
const router = express.Router();
const repairCtrl = require('../controllers/repairController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { uploadRepairImages } = require('../middleware/upload');

router.post('/', optionalAuth, uploadRepairImages, repairCtrl.createBooking);
router.get('/track/:ticketRef', repairCtrl.trackRepair);
router.get('/my', authenticate, repairCtrl.getMyBookings);

module.exports = router;
