const loginForm = document.getElementById('adminLoginForm');
const registerForm = document.getElementById('adminRegisterForm');

function toggleForm() {
  loginForm.style.display = loginForm.style.display === 'none' ? 'block' : 'none';
  registerForm.style.display = registerForm.style.display === 'none' ? 'block' : 'none';
}

// Đăng nhập
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch('/api/admins/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Đăng nhập thất bại');

    localStorage.setItem('adminAccessToken', data.accessToken);
    localStorage.setItem('adminRefreshToken', data.refreshToken);
    localStorage.setItem('admin', JSON.stringify({ id: data.id, email }));
    window.location.href = 'admin.html';
  } catch (err) {
    alert('Lỗi kết nối máy chủ');
  }
});

// Đăng ký
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const res = await fetch('/api/admins/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || 'Đăng ký thất bại');

    alert('Đăng ký thành công, vui lòng đăng nhập');
    toggleForm();
  } catch (err) {
    alert('Lỗi kết nối máy chủ');
  }
});
