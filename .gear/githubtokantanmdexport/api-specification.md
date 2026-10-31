# API仕様書

| endpoint | method | description | requestBody | responseBody | auth |
| --- | --- | --- | --- | --- | --- |
| chrome.runtime.sendMessage:exportMarkdown | POST | Raw Markdownデータおよび設定されたリポジトリタイプ・エディションに応じたテンプレートHTMLをフェッチ・結合し、エクスポート用HTMLコンテンツを生成するメッセージパッシングAPI。 | [object Object] |  | [object Object] |
| https://{username}.github.io/{repo}/dist/ktm-lite.html | GET | 設定画面で入力されたカスタムリポジトリURLから構築したGitHub PagesのHTMLエンドポイントに接続テストを行い、テンプレートの存在および接続可否を確認する。 |  |  | [object Object] |
| chrome.storage.local | PUT | 拡張機能の設定（リポジトリタイプ、カスタムリポジトリURL、エディション）を Chrome 拡張機能のローカルストレージへ読み込み・保存する処理。 | [object Object] |  | [object Object] |
| github-actions/release-extension | POST | GitHubリポジトリに対するバージョンタグ（v*）のプッシュを契機に、manifest.jsonのバージョン記述更新、ZIPパッケージ化、およびGitHub Releaseの作成を実行するワークフロー処理。 | [object Object] |  | [object Object] |