const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const capsuleRoutes = require('./routes/capsuleRoutes');
const heartbeatRoutes = require('./routes/heartbeatRoutes');
const engagementRoutes = require('./routes/engagementRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('trust proxy', 1);

app.use(helmet());

app.use(compression());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/capsules', capsuleRoutes);
app.use('/api/heartbeat', heartbeatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/engagement', engagementRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Chrono Nest API is running!' });
});

require('./services/cronService');

app.listen(PORT, () => {
    console.log(`Chrono Nest server running on port: ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
