// ====== login-register.js ======
const API_BASE = window.location.origin; 


function showRegisterForm() {
  document.body.classList.add("show-register");
}

function showLoginForm() {
  document.body.classList.remove("show-register");
}

window.addEventListener("DOMContentLoaded", () => {
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPassword = localStorage.getItem("savedPassword");
  const remember = localStorage.getItem("rememberMe");

  if (remember === "true") {
    document.querySelector("#loginForm #email").value = savedEmail || "";
    document.querySelector("#loginForm #password").value = savedPassword || "";
    document.querySelector("#loginForm .check-box input[type='checkbox']").checked = true;
  }
});

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.querySelector("#registerForm #username").value.trim();
  const email = document.querySelector("#registerForm #email").value.trim();
  const password = document.querySelector("#registerForm #password").value.trim();

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      showLoginForm();
    } else {
      alert(data.error || "Đăng ký thất bại");
    }
  } catch (err) {
    alert("Lỗi kết nối server!");
    console.error(err);
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector("#loginForm #email").value.trim();
  const password = document.querySelector("#loginForm #password").value.trim();
  const rememberMe = document.querySelector("#loginForm .check-box input[type='checkbox']").checked;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
        localStorage.removeItem("rememberMe");
      }

      window.location.href = "home.html";
    } else {
      alert(data.error || "Đăng nhập thất bại");
    }
  } catch (err) {
    alert("Lỗi kết nối server!");
    console.error(err);
  }
});
