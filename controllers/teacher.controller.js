const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Tạo accessToken & refreshToken
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, role: 'teacher' },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, role: 'teacher' },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// ================================
// Đăng ký tài khoản giáo viên
// ================================
exports.registerTeacher = async (req, res) => {
  const { name, email, password, faculty, department, address, phone } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM teachers WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO teachers (name, email, password, faculty, department, address, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email`,
      [name, email, hashed, faculty, department, address, phone]
    );

    res.status(201).json({ message: 'Đăng ký thành công', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký' });
  }
};

// ================================
// Đăng nhập giáo viên ✅ sửa mới
// ================================
exports.loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM teachers WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Email không tồn tại' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Mật khẩu không đúng' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      teacher: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập' });
  }
};

// ================================
// Lấy thông tin giáo viên theo ID
// ================================
exports.getTeacherById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, faculty, department, address, phone FROM teachers WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy giáo viên' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy thông tin giáo viên' });
  }
};

// ================================
// Cập nhật tên giáo viên
// ================================
exports.updateTeacherName = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await pool.query('UPDATE teachers SET name = $1 WHERE id = $2', [name, id]);
    res.json({ message: 'Cập nhật tên thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật tên' });
  }
};

// ================================
// Cập nhật mật khẩu giáo viên
// ================================
exports.updateTeacherPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('UPDATE teachers SET password = $1 WHERE id = $2', [hashed, id]);
    res.json({ message: 'Cập nhật mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật mật khẩu' });
  }
};
