const express = require('express');
const router = express.Router();
const verifyTeacher = require('../middleware/verifyTeacher');
const pool = require('../db'); // Đảm bảo đã kết nối db

// POST /api/grades - giáo viên nhập điểm
router.post('/', verifyTeacher, async (req, res) => {
  const { student_id, subject, midterm, final } = req.body;

  if (!student_id || !subject || midterm == null || final == null) {
    return res.status(400).json({ message: 'Thiếu thông tin điểm' });
  }

  try {
    const semester = '2025-1'; // hoặc lấy từ req.user/req.body nếu cần linh hoạt

    // Kiểm tra tồn tại sinh viên
    const userRes = await pool.query('SELECT * FROM users WHERE student_id = $1', [student_id]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sinh viên' });
    }

    // Chèn hoặc cập nhật điểm
    const existing = await pool.query(
      'SELECT id FROM grades WHERE student_id = $1 AND subject = $2 AND semester = $3',
      [student_id, subject, semester]
    );

    if (existing.rows.length > 0) {
      // update
      await pool.query(
        'UPDATE grades SET midterm = $1, final = $2 WHERE student_id = $3 AND subject = $4 AND semester = $5',
        [midterm, final, student_id, subject, semester]
      );
    } else {
      // insert
      await pool.query(
        'INSERT INTO grades (student_id, subject, midterm, final, semester) VALUES ($1, $2, $3, $4, $5)',
        [student_id, subject, midterm, final, semester]
      );
    }

    res.status(200).json({ message: 'Nhập điểm thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
