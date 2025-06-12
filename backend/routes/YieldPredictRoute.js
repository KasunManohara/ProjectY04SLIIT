const express = require('express');
const router = express.Router();
const GCController = require('../controller/YieldPredictController');

// Get all grow components
router.get('/', GCController.getAllGrowComponents);

// Add a new grow component
router.post('/', GCController.addGrowComponent);

// Delete a grow component by ID
router.delete('/:id', GCController.deleteGrowComponent);

module.exports = router;
