const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// Home Page
router.get('/', pageController.home);

// // About Page
// router.get('/about', pageController.about);

// // Services Page
// router.get('/services', pageController.services);

// // Contact Page
// router.get('/contact', pageController.contact);

// // 404 Not Found (optional catch-all)
// router.get('*', pageController.notFound);

module.exports = router;
