const express = require('express');
const morgan = require('morgan');
const path = require('path');
const webRoutes = require('./routes/web');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use('/', webRoutes);

module.exports = app;
