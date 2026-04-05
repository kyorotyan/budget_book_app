---

# ブランチ運用ルール

## 目的
- main ブランチを常にデプロイ可能な安定状態に保つ
- 作業単位を分離し、レビューしやすくする
- 変更履歴を追いやすくする

## 基本ルール
- main へ直接 push しない（必ず Pull Request 経由）
- 1ブランチ = 1目的（1 Issue）
- 作業開始前に main を最新化する
- マージ後は作業ブランチを削除する

## ブランチ種別
- main: 安定版（常にデプロイ可能な状態）
- feature: 新機能追加や通常改修を行うためのブランチ。main から分岐し、作業後に main へマージする
- hotfix: 本番環境で発見された緊急バグを修正するためのブランチ。main から分岐し、修正後に main へマージする

## 命名規則
- フォーマット: `種別/識別子-短い説明`
- `main` は固定名を使う
- `feature` と `hotfix` は `main` から作成する
- 例:
  - `feature/123-login-form`
  - `feature/245-db-schema-update`
  - `hotfix/312-login-null-check`

## 作成手順
1. 新機能・通常改修（`feature`）
1. `git switch main`
1. `git pull origin main`
1. `git switch -c feature/123-login-form`

1. 緊急修正（`hotfix`）
1. `git switch main`
1. `git pull origin main`
1. `git switch -c hotfix/312-login-null-check`

## マージ手順
1. `feature` ブランチ
1. 作業内容をコミットして push
1. `main` 向けに Pull Request を作成
1. レビュー承認後に `main` へマージ
1. マージ後に `feature` ブランチを削除

1. `hotfix` ブランチ
1. 緊急修正を実施して push
1. `main` 向けに Pull Request を作成してマージ
1. 必要に応じてタグを更新
1. マージ後に `hotfix` ブランチを削除

## コミット種別との対応
- コミットメッセージは `COMMIT_TEMPLATE` の種別を使用する
- `add`: 新規機能追加
- `update`: 機能修正（バグ以外）
- `fix`: バグ修正
- `remove`: 削除
- `docs`: ドキュメント修正
- ブランチ種別とコミット種別は別管理とし、内容に合う種別を選ぶ

## 禁止事項
- main で直接作業してコミットすること
- feature を main 以外から作成すること
- hotfix を main 以外から作成すること
- 無関係な変更を1つのブランチに混ぜること
- レビューなしで main に取り込むこと