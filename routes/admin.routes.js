const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const { verifyAdminToken } = require('../middleware/verifyAdminToken'); // ✅ thêm dòng này


// Đăng ký & đăng nhập (không cần token)
router.post('/register', adminCtrl.registerAdmin);
router.post('/login', adminCtrl.loginAdmin);

// Các route dưới đây cần token:
router.post('/send-notification', verifyAdminToken, adminCtrl.sendNotification);
router.post('/survey', verifyAdminToken, adminCtrl.createSurvey);
router.get('/feedbacks', verifyAdminToken, adminCtrl.getAllFeedback);
router.post('/schedule', verifyAdminToken, adminCtrl.updateSchedule);
router.get('/notifications/latest', adminCtrl.getNotifications); // ❌ KHÔNG dùng verifyAdminToken
router.post('/refresh-token', adminCtrl.refreshToken);
router.get('/latest-survey', adminCtrl.getLatestSurvey);
// ✅ Route tìm kiếm sinh viên hoặc giáo viên theo tên/email
router.get('/search', verifyAdminToken, adminCtrl.searchUsersAndTeachers);


module.exports = router;
