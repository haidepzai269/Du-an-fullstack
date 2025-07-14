const pool = require('../db');

exports.getSurveys = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM surveys ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi lấy khảo sát' });
  }
};

exports.submitSurveyResponse = async (req, res) => {
  try {
    const student_id = req.user.id;
    const { survey_id, response_text } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!survey_id || !response_text) {
      return res.status(400).json({ error: 'Thiếu survey_id hoặc response_text' });
    }

    // Ghi log kiểm tra trước khi insert
    console.log('📥 Dữ liệu nhận:', { survey_id, student_id, response_text });

    // Chèn vào database
    await pool.query(
      'INSERT INTO survey_responses (survey_id, student_id, response_text) VALUES ($1, $2, $3)',
      [survey_id, student_id, response_text]
    );

    res.json({ message: 'Đã gửi phản hồi' });
  } catch (err) {
    console.error('❌ Lỗi khi gửi phản hồi:', err);
    res.status(500).json({ error: 'Lỗi khi gửi phản hồi' });
  }
};



exports.submitFeedback = async (req, res) => {
  const { title, content } = req.body;
  const student_id = req.user.id;
  try {
    await pool.query(
      'INSERT INTO feedbacks (student_id, title, content) VALUES ($1, $2, $3)',
      [student_id, title, content]
    );
    res.json({ message: 'Góp ý đã được gửi' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi gửi góp ý' });
  }
};
