const express = require('express');
const router = express.Router();
const BlogRecommendationsController= require('../controllers/BlogRecommendationsController')

router.get('/recommendations/:userId', BlogRecommendationsController.getBlogRecommendations);

module.exports = router;