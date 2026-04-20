const API_BASE = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const setMessage = (id, message, isError) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.textContent = message;
  target.style.color = isError ? "red" : "green";
};

const extractErrorMessage = async (res, fallbackMessage) => {
  try {
    const data = await res.json();
    return data.detail || data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorMessage = await extractErrorMessage(res, "ログインに失敗しました");
        setMessage("loginMessage", errorMessage, true);
        return;
      }

      const data = await res.json();

      localStorage.setItem("authToken", data.token);
      window.location.href = "home.html";
    } catch (error) {
      setMessage("loginMessage", "通信エラーが発生しました", true);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (password.length < 3) {
      setMessage("registerMessage", "パスワードは3文字以上で入力してください", true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const errorMessage = await extractErrorMessage(res, "登録に失敗しました");
        setMessage("registerMessage", errorMessage, true);
        return;
      }

      const data = await res.json();

      setMessage("registerMessage", data.message || "登録が完了しました。ログインしてください。", false);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1200);
    } catch (error) {
      setMessage("registerMessage", "通信エラーが発生しました", true);
    }
  });
}
