const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.get('/doctors', staffController.getDoctors);

module.exports = router;