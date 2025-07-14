document.addEventListener("DOMContentLoaded", () => {
    loadTeacherSurveys();
  // Hiển thị tên giáo viên
     const teacher = JSON.parse(localStorage.getItem('teacher'));
      if (teacher && teacher.name) {
        document.getElementById('teacherName').textContent = teacher.name;
      }

    // Gửi góp ý
    const feedbackForm = document.getElementById("feedbackForm");
    feedbackForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("feedbackTitle").value;
      const content = document.getElementById("feedbackContent").value;
  
      const res = await authFetch(`${BASE_API}/api/teacher-surveys/feedbacks`, {
        method: "POST",
        body: JSON.stringify({ title, content })
      });
  
      if (res.ok) {
        alert("Đã gửi góp ý!");
        feedbackForm.reset();
      } else {
        alert("Gửi góp ý thất bại.");
      }
    });
  
    // Gửi phản hồi khảo sát
    const surveyResponseForm = document.querySelector("#surveyResponseForm form");
    surveyResponseForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const surveyId = document.getElementById("surveyId").value;
      const responseText = document.getElementById("responseText").value;
  
      const res = await authFetch(`${BASE_API}/api/teacher-surveys/responses`, {
        method: "POST",
        body: JSON.stringify({ surveyId, responseText })
      });
  
      if (res.ok) {
        alert("Đã gửi phản hồi khảo sát!");
        document.getElementById("surveyResponseForm").style.display = "none";
        loadTeacherSurveys();
      } else {
        alert("Gửi phản hồi thất bại.");
      }
    });
  });
  
  async function loadTeacherSurveys() {
    const res = await authFetch(`${BASE_API}/api/admins/latest-survey`);
    const survey = await res.json();
    const list = document.getElementById("surveyList");
    list.innerHTML = "";
  
    if (!survey || !survey.id) {
      list.innerHTML = "<p>Không có khảo sát nào.</p>";
      return;
    }
  
    const div = document.createElement("div");
    div.innerHTML = `
      <h4>${survey.title}</h4>
      <p>${survey.description}</p>
      <button class="btn-respond" onclick="respondSurvey(${survey.id}, '${survey.title.replace(/'/g, "\\'")}')">Phản hồi</button>
      <hr />
    `;
    list.appendChild(div);
  }
  
  
  let currentSurveyId = null;

  function respondSurvey(id, title) {
    const form = document.getElementById("surveyResponseForm");
  
    if (form.style.display === "block" && currentSurveyId === id) {
      // Nếu đang mở đúng khảo sát này => đóng lại
      form.style.display = "none";
      currentSurveyId = null;
    } else {
      // Nếu chưa mở hoặc mở cái khác => cập nhật lại
      document.getElementById("surveyId").value = id;
      document.getElementById("surveyTitle").textContent = `Phản hồi: ${title}`;
      form.style.display = "block";
      currentSurveyId = id;
    }
  }
  
  