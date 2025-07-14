// routes/user.js
const express = require("express");
const router = express.Router();
const pool = require("../db");
const { verifyToken } = require("../middleware/auth");

// Lấy thông tin cá nhân
router.get("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Không tìm thấy người dùng" });
  }

  res.json(result.rows[0]);
});


// Cập nhật thông tin
router.put("/profile", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { username, faculty, class_name } = req.body;

  await pool.query(
    "UPDATE users SET username = $1, faculty = $2, class_name = $3 WHERE id = $4",
    [username, faculty, class_name, userId]
  );

  res.json({ message: "Cập nhật thành công" });
});

module.exports = router;
