const express = require('express');
const router = express.Router();
const {
  getScheduleByTeacher,
  addSchedule,
} = require('../controllers/teacherSchedule.controller');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Giáo viên xem lịch của chính họ
router.get('/', verifyToken, getScheduleByTeacher);

// Admin thêm lịch giảng dạy mới
router.post('/add', verifyToken, isAdmin, addSchedule);

module.exports = router;
