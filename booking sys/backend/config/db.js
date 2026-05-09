const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: process.env.NODE_ENV === 'development'
        });
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
