const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Debug: Log if MONGO_URI is set
        if (!process.env.MONGO_URI) {
            console.error('ERROR: MONGO_URI is not set in .env file');
            process.exit(1);
        }

        console.log('Attempting to connect to MongoDB...');
        console.log(`Using URI: ${process.env.MONGO_URI.substring(0, 50)}...`);

        mongoose.set('strictQuery', true);
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            autoIndex: process.env.NODE_ENV === 'development'
        });
        console.log(`✓ MongoDB connected successfully to: ${connection.connection.host}`);
    } catch (error) {
        console.error('✗ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
