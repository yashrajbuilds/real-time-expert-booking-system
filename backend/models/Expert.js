const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema(
  {
    bookingDate: { type: String, required: [true, 'Slot booking date is required'] },
    timeSlot: { type: String, required: [true, 'Slot time is required'], trim: true },
    isBooked: { type: Boolean, default: false }
  },
  { _id: false }
);

const expertSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Expert name is required'], trim: true, index: true },
    category: { type: String, required: [true, 'Expert category is required'], trim: true, index: true },
    experience: { type: Number, required: [true, 'Experience is required'], min: [0, 'Experience cannot be negative'] },
    rating: { type: Number, default: 0, min: [0, 'Rating cannot be lower than 0'], max: [5, 'Rating cannot be higher than 5'] },
    bio: { type: String, required: [true, 'Bio is required'], trim: true },
    availableSlots: [availableSlotSchema]
  },
  { timestamps: true }
);

expertSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Expert', expertSchema);
