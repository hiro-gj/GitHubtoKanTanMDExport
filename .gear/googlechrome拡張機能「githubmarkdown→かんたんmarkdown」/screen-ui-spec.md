# 画面UI定義書

```json
{
  "screens": [
    {
      "screenId": "SCR-001",
      "screenName": "拡張機能設定（オプション）画面",
      "category": "設定",
      "targetUser": "GitHub Markdownを「かんたんMarkdown」へエクスポートしたい拡張機能の全ユーザー",
      "overview": "「かんたんMarkdown」のソースとなるリポジトリ（オリジナル：tatesuke、またはその他：カスタム）および出力エディション（Lite/Standard/Full）を登録・管理するためのChrome拡張機能設定UI。カスタムリポジトリ指定時には接続確認機能も提供する。※要確認（設定画面の統一的なCSS/UIデザインシステムや、ブラウザ側の永続化APIの種類は仕様書上未定義のためChrome Extension Storage API利用を想定して暫定定義）",
      "components": [
        {
          "name": "設定ヘッダー",
          "type": "header",
          "description": "画面タイトル「かんたんMarkdown変換 拡張機能設定」と、かんたんMarkdown公式仕様ドキュメント等へのリンクを配置。"
        },
        {
          "name": "リポジトリ選択フォーム",
          "type": "form",
          "description": "「オリジナル(tatesuke)」と「その他（カスタムURL入力）」を選択・トグルするラジオボタンおよび入力フィールド群。"
        },
        {
          "name": "エディション選択フォーム",
          "type": "form",
          "description": "Lite / Standard / Full の中からエクスポート時にベースとするテンプレートHTMLのエディションを指定するラジオボタン。"
        },
        {
          "name": "操作ボタンエリア",
          "type": "button-group",
          "description": "「保存」ボタン、「接続テスト」ボタン（その他リポジトリ選択時のみ有効化）、および「キャンセル」ボタン。"
        }
      ],
      "operationSteps": [
        {
          "step": 1,
          "action": "拡張機能アイコンを右クリックし「オプション」を選択、または拡張機能管理画面からオプションページを起動する。",
          "systemResponse": "設定画面（SCR-001）がロードされ、ローカルストレージから既存の設定情報が読み込まれて各フィールドに復元表示される。"
        },
        {
          "step": 2,
          "action": "「かんたんMarkdownリポジトリ選択」で「その他」をチェックし、「カスタムリポジトリURL」入力欄に任意のGitHubリポジトリURL（例: https://github.com/hiro-gj/KanTanMarkdown ）を入力する。",
          "systemResponse": "「カスタムリポジトリURL」フィールドが入力活性状態となり、「接続テスト」ボタンが有効化される。同時に、エディション選択のプレビューにアカウント名が反映されたURL候補がリアルタイムに表示される。"
        },
        {
          "step": 3,
          "action": "「接続テスト」ボタンをクリックする。",
          "systemResponse": "入力されたカスタムリポジトリからGitHub Pages（またはdistファイル群）の疎通確認をバックグラウンドで行い、「接続成功」または「疎通エラー：URLが存在しません（※要確認）」という結果通知をフィールド下部に表示する。"
        },
        {
          "step": 4,
          "action": "希望するエディション（Lite/Standard/Fullから1つ）を選択し、「保存」ボタンをクリックする。",
          "systemResponse": "バリデーションチェック後、設定値が永続化（chrome.storage.local等）され、「設定を保存しました」のメッセージトーストが描画された後に、自動的にオプションタブが閉じる。"
        }
      ],
      "fields": [
        {
          "name": "かんたんMarkdownリポジトリ選択",
          "type": "radio",
          "required": true,
          "validation": "必須。値は original または custom のいずれか。",
          "description": "変換パッケージのテンプレートを取得・生成する基準となるGitHubリポジトリを指定。"
        },
        {
          "name": "カスタムリポジトリURL",
          "type": "text",
          "required": false,
          "validation": "「その他」選択時のみ必須。正規表現 ^https://github\\.com/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+$ によるGitHubリポジトリ形式チェック。※要確認",
          "description": "かんたんMarkdownをフォークしたカスタムリポジトリ等のURL。未定義時は入力補助用のプレースホルダーを表示。"
        },
        {
          "name": "エディション選択",
          "type": "radio",
          "required": true,
          "validation": "必須。値は lite / standard / full のいずれか。",
          "description": "かんたんMarkdownの出力エディションを選択。リポジトリ選択に応じて、内部的・動的に対象テンプレートHTMLのURLが解決される。"
        }
      ],
      "events": [
        {
          "trigger": "リポジトリ選択（ラジオボタン）変更時",
          "action": "カスタムリポジトリURLのバリデーション・表示切り替え",
          "description": "「オリジナル」が選択された場合は「カスタムリポジトリURL」入力エリアを非表示（または非活性）化し、設定値をクリアする。"
        },
        {
          "trigger": "「接続テスト」ボタンクリック時",
          "action": "カスタムリポジトリ疎通確認処理の実行 (FR-005)",
          "description": "非同期で `{アカウント名}.github.io/KanTanMarkdown/dist/ktm-lite.html` 等の疎通をHEADリクエストで確認し、成否に応じてインジケータ（緑チェックマーク/赤警告マーク）とメッセージを表示。※要確認"
        },
        {
          "trigger": "「保存」ボタンクリック時",
          "action": "設定内容の検証およびブラウザストレージへの保存 (FR-001, FR-004)",
          "description": "フォームの全バリデーションを検証。成功時は設定情報をJSON構造としてストレージに保存し、画面を閉じるアニメーションを実行。"
        }
      ],
      "transitions": [
        {
          "action": "保存完了、または「キャンセル」ボタン押下",
          "destination": "「遷移なし (タブの閉鎖)」",
          "condition": "設定情報が正常保存された、または変更破棄がユーザーによって承認された場合。※要確認"
        }
      ]
    },
    {
      "screenId": "SCR-002",
      "screenName": "GitHub Markdownプレビュー画面（ボタン挿入）",
      "category": "トランザクション",
      "targetUser": "GitHub上の任意のMarkdownファイルを閲覧し、「かんたんMarkdown」形式でダウンロードしたいユーザー",
      "overview": "GitHubのリポジトリ内ファイルビューワー（*.md表示時）のDOMに割って入り、「かんたんMarkdownへエクスポート」を行う操作トリガーボタンを動的インジェクションする画面。※要確認（GitHub側の頻繁なDOM変更に対応するためのボタン検知・インジェクション用CSSセレクタ定義は運用上未定義のため暫定定義）",
      "components": [
        {
          "name": "GitHub標準ファイル操作バー",
          "type": "button-group",
          "description": "GitHub既存のRaw、Blame、Edit等のボタンが配置されているアクションヘッダー部。拡張機能により独自ボタンが追加される。"
        },
        {
          "name": "かんたんMarkdownへエクスポートボタン",
          "type": "button-group",
          "description": "DOM解析後にGitHub標準ボタンとデザインを合わせた形でインジェクションされる緑色（またはGitHubテーマ調）のアクションボタン。"
        },
        {
          "name": "Markdownプレビューレンダラー",
          "type": "card",
          "description": "GitHub標準で描画されているマークダウンの整形プレビュー領域。バックグラウンド処理時にDOMまたはRawデータをここから抽出する。"
        }
      ],
      "operationSteps": [
        {
          "step": 1,
          "action": "GitHub上のリポジトリにホストされているMarkdownドキュメント（例: README.md）の表示URLにブラウザでアクセスする。",
          "systemResponse": "拡張機能のコンテンツスクリプトが動作し、ファイルヘッダー内のDOMツリーを探索。「Raw」「Blame」ボタンの隣に「かんたんMarkdownへエクスポート」というボタンが即時挿入される。"
        },
        {
          "step": 2,
          "action": "「かんたんMarkdownへエクスポート」ボタンをクリックする。",
          "systemResponse": "ボタンがローディング（インジケータ表示）状態に遷移し、バックグラウンドでのエクスポートタスク（Markdownパース、画像抽出、フェッチ）が開始され、画面上に「エクスポート処理状況ダイアログ（SCR-003）」がオーバーレイ表示される。"
        }
      ],
      "fields": [],
      "events": [
        {
          "trigger": "GitHubプレビューページのDOMレンダリング（SPA遷移含む）検知時",
          "action": "エクスポートボタンの自動動的挿入 (FR-006, FR-007)",
          "description": "GitHubのSPA遷移（TurboLink/Pjax）によるURL変更を検知し、ファイルアクションバーを再スキャンしてボタンを自動インジェクションする。"
        },
        {
          "trigger": "「かんたんMarkdownへエクスポート」ボタンのクリック時",
          "action": "Markdownソースのフェッチ・解析処理のトリガー (FR-008, FR-010)",
          "description": "表示中のMarkdownファイルのプレーンテキスト（Rawデータ）を取得。並行して進捗表示モーダル（SCR-003）をインジェクションして表示制御を委譲する。"
        }
      ],
      "transitions": [
        {
          "action": "エクスポートボタンのクリック",
          "destination": "SCR-003",
          "condition": "Markdownソーステキストの取得またはパースがエラーなく開始された場合"
        }
      ]
    },
    {
      "screenId": "SCR-003",
      "screenName": "エクスポート処理状況・エラー表示ダイアログ",
      "category": "トランザクション",
      "targetUser": "エクスポート処理の進行状況を確認、またはエラー時の原因を確認したいユーザー",
      "overview": "エクスポート処理中にGitHub画面上にライトボックス/モーダルとしてオーバーレイ表示される進捗モニタリングUI。画像データのBase64変換やGitHub認証セッションによる通信結果、およびエラー時の例外詳細を表示する。※要確認（モーダルのカラーパレット、アニメーション、タイムアウトによる自動閉鎖有無などは仕様未定義のため暫定配置）",
      "components": [
        {
          "name": "進捗モーダルウィンドウ",
          "type": "modal",
          "description": "GitHub画面中央にフェードインするダイアログボックス。背後への操作を透過的にブロックする。"
        },
        {
          "name": "処理進捗プログレスバー",
          "type": "pagination",
          "description": "「Markdown解析中」「画像取得中（3/10枚）」「変換処理中」などのステータスと、0%〜100%の進捗率を視覚化するバー。"
        },
        {
          "name": "詳細ステータス・ログ領域",
          "type": "textarea",
          "description": "非同期フェッチ結果ログ（例: '✔ image1.png... 変換成功'）を表示するダークモード風の簡易コンソール領域。※要確認"
        },
        {
          "name": "ダイアログ操作ボタン群",
          "type": "button-group",
          "description": "処理中の「キャンセル」ボタン、および完了/エラー時に有効化される「閉じる」ボタン。"
        }
      ],
      "operationSteps": [
        {
          "step": 1,
          "action": "SCR-002からエクスポートボタンがクリックされ、本モーダルが自動的にオープンする。",
          "systemResponse": "「処理を開始しています...」のメッセージと共に、プログレスバーが進行。並行して画像ダウンロード、Base64エンコード処理（FR-015, FR-017）が実行されログが表示される。"
        },
        {
          "step": 2,
          "action": "処理の進行をリアルタイムで見届ける（ユーザーアクション不要）。",
          "systemResponse": "すべての画像と本文の変換およびテンプレート（Lite/Standard/Fullのいずれか）への流し込み（FR-020）が完了すると、プログレスバーが100%になり、「完了しました」の通知が表示される。自動的にブラウザのローカルPCダウンロードフォルダーへHTMLファイルが出力される。"
        },
        {
          "step": 3,
          "action": "ダウンロード完了後、または処理途中で発生したエラー確認後に「閉じる」ボタンをクリックする。",
          "systemResponse": "モーダルがフェードアウトして閉じられ、SCR-002（元のGitHubプレビュー画面）の操作が再活性化される。"
        }
      ],
      "fields": [],
      "events": [
        {
          "trigger": "バックグラウンド処理中のステータス変更受信（Chrome runtime メッセージ疎通）",
          "action": "UIプログレス情報の同期更新 (FR-019)",
          "description": "非同期の各変換プロセスから送信されるタスク情報を解析し、処理パーセンテージとコンソールログをリアルタイム追記する。"
        },
        {
          "trigger": "画像フェッチエラー、または認証期限切れ、ファイル容量超過等の例外発生時 (FR-022)",
          "action": "エラー画面状態への遷移・エラーメッセージの描画",
          "description": "進行処理を安全にロールバック・中断し、エラーメッセージ「[未定義] ※要確認: 画像のフェッチに失敗しました。GitHubログイン状態を確認してください」と警告マーク、対処ガイダンスを表示し、閉じるボタンをアクティブ化する。"
        },
        {
          "trigger": "「キャンセル」ボタンクリック時",
          "action": "バックグラウンドスレッドの強制終了とダイアログの即時閉鎖",
          "description": "すでに開始されているHTTPリクエスト（AbortController経由）やBase64変換を破棄し、データを保存せずにダイアログを閉じる。"
        }
      ],
      "transitions": [
        {
          "action": "「閉じる」または「キャンセル」ボタンクリックによる終了",
          "destination": "SCR-002",
          "condition": "処理完了または処理中断により、モーダルが完全に破棄された場合"
        }
      ]
    }
  ]
}
```