// 📁 admin-authFetch.js
async function adminAuthFetch(url, options = {}) {
    let accessToken = localStorage.getItem('adminAccessToken');
    let refreshToken = localStorage.getItem('adminRefreshToken');
  
    options.headers = {
      ...(options.headers || {}),
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  
    let response = await fetch(url, options);
  
    if (response.status === 403) {
      console.log('[adminAuthFetch] Token hết hạn, đang refresh...');
  
      const res = await fetch('/api/admins/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken }),
      });
  
      if (res.ok) {
        const data = await res.json();
        accessToken = data.accessToken;
        localStorage.setItem('adminAccessToken', accessToken);
  
        // Gửi lại request gốc với token mới
        options.headers['Authorization'] = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      } else {
        alert('Phiên đăng nhập của admin đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('admin');
        window.location.href = 'admin-auth.html';
        throw new Error('Admin token expired');
      }
    }
  
    return response;
  }
  