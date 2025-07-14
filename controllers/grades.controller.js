const pool = require('../db'); // hoặc nơi bạn export kết nối PostgreSQL

// Lấy điểm học tập theo student_id từ token
exports.getGradesByStudent = async (req, res) => {
  try {
    const userId = req.user.id;

    // Truy vấn student_id từ bảng users
    const userResult = await pool.query('SELECT student_id FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin sinh viên' });
    }

    const studentId = userResult.rows[0].student_id;

    // Lấy điểm từ bảng grades
    const gradesResult = await pool.query(
      'SELECT subject, midterm, final FROM grades WHERE student_id = $1',
      [studentId]
    );

    // Giả sử điểm giữa kỳ và cuối kỳ bằng nhau (nếu bạn chưa tách cột), thì cho FE xử lý
    const grades = gradesResult.rows.map(item => ({
      subject: item.subject,
      midterm: item.midterm,
      final: item.final,
      semester: item.semester
    }));

    res.json(grades);
  } catch (err) {
    console.error('Lỗi khi lấy điểm học tập:', err);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
