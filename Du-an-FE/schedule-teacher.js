// ✅ schedule-teacher.js
document.addEventListener('DOMContentLoaded', () => {
  const teacher = JSON.parse(localStorage.getItem('teacher'));
  const tableBody = document.getElementById('scheduleBody');
  const teacherNameEl = document.getElementById('teacherName');
  const logoutBtn = document.getElementById('logoutBtn');
  if (teacher && teacher.name && teacherNameEl) teacherNameEl.textContent = teacher.name;
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('teacher');
        window.location.href = 'teacher-auth.html';
      }
    });
  }
  authFetch('/api/schedule/teacher')
    .then((res) => res.json())
    .then((data) => {
      if (!Array.isArray(data)) return alert('Không lấy được thời khóa biểu');
      tableBody.innerHTML = '';
      data.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.subject_name}</td>
          <td>${item.day}</td>
          <td>${item.start_time}</td>
          <td>${item.end_time}</td>
          <td>${item.classroom}</td>`;
        tableBody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error('❌ Lỗi khi lấy TKB:', err);
      alert('Không thể tải thời khóa biểu');
    });
});
