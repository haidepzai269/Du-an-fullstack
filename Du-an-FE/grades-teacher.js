// ======= XỬ LÝ GỬI FORM NHẬP ĐIỂM =======
const form = document.getElementById('gradeForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const student_id = document.getElementById('studentId').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const midterm = parseFloat(document.getElementById('midterm').value);
  const final = parseFloat(document.getElementById('final').value);

  if (!student_id || !subject || isNaN(midterm) || isNaN(final)) {
    alert('Vui lòng điền đầy đủ và chính xác thông tin.');
    return;
  }

  try {
    const res = await authFetch('http://localhost:3000/api/teacher/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id, subject, midterm, final })
    });

    // Nếu sinh viên không tồn tại
    if (res.status === 404) {
      const text = await res.text();
      alert("❌ " + (text || "Không tìm thấy sinh viên"));
      return;
    }

    const data = await res.json();

    if (res.ok) {
      alert('✅ Nhập điểm thành công!');
      form.reset();
    } else {
      alert('❌ Lỗi: ' + (data.message || 'Không thể nhập điểm'));
    }
  } catch (err) {
    console.error('🚨 Lỗi gửi dữ liệu:', err);
    alert('🚨 Đã có lỗi xảy ra trong quá trình gửi dữ liệu.');
  }
});


// ======= HIỂN THỊ TÊN GIÁO VIÊN TRÊN HEADER =======
window.addEventListener('DOMContentLoaded', () => {
  const teacherData = localStorage.getItem('teacher');
  if (teacherData) {
    try {
      const teacher = JSON.parse(teacherData);
      const headerTitle = document.querySelector('.main-content .header h2');
      if (headerTitle && teacher.name) {
        headerTitle.textContent = teacher.name.toUpperCase();
      }
    } catch (err) {
      console.error('Không thể phân tích dữ liệu giáo viên:', err);
    }
  }
});

// ======= NÚT ĐĂNG XUẤT =======
document.querySelector('.logout-btn').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = 'teacher-auth.html';
});
