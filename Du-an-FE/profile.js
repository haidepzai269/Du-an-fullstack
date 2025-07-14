document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Bạn chưa đăng nhập!");
    window.location.href = "login-register.html";
    return;
  }

  try {
    const res = await authFetch("http://localhost:3000/api/user/profile");

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Lỗi không xác định từ server");
    }

    const data = await res.json();

    // Gán dữ liệu vào giao diện
    document.getElementById("userName").textContent = data.username.toUpperCase();
    document.getElementById("studentName").value = data.username;
    document.getElementById("studentId").value = data.student_id;
    document.getElementById("studentFaculty").value = data.faculty;
    document.getElementById("studentClass").value = data.class_name;

    document.getElementById("nameInput").value = data.username;

    // Gắn lại sự kiện khi nút được DOM load xong
    document.getElementById("saveBtn").addEventListener("click", updateProfile);

  } catch (err) {
    alert("Lỗi khi tải thông tin: " + err.message);
  }
});

async function updateProfile() {
  const newName = document.getElementById("nameInput").value.trim();
  const faculty = document.getElementById("studentFaculty").value.trim();
  const className = document.getElementById("studentClass").value.trim();

  const updatedData = {
    username: newName,
    faculty,
    class_name: className
  };

  try {
    const res = await authFetch("http://localhost:3000/api/user/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedData)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Cập nhật thất bại");
    }

    const data = await res.json();

    alert("✅ " + data.message);

    // Cập nhật lại giao diện
    document.getElementById("userName").textContent = newName.toUpperCase();
    document.getElementById("studentName").value = newName;

    // Cập nhật localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.username = newName;
      localStorage.setItem("user", JSON.stringify(user));
    }

  } catch (err) {
    alert("❌ Lỗi khi cập nhật: " + err.message);
  }
}
