// 家計簿アプリのメインスクリプト
// ログイン状態の確認
const token = localStorage.getItem("access_token");
if (!token) {
    window.location.href = "index.html";
}
