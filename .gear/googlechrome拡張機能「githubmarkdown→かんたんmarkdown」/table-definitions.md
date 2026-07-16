# テーブル定義

| tableName | columnName | dataType | nullable | primaryKey | description |
| --- | --- | --- | --- | --- | --- |
| user_settings | setting_id | UUID | NO | YES | 設定ID |
| user_settings | selected_repository_type | VARCHAR(50) | NO | NO | 選択リポジトリ区分（original:オリジナル / custom:その他 ※要確認） |
| user_settings | selected_edition | VARCHAR(50) | NO | NO | 選択エディション（lite / standard / full） |
| user_settings | custom_repository_id | UUID | YES | NO | 選択カスタムリポジトリID（custom_repositoriesテーブルのID ※要確認） |
| user_settings | updated_at | TIMESTAMP | NO | NO | 最終更新日時 |
| custom_repositories | repository_id | UUID | NO | YES | カスタムリポジトリID |
| custom_repositories | repository_url | VARCHAR(255) | NO | NO | リポジトリURL |
| custom_repositories | lite_url | VARCHAR(555) | NO | NO | LiteエディションURL（※要確認：自動生成仕様に基づく） |
| custom_repositories | standard_url | VARCHAR(555) | NO | NO | StandardエディションURL（※要確認：自動生成仕様に基づく） |
| custom_repositories | full_url | VARCHAR(555) | NO | NO | FullエディションURL（※要確認：自動生成仕様に基づく） |
| custom_repositories | is_valid | BOOLEAN | NO | NO | 接続検証ステータス（※要確認：技術要件未定義のため仮設定） |
| custom_repositories | created_at | TIMESTAMP | NO | NO | 登録日時 |
| export_history | export_id | UUID | NO | YES | エクスポート実行履歴ID |
| export_history | github_repo_name | VARCHAR(255) | NO | NO | 対象GitHubリポジトリ名 |
| export_history | original_file_name | VARCHAR(255) | NO | NO | エクスポート元Markdownファイル名 |
| export_history | output_file_name | VARCHAR(255) | NO | NO | ダウンロード出力ファイル名（※要確認：命名制御ルールに基づく） |
| export_history | edition_used | VARCHAR(50) | NO | NO | エクスポート時の適用エディション |
| export_history | markdown_char_count | INTEGER | NO | NO | Markdown文字数（※要確認：未定義の統計情報） |
| export_history | image_count | INTEGER | NO | NO | 検出・処理対象画像数 |
| export_history | status | VARCHAR(50) | NO | NO | エクスポート処理結果ステータス（SUCCESS/FAILED ※要確認） |
| export_history | error_message | VARCHAR(500) | YES | NO | エラーメッセージ（※要確認：エラーハンドリング仕様に基づく） |
| export_history | exported_at | TIMESTAMP | NO | NO | エクスポート実行日時 |
| exported_images | image_id | UUID | NO | YES | 画像処理履歴ID |
| exported_images | export_id | UUID | NO | NO | エクスポート実行履歴ID（export_historyテーブルの外部キー） |
| exported_images | original_image_url | VARCHAR(2048) | NO | NO | オリジナル画像取得先URL |
| exported_images | base64_size_bytes | INTEGER | YES | NO | Base64エンコード後データサイズ（※要確認：容量制限監視用） |
| exported_images | status | VARCHAR(50) | NO | NO | 画像個別処理ステータス（SUCCESS/FAILED ※要確認） |
| exported_images | created_at | TIMESTAMP | NO | NO | レコード作成日時 |