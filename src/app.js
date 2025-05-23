const express = require('express');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const expressLayouts = require('express-ejs-layouts');
const webRoutes = require('./routes/web');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Set EJS as view engine with express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/default');  // default layout file: views/layouts/default.ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Apply security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// Request logger
app.use(morgan('dev'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files
const publicPath = path.join(__dirname, '../public');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(publicPath, {
    maxAge: '30d',
    etag: true
  }));
} else {
  app.use(express.static(publicPath, {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'no-store');
    }
  }));
}

// Mount web routes
app.use('/', webRoutes);

// 404 handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
