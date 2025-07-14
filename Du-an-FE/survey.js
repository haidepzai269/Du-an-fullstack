document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('feedbackTitle').value;
  const content = document.getElementById('feedbackContent').value;

  try {
    const res = await authFetch('http://localhost:3000/api/survey/feedback', {
      method: 'POST',
      body: JSON.stringify({ title, content })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      document.getElementById('feedbackForm').reset();
    } else {
      alert('Gửi góp ý thất bại: ' + data.error || data.message);
    }
  } catch (err) {
    alert('Lỗi mạng: ' + err.message);
  }
});
// Hiển thị tên người dùng ở góc trên trái
const userData = JSON.parse(localStorage.getItem("user"));
const userName = userData?.username || "Tên người dùng";
document.getElementById("userName").innerText = userName;

async function loadSurveys() {
  try {
    const res = await authFetch('http://localhost:3000/api/admins/latest-survey');
    const survey = await res.json();
    const container = document.getElementById('surveyList');
    container.innerHTML = '';

    if (!survey || !survey.id) {
      container.innerHTML = '<p>Không có khảo sát nào.</p>';
      return;
    }

    const div = document.createElement('div');
    div.innerHTML = `
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px; border-radius: 6px;">
        <strong>${survey.title}</strong><br/>
        <p>${survey.description}</p>
        <button onclick="showSurveyForm(${survey.id}, '${survey.title.replace(/'/g, "\\'")}')">Phản hồi</button>
      </div>
    `;
    container.appendChild(div);
  } catch (err) {
    alert('Lỗi khi tải khảo sát: ' + err.message);
  }
}


loadSurveys();

function showSurveyForm(id, title) {
  document.getElementById('surveyId').value = id;
  document.getElementById('surveyTitle').innerText = title;
  document.getElementById('surveyResponseForm').style.display = 'block';
}

document.getElementById('surveyResponseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const survey_id = document.getElementById('surveyId').value;
  const response_text = document.getElementById('responseText').value;

  try {
    const res = await authFetch('http://localhost:3000/api/survey/respond', {
      method: 'POST',
      body: JSON.stringify({ survey_id, response_text })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      document.getElementById('surveyResponseForm').style.display = 'none';
      document.getElementById('responseText').value = '';
    } else {
      alert('Gửi phản hồi thất bại: ' + data.error || data.message);
    }
  } catch (err) {
    alert('Lỗi mạng: ' + err.message);
  }
});



