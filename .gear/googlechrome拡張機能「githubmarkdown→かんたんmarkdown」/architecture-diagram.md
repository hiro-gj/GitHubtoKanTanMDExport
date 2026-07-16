# アーキテクチャ構成図

ブラウザ拡張機能（Manifest V3）とバックエンドAPIサーバー（API仕様書に基づく構成 ※要確認：システム概要に記載の完全クライアントサイド動作モデルとの不整合について要確認）が連携するハイブリッド型アーキテクチャ

**クライアント層（ユーザー・ブラウザ拡張）:**
- エンドユーザー
- コンテンツスクリプト [Chrome Extension Content Script (JavaScript)]
- 設定画面 (Options UI) [HTML5 / CSS3 / Vanilla JS]

**ゲートウェイ層（APIルーティング ※要確認）:**
- API Gateway / ALB [AWS ALB ※要確認：インフラ要件未定義のため推測]

**アプリケーション層（実行ロジック）:**
- サービスワーカー [Chrome Extension Background SW (Manifest V3)]
- バックエンドAPIサーバー [Node.js (Express) ※要確認：技術スタック未定義のため推測]

**データ層（永続化・ローカルストレージ）:**
- chrome.storage.local [WebExtensions Storage API]
- バックエンドデータベース [PostgreSQL ※要確認：技術要件未定義のため推測]

**外部サービス層（GitHubプラットフォーム）:**
- GitHub Web画面 [GitHub DOM / Markdown Preview]
- KanTanMarkdown 配信元 [GitHub Pages (HTML Static Hosting)]
- GitHub画像サーバー [GitHub Assets / Raw Content Server]

**接続:**
- エンドユーザー → GitHub Web画面 (HTTPS)
- エンドユーザー → 設定画面 (Options UI) (UI)
- コンテンツスクリプト → GitHub Web画面 (DOM API)
- コンテンツスクリプト → サービスワーカー (Message Passing)
- 設定画面 (Options UI) → chrome.storage.local (chrome.storage API)
- 設定画面 (Options UI) → API Gateway / ALB (HTTPS)
- サービスワーカー → chrome.storage.local (chrome.storage API)
- サービスワーカー → API Gateway / ALB (HTTPS)
- API Gateway / ALB → バックエンドAPIサーバー (HTTP)
- バックエンドAPIサーバー → バックエンドデータベース (SQL)
- バックエンドAPIサーバー → KanTanMarkdown 配信元 (HTTPS)
- バックエンドAPIサーバー → GitHub画像サーバー (HTTPS)

```mermaid
flowchart TD
    subgraph client["クライアント層（ユーザー・ブラウザ拡張）"]
        user["エンドユーザー"]
        content_script["コンテンツスクリプト (Chrome Extension Content Script (JavaScript))"]
        options_ui["設定画面 (Options UI) (HTML5 / CSS3 / Vanilla JS)"]
    end
    subgraph gateway["ゲートウェイ層（APIルーティング ※要確認）"]
        api_gateway["API Gateway / ALB (AWS ALB ※要確認：インフラ要件未定義のため推測)"]
    end
    subgraph application["アプリケーション層（実行ロジック）"]
        bg_worker["サービスワーカー (Chrome Extension Background SW (Manifest V3))"]
        api_server["バックエンドAPIサーバー (Node.js (Express) ※要確認：技術スタック未定義のため推測)"]
    end
    subgraph data["データ層（永続化・ローカルストレージ）"]
        chrome_storage["chrome.storage.local (WebExtensions Storage API)"]
        db[("バックエンドデータベース (PostgreSQL ※要確認：技術要件未定義のため推測)")]
    end
    subgraph external["外部サービス層（GitHubプラットフォーム）"]
        github_ui["GitHub Web画面 (GitHub DOM / Markdown Preview)"]
        github_pages["KanTanMarkdown 配信元 (GitHub Pages (HTML Static Hosting))"]
        github_media["GitHub画像サーバー (GitHub Assets / Raw Content Server)"]
    end
    user -->|"ブラウザ閲覧"|github_ui
    user -->|"設定変更・保存"|options_ui
    content_script -->|"ボタン挿入 & HTML解析"|github_ui
    content_script -.->|"メッセージ送信"|bg_worker
    options_ui -->|"設定読み書き"|chrome_storage
    options_ui -->|"設定同期・接続検証"|api_gateway
    bg_worker -->|"設定参照"|chrome_storage
    bg_worker -->|"変換・パッケージング要求"|api_gateway
    api_gateway -->|"リクエストルーティング"|api_server
    api_server -->|"設定・変換履歴永続化 ※要確認"|db
    api_server -->|"HTMLテンプレート取得 (FR-020)"|github_pages
    api_server -->|"認証付き画像フェッチ (FR-015)"|github_media
```