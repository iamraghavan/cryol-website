const express = require('express');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const webRoutes = require('./routes/web');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss');

const app = express();

// Trust proxies if behind one (Heroku/Render/Netlify)
app.set('trust proxy', 1);

// CORS Configuration
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  optionsSuccessStatus: 200
}));

// Secure HTTP Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      connectSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginResourcePolicy: { policy: "same-origin" },
  crossOriginEmbedderPolicy: { policy: "require-corp" }
}));

// Gzip compression
app.use(compression());

// Request logging
app.use(morgan('dev'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Manual sanitization for NoSQL injection and XSS
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        if (key.startsWith('$')) delete obj[key];
        else obj[key] = xss(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);
  if (req.query) sanitize(req.query);
  next();
});

// Prevent HTTP Parameter Pollution
app.use(hpp({
  whitelist: ['filter']
}));

// Serve static files securely — BEFORE rate limiter
const publicPath = path.join(__dirname, '../public');
if (process.env.NODE_ENV === 'production') {
  app.use('/assets', express.static(path.join(publicPath, 'assets'), {
    maxAge: '30d',
    etag: true
  }));
} else {
  app.use('/assets', express.static(path.join(publicPath, 'assets'), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store');
    }
  }));
}

// Rate Limiter: prevent brute force/DDoS (only for API + page routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// EJS Templating
app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.locals.assetPath = '/assets';

// Web Routes
app.use('/', webRoutes);

// 404 Not Found handler
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
