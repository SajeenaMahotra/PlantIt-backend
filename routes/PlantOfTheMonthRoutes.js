const express = require('express');
const router = express.Router();
const PlantOfTheMonthController = require('../controllers/PlantOfTheMonthController');
const upload = require("../middleware/upload");

router.get('/plantofthemonth', PlantOfTheMonthController.getPlantOfTheMonth);
router.post('/plantofthemonth',upload.single("image"), PlantOfTheMonthController.createPlantOfTheMonth);


module.exports=router;
