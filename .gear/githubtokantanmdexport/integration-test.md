# 結合テスト

| id | testCase | precondition | steps | expectedResult | relatedFunction |
| --- | --- | --- | --- | --- | --- |
| IT-001 | Content ScriptからBackground ScriptへのexportMarkdownメッセージ送信とレスポンス受信検証 | GitHubのMarkdown閲覧画面を表示しており、拡張機能が有効化されていること | [object Object] | Content ScriptとBackground Script間でのメッセージ送受信が正常に完了し、エクスポートデータを受信できること |  |
| IT-002 | カスタムリポジトリURLに対するHEADリクエスト送信による接続確認 | 設定画面が開かれており、リポジトリタイプが 'custom' に設定されていること | [object Object] | 外部のGitHub Pagesエンドポイントに対して疎通確認が行われ、正常な応答が受信できること |  |
| IT-003 | バージョンタグプッシュ時のGitHub Actionsワークフロー起動およびリリース発行検証 | GitHubリポジトリにソースコードが格納されていること | [object Object] | GitHub APIと連携して自動ビルドおよびGitHub Releaseの発行が正常に完了すること |  |
| IT-004 | exportMarkdownメッセージ受信時のchrome.storage.localからの設定値取得とレスポンス統合検証 | chrome.storage.localにrepo_type='custom', custom_repo_url='https://github.com/customuser/customrepo' が保存されていること | [object Object] | 内部メッセージング処理時にローカルストレージの設定値が正しく読み出され、処理結果に反映されること |  |
| IT-005 | 接続テスト実行時のGitHub PagesテンプレートHTML非存在エラー（HTTP 404）検証 | 設定画面で存在しないカスタムリポジトリURLが入力されていること | [object Object] | テンプレートが存在しない場合に疎通エラーが正しくハンドリングされ、エラーメッセージが表示されること |  |
| IT-006 | タグプッシュ時のmanifest.jsonバージョン書き換えとZIPパッケージ生成検証 | リモートリポジトリのmanifest.jsonのversionが '0.0.0' であること | [object Object] | ワークフロー内でmanifest.jsonのバージョン記述が正規化され、ZIPファイルが正常にパッケージングされること |  |
| IT-007 | Markdown閲覧画面アクセス時のエクスポートボタン動的挿入検証 | GitHubの.mdファイル詳細画面を開くこと | [object Object] | 画面上のDOMを検知してエクスポートボタンが正しく挿入され、クリックイベントがバインドされること |  |
| IT-008 | リポジトリタイプ切り替え時のカスタムリポジトリURL入力欄活性・非活性制御検証 | 設定画面が表示されていること | [object Object] | 画面のラジオボタン選択状態に連動して入力フォーム要素の活性/非活性状態が制御されること |  |
| IT-009 | 不正なカスタムリポジトリURL入力時の形式エラー表示検証 | 設定画面でリポジトリタイプ「カスタム」を選択していること | [object Object] | フォーマット違反のURLが検出され、適切なエラーメッセージが画面上に表示されること |  |
| IT-010 | GitHub SPA遷移およびDOM部分更新時のエクスポートボタン再挿入検証 | GitHub上でファイル一覧から .md ファイル閲覧画面へSPA遷移すること | [object Object] | ページ全体リロードを伴わないSPA遷移後もボタンが正しく再挿入されること |  |
| IT-011 | エクスポートモーダルでのエディション選択とボタン状態連動検証 | Markdown閲覧画面で「かんたんMarkdownへエクスポート」を押下しモーダルを表示していること | [object Object] | モーダル上でのユーザー選択が非同期処理の実行状態と正しくUI連動すること |  |
| IT-012 | 設定画面での入力値保存とchrome.storage.local永続化および次回読み込み検証 | 設定画面を開いていること | [object Object] | 設定値がローカルストレージへ正常に書き込まれ、再起動や再読み込み後も保持されること |  |
| IT-013 | エディション指定に応じたテンプレートHTML取得とMarkdown本文・添付メタデータのプレースホルダー合成検証 | 設定ストレージのeditionが'standard'であること | [object Object] | 指定されたエディションのテンプレートHTMLに対し、DB/ストレージ由来のデータが整合性を保って埋め込まれること |  |
| IT-014 | Raw Markdownデータおよび画像・添付ファイル（Blob/Base64）の並列フェッチ検証 | .mdファイル内に画像 ![alt](image.png) および user-attachments の動画リンクが含まれていること | [object Object] | 外部のRawデータおよび添付ファイル群が正常に取得・エンコード処理されること |  |
| IT-015 | エクスポート生成HTMLのブラウザダウンロード処理およびリリースZIPファイル作成検証 | エクスポート処理が成功し、ブラウザ側でBlob URLが生成されていること | [object Object] | 生成されたHTMLコンテンツがファイルとしてクライアント環境へ正しく出力保存されること |  |
| IT-016 | RawデータフェッチとQuine型単一HTMLファイル内へのテキストエスケープ・添付DOM静的埋め込み検証 | Markdownデータに特殊文字 `<script>` や `&` が含まれていること | [object Object] | 特殊文字のエスケープを含むQuine構造の単一HTMLファイルが正しく出力生成されること |  |
| IT-017 | Content ScriptとBackground Script間のメッセージパッシングによるデータ送受信検証 | Chrome拡張機能が有効化されており、GitHubの.mdファイル閲覧画面が開かれていること | [object Object] | Background Scriptへのメッセージパッシングが成功し、生成されたHTMLデータが正常に応答されること |  |
| IT-018 | カスタムリポジトリURLに対するHEADリクエスト疎通検証 | 設定画面でリポジトリタイプ「カスタムリポジトリ」が選択されていること | [object Object] | 外部GitHub Pagesエンドポイントへの疎通確認が成功し、UIに成功メッセージが表示されること |  |
| IT-019 | GitHub Actionsにおけるバージョンタグプッシュ契機のリリース発行検証 | GitHub Actionsワークフローが定義され、secrets.GITHUB_TOKENが設定されていること | [object Object] | ワークフローが正常終了し、GitHub ReleaseおよびパッケージZIPが作成されること |  |
| IT-020 | chrome.runtime.sendMessage実行時のchrome.storage.local設定値取得連携検証 | chrome.storage.localにrepo_type='custom', custom_repo_url='https://github.com/customuser/customrepo', edition='standard'が保存されていること | [object Object] | ストレージの設定値に基づき、カスタムリポジトリのテンプレート取得先URLが正しく構築・フェッチされること |  |
| IT-021 | 存在しないカスタムリポジトリURLに対するテンプレート取得疎通失敗のハンドリング検証 | 設定画面にて存在しないカスタムリポジトリURLが設定されていること | [object Object] | テンプレートフェッチ失敗時に適切なエラーハンドリングが行われ、画面にエラー状態が表示されること |  |
| IT-022 | 規定外フォーマットのタグプッシュ時におけるリリースワークフロー非起動検証 | リポジトリにリリースワークフローが設定されていること | [object Object] | 対象外のタグプッシュに対してビルド・リリース処理がトリガーされないこと |  |
| IT-023 | Markdown閲覧画面でのSPA遷移におけるエクスポートボタン動的挿入検証 | GitHub上で'.md'以外のファイル閲覧画面が開かれていること | [object Object] | SPA遷移後も遅延なくボタンが画面上に正しく挿入されること |  |
| IT-024 | 設定画面でのリポジトリタイプ切り替えに伴う入力欄有効・無効化検証 | 設定画面が開かれており、初期状態で「公式リポジトリ」が選択されていること | [object Object] | UI操作に応じて関連するフォーム要素の有効・無効状態が正しく制御されること |  |
| IT-025 | カスタムリポジトリURLの不正フォーマット入力時のバリデーション検証 | 設定画面で「カスタムリポジトリ」が選択されていること | [object Object] | 不正なURL形式に対して即座に画面上でエラー表示が行われること |  |
| IT-026 | 同一画面内DOM部分更新時のエクスポートボタン重複挿入防止検証 | Markdownファイル閲覧画面でエクスポートボタンが既に描画されていること | [object Object] | ボタン要素が重複せず、画面上に常に1点のみ表示されること |  |
| IT-027 | エクスポートボタン押下時のモーダル表示と初期選択エディションの連動検証 | chrome.storage.localにedition='standard'が保存されていること | [object Object] | ストレージに保存されたデフォルトエディションがモーダル初期値に反映されること |  |
| IT-028 | chrome.storage.localへの設定値保存および再読み込みデータ整合性検証 | 設定画面が開かれていること | [object Object] | ローカルストレージへのデータ永続化と読み出しが正確に行われること |  |
| IT-029 | エディション指定に応じたテンプレートHTML取得とMarkdownデータの埋め込み整合性検証 | 対象のMarkdownファイルにテキストコンテンツが含まれていること | [object Object] | 選択エディションに応じたテンプレートにデータが整合性を保って合成されること |  |
| IT-030 | Raw Markdownおよび画像・添付ファイルデータの個別取得検証 | Markdown本文に画像リンク（![alt](image.png)）および添付ファイルが含まれていること | [object Object] | 外部添付ファイルおよび画像データが正しくフェッチ・エンコードされること |  |
| IT-031 | 生成HTMLダウンロード処理および拡張機能ZIPアーカイブ出力検証 | バックグラウンドでのHTML生成処理が完了していること | [object Object] | クライアント環境においてHTMLファイルのダウンロード保存が完了すること |  |
| IT-032 | RawデータフェッチとQuine型単一HTMLファイル生成処理検証 | Raw Markdownデータの取得URLが有効であること | [object Object] | 単体で動作するQuine型単一HTMLファイル構造が正常に構築されること |  |
| IT-033 | Content ScriptからBackground ScriptへのexportMarkdownメッセージ送信およびデータ受発信検証 | GitHubのMarkdownファイル閲覧画面（https://github.com/user/repo/blob/main/README.md）を表示しており、エクスポートボタンが挿入されていること。 | [object Object] | Content ScriptとBackground Script間のメッセージ通信が成功し、生成されたHTMLファイルのダウンロード処理が開始されること |  |
| IT-034 | カスタムリポジトリURLに対するHEADリクエスト送信によるテンプレート存在確認検証 | 拡張機能の設定画面を開き、リポジトリタイプで「カスタムリポジトリ」が選択されていること。 | [object Object] | 外部GitHub Pagesエンドポイントへの疎通確認が正常に完了し、接続成功メッセージが画面に描画されること |  |
| IT-035 | バージョンタグ（v*）のGitプッシュを契機としたGitHub Actionsリリースワークフロー起動検証 | GitHubリポジトリにビルド対象ソースコードがコミットされていること。 | [object Object] | GitHub ActionsのAPI連携により、パッケージZIPの作成とGitHub Releaseの自動発行が完了すること |  |
| IT-036 | メッセージパッシング実行時におけるchrome.storage.localからの設定値取得およびテンプレート決定処理検証 | chrome.storage.localにrepo_type='custom', custom_repo_url='https://github.com/customuser/customrepo', edition='standard'が事前に保存されていること。 | [object Object] | ローカルストレージから設定情報が正しく取得・結合され、指定されたカスタムテンプレートでのエクスポート処理が正常完了すること |  |
| IT-037 | 存在しないカスタムリポジトリURLに対する接続テスト時の通信エラー検知検証 | 設定画面を開き、リポジトリタイプで「カスタムリポジトリ」が選択されていること。 | [object Object] | 外部テンプレート通信失敗が正しく検知され、エラー状態が画面にフィードバックされること |  |
| IT-038 | 不適合なタグパターン（v*以外）プッシュ時におけるGitHub Actionsリリースワークフロー不起動検証 | GitHubリポジトリにソースコードがコミットされていること。 | [object Object] | 対象外のタグプッシュに対してCI/CDリリース連携APIが呼び出されないことが確認されること |  |
| IT-039 | Markdownファイル閲覧画面アクセス時におけるエクスポートボタン動的挿入確認 | Chrome拡張機能が有効化されており、GitHubの.mdファイル閲覧画面が開かれていること | [object Object] | Markdownファイル閲覧画面にエクスポートボタンが正常に挿入・描画されること |  |
| IT-040 | エディション選択モーダルの表示および設定画面連動初期値の検証 | chrome.storage.localにedition='standard'が保存されていること | [object Object] | 保存された設定値に応じてエディション選択モーダルの初期表示状態が正しく制御されること |  |
| IT-041 | 設定画面における不正なカスタムリポジトリURL入力時の接続テストバリデーション検証 | 設定画面が開かれており、リポジトリタイプで「custom」を選択していること | [object Object] | フォーマット不正なURLに対して即座にバリデーションエラーメッセージが描画されること |  |
| IT-042 | DOM監視およびSPA遷移時におけるエクスポートボタン重複挿入防止検証 | Markdownファイル閲覧画面で「かんたんMarkdownへエクスポート」ボタン（#ktm-export-btn）が既に挿入されていること | [object Object] | DOM更新が発生してもエクスポートボタンが重層化されず1つのみ正しく維持されること |  |
| IT-043 | 設定画面でのリポジトリタイプ変更に伴う入力フィールド活性・非活性制御検証 | 設定画面で「custom」を選択し、カスタムリポジトリURLに'https://github.com/user/repo'が入力されていること | [object Object] | リポジトリタイプの変更に応じて画面上の入力フォーム要素の有効・無効切り替えおよび値の非活性化処理が正しく動作すること |  |
| IT-044 | chrome.storage.localにおける設定値の永続化と取得検証 | 拡張機能の設定画面が開かれており、chrome.storage.localが初期化状態であること | [object Object] | 設定画面で入力した値がエラーなくchrome.storage.localへ永続化され、再読み込み時にも正しく取得できること |  |
| IT-045 | エディション指定に応じたテンプレートHTML取得とデータ埋め込み検証 | Markdownファイル閲覧画面で'.md'ファイルを表示しており、chrome.storage.localにedition='standard'が設定されていること | [object Object] | 指定されたエディション（standard）に対応するテンプレートHTML（ktm-std.html）が取得され、Markdown本文とデータ構造が欠損なく結合されたオブジェクトが作成されること |  |
| IT-046 | Raw Markdownデータおよび添付ファイルメタデータの個別取得検証 | Markdownファイル閲覧画面を表示中で、Markdown本文に画像および添付ファイルリンクが含まれていること。 | [object Object] | Raw Markdownテキストおよび添付データが取得され、添付ファイルデータマップが正しく構築されること。 |  |
| IT-047 | GitHub ActionsによるChrome拡張機能ZIPパッケージングとリリース出力検証 | GitHubリポジトリにおいて、タグ 'v1.0.0' のプッシュイベントが発生すること。 | [object Object] | 拡張機能構成ファイルを含むZIPアーカイブが作成され、GitHub Releaseとして出力されること。 |  |
| IT-048 | Rawデータフェッチ結果とQuine型単一HTMLファイル出力処理の検証 | かんたんMarkdownデータ取得およびエクスポート処理の応答をContent Scriptが正常に受信した状態。 | [object Object] | Quine仕様に基づき、Markdown本文および添付情報が正しく組み込まれた単一のスタンドアロンHTMLファイルが生成・出力されること。 |  |