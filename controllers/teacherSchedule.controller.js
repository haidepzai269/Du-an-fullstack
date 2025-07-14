const pool = require('../db');

exports.getScheduleByTeacher = async (req, res) => {
  try {
    const teacherId = req.user.id; // ID từ token của giáo viên

    const result = await pool.query(
      'SELECT subject_name, day, start_time, end_time, classroom FROM teacher_schedules WHERE teacher_id = $1 ORDER BY day, start_time',
      [teacherId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy thời khóa biểu giáo viên:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// Admin thêm lịch giảng dạy mới
exports.addSchedule = async (req, res) => {
  try {
    const { teacher_id, subject_name, day, start_time, end_time, classroom } = req.body;

    await pool.query(
      `INSERT INTO teacher_schedules (teacher_id, subject_name, day, start_time, end_time, classroom)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [teacher_id, subject_name, day, start_time, end_time, classroom]
    );

    res.json({ message: 'Thêm lịch giảng dạy thành công' });
  } catch (err) {
    console.error('Lỗi thêm lịch:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
