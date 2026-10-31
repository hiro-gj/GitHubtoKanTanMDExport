# 画面UI定義書

```json
{
  "screens": [
    {
      "events": [
        {
          "action": "exportMarkdownアクションの実行",
          "trigger": "onClick (エクスポートボタン)",
          "description": "バックグラウンドへMarkdownデータ取得およびテンプレートHTML結合・エクスポート処理を要求する"
        }
      ],
      "fields": [],
      "category": "拡張機能機能",
      "overview": "GitHub上でMarkdown(.md)ファイルを閲覧している際に、かんたんMarkdown形式へ変換してエクスポートするボタンを画面上に挿入・表示する画面",
      "screenId": "SCR-001",
      "components": [
        {
          "name": "エクスポートボタン",
          "type": "button-group",
          "description": "GitHubのアクションバー（ButtonGroup等）内に挿入される「かんたんMDエクスポート」アクションボタン"
        }
      ],
      "screenName": "Markdownファイル閲覧画面",
      "targetUser": "GitHubユーザー",
      "transitions": [],
      "operationSteps": [
        {
          "step": 1,
          "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
          "systemResponse": "DOMの変更を検知し、ファイルアクションバー内に「かんたんMDエクスポート」ボタンが挿入される"
        },
        {
          "step": 2,
          "action": "「かんたんMDエクスポート」ボタンをクリックする",
          "systemResponse": "バックグラウンドスクリプトにメッセージを送信し、Raw MarkdownとテンプレートHTMLを結合してエクスポート処理を実行する"
        }
      ],
      "sourceEvidence": [
        "content.js",
        "background.js"
      ]
    },
    {
      "events": [
        {
          "action": "toggleCustomRepoInput",
          "trigger": "onChange (repo_type)",
          "description": "リポジトリタイプに応じてカスタムリポジトリURL入力項目と接続テストボタンの活性/非活性を切り替える"
        },
        {
          "action": "接続テスト処理",
          "trigger": "onClick (test-btn)",
          "description": "入力されたカスタムリポジトリURLのバリデーションを実施し、テンプレートHTMLへのアクセス確認を行う"
        },
        {
          "action": "設定保存処理",
          "trigger": "onClick (save-btn)",
          "description": "設定値をchrome.storage.localに保存し、通知を表示して画面を閉じる"
        },
        {
          "action": "画面クローズ処理",
          "trigger": "onClick (cancel-btn)",
          "description": "変更内容を保存せずに設定画面を閉じる"
        }
      ],
      "fields": [
        {
          "name": "リポジトリタイプ",
          "type": "radio",
          "required": true,
          "validation": "必須（original | custom）",
          "description": "使用するテンプレートリポジトリの種類を選択する"
        },
        {
          "name": "カスタムリポジトリURL",
          "type": "text",
          "required": false,
          "validation": "リポジトリタイプがcustomの場合は必須。正規表現: ^https:\\/\\/github\\.com\\/([a-zA-Z0-9_-]+)\\/([a-zA-Z0-9_-]+)$",
          "description": "独自に用意したテンプレートリポジトリのGitHub URL"
        },
        {
          "name": "エディション",
          "type": "radio",
          "required": true,
          "validation": "必須（lite | standard | full）",
          "description": "エクスポート時に使用するテンプレートHTMLのエディションを選択する"
        }
      ],
      "category": "拡張機能設定",
      "overview": "かんたんMarkdownエクスポート時に使用するリポジトリタイプ、カスタムリポジトリURL、およびエディションを設定・保存する画面",
      "screenId": "SCR-002",
      "components": [
        {
          "name": "設定フォーム",
          "type": "form",
          "description": "リポジトリタイプ選択、カスタムリポジトリURL入力、エディション選択を行うフォーム"
        },
        {
          "name": "操作ボタンエリア",
          "type": "button-group",
          "description": "接続テスト、保存、キャンセル操作を行うボタン群"
        }
      ],
      "screenName": "設定画面",
      "targetUser": "拡張機能利用者",
      "transitions": [],
      "operationSteps": [
        {
          "step": 1,
          "action": "リポジトリタイプ（公式/カスタム）を選択する",
          "systemResponse": "「カスタム」選択時にカスタムリポジトリURL入力欄および接続テストボタンが有効化される"
        },
        {
          "step": 2,
          "action": "カスタムリポジトリURLを入力し、「接続テスト」ボタンをクリックする",
          "systemResponse": "URLの形式チェックおよびGitHub Pagesへの到達性テストを行い、結果メッセージを表示する"
        },
        {
          "step": 3,
          "action": "エディション（Lite/Standard/Full）を選択し、「保存」ボタンをクリックする",
          "systemResponse": "設定情報をストレージに保存し、トースト通知を表示後に設定画面を閉じる"
        }
      ],
      "sourceEvidence": [
        "options.js",
        "options.html"
      ]
    }
  ]
}
```