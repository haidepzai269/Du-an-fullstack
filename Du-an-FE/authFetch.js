const BASE_API = '';

async function authFetch(url, options = {}) {
  const isTeacherPage = window.location.pathname.includes('teacher');

  let accessToken = isTeacherPage
    ? localStorage.getItem('teacherAccessToken')
    : localStorage.getItem('accessToken');

  let refreshToken = isTeacherPage
    ? localStorage.getItem('teacherRefreshToken')
    : localStorage.getItem('refreshToken');

  options.headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  let response = await fetch(url, options);

  if (response.status === 403) {
    const refreshURL = isTeacherPage
      ? `/api/teachers/refresh-token`
      : `/api/auth/refresh-token`;

    const res = await fetch(refreshURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      accessToken = data.accessToken;

      // ✅ Ghi lại token đúng loại
      if (isTeacherPage) {
        localStorage.setItem('teacherAccessToken', accessToken);
      } else {
        localStorage.setItem('accessToken', accessToken);
      }

      options.headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, options);
    } else {
      alert('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
      if (isTeacherPage) {
        localStorage.removeItem('teacherAccessToken');
        localStorage.removeItem('teacherRefreshToken');
        localStorage.removeItem('teacher');
        window.location.href = 'teacher-auth.html';
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = 'login-register.html';
      }
      throw new Error('Token expired');
    }
  }

  return response;
}
