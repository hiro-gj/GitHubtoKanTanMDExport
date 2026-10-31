# システム概要

```json
{
  "sections": [
    {
      "title": "システム構成概要",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| 拡張 | 2件 | 添付ファイル（動画・ドキュメント）対応のための非同期リソース処理拡張、オプショナル権限動的リクエストの組み込み |\n| - | 3件 | Content Script、Service Worker、Options UIの基本構成 |\n\n## 拡張\n### 添付ファイル高度化コンポーネント（Content Script / Service Worker）\n従来の画像データ取得・Base64変換処理を拡張し、GitHubの `user-attachments`（動画、PDF、各種添付ドキュメント）のUUID解読および非同期並列フェッチ・Base64データ化に対応。Quine型単一HTML構造（KanTanMarkdown仕様）へ完全統合します。\n\n### 動的権限リクエストコンポーネント（Options UI）\nカスタムリポジトリURL指定時のセキュリティ強化として、`chrome.permissions` APIを用いたオプショナルホスト権限の動的リクエストおよび確認ゲート処理を追加構成します。\n\n## 既存（参考）\n### 1. Content Script (`content.js`)\nGitHubの.mdファイル閲覧画面を監視（MutationObserver）し、画面上にエクスポートボタンおよびエディション選択UIを挿入。生成された単一HTMLのダウンロード処理を担当。\n\n### 2. Service Worker (`background.js`)\nManifest V3準拠のバックグラウンドスクリプト。Content Scriptからの要求を受け、CORSの影響を受けずにRaw Markdown、テンプレートHTML、画像・添付ファイルを並列取得・合成。\n\n### 3. Options UI (`options.html` / `options.js`)\nテンプレートリポジトリタイプ（公式/カスタム）およびデフォルトエディションの設定保持（`chrome.storage.local`）、接続テスト機能を提供。"
    },
    {
      "title": "使用技術スタック",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| 拡張 | 1件 | Manifest V3 API（chrome.permissions）の権限拡張利用 |\n| - | 4件 | JavaScript(ES6+)、Chrome Extension API、GitHub Actions、GitHub Pages |\n\n## 拡張\n### Chrome Extension API\n- **Manifest Version**: Manifest V3\n- **拡張API**: `chrome.storage.local`（設定保持）、`chrome.runtime`（コンポーネント間通信）、`chrome.permissions`（オプショナル権限の動的取得：拡張）\n\n## 既存（参考）\n### 言語・コア技術\n- **フロントエンド/スクリプト**: JavaScript (ES6+)\n- **マークアップ/スタイル**: HTML5, CSS3, GitHub Primer Design System模倣スタイル\n\n### 開発・CI/CDパイプライン\n- **CI/CD Platform**: GitHub Actions (`ubuntu-latest` runner)\n- **ツール**: `jq` (manifest.jsonバージョン自動更新用)、`zip` (パッケージング用)、`actions/checkout@v4`、`softprops/action-gh-release@v2`\n\n### 外部インフラ・配信\n- **テンプレート配信**: GitHub Pages (`https://tatesuke.github.io/KanTanMarkdown` または カスタムリポジトリ)"
    },
    {
      "title": "システム間連携",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| 拡張 | 1件 | user-attachments（添付ファイル群）取得のための外部エンドポイント連携拡張 |\n| - | 3件 | Content Script-Background間メッセージング、GitHub Raw連携、GitHub Pages連携 |\n\n## 拡張\n### GitHub Attachments Service 連携\n- **連携元**: Service Worker (`background.js`)\n- **連携先**: `https://github.com/user-attachments/assets/` および `private-user-images.githubusercontent.com`\n- **連携内容**: Content Scriptが解析したUUIDメタデータを元に、添付ファイル・動画・画像を直フェッチしBase64エンコード化。\n\n## 既存（参考）\n### コンポーネント間内部連携 (chrome.runtime)\n- **Content Script ↔ Service Worker**: `chrome.runtime.sendMessage` / `sendResponse` による非同期非ブロッキング通信。\n- **Options UI ↔ Storage**: `chrome.storage.local` を介した設定値の同期。\n\n### GitHub Web 連携\n- **Content Script ↔ GitHub DOM**: DOM構造およびSPA遷移の監視・ボタン動的挿入。\n- **Service Worker ↔ GitHub Raw**: `raw.githubusercontent.com` からのRaw Markdown取得。\n- **Service Worker ↔ GitHub Pages**: `https://tatesuke.github.io/KanTanMarkdown/dist/` からの各種エディション用テンプレートHTML取得。"
    },
    {
      "title": "データフロー概要",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| 拡張 | 1件 | 動画・添付ファイルのメタデータ解析および合成データフローの拡張 |\n| - | 3件 | DOM監視・ボタン挿入フロー、リソースフェッチフロー、単一HTML生成・ダウンロードフロー |\n\n## 拡張\n### 添付ファイル統合データフロー\n1. **解析**: Content Scriptが `.markdown-body` 内の `video`, `source`, `img`, `a` タグから `user-attachments` UUIDおよびファイル名を抽出メタデータ化。\n2. **取得**: Service Workerが送信されたメタデータに基づき、全添付ファイル（画像/動画/ドキュメント）を並列フェッチしBase64変換。\n3. **置換・埋め込み**: Raw Markdown内のURL記述を `attach:cleanKey` に置換し、Quine型HTMLの `<ul id=\"fileList\">` 内へ `<script type=\"text/template\" id=\"attach-...\">` 形式で静的注入。\n\n## 既存（参考）\n### 全体処理フロー\n1. **画面監視・ボタン挿入**: Content Scriptが `.md` ページを検知し、エクスポートボタンを挿入。\n2. **ユーザー操作・エディション選択**: ボタン押下でモーダルダイアログを表示し、エディション（Lite/Standard/Full）を選択。\n3. **メッセージ送信**: Content Scriptから Service Worker へ処理要求を送信。\n4. **データ取得・合成**: Service Workerが Raw Markdown、テンプレートHTML、各種画像を非同期取得・合成しオブジェクト化して返却。\n5. **ファイル出力**: Content Scriptが受け取った合成データを Blob 化し、ブラウザのダウンロード機能で保存。"
    },
    {
      "title": "セキュリティ概要",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| 拡張 | 2件 | XSSエスケープ強化、chrome.permissionsによる最小権限モデルの拡張適用 |\n| - | 2件 | Manifest V3セキュアモデル準拠、CORS制約の安全な回避 |\n\n## 拡張\n### インジェクション（XSS）防止の強化\n- **Markdownサニタイズ**: テンプレートの `<textarea id=\"editor\">` への埋め込み時、`&`, `<`, `>` の確実なエスケープを実施。\n- **添付ファイルデータサニタイズ**: `<script type=\"text/template\">` 内へのBase64埋め込み時、`</script>` タグの分割エスケープ (`<\\/script>`) を徹底し、スクリプト脱出型インジェクションを防止。\n\n### 最小権限とオプショナルホスト権限\n- **権限管理**: 必要最小限の権限（`storage`）のみを標準指定。カスタムリポジトリURL接続テスト時には `chrome.permissions.request` によりユーザー同意を明示的に取得。\n\n## 既存（参考）\n### Manifest V3 準拠\n- 外部スクリプトの動的実行 (`eval` やリモートコード実行) を全廃し、バックグラウンド処理を Service Worker で分離実行。"
    },
    {
      "title": "インフラ構成概要",
      "content": "## 変更サマリー\n| 区分 | 件数 | 主な内容 |\n|------|------|----------|\n| - | 3件 | クライアントサイド完結型実行環境、GitHub Pagesテンプレート配信、GitHub Actions CI/CDパイプライン |\n\n## 既存（参考）\n### クライアント実行環境\n- **ブラウザ**: Google Chrome（Manifest V3対応バージョン）\n- **アーキテクチャ**: サーバーレス / クライアントサイド完結型（ユーザーのブラウザ内で全ての変換・HTML合成処理を完了）\n\n### ホスティング・配布インフラ\n- **テンプレートホスティング**: GitHub Pages (CDN配信)\n  - URL: `https://tatesuke.github.io/KanTanMarkdown/dist/` (ktm-lite.html / ktm-std.html / ktm-full.html)\n\n### CI/CDパイプライン（自動ビルド・リリース）\n- **プラットフォーム**: GitHub Actions\n- **トリガー**: `v*` タグのGitHubリポジトリへのプッシュ\n- **パイプライン工程**:\n  1. `actions/checkout@v4` によるソースコードチェックアウト\n  2. リリースタグ名からセマンティックバージョンを抽出し `jq` で `manifest.json` の `version` を自動更新\n  3. `zip` コマンドによる拡張機能パッケージング (`github-to-kantan-markdown.zip`)\n  4. `softprops/action-gh-release@v2` を使用した GitHub Release の自動作成とZIPパッケージのアタッチ"
    }
  ]
}
```