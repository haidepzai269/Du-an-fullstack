const express = require('express');
const router = express.Router();
const {
  registerTeacher,
  loginTeacher,
  getTeacherById,
  updateTeacherName,
  updateTeacherPassword
} = require('../controllers/teacher.controller');
const jwt = require('jsonwebtoken');
const verifyTeacher = require('../middleware/verifyTeacher');

// ✅ Đăng ký và đăng nhập
router.post('/register', registerTeacher);
router.post('/login', loginTeacher);

// ✅ Refresh token (gia hạn accessToken)
router.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'Thiếu refresh token' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Refresh token không hợp lệ' });

    const accessToken = jwt.sign(
      { id: decoded.id, role: 'teacher' },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    res.json({ accessToken });
  });
});

// ✅ Lấy và cập nhật thông tin giáo viên (bảo vệ bằng middleware)
router.get('/:id', verifyTeacher, getTeacherById);
router.put('/:id/name', verifyTeacher, updateTeacherName);
router.put('/:id/password', verifyTeacher, updateTeacherPassword);

module.exports = router;
