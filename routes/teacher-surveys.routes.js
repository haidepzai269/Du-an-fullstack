const express = require('express');
const router = express.Router();
const verifyTeacher = require('../middleware/verifyTeacher');
const db = require('../db'); // vì bạn export pool trực tiếp

// GET: Lấy danh sách khảo sát dành cho giáo viên
router.get('/', verifyTeacher, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM teacher_surveys ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    console.error('Lỗi khi lấy surveys:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// POST: Gửi phản hồi khảo sát
router.post('/responses', verifyTeacher, async (req, res) => {
  try {
    const { surveyId, responseText } = req.body;
    const teacherId = req.user.id;

    await db.query(
      "INSERT INTO survey_responses (survey_id, teacher_id, response_text) VALUES ($1, $2, $3)",
      [surveyId, teacherId, responseText]
    );

    res.json({ message: "Đã gửi phản hồi" });
  } catch (error) {
    console.error('Lỗi khi gửi phản hồi:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});

// POST: Gửi góp ý tự do
router.post('/feedbacks', verifyTeacher, async (req, res) => {
  try {
    const { title, content } = req.body;
    const teacherId = req.user.id;

    await db.query(
      "INSERT INTO feedbacks (teacher_id, title, content) VALUES ($1, $2, $3)",
      [teacherId, title, content]
    );

    res.json({ message: "Đã gửi góp ý" });
  } catch (error) {
    console.error('Lỗi khi gửi góp ý:', error);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
});


module.exports = router;
