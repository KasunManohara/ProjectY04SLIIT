const express = require('express');
const router = express.Router();
const GSController = require('../controller/GrowShedController')

//get all 
router.get('/',GSController.getAllGS);

//post
router.post('/',GSController.addGS);

//delete by id
router.delete('/:id',GSController.deleteGS);

//update by id
router.put('/:id',GSController.updatedGS);

module.exports = router;