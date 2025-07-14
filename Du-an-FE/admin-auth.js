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

  const res = await fetch('http://localhost:3000/api/admins/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    // ✅ Lưu token vào localStorage
    localStorage.setItem('adminAccessToken', data.accessToken);
    localStorage.setItem('adminRefreshToken', data.refreshToken);
    localStorage.setItem('admin', JSON.stringify({ id: data.id, email }));

    // ✅ Chuyển sang trang quản trị
    window.location.href = 'admin.html';
  } else {
    alert(data.error || 'Đăng nhập thất bại');
  }
});

// Đăng ký
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await fetch('http://localhost:3000/api/admins/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Đăng ký thành công, vui lòng đăng nhập');
    toggleForm();
  } else {
    alert(data.error || 'Đăng ký thất bại');
  }
});
