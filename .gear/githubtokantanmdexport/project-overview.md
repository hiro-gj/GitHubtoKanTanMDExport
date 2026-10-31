# プロジェクト概要

# プロジェクト概要

## 概要
GitHubtoKanTanMDExportは、GitHub上のMarkdown（.md）ファイルを閲覧する際に、インタラクティブで閲覧しやすい「かんたんMarkdown」形式のHTMLへエクスポート・変換できるようにするGoogle Chrome拡張機能です。

本拡張機能は、GitHubのDOM構造を監視してファイル詳細画面に専用のエクスポートボタンを自動的に挿入します。ユーザーがボタンをクリックすると、バックグラウンドスクリプトを介してRaw MarkdownデータとテンプレートHTMLを取得・合成し、スタンドアロンで動作するHTMLファイルを生成・保存します。

Manifest V3仕様に準拠したJavaScript（Content Script, Background Script, Options UI）を中心に構成されており、GitHub Actionsを活用したビルドおよびリリース自動化パイプラインも備えています。