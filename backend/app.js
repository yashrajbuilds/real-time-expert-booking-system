const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const expertRoutes = require('./routes/expertRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

const corsOriginSetting = process.env.CORS_ORIGIN || '*';
const allowedOrigins = corsOriginSetting === '*'
  ? '*'
  : corsOriginSetting.split(',').map((origin) => origin.trim());

app.set('trust proxy', 1);
app.use(helmet());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Booking API is healthy',
    realtimeReady: true
  });
});

app.use('/api/experts', expertRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
