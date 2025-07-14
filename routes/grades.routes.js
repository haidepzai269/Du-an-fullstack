const express = require('express');
const router = express.Router();
const { getGradesByStudent } = require('../controllers/grades.controller');
const { verifyToken } = require('../middleware/auth'); // ✅ dùng middleware cũ

// GET /api/grades

router.get('/', verifyToken, getGradesByStudent);


module.exports = router;
