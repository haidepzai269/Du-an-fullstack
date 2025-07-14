// middleware/verifyAdminToken.js
const jwt = require('jsonwebtoken');

exports.verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) return res.status(401).json({ error: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập (không phải admin)' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    // ⚠️ Trả về 403 để trùng với frontend check
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
