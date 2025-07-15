// ====== schedule.js ======
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.username) document.getElementById("userName").textContent = user.username.toUpperCase();

  try {
    const res = await authFetch("http://localhost:3000/api/schedule");
    const data = await res.json();
    const tbody = document.querySelector("#scheduleTable tbody");
    tbody.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.subject_name}</td>
          <td>${item.day_of_week}</td>
          <td>${item.start_time.slice(0, 5)}</td>
          <td>${item.end_time.slice(0, 5)}</td>
          <td>${item.room}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="5">⚠ ${data.message || "Không lấy được TKB"}</td></tr>`;
    }
  } catch (err) {
    console.error("Lỗi tải TKB:", err);
  }
});

function logout() {
  localStorage.clear();
  window.location.href = "login-register.html";
}
