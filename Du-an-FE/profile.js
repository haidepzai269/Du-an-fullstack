// ====== profile.js ======
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "login-register.html";
    return;
  }

  try {
    const res = await authFetch("http://localhost:3000/api/user/profile");
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();

    document.getElementById("userName").textContent = data.username.toUpperCase();
    document.getElementById("studentName").value = data.username;
    document.getElementById("studentId").value = data.student_id;
    document.getElementById("studentFaculty").value = data.faculty;
    document.getElementById("studentClass").value = data.class_name;
    document.getElementById("nameInput").value = data.username;

    document.getElementById("saveBtn").addEventListener("click", updateProfile);
  } catch (err) {
    alert("Lỗi khi tải thông tin: " + err.message);
  }
});

async function updateProfile() {
  const newName = document.getElementById("nameInput").value.trim();
  const faculty = document.getElementById("studentFaculty").value.trim();
  const className = document.getElementById("studentClass").value.trim();

  try {
    const res = await authFetch("http://localhost:3000/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: newName, faculty, class_name: className })
    });

    if (!res.ok) throw new Error(await res.text());

    alert("✅ Thay đổi thông tin thành công!");
    document.getElementById("userName").textContent = newName.toUpperCase();
    document.getElementById("studentName").value = newName;

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.username = newName;
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (err) {
    alert("❌ Lỗi khi cập nhật: " + err.message);
  }
}