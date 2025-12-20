const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

router.get('/', petController.getAllPets);
router.post('/', petController.createPet);
router.get('/:id/history', petController.getPetHistory); // Route mới xem bệnh án

module.exports = router;