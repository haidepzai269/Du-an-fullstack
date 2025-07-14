// controllers/schedule.controller.js
const pool = require('../db');
const jwt = require('jsonwebtoken');

exports.getSchedule = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Không có token' });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const studentId = decoded.id;

    const result = await pool.query(
      'SELECT subject_name, day_of_week, start_time, end_time, room FROM schedules WHERE student_id = $1 ORDER BY day_of_week, start_time',
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('💥 Chi tiết lỗi server khi lấy TKB:', error.message);
    res.status(500).json({ message: 'Lỗi server', detail: error.message });
  }
  
};
