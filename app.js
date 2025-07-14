// Du-an-BE/app.js
const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ mới thêm

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user');
const scheduleRoutes = require('./routes/schedule.routes');
const gradesRoutes = require('./routes/grades.routes');
const surveyRoutes = require('./routes/survey.routes');
const teacherRoutes = require('./routes/teacher.routes');
const teacherScheduleRoutes = require('./routes/teacherSchedule.routes');
const teacherGradesRoutes = require('./routes/grades-teacher.routes');
const teacherSurveyRoutes = require('./routes/teacher-surveys.routes');
const adminRoutes = require('./routes/admin.routes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve static files từ folder Du-an-FE
app.use(express.static(path.join(__dirname, 'Du-an-FE')));

// Các API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/schedule/teacher', teacherScheduleRoutes);
app.use('/api/teacher/grades', teacherGradesRoutes);
app.use('/api/teacher-surveys', teacherSurveyRoutes);
app.use('/api/admins', adminRoutes);


// ✅ Khi vào đường dẫn gốc → trả về login-register.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Du-an-FE', 'teacher-auth.html'));
});
// Trang sinh viên
app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, 'Du-an-FE', 'login-register.html'));
});

// Trang quản lý (admin)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'Du-an-FE', 'admin-auth.html'));
});

module.exports = app;
