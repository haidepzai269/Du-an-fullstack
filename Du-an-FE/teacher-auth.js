// ✅ teacher-auth.js
const API_BASE = '/api/teachers';

document.getElementById('register').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = e.target[0].value.trim();
  const email = e.target[1].value.trim();
  const password = e.target[2].value.trim();
  const confirmPassword = e.target[3].value.trim();
  if (password !== confirmPassword) return alert('Mật khẩu nhập lại không khớp!');
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, faculty: '', department: '', address: '', phone: '' })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message || 'Đăng ký thành công');
      document.getElementById('registerForm').classList.add('hidden');
      document.getElementById('loginForm').classList.remove('hidden');
    } else alert(data.error || `Lỗi đăng ký: ${res.status}`);
  } catch (err) {
    console.error('Lỗi mạng khi đăng ký:', err);
    alert('Không thể kết nối đến máy chủ (đăng ký)');
  }
});

document.getElementById('login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target[0].value.trim();
  const password = e.target[1].value.trim();
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok && data.accessToken && data.refreshToken && data.teacher) {
      localStorage.setItem('teacherAccessToken', data.accessToken);
      localStorage.setItem('teacherRefreshToken', data.refreshToken);
      localStorage.setItem('teacher', JSON.stringify(data.teacher));
      window.location.href = 'home-teacher.html';
    } else alert(data.error || 'Sai tài khoản/mật khẩu');
  } catch (err) {
    console.error('Lỗi mạng khi đăng nhập:', err);
    alert('Không thể kết nối đến máy chủ (đăng nhập)');
  }
});