const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const AppError = require('../utils/AppError');
const { isNonEmptyString, normalizeDateKey } = require('../utils/date');

const allowedStatuses = ['Pending', 'Confirmed', 'Completed'];

const getMatchingSlot = (slots, bookingDate, normalizedTimeSlot) => {
  if (!Array.isArray(slots)) return null;

  return slots.find(
    (slot) => slot.bookingDate === bookingDate && slot.timeSlot.trim().toLowerCase() === normalizedTimeSlot
  );
};

const createBooking = async (req, res, next) => {
  try {
    const { expertId, customerName, email, phone, bookingDate, timeSlot, notes = '' } = req.body;

    if (!expertId || !customerName || !email || !phone || !bookingDate || !timeSlot) {
      throw new AppError('Please fill all required fields', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(expertId)) throw new AppError('Invalid expert ID', 400);

    const normalizedBookingDate = normalizeDateKey(bookingDate);
    if (!normalizedBookingDate) throw new AppError('Please select a valid booking date', 400);

    const normalizedTimeSlot = timeSlot.trim().toLowerCase();
    const trimmedTimeSlot = timeSlot.trim();

    if (!isNonEmptyString(customerName) || !isNonEmptyString(email) || !isNonEmptyString(phone) || !isNonEmptyString(timeSlot)) {
      throw new AppError('Name, email, phone, and time slot are required', 400);
    }

    const expert = await Expert.findById(expertId);
    if (!expert) throw new AppError('Expert not found', 404);

    const matchingSlot = getMatchingSlot(expert.availableSlots, normalizedBookingDate, normalizedTimeSlot);

    if (!matchingSlot) throw new AppError('That slot is not available for this expert', 400);
    if (matchingSlot.isBooked) throw new AppError('This slot is already booked. Please choose another one', 409);

    const existingBooking = await Booking.findOne({ expertId, bookingDate: normalizedBookingDate, normalizedTimeSlot });
    if (existingBooking) throw new AppError('This slot is already taken', 409);

    const booking = await Booking.create({
      expertId,
      customerName: customerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bookingDate: normalizedBookingDate,
      timeSlot: trimmedTimeSlot,
      normalizedTimeSlot,
      notes: typeof notes === 'string' ? notes.trim() : '',
      status: 'Pending'
    });

    const slotUpdate = await Expert.updateOne(
      {
        _id: expertId,
        'availableSlots.bookingDate': normalizedBookingDate,
        'availableSlots.timeSlot': matchingSlot.timeSlot,
        'availableSlots.isBooked': false
      },
      { $set: { 'availableSlots.$.isBooked': true } }
    );

    if (slotUpdate.matchedCount === 0 || slotUpdate.modifiedCount === 0) {
      await Booking.findByIdAndDelete(booking._id);
      throw new AppError('This slot was just booked by someone else', 409);
    }

    const populatedBooking = await Booking.findById(booking._id).populate('expertId', 'name category rating experience');

    res.status(201).json({ success: true, message: 'Booking successful', data: populatedBooking });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';
    const expertId = typeof req.query.expertId === 'string' ? req.query.expertId.trim() : '';

    const filter = {};
    if (status) {
      if (!allowedStatuses.includes(status)) throw new AppError(`Invalid status filter. Use one of: ${allowedStatuses.join(', ')}`, 400);
      filter.status = status;
    }
    if (expertId) {
      if (!mongoose.Types.ObjectId.isValid(expertId)) throw new AppError('Invalid expert ID filter', 400);
      filter.expertId = expertId;
    }

    const totalBookings = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter).populate('expertId', 'name category rating experience').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: { page, limit, total: totalBookings, totalPages: Math.ceil(totalBookings / limit) || 1 },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) throw new AppError('Invalid booking ID', 400);
    if (!isNonEmptyString(status)) throw new AppError('Status is required', 400);

    const normalizedStatus = status.trim();
    if (!allowedStatuses.includes(normalizedStatus)) throw new AppError(`Status must be one of: ${allowedStatuses.join(', ')}`, 400);

    const booking = await Booking.findById(id);
    if (!booking) throw new AppError('Booking not found', 404);

    booking.status = normalizedStatus;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id).populate('expertId', 'name category rating experience');
    res.status(200).json({ success: true, message: 'Booking status updated', data: updatedBooking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, updateBookingStatus };
