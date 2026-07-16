# API仕様書

| endpoint | method | description | requestBody | responseBody | auth |
| --- | --- | --- | --- | --- | --- |
| /api/auth/login | POST | 拡張機能からバックエンドサーバーへの認証を行い、アクセストークンを発行します。※要確認（拡張機能の認証仕様は未定義のため、一般的なJWT認証を想定） | [object Object] |  | [object Object] |
| /api/auth/token/refresh | POST | リフレッシュトークンを用いて、期限切れのアクセストークンを再発行します。 | [object Object] |  | [object Object] |
| /api/settings | GET | 「かんたんMarkdown」の選択エディションや、選択中リポジトリの設定情報を取得します。※要確認（ローカルストレージのみで管理される場合はAPI不要、今回は同期用の設定APIとして定義） |  |  | [object Object] |
| /api/settings | PUT | 「かんたんMarkdown」のエディション選択、リポジトリ区分の設定を更新します（FR-004）。 | [object Object] |  | [object Object] |
| /api/custom-repositories | GET | ユーザーが登録した「その他」のカスタムリポジトリ一覧をページネーション付きで取得します（FR-002）。 |  |  | [object Object] |
| /api/custom-repositories | POST | 新しいカスタムリポジトリURLを登録し、対応するエディションURLを自動算出・保存します（FR-002, FR-003）。 | [object Object] |  | [object Object] |
| /api/custom-repositories/{id}/verify | POST | 指定されたカスタムリポジトリのGitHub Pagesなどの公開URLに対して、バックエンドから疎通確認を行います（FR-005）。 |  |  | [object Object] |
| /api/custom-repositories/{id} | DELETE | 登録されたカスタムリポジトリ設定を物理削除します。 |  |  | [object Object] |
| /api/export/parse | POST | GitHubから抽出された生Markdownをパースし、本文の変換（Insert Tagへの置換プレースホルダー）とダウンロードすべき画像リストを返却します（FR-010, FR-011, FR-012, FR-013）。 | [object Object] |  | [object Object] |
| /api/export/fetch-image | POST | プライベートリポジトリ対応のため、GitHubセッションを用いて画像を安全にフェッチし、Base64（Data URL形式）にエンコードして返却します（FR-015, FR-016, FR-017）。 | [object Object] |  | [object Object] |
| /api/export/package | POST | 指定エディションの「かんたんMarkdown」テンプレート（HTML）に、置換済MarkdownテキストとBase64化された画像を埋め込んだ成果物HTMLをサーバー側でパッケージングして返却します（FR-020）。 | [object Object] |  | [object Object] |
| /api/export/history | POST | 完了または失敗したエクスポート処理履歴および画像処理結果を永続化保存します（FR-019）。 | [object Object] |  | [object Object] |
| /api/export/history | GET | 過去に実行したエクスポート履歴をフィルタ、ページネーション、ソート対応で一覧取得します。 |  |  | [object Object] |
| /api/export/history/{id} | GET | 1件のエクスポートログおよび画像ごとの変換結果詳細を紐づくテーブルより取得します。 |  |  | [object Object] |