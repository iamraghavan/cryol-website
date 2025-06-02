const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

router.get('/', pageController.home);
router.get('/about-us', pageController.about);
router.get('/services/application-development', pageController.applicationDevelopment);
router.get('/services/cloud-services', pageController.cloudServices);
router.get('/services/cybersecurity', pageController.cybersecurityServices);
router.get('/services/cyber-forensics', pageController.cyberForensicsServices);
router.get('/services/digital-marketing', pageController.digitalMarketingServices);


module.exports = router;
