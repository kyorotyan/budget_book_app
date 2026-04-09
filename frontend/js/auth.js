const API_BASE = "http://localhost:8000";

// ログインフォームの処理
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // JWTトークンをlocalStorageに保存
                localStorage.setItem("access_token", data.access_token);
                window.location.href = "home.html";
            } else {
                const data = await response.json();
                errorMsg.textContent = data.detail || "ログインに失敗しました。";
                errorMsg.style.display = "block";
            }
        } catch (error) {
            errorMsg.textContent = "サーバーに接続できませんでした。";
            errorMsg.style.display = "block";
        }
    });
}

// ユーザー登録フォームの処理
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMsg = document.getElementById("errorMsg");
        const successMsg = document.getElementById("successMsg");

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                successMsg.textContent = "登録が完了しました。ログイン画面へ移動します。";
                successMsg.style.display = "block";
                errorMsg.style.display = "none";
                setTimeout(() => { window.location.href = "index.html"; }, 1500);
            } else {
                const data = await response.json();
                errorMsg.textContent = data.detail || "登録に失敗しました。";
                errorMsg.style.display = "block";
                successMsg.style.display = "none";
            }
        } catch (error) {
            errorMsg.textContent = "サーバーに接続できませんでした。";
            errorMsg.style.display = "block";
        }
    });
}
