// 📁 controllers/admin.controller.js
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Đăng ký admin
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO admins (email, password) VALUES ($1, $2) RETURNING id',
      [email, hash]
    );
    res.json({ message: 'Đăng ký thành công', id: result.rows[0].id });
  } catch (err) {
    console.error('Đăng ký admin lỗi:', err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
};

// ✅ Đăng nhập admin (đã sửa lại hoàn chỉnh)
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Không tồn tại admin' });
    }

    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }

    // ✅ Tạo access token
    const accessToken = jwt.sign(
      { id: result.rows[0].id, role: 'admin' },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    // ✅ Tạo refresh token
    const refreshToken = jwt.sign(
      { id: result.rows[0].id, role: 'admin' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      id: result.rows[0].id,
    });
  } catch (err) {
    console.error('Đăng nhập admin lỗi:', err);
    res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
};


// ✅ Gửi thông báo
exports.sendNotification = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Thiếu nội dung thông báo' });
  try {
    await pool.query('INSERT INTO notifications (message) VALUES ($1)', [message]);
    res.json({ message: 'Đã gửi thông báo' });
  } catch (err) {
    console.error('❌ Lỗi gửi thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi gửi thông báo' });
  }
};

// ✅ Tạo khảo sát
exports.createSurvey = async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Tiêu đề không được trống' });
  try {
    await pool.query('INSERT INTO surveys (title, description) VALUES ($1, $2)', [title, description]);
    res.json({ message: 'Đã tạo khảo sát' });
  } catch (err) {
    console.error('❌ Lỗi tạo khảo sát:', err);
    res.status(500).json({ error: 'Lỗi khi tạo khảo sát' });
  }
};

// ✅ Xem phản hồi (có JOIN tên khảo sát)
// ✅ Xem phản hồi (có JOIN tên khảo sát)
exports.getAllFeedback = async (req, res) => {
  try {
    const free = await pool.query(`
      SELECT f.id, f.student_id, f.teacher_id, f.title, f.content, f.submitted_at
      FROM feedbacks f
      ORDER BY f.submitted_at DESC
    `);

    const survey = await pool.query(`
      SELECT sr.id, sr.student_id, sr.teacher_id, sr.survey_id, sr.response_text, sr.submitted_at, s.title AS survey_title
      FROM survey_responses sr
      LEFT JOIN surveys s ON sr.survey_id = s.id
      ORDER BY sr.submitted_at DESC
    `);

    res.json({ freeFeedbacks: free.rows, surveyResponses: survey.rows });
  } catch (err) {
    console.error('❌ Lỗi lấy phản hồi:', err);
    res.status(500).json({ error: 'Không lấy được phản hồi' });
  }
};


// ✅ Cập nhật thời khóa biểu cho SV hoặc GV
exports.updateSchedule = async (req, res) => {
  const { user_id, role, day, start_time, end_time, subject, location } = req.body;

  if (!user_id || !role || !day || !start_time || !end_time || !subject || !location) {
    return res.status(400).json({ error: 'Thiếu dữ liệu bắt buộc' });
  }

  try {
    if (role === 'student') {
      await pool.query(
        'INSERT INTO schedules (student_id, subject_name, day_of_week, start_time, end_time, room) VALUES ($1, $2, $3, $4, $5, $6)',
        [user_id, subject, day, start_time, end_time, location]
      );
    } else if (role === 'teacher') {
      await pool.query(
        'INSERT INTO teacher_schedules (teacher_id, subject_name, day, start_time, end_time, classroom) VALUES ($1, $2, $3, $4, $5, $6)',
        [user_id, subject, day, start_time, end_time, location]
      );
    } else {
      return res.status(400).json({ error: 'Role không hợp lệ' });
    }

    res.json({ message: 'Đã thêm lịch thành công' });
  } catch (err) {
    console.error('❌ Lỗi thêm thời khóa biểu:', err);
    res.status(500).json({ error: 'Thêm lịch thất bại' });
  }
};

// ✅ Lấy thông báo mới nhất
exports.getNotifications = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error('Lỗi khi lấy thông báo:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy thông báo' });
  }
};
// 📁 controllers/admin.controller.js
exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'Không có refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, role: 'admin' }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    res.json({ accessToken });
  } catch (err) {
    console.error('❌ Lỗi refresh token:', err);
    res.status(403).json({ error: 'Refresh token không hợp lệ' });
  }
};

// Thêm vào cuối file admin.controller.js
exports.getLatestSurvey = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC LIMIT 1');
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Lỗi khi lấy khảo sát mới nhất:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy khảo sát mới nhất' });
  }
};

// 📁 admin.controller.js

exports.searchUsersAndTeachers = async (req, res) => {
  const keyword = req.query.q || '';
  try {
    const resultUsers = await pool.query(
      `SELECT id, username AS name, email FROM users
       WHERE username ILIKE $1 OR email ILIKE $1`,
      [`%${keyword}%`]
    );

    const resultTeachers = await pool.query(
      `SELECT id, name, email FROM teachers
       WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${keyword}%`]
    );

    const results = [
      ...resultUsers.rows.map(u => ({ ...u, role: 'student' })),
      ...resultTeachers.rows.map(t => ({ ...t, role: 'teacher' }))
    ];

    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi tìm kiếm:', err);
    res.status(500).json({ error: 'Lỗi server khi tìm kiếm' });
  }
};
