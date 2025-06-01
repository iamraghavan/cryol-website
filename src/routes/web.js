const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.home);
router.get('/about-us', pageController.about);
router.get('/services/application-development', pageController.applicationDevelopment);


module.exports = router;
