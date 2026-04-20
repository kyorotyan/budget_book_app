// localStorage から authToken を取得
const token = localStorage.getItem("authToken");

// トークンがない場合はログイン画面へリダイレクト
if (!token) {
  window.location.href = "index.html";
}

// id="logoutBtn" のボタンを探す
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  // クリックされたら localStorage の authToken を削除してログイン画面へリダイレクト
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "index.html";
  });
}
