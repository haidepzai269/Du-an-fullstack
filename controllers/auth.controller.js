const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 👉 Lưu tạm refresh tokens trong RAM (chỉ dùng tạm trong dev)
let refreshTokens = [];

// ✅ Hàm tạo accessToken và refreshToken
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN } // ví dụ: '15m'
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN } // ví dụ: '7d'
  );

  return { accessToken, refreshToken };
}

// ✅ Đăng ký người dùng
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Đăng ký thành công',
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Email đã tồn tại' });
    } else {
      res.status(500).json({ error: 'Lỗi máy chủ khi đăng ký' });
    }
  }
};

// ✅ Đăng nhập người dùng
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Sai mật khẩu' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    refreshTokens.push(refreshToken); // ✅ Lưu refreshToken tạm thời

    res.json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập' });
  }
};

// ✅ Làm mới access token — ĐÃ SỬA
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = decoded.id;

    // ✅ Kiểm tra user còn tồn tại
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    const newAccessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Lỗi khi làm mới token:', err);
    res.status(403).json({ message: 'Refresh token đã hết hạn hoặc không hợp lệ' });
  }
};

// ✅ Đăng xuất
exports.logout = (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.json({ message: 'Đăng xuất thành công' });
};
