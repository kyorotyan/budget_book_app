# 家計簿アプリの作成

簡単な家計簿アプリの仕様とMVPを記載します。

## MVP（優先機能） 🎯

- **収支入力（支出/収入）**: 金額、日付、カテゴリ、メモ
- **一覧表示・編集・削除**: 日付/カテゴリでフィルタ
- **月次サマリ**: 合計・残高表示 + 簡易グラフ（棒/円）
- **CSVエクスポート／インポート**
- **ユーザー認証（任意）**: ローカルのみでも可

## 使用する技術スタック 🛠️
- バックエンド: Python/FastAPI
- ログイン方式: JWT
## ローカル実行（ログイン機能）
1. `docker-compose up -d`（DB と API が起動します）
2. ブラウザで `http://localhost:8080` を開く

## API をローカルで動かす場合
1. `docker-compose up -d database`
2. `backend` で依存関係をインストールして API を起動
	- `pip install -r requirements.txt`
	- `uvicorn main:app --host 0.0.0.0 --port 3000`
3. ブラウザで `http://localhost:8080` を開く
