// ✅ profile-teacher.js
const teacher = JSON.parse(localStorage.getItem("teacher"));

window.onload = async () => {
  if (!teacher || !teacher.id) {
    alert("Không tìm thấy tài khoản giáo viên");
    return (window.location.href = "teacher-auth.html");
  }

  document.getElementById("usernameDisplay").textContent = teacher.name?.toUpperCase() || "GIÁO VIÊN";

  try {
    const res = await authFetch(`http://localhost:3000/api/teachers/${teacher.id}`);
    if (!res.ok) throw new Error("Không tìm thấy giáo viên");

    const data = await res.json();
    document.getElementById("displayName").value = data.name;
    document.getElementById("displayEmail").value = data.email;
    document.getElementById("displaySubject").value = data.department || "";
    document.getElementById("displayCode").value = `GV${data.id}`;
  } catch (err) {
    console.error("Lỗi:", err);
    alert("Không thể tải thông tin giáo viên");
  }
};

document.getElementById("saveBtn").addEventListener("click", async () => {
  const newName = document.getElementById("newName").value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();

  if (!newName && !newPassword) return alert("Vui lòng nhập tên mới hoặc mật khẩu mới");

  try {
    if (newName) {
      await authFetch(`http://localhost:3000/api/teachers/${teacher.id}/name`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName })
      });
      teacher.name = newName;
      localStorage.setItem("teacher", JSON.stringify(teacher));
      document.getElementById("usernameDisplay").textContent = newName.toUpperCase();
    }

    if (newPassword) {
      await authFetch(`http://localhost:3000/api/teachers/${teacher.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword })
      });
    }

    alert("Đã cập nhật thành công!");
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert("Cập nhật thất bại!");
  }
});

function logout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("teacher");
    window.location.href = "teacher-auth.html";
  }
}