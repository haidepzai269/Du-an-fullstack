// 📁 admin.js

// 🔔 Gửi thông báo
document.getElementById('sendNotification').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = e.target.message.value;

  const res = await adminAuthFetch('http://localhost:3000/api/admins/send-notification', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  alert(data.message || data.error);
  e.target.reset();
});

// 📝 Tạo khảo sát
document.getElementById('createSurvey').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = e.target.title.value;
  const description = e.target.description.value;

  const res = await adminAuthFetch('http://localhost:3000/api/admins/survey', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  alert(data.message || data.error);
  e.target.reset();
});

// 💬 Xem phản hồi
async function loadFeedbacks() {
  const res = await adminAuthFetch('http://localhost:3000/api/admins/feedbacks');
  const data = await res.json();
  const list = document.getElementById('feedbackList');
  list.innerHTML = '';

  if (data.freeFeedbacks.length === 0 && data.surveyResponses.length === 0) {
    list.innerHTML = '<li>Không có phản hồi nào.</li>';
    return;
  }

  // 🗨️ Hiển thị phản hồi tự do
  if (data.freeFeedbacks.length > 0) {
    list.innerHTML += '<h3>🗨️ Phản hồi tự do:</h3>';
    data.freeFeedbacks.forEach(f => {
      const idTag = f.student_id ? `SV ${f.student_id}` :
                     f.teacher_id ? `GV ${f.teacher_id}` : 'Ẩn danh';
      const li = document.createElement('li');
      li.innerHTML = `<strong>[${idTag}] ${f.title}:</strong> ${f.content}`;
      list.appendChild(li);
    });
  }

  // 📋 Hiển thị phản hồi khảo sát
  if (data.surveyResponses.length > 0) {
    list.innerHTML += '<h3>📋 Phản hồi khảo sát:</h3>';
    data.surveyResponses.forEach(s => {
      const idTag = s.student_id ? `SV ${s.student_id}` :
                     s.teacher_id ? `GV ${s.teacher_id}` : 'Ẩn danh';
      const li = document.createElement('li');
      li.innerHTML = `<strong>[${idTag}] ${s.survey_title}:</strong> ${s.response_text}`;
      list.appendChild(li);
    });
  }
}

// Tự động gọi khi admin bấm tab “Phản hồi”
document.querySelector('li[onclick*="feedback"]').addEventListener('click', loadFeedbacks);

// 📅 Gửi thời khóa biểu
const scheduleForm = document.getElementById('scheduleForm');
scheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user_id = e.target.user_id.value;
  const role = e.target.role.value;
  const day = e.target.day.value;
  const start_time = e.target.start_time.value;
  const end_time = e.target.end_time.value;
  const subject = e.target.subject.value;
  const location = e.target.location.value;

  const res = await adminAuthFetch('http://localhost:3000/api/admins/schedule', {
    method: 'POST',
    body: JSON.stringify({ user_id, role, day, start_time, end_time, subject, location }),
  });

  const data = await res.json();
  alert(data.message || data.error);
  scheduleForm.reset();
});

// 🎯 Chuyển tab
function showSection(id) {
  document.querySelectorAll('main section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.sidebar li').forEach(li => li.classList.remove('active'));
  document.querySelector(`.sidebar li[onclick*="${id}"]`).classList.add('active');

  if (id === 'feedback') loadFeedbacks();
}


// tìm kiếm 
const searchInput = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');

let searchTimeout = null;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  const keyword = searchInput.value.trim();

  if (keyword.length === 0) {
    resultsList.innerHTML = '';
    return;
  }

  // Gửi request sau 300ms để tránh spam
  searchTimeout = setTimeout(async () => {
    try {
      const res = await adminAuthFetch(`http://localhost:3000/api/admins/search?q=${encodeURIComponent(keyword)}`);
      const data = await res.json();

      resultsList.innerHTML = '';
      if (data.length === 0) {
        resultsList.innerHTML = '<li>Không tìm thấy kết quả nào.</li>';
        return;
      }

      data.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.role === 'student' ? 'SV' : 'GV'}: ${user.name} (${user.email})`;
        resultsList.appendChild(li);
      });
    } catch (err) {
      resultsList.innerHTML = '<li>Lỗi khi tìm kiếm.</li>';
      console.error(err);
    }
  }, 300);
});



// hiệu ứng tuyết rơi 
function updateSnowLayers() {
  const pile = document.querySelector('.sidebar .snow-pile');
  const layerContainer = pile.querySelector('.snow-layer');
  const iceLayer = document.getElementById('iceLayer');
  const count = pile.querySelectorAll('.flake').length;

  const layerCount = Math.floor(count / 12); // 12 bông = 1 lớp
  layerContainer.innerHTML = '';

  for (let i = 1; i <= Math.min(layerCount, 4); i++) {
    const layer = document.createElement('div');
    layer.className = `snow-layer layer-${i}`;
    layerContainer.appendChild(layer);
  }

  // ❄️ Nếu đủ 4 lớp => hiện băng đá
  if (layerCount >= 2) {
    iceLayer.classList.add('show-ice');
  } else {
    iceLayer.classList.remove('show-ice');
  }
}


function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.textContent = '❄️';

  const size = Math.random() * 10 + 10;
  const left = Math.random() * window.innerWidth;
  snowflake.style.left = left + 'px';
  snowflake.style.fontSize = size + 'px';
  snowflake.style.opacity = Math.random();
  snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';

  document.querySelector('.snow-container').appendChild(snowflake);

  setTimeout(() => {
    // Đọng lại nếu trúng sidebar
    const sidebar = document.querySelector('.sidebar');
    const snowPile = sidebar.querySelector('.snow-pile');
    const sidebarRect = sidebar.getBoundingClientRect();

    if (left >= sidebarRect.left && left <= sidebarRect.right) {
      const flake = document.createElement('div');
      flake.classList.add('flake');
      flake.textContent = '❄️';

      // 1/2 số bông tuyết có hiệu ứng lấp lánh
      if (Math.random() < 0.5) {
        flake.classList.add('glow');
      }

      snowPile.appendChild(flake);

      // Giới hạn số bông tuyết tích lại (80)
      if (snowPile.children.length > 80) {
        snowPile.removeChild(snowPile.firstChild);
      }

      updateSnowLayers(); // ⬅ Cập nhật số lớp sau khi thêm

      // Tự động tan dần sau 30s
      setTimeout(() => {
        flake.style.opacity = '0';
        flake.style.transform = 'translateY(5px) scale(0.8)';
        setTimeout(() => {
          flake.remove();
          updateSnowLayers(); // ⬅ Cập nhật lại sau khi xóa
        }, 1000);
      }, 20000);
    }

    snowflake.remove();
  }, 5000);
}

setInterval(createSnowflake, 150);

// tia sét
function spawnCrack() {
  const sidebar = document.querySelector("aside, .sidebar, .nav, .menu"); // tuỳ selector
  if (!sidebar) return;

  const crack = document.createElement("img");
  crack.src = "tuyetda.png"; // Đổi thành path đến file bạn vừa gửi
  crack.className = "crack";

  // Vị trí ngẫu nhiên trong sidebar
  const rect = sidebar.getBoundingClientRect();
  const x = Math.random() * (rect.width - 100);
  const y = Math.random() * (rect.height - 100);

  crack.style.left = `${x}px`;
  crack.style.top = `${y}px`;
  crack.style.width = "80px";

  sidebar.appendChild(crack);

  setTimeout(() => {
    sidebar.removeChild(crack);
  }, 3000);
}

// Tạo hiệu ứng ngẫu nhiên mỗi 10-20s
setInterval(spawnCrack, Math.random() * 10000 + 10000);
