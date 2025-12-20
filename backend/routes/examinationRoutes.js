const express = require('express');
const router = express.Router();
const examinationController = require('../controllers/examinationController');

router.post('/', examinationController.createMedicalRecord);

module.exports = router;