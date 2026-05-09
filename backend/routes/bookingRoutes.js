const express = require('express');
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
