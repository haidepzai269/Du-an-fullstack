// ====== grades.js ======
document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.username) document.getElementById("userName").textContent = user.username.toUpperCase();

  try {
    const res = await authFetch("http://localhost:3000/api/grades");
    const data = await res.json();
    const tbody = document.querySelector("#gradesTable tbody");
    tbody.innerHTML = "";

    if (Array.isArray(data)) {
      data.forEach(item => {
        const midterm = Number(item.midterm);
        const final = Number(item.final);
        const avg = ((midterm + final) / 2).toFixed(2);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.subject}</td>
          <td>${midterm}</td>
          <td>${final}</td>
          <td>${avg}</td>
          <td>${avg >= 5 ? "Đạt" : "Không đạt"}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      tbody.innerHTML = `<tr><td colspan="5">⚠ ${data.message || "Không lấy được dữ liệu điểm."}</td></tr>`;
    }
  } catch (err) {
    console.error("Lỗi lấy điểm:", err);
  }
});

function goBack() {
  window.location.href = "home.html";
}

