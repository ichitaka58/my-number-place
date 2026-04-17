# My Number Place (フロントエンド)

[🚀 Live Demoを見る](https://my-number-place.vercel.app/)

このプロジェクトは、「ナンプレ」をプレイできるWebアプリケーションのフロントエンドです。
難易度ごとのパズルを解き、クリアタイムを測定・バックエンドに保存してランキングとして確認することができます。

## 技術スタック

* **ライブラリ/フレームワーク**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
* **言語**: TypeScript
* **スタイリング**: [Tailwind CSS](https://tailwindcss.com/)
* **UIコンポーネント**: [Material UI (MUI)](https://mui.com/)
* **ルーティング**: React Router

## 主な機能

* **ナンプレプレイ機能**: 動的に生成される数独パズルを解くことができます。
* **難易度選択**: Easy, Medium, Hard, Debug などのレベルから選択可能です。
* **タイマー機能**: パズルを開始してからの経過時間をリアルタイムで計測します。
* **クリアタイムの保存・表示**: バックエンドAPIと連携し、ゲームのクリア時間を成績（Result）として一覧表示します。

## 開発環境のセットアップ手順

### 1. リポジトリのクローンと依存関係のインストール

```bash
git clone https://github.com/ichitaka58/my-number-place.git
cd my-number-place
npm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、必要な環境変数（バックエンドAPIのURLなど）を設定します。

```env
VITE_API_URL=http://localhost:8888
```
※ 使用している環境に合わせてURLを変更してください。

### 3. アプリケーションの起動

開発モードで起動する場合：
```bash
npm run dev
```

ビルドしてプレビューする場合：
```bash
npm run build
npm run preview
```

アプリケーションはデフォルトで `http://localhost:5173` などのURLで起動します（Viteのデフォルト）。

## 構造

* `/src/components`: ナンバーパッドやタイマー、ナビゲーションなどの共通UIコンポーネント
* `/src/pages`: Home, Result, NotFound などのページコンポーネント
* `/src/router`: 画面遷移（ルーティング）の設定
* `/src/utils`: 時間計算などのユーティリティ関数
* `/src/lib/api.ts`: バックエンドとの通信処理
* `/src/mock`: 開発やテスト用のモックデータ

## バックエンドシステム

本アプリケーションは以下のバックエンドと連携して動作します。
* **[my-number-place-backend](https://github.com/ichitaka58/my-number-place-backend)** (Node.js/Express + Prisma)

## デプロイ (Vercel)

このフロントエンドアプリケーションは [Vercel](https://vercel.com/) にデプロイされています。

### 本番環境での環境変数の設定
Vercelのダッシュボード（`Settings` > `Environment Variables`）にて、デプロイ済みのバックエンドAPIを指すように以下の環境変数を設定してください。

* `VITE_API_URL`: `<バックエンドの公開URL>` (例: `https://my-number-place-backend.onrender.com` など)

### デプロイ運用
`main` ブランチにコードがPushされると、Vercelによって自動的にビルドとデプロイが行われます。

