const express = require('express');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const xss = require('xss');
const serverless = require('serverless-http');

const webRoutes = require('../src/routes/web');  // Adjust if needed
const { notFoundHandler, errorHandler } = require('../src/middleware/errorHandler'); // Adjust if needed

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: ['https://cryol.vercel.app','https://vercel.app', 'http://localhost','http://192.168.1.3'],
  optionsSuccessStatus: 200
}));

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

app.use(compression());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.use(hpp({ whitelist: ['filter'] }));

// Serve static files relative to project root
const publicPath = path.join(process.cwd(), 'public');
app.use('/assets', express.static(path.join(publicPath, 'assets'), {
  maxAge: process.env.NODE_ENV === 'production' ? '30d' : 0,
  etag: process.env.NODE_ENV === 'production'
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'src/views'));
app.locals.assetPath = '/assets';

app.use('/', webRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
module.exports.handler = serverless(app);
