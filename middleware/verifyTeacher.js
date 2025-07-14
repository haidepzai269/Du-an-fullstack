const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Không có token' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });

    // ✅ Kiểm tra đúng vai trò giáo viên
    if (decoded.role !== 'teacher') {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập (không phải giáo viên)' });
    }

    req.user = decoded;
    next();
  });
};
