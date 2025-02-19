const express = require('express');
const router = express.Router();
const ViewedBlogController = require('../controllers/ViewedBlogController');

router.post('/view', ViewedBlogController.logBlogView);
router.get("/viewed/:user_id", ViewedBlogController.getViewedBlogsByUser);

module.exports = router;  // This is important
