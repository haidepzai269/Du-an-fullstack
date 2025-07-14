const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getSurveys,
  submitSurveyResponse,
  submitFeedback
} = require('../controllers/survey.controller');

router.get('/', verifyToken, getSurveys);
router.post('/respond', verifyToken, submitSurveyResponse);
router.post('/feedback', verifyToken, submitFeedback);

module.exports = router;
