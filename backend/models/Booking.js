const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: [true, 'Expert ID is required'], index: true },
        customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
        email: { type: String, required: [true, 'Email is required'], trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] },
        phone: { type: String, required: [true, 'Phone is required'], trim: true },
        bookingDate: { type: String, required: [true, 'Booking date is required'], trim: true },
        timeSlot: { type: String, required: [true, 'Time slot is required'], trim: true },
        normalizedTimeSlot: { type: String, required: true, trim: true, lowercase: true },
        notes: { type: String, default: '', trim: true },
        status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' }
    },
    { timestamps: true }
);

bookingSchema.index({ expertId: 1, bookingDate: 1, normalizedTimeSlot: 1 }, { unique: true });

bookingSchema.pre('save', function (next) {
    if (this.timeSlot && typeof this.timeSlot === 'string') {
        this.timeSlot = this.timeSlot.trim();
        this.normalizedTimeSlot = this.timeSlot.toLowerCase();
    }

    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
