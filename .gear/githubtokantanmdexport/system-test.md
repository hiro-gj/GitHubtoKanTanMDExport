# システムテスト

```json
[
  {
    "変更区分": "拡張",
    "id": "ST-001",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "ボタン挿入フロー",
      "small": "DOM挿入・描画反映"
    },
    "testCase": "Markdownファイル閲覧画面におけるエクスポートボタンの動的挿入確認",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-001",
    "scenario": "ユーザーがGitHub上でMarkdownファイルを閲覧した際に、ファイルアクションバー内に「かんたんMDエクスポート」ボタンが動的に挿入・描画されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Chrome拡張機能が有効化されており、GitHubの.mdファイル閲覧画面にアクセス可能な状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "DOMの変更を検知し、ファイルアクションバー内に「かんたんMDエクスポート」ボタンが挿入・描画されること"
      }
    ],
    "expectedResult": "Markdownファイル閲覧画面上に「かんたんMDエクスポート」ボタンが正しく表示されること。",
    "testData": "URL=https://github.com/user/repo/blob/main/README.md",
    "acceptanceCriteria": "ファイルアクションバー内にボタンが重複なく1つ動的に表示されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-002",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "エクスポート処理フロー",
      "small": "モーダルダイアログ表示およびエディション選択"
    },
    "testCase": "エクスポートボタンクリック時のエディション選択モーダルダイアログ動作確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-002",
    "scenario": "ユーザーが「かんたんMDエクスポート」ボタンをクリックし、表示されるモーダルダイアログでエディションを選択してバックグラウンド処理を開始できることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面にて「かんたんMDエクスポート」ボタンが表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "エクスポートエディションを選択するモーダルダイアログ画面が表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "モーダルダイアログのドロップダウンで「Standard (ktm-std.html)」を選択し、「エクスポート」ボタンをクリックする",
        "expectedResult": "モーダルダイアログが閉じ、ボタンテキストが「エクスポート中...」に変更され、バックグラウンドスクリプトにメッセージが送信されること"
      }
    ],
    "expectedResult": "指定したエディション情報を含むメッセージがバックグラウンドに送信され、処理が開始されること。",
    "testData": "edition='standard'",
    "acceptanceCriteria": "モーダルダイアログで選択したエディション情報が正常にバックグラウンドへ伝達されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-003",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "エクスポート処理フロー",
      "small": "データ取得・単一HTML出力"
    },
    "testCase": "Raw MarkdownデータおよびテンプレートHTMLの結合による単一HTML生成・出力確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-003",
    "scenario": "エクスポート処理実行時にRaw MarkdownとテンプレートHTMLがフェッチ・結合され、Quine型単一HTMLファイルが自動ダウンロードされることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面でエクスポート操作を開始できること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、モーダルダイアログで「Lite (ktm-lite.html)」を選択して「エクスポート」ボタンをクリックする",
        "expectedResult": "Raw MarkdownおよびテンプレートHTML（ktm-lite.html）が取得・結合され、生成されたHTMLファイル（例: README.html）が自動的にダウンロードされること"
      }
    ],
    "expectedResult": "Markdownデータがインジェクションされた単一HTMLファイルが正しくローカルに保存されること。",
    "testData": "edition='lite', outputFileName='README.html'",
    "acceptanceCriteria": "生成されたHTMLファイル内の<textarea id=\"editor\">にMarkdownが埋め込まれて出力されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-004",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定画面操作",
      "small": "設定UI制御および入力バリデーション"
    },
    "testCase": "設定画面におけるリポジトリタイプ切り替えおよびカスタムURLバリデーション確認",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-004",
    "scenario": "設定画面にて「リポジトリタイプ」をカスタムに変更した際に入力欄が活性化され、不正なURL形式で「接続テスト」をクリックした際にエラーが検知されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能の設定画面（SCR-002）を表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで「custom」を選択する",
        "expectedResult": "「カスタムリポジトリURL」入力フィールドおよび「接続テスト」ボタンが非活性から活性状態に切り替わること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'https://invalid-url.com' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "「エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)」のエラーメッセージが表示されること"
      }
    ],
    "expectedResult": "フォーマット検証により不正なカスタムリポジトリURLが遮断され、エラーメッセージが表示されること。",
    "testData": "repo_type='custom', custom_repo_url='https://invalid-url.com'",
    "acceptanceCriteria": "GitHubリポジトリ形式以外のURL入力に対して接続テストを実行せずエラーメッセージを表示すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-005",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定画面操作",
      "small": "ストレージ連携・設定保存"
    },
    "testCase": "設定画面における設定情報のストレージ保存および読み込み確認",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-005",
    "scenario": "設定画面で「リポジトリタイプ」「カスタムリポジトリURL」「エディション」を指定して保存し、ストレージに値が保持されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面（SCR-002）を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で「custom」を選択し、「カスタムリポジトリURL」フィールドに 'https://github.com/myaccount/myrepo' を入力する",
        "expectedResult": "各入力項目に値が反映されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「エディション」ラジオボタンで「full」を選択し、「保存」ボタンをクリックする",
        "expectedResult": "トースト通知が表示され、設定値がchrome.storage.localに保存された後、設定画面が閉じること"
      }
    ],
    "expectedResult": "設定した値がストレージに保存され、次回設定画面表示時に保存値が読み込まれること。",
    "testData": "repo_type='custom', custom_repo_url='https://github.com/myaccount/myrepo', edition='full'",
    "acceptanceCriteria": "chrome.storage.localに設定情報が永続化され、設定画面再開時に各フィールドへ復元されること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-006",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "運用シナリオ",
      "small": "標準エクスポート運用フロー"
    },
    "testCase": "標準リポジトリ設定におけるE2Eエクスポート運用フローの検証",
    "relatedRequirement": "BR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-013",
    "scenario": "ユーザーがデフォルトの公式リポジトリ設定でGitHub上のMarkdownファイルから「かんたんMarkdown」HTMLをエクスポートする一連の運用フローを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Chrome拡張機能が標準設定（リポジトリタイプ=original）でインストールされていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で任意の「.md」拡張子を持つファイルページを表示する",
        "expectedResult": "ファイル操作エリアに「かんたんMDエクスポート」ボタンが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "バックグラウンド処理によりテンプレートHTMLが取得・合成され、ブラウザでHTMLファイルが自動ダウンロードされること"
      }
    ],
    "expectedResult": "標準リポジトリを用いたMarkdownエクスポート運用フローが一貫して成功すること。",
    "testData": "repo_type='original', edition='lite'",
    "acceptanceCriteria": "処理中にエラーを発生させることなく、閲覧中のMarkdownが正しく変換されたHTMLファイルとして保存されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-007",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "運用シナリオ",
      "small": "カスタムリポジトリ設定・接続確認フロー"
    },
    "testCase": "カスタムリポジトリ設定および接続確認の一連運用フロー検証",
    "relatedRequirement": "BR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-014",
    "scenario": "ユーザーが設定画面でカスタムリポジトリURLを設定し、接続テストを実施して保存する一連の運用シナリオを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "公開済みの独自テンプレート用GitHubリポジトリ（GitHub Pages設定済み）が存在すること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で「custom」を選択し、「カスタムリポジトリURL」フィールドに 'https://github.com/testuser/custom-template' を入力する",
        "expectedResult": "「接続テスト」ボタンが活性化すること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックする",
        "expectedResult": "「接続成功：かんたんMarkdownテンプレートを検出しました。」の成功メッセージが表示されること"
      },
      {
        "order": 3,
        "screen": "設定画面",
        "action": "「保存」ボタンをクリックする",
        "expectedResult": "トースト通知が表示され、設定が保存されて画面が閉じること"
      }
    ],
    "expectedResult": "カスタムリポジトリの設定、疎通確認、および保存までの一連のシナリオが正常に完了すること。",
    "testData": "repo_type='custom', custom_repo_url='https://github.com/testuser/custom-template'",
    "acceptanceCriteria": "接続テスト成功後に設定がストレージへ保存され、後続のエクスポートでカスタムテンプレートが利用可能な状態になること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-008",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "エクスポート処理速度",
      "small": "単一HTML生成速度検証"
    },
    "testCase": "エクスポート処理および単一HTML生成処理時間の測定",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-007",
    "scenario": "Markdownファイル閲覧画面でエクスポートを実行し、Raw Markdownの取得から画像・添付ファイルのBase64変換、テンプレート合成処理が規定時間内に完了することを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubの.mdファイル閲覧画面が表示されており、拡張機能が有効化されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイルアクションバー内に挿入された「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "エクスポートエディションの選択ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "エディションドロップダウンで 'Lite (ktm-lite.html)' を選択し、ダイアログ内の「エクスポート」ボタンをクリックする",
        "expectedResult": "処理が開始され、「エクスポート中...」から完了して単一HTMLファイルが生成・ダウンロードされること"
      }
    ],
    "expectedResult": "エクスポート処理および単一HTML生成が5秒以内に完了すること（ネットワーク遅延を除く）。",
    "testData": "ファイル名=test.md, エディション=lite",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-009",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "デバウンス制御検証"
    },
    "testCase": "DOM監視におけるデバウンス制御によるブラウザ描画負荷の検証",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-008",
    "scenario": "DOM変更が頻繁に発生する場面において、MutationObserverがデバウンス制御（500ms）を行い、無駄な再描画やブラウザの負荷増大を発生させないことを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubの.mdファイル閲覧画面が表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "DOMが連続して動的に更新される操作（画面スクロールや動的要素の読み込み）を連続して行う",
        "expectedResult": "500msのデバウンス制御が働き、連続操作中にはボタン挿入処理が重複実行されないこと"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "操作停止後500ms経過後の状態を確認する",
        "expectedResult": "ボタンの重複や描画遅延が発生せず、「かんたんMDエクスポート」ボタンが1つのみ正常表示されていること"
      }
    ],
    "expectedResult": "MutationObserverのデバウンス制御によりCPU高負荷や画面描画のフリーズが発生しないこと。",
    "testData": "連続DOM変更イベント発生",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-010",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "エクスポート応答時間確認"
    },
    "testCase": "エクスポート処理実行時のレスポンス時間確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-022",
    "scenario": "エクスポートボタン押下後、バックグラウンドスクリプトとのメッセージ通信からHTMLファイルのダウンロード開始までの全応答時間を測定する。",
    "actor": "GitHubユーザー",
    "precondition": "標準的なテキストと画像を含む.mdファイルを閲覧中であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルで「エクスポート」ボタンを押下してタイマーを計測開始する",
        "expectedResult": "バックグラウンド処理が開始されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイル保存ダイアログの表示または自動ダウンロード完了時でタイマーを停止する",
        "expectedResult": "エクスポート処理が完了しHTMLファイルが出力されること"
      }
    ],
    "expectedResult": "ボタン押下からファイル出力完了までのレスポンス時間が規定時間内（5秒以内）であること。",
    "testData": "ファイル名=sample.md, 添付画像数=2",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-011",
    "category": "性能",
    "functionCategory": {
      "large": "Markdownファイル閲覧画面でのエクスポートボタン挿入",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "画面描画負荷制御確認"
    },
    "testCase": "MutationObserver制御による画面描画負荷の検証",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-023",
    "scenario": "GitHub画面上でMutationObserverが発火した際のメインスレッドの占有時間と描画パフォーマンスを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "ブラウザの開発者ツール（Performanceタブ）を開いた状態にする。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "開発者ツールでプロファイリングを開始し、.mdファイル閲覧画面内で動的なDOM変更を誘発させる操作を行う",
        "expectedResult": "MutationObserverがイベントを検知すること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "プロファイリングを停止し、Long Task（50ms以上のタスク）の発生状況とスクリプト実行時間を測定する",
        "expectedResult": "デバウンス制御（500ms）により過度なスクリプト実行やフレームレートの低下（フレームドロップ）が発生していないこと"
      }
    ],
    "expectedResult": "DOM監視に伴うメインスレッドの過度な占有がなく、レスポンシブな画面描画が維持されていること。",
    "testData": "監視対象=document, サブツリー更新=あり",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-012",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "単一HTML生成処理時間検証"
    },
    "testCase": "単一HTML生成処理時間およびレスポンス測定",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-031",
    "scenario": "テンプレートHTMLとMarkdown本文、Base64エンコードされた添付データの結合・インジェクション処理自体の実行時間を検証する。",
    "actor": "GitHubユーザー",
    "precondition": "データフェッチ完了後のHTML構築フェーズを実行可能な状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「Standard (ktm-std.html)」を選択して「エクスポート」をクリックする",
        "expectedResult": "バックグラウンド側でテンプレートのインジェクションおよびQuine型HTMLの生成が実行されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "生成完了メッセージ受領までの内部処理時間を計測する",
        "expectedResult": "HTMLのTextareaおよびfileListへのインジェクション処理が問題なく完了すること"
      }
    ],
    "expectedResult": "単一HTML生成処理が5秒以内に正常終了すること。",
    "testData": "エディション=standard, Markdownサイズ=50KB",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-013",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "CPU・メモリ負荷検証"
    },
    "testCase": "MutationObserverのデバウンス制御とCPU/メモリ負荷検証",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-032",
    "scenario": "長時間のGitHub操作時において、DOM監視用のMutationObserverが不要なタイマーやメモリを保持し続けないことを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "タスクマネージャーまたは開発者ツールのMemoryタブでメモリ使用量を監視できる状態にすること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "Markdownファイル閲覧画面を開き、連続的に画面遷移やDOM変更を100回連続で発生させる",
        "expectedResult": "clearTimeoutおよび500msのデバウンスタイマーが正常に機能すること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "操作終了後のCPU使用率およびヒープメモリ使用量を測定する",
        "expectedResult": "CPU使用率が即座に低下し、メモリリークが発生していないこと"
      }
    ],
    "expectedResult": "デバウンス制御によりCPU高負荷やメモリリークが発生せず、動作が安定していること。",
    "testData": "連続DOMイベント=100回",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-014",
    "category": "性能",
    "functionCategory": {
      "large": "Chrome拡張機能パッケージの自動ビルド・リリース機能",
      "medium": "CI/CDビルド・リリース実行パフォーマンス",
      "small": "パイプライン処理速度検証"
    },
    "testCase": "CI/CD自動パッケージングパイプラインの処理速度検証",
    "relatedRequirement": "NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-039",
    "scenario": "GitHub Actionsワークフローが起動してから、manifest.json更新、ZIP化、Release作成が完了するまでの所要時間を測定する。",
    "actor": "開発・運用担当者",
    "precondition": "リポジトリに新しいバージョンタグ（例: v1.0.1）をプッシュすること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub Actionsワークフロー画面",
        "action": "バージョンタグ「v1.0.1」をリモートリポジトリにプッシュし、GitHub Actionsを開始させる",
        "expectedResult": "ワークフロー「Release Chrome Extension」がトリガーされること"
      },
      {
        "order": 2,
        "screen": "GitHub Actionsワークフロー画面",
        "action": "ビルドジョブの実行完了までのタイムスタンプを確認する",
        "expectedResult": "manifest.jsonのバージョン補正、ZIPアーカイブ作成、GitHub Release作成が遅延なく一連で完了すること"
      }
    ],
    "expectedResult": "CI/CDパイプライン全体の実行が正常なビルド時間内で完了すること。",
    "testData": "タグ名=v1.0.1",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-015",
    "category": "性能",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "カスタムテンプレートURL解決レスポンス",
      "small": "接続応答速度検証"
    },
    "testCase": "カスタムテンプレートURL解決および接続応答速度検証",
    "relatedRequirement": "NFR-007",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-040",
    "scenario": "設定画面でカスタムリポジトリURLを入力し接続テストを行った際、URL解析および外部フェッチの応答時間を測定する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面（SCR-002）が開かれていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で「カスタム」を選択し、「カスタムリポジトリURL」に 'https://github.com/myuser/myrepo' を入力する",
        "expectedResult": "「接続テスト」ボタンが活性化すること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックし、テスト結果メッセージが表示されるまでの時間を測定する",
        "expectedResult": "URL解決およびHEADリクエストが送信され、遅延なく「接続成功」またはエラーメッセージが表示されること"
      }
    ],
    "expectedResult": "URL解決および接続応答がスムーズに行われ、結果が素早く表示されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/myuser/myrepo",
    "acceptanceCriteria": "公式リポジトリ/カスタムURLおよび複数エディション（Lite/Standard/Full）の拡張に対応できる柔軟なURL解決・データ設定保持構造を有すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-016",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "生成速度確認"
    },
    "testCase": "標準Markdownエクスポート時の処理速度確認",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-046",
    "scenario": "一般的なサイズのMarkdownファイルにおいて、エクスポート要求からデータ生成完了までの時間が目標性能を満たすことを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "標準的なサイズ（約10KB）の.mdファイル画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "エクスポートエディション選択モーダルが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「エクスポート」ボタンをクリックし、ファイル出力完了までの時間を測定する",
        "expectedResult": "5秒以内に処理が完了し、HTMLファイルが保存されること"
      }
    ],
    "expectedResult": "処理速度目標（5秒以内）を達成できること。",
    "testData": "ファイルサイズ=10KB",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-017",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "大量データ処理安定性確認"
    },
    "testCase": "大量データおよび多数添付ファイル処理時の動作安定性確認",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-047",
    "scenario": "多数の画像（20枚以上）や大容量テキストが含まれるMarkdownファイルに対してエクスポートを実施し、メモリ不足やタイムアウトを起こさず完了することを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "画像や添付ファイルが多数含まれる大型の.mdファイルを開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エディションで 'Full (ktm-full.html)' を選択して「エクスポート」をクリックする",
        "expectedResult": "全画像の非同期並列フェッチおよびBase64変換が開始されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "処理の完了状況および出力されたHTMLファイルのサイズと正常性を確認する",
        "expectedResult": "ブラウザクラッシュやクラッシュダイアログが発生せず、単一HTMLファイルが正しく出力されること"
      }
    ],
    "expectedResult": "大量データ処理時でも5秒以内（ネットワーク遅延を除く）に安定して処理が完了すること。",
    "testData": "画像数=20枚, テキストサイズ=200KB, エディション=full",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-018",
    "category": "性能",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "接続テスト・設定処理速度",
      "small": "接続テストレスポンス確認"
    },
    "testCase": "カスタムリポジトリURL接続テストのレスポンス性能確認",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-048",
    "scenario": "設定画面で接続テストボタンを押下した際、ユーザーにストレスを与えない時間で検証結果が表示されるか確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面で「カスタム」リポジトリタイプが選択され、正当なURLが入力されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「接続テスト」ボタン（test-btn）をクリックする",
        "expectedResult": "「接続テスト中...」のメッセージが即座に表示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「接続成功：かんたんMarkdownテンプレートを検出しました。」メッセージが表示されるまでのレスポンス時間を測定する",
        "expectedResult": "数秒以内に接続可否結果が表示されること"
      }
    ],
    "expectedResult": "接続テストのレスポンスが良好であり、画面フリーズ等が発生しないこと。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/tatesuke/KanTanMarkdown",
    "acceptanceCriteria": "設定画面で入力されたカスタムリポジトリURLのフォーマット検証およびテンプレートHTMLへの接続確認テストを行い、結果を表示すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-019",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "描画パフォーマンス確認"
    },
    "testCase": "MutationObserverデバウンス制御と描画パフォーマンス確認",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-049",
    "scenario": "SPA（Single Page Application）遷移による動的なページ切り替え時に、500msのデバウンス制御が正しく適用されスクロールや描画が滑らかに行われることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのSPA遷移が有効な状態（画面全体リロードを伴わないファイル移動）であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイルツリーやリンクをクリックして別の.mdファイルへ素早く連続で遷移する",
        "expectedResult": "URL変更検知およびDOM監視イベントが発生すること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "遷移後の画面描画および「かんたんMDエクスポート」ボタンの自動挿入動作を確認する",
        "expectedResult": "デバウンス制御により不要な再描画が抑制され、画面カクつきなくボタンが1重に挿入されること"
      }
    ],
    "expectedResult": "500msのデバウンス制御により描画パフォーマンスが保たれること。",
    "testData": "画面遷移操作=連続5回",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-020",
    "category": "性能",
    "functionCategory": {
      "large": "Chrome拡張機能パッケージの自動ビルド・リリース機能",
      "medium": "CI/CDパイプライン処理速度",
      "small": "ワークフロー処理時間確認"
    },
    "testCase": "自動パッケージングおよびリリースワークフローの処理時間確認",
    "relatedRequirement": "NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-050",
    "scenario": "GitHub Actionsの実行において、ビルドおよび成果物生成の処理時間が許容範囲内であることを確認する。",
    "actor": "開発・運用担当者",
    "precondition": "GitHub Actionsワークフロー「release-extension.yml」が正常に配置されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub Actionsワークフロー画面",
        "action": "リポジトリにリリース用タグを送信し、ビルドジョブ「build-and-release」を開始させる",
        "expectedResult": "Ubuntuランナー上でCheckout、Version更新、Zip作成、Release作成の各ステップが実行されること"
      },
      {
        "order": 2,
        "screen": "GitHub Actionsワークフロー画面",
        "action": "ワークフロー全体の実行時間をログから確認する",
        "expectedResult": "ボトルネックなく短時間（目安: 2分以内）で緑色（成功）ステータスとなること"
      }
    ],
    "expectedResult": "自動パッケージングおよびリリースワークフローが遅延なくスムーズに完了すること。",
    "testData": "タグ=v1.0.0",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-021",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "描画性能評価"
    },
    "testCase": "MutationObserverデバウンス制御による描画性能の評価",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-057",
    "scenario": "DOM監視が常時稼働している状態でユーザーが長いMarkdown文書をスクロールした際、FPS（Frame Per Second）の急激な低下が起きないことを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "縦長の大規模な.mdファイルを閲覧中であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ブラウザの開発者ツールでFPSメーターを有効にし、ページトップから最下部まで高速スクロールする",
        "expectedResult": "DOM更新イベントが発生してもデバウンス制御によりタイマーがリセットされ、高頻度なスクリプト再実行が回避されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "スクロール中のFPS数値および描画の滑らかさを評価する",
        "expectedResult": "FPSが著しく低下（60fpsから大幅なドロップ）することなく、快適な閲覧が維持されること"
      }
    ],
    "expectedResult": "デバウンス制御により高い描画性能（FPS）が維持されること。",
    "testData": "文書長=10,000行以上",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-022",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定情報管理",
      "small": "Manifest V3・権限管理"
    },
    "testCase": "Manifest V3規約準拠および最小権限の検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-011",
    "scenario": "拡張機能の設定画面において、Manifest V3仕様に基づき不要な広域権限が要求されず、最小限の権限構造になっているか検証する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能がインストールされており、設定画面が表示可能な状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "設定画面を開き、manifest.jsonに定義された権限および実行時のアクセス要求を確認する",
        "expectedResult": "Manifest V3仕様に準拠しており、不必要な広域ホスト権限が事前に要求されていないこと"
      }
    ],
    "expectedResult": "Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用していること",
    "testData": "なし",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-023",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "商品管理",
      "medium": "エクスポート処理",
      "small": "インジェクション対策"
    },
    "testCase": "XSS（クロスサイトスクリプティング）防止構造の検証",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-012",
    "scenario": "HTMLタグやJavaScriptコードを含むMarkdownファイルを閲覧中にエクスポートを実行し、生成されたHTML内でスクリプトが意図せず実行されないか確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面にて、スクリプトタグが含まれるMarkdownファイルを表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイルアクションバーの「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "エクスポートモーダルダイアログが表示される"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "エディション選択ダイアログで「Lite (ktm-lite.html)」を選択し、「エクスポート」ボタンをクリックする",
        "expectedResult": "生成されたHTMLファイルがダウンロードされ、HTML内の特殊文字が適切にエスケープされていること"
      }
    ],
    "expectedResult": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理が実施されXSSが防止されること",
    "testData": "Markdownデータ=<script>alert('XSS')</script>",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-024",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定情報管理",
      "small": "Manifest V3・権限管理"
    },
    "testCase": "権限最小化・Manifest V3検証",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-026",
    "scenario": "設定画面の初期状態および設定変更において、過剰なパーミッションが要求されないことを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで 'custom' を選択する",
        "expectedResult": "「カスタムリポジトリURL」入力フィールドおよび「接続テスト」ボタンが活性化し、この時点で動的権限が過剰要求されないこと"
      }
    ],
    "expectedResult": "静的権限が最小限に保持されていること",
    "testData": "リポジトリタイプ=custom",
    "acceptanceCriteria": "必要最小限の権限のみが定義されていること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-025",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "商品管理",
      "medium": "エクスポート処理",
      "small": "インジェクション対策"
    },
    "testCase": "特殊文字エスケープ処理",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-027",
    "scenario": "Markdown本文中の `<`、`>`、`&` などの特殊文字が、HTML変換時に正しくエスケープ処理されるか検証する。",
    "actor": "GitHubユーザー",
    "precondition": "特殊文字（`<script>`, `&amp;`等）を含むMarkdownファイルを閲覧中であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エクスポートを実行する",
        "expectedResult": "生成されたHTML内の `<textarea id=\"editor\">` にエスケープされたテキストが正しく埋め込まれること"
      }
    ],
    "expectedResult": "特殊文字が `&lt;`, `&gt;`, `&amp;` 等に置換されて安全に出力されること",
    "testData": "Markdownデータ=<div>Test & Sample</div>",
    "acceptanceCriteria": "特殊文字がエスケープされ、悪意あるスクリプト挿入が防止されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-026",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定情報管理",
      "small": "オプショナル権限要求"
    },
    "testCase": "Manifest V3規約準拠およびオプショナル権限要求制御検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-033",
    "scenario": "カスタムリポジトリURL接続テスト時、ホスト権限が存在しない場合にのみ動的にchrome.permissions.requestが呼び出されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を開き、「リポジトリタイプ」で 'custom' を選択していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'https://github.com/myuser/myrepo' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "ブラウザの権限要求ダイアログが表示され、オプショナル権限要求（chrome.permissions）が制御されること"
      }
    ],
    "expectedResult": "オプショナル権限リクエストが適切に呼び出され、承認動作に連動すること",
    "testData": "カスタムリポジトリURL=https://github.com/myuser/myrepo",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-027",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "商品管理",
      "medium": "エクスポート処理",
      "small": "インジェクション対策"
    },
    "testCase": "HTMLテンプレート埋め込み時の特殊文字エスケープ検証",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-034",
    "scenario": "Markdown本文だけでなく、添付ファイルのファイル名やキーに含まれる特殊文字がHTML内に埋め込まれる際のエスケープ検証を行う。",
    "actor": "GitHubユーザー",
    "precondition": "特殊文字を含むファイル名の添付画像が存在するMarkdownファイルを閲覧中であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エクスポート処理を完了させる",
        "expectedResult": "ダウンロードされたHTMLの `<ul id=\"fileList\">` 内の `id` 属性や `title` 属性における特殊文字が正しくエスケープされていること"
      }
    ],
    "expectedResult": "添付ファイルメタデータ埋め込み時の特殊文字エスケープが確実に行われること",
    "testData": "添付ファイル名=<bad_img>.png",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-028",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "接続テスト",
      "small": "動的権限要求"
    },
    "testCase": "chrome.permissionsによる動的権限要求確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-043",
    "scenario": "接続テスト実行時に `chrome.permissions.contains` で事前に権限チェックが行われ、未許可時のみ `chrome.permissions.request` が実行されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面でカスタムリポジトリURLを入力済みであること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックする",
        "expectedResult": "対象ホスト権限の有無がチェックされ、未所持の場合に権限承認要求が表示されること"
      }
    ],
    "expectedResult": "動的権限要求 API が正しく機能すること",
    "testData": "カスタムリポジトリURL=https://github.com/testuser/testrepo",
    "acceptanceCriteria": "オプショナル権限リクエスト（chrome.permissions）を使用して最小権限を維持すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-029",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "接続テスト",
      "small": "アクセス制御"
    },
    "testCase": "オプショナルホスト権限のリクエストとアクセス制御確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-051",
    "scenario": "動的権限要求ダイアログでユーザーが拒否した場合に、外部接続処理（fetch）が遮断されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "「リポジトリタイプ」で 'custom' を選択し、未許可のカスタムリポジトリURLを入力していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックし、表示された権限要求ダイアログで「拒否」を選択する",
        "expectedResult": "画面上に「接続失敗：拡張機能へのホスト権限の承認が拒否されました。」メッセージが表示され、無権限でのフェッチが行われないこと"
      }
    ],
    "expectedResult": "権限拒否時に外部接続が適切にアクセス制御・遮断されること",
    "testData": "カスタムリポジトリURL=https://github.com/unauthorized/repo",
    "acceptanceCriteria": "権限が拒否された場合、通信を実行せずに安全にエラー処理を行うこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-030",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定情報管理",
      "small": "Manifest V3・権限管理"
    },
    "testCase": "Manifest V3仕様に準拠した権限の最小化確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-052",
    "scenario": "manifest.json内の permissions および host_permissions 定義をレビューし、過剰なワイルドカード権限が含まれていないことを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能のパッケージ構成を確認可能な状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "拡張機能の設定画面およびマニフェスト設定を確認する",
        "expectedResult": "必要最小限の permissions（storage等）のみが宣言されていること"
      }
    ],
    "expectedResult": "Manifest V3仕様に基づき権限の最小化が達成されていること",
    "testData": "なし",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、権限を最小化すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-031",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "商品管理",
      "medium": "エクスポート処理",
      "small": "インジェクション対策"
    },
    "testCase": "HTMLテンプレート結合時のMarkdown・添付ファイル情報エスケープ確認",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-053",
    "scenario": "エクスポート処理時に、Markdown内のコードブロックや添付ファイルリストの注入部分でエスケープ漏れが発生しないか確認する。",
    "actor": "GitHubユーザー",
    "precondition": "エクスポート対象のMarkdown内にHTML特殊文字を含む添付ファイル情報が存在すること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エクスポートを実行する",
        "expectedResult": "ダウンロードされたHTMLをブラウザで開いた際、スクリプトが実行されず平文として表示されること"
      }
    ],
    "expectedResult": "すべての埋め込みデータに対して確実なエスケープ処理が適用されていること",
    "testData": "Markdownデータ=```html\n<script>console.log('test')</script>\n```",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-032",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "入力値検証",
      "small": "バリデーション"
    },
    "testCase": "カスタムリポジトリURLのバリデーションおよび不正スキーム遮断確認",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-054",
    "scenario": "設定画面の「カスタムリポジトリURL」に、不正なURL形式や `javascript:` などの不正スキームを入力した際の遮断処理を検証する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を開き、「リポジトリタイプ」で 'custom' を選択していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'javascript:alert(1)' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "「エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)」が表示され、接続処理が遮断されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「保存」ボタンをクリックする",
        "expectedResult": "アラートダイアログで「カスタムリポジトリURLの形式が正しくありません。」が表示され、保存されないこと"
      }
    ],
    "expectedResult": "正規表現パターンに合致しない不正なURLスキームおよびフォーマットが確実に遮断されること",
    "testData": "カスタムリポジトリURL=javascript:alert(1)",
    "acceptanceCriteria": "GitHubリポジトリ形式（https://github.com/ユーザー名/リポジトリ名）を満たしていない場合に適切にエラー表示および遮断を行うこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-033",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定情報管理",
      "small": "Manifest V3・権限管理"
    },
    "testCase": "オプショナル権限要求および最小権限動作確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-060",
    "scenario": "デフォルト設定（リポジトリタイプが 'original'）での使用時に、外部ドメインへのオプショナル権限要求が一切発生しないことを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面で「リポジトリタイプ」が 'original' に設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「保存」ボタンをクリックする",
        "expectedResult": "追加のホスト権限要求が発生せずに設定が保存され、標準の公式リポジトリURLのみで安全に動作すること"
      }
    ],
    "expectedResult": "不要な権限要求を行わず、最小権限原則に従って正常動作すること",
    "testData": "リポジトリタイプ=original",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、権限を最小化すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-034",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "ブラウザ描画・動作互換性",
      "small": "マルチブラウザ検証"
    },
    "testCase": "GitHub SPA遷移およびDOM動的変化における主要ブラウザ互換性確認",
    "relatedRequirement": "NFR-003",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-055",
    "scenario": "Google ChromeおよびChromium系（Microsoft Edge等）のブラウザ環境において、GitHub上のMarkdownファイル閲覧画面を開き、SPA遷移およびDOM動的更新が発生しても「かんたんMDエクスポート」ボタンが正しく表示・動作することを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "対象ブラウザ（Google Chrome, Microsoft Edge）に拡張機能がインストールされており、GitHubにログインした状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "ファイルアクションバー内に「かんたんMDエクスポート」ボタンが正しく挿入・描画されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub内の別ディレクトリの.mdファイルへSPA（ページ再読み込みなし）遷移を行う",
        "expectedResult": "画面遷移後、既存ボタンの重複なく新しいファイルアクションバー内に「かんたんMDエクスポート」ボタンが自動再挿入されること"
      },
      {
        "order": 3,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "エラーなく処理が完了し、指定したエディションのHTMLファイルがダウンロードされること"
      }
    ],
    "expectedResult": "複数のサポート対象ブラウザ（Chrome, Edge）においてSPA遷移追従およびボタン挿入・エクスポート動作が正常に機能すること",
    "testData": "URL=https://github.com/user/repo/blob/main/README.md, エディション=standard",
    "acceptanceCriteria": "ページ遷移やReactベースのコンポーネント再描画を検知し、99.9%以上の確率でボタン重複なく確実にエクスポートボタンを自動再挿入すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-035",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "画面UIレイアウト",
      "small": "レスポンシブ・表示崩れ検証"
    },
    "testCase": "設定画面およびモーダルダイアログのUIレイアウト・レスポンシブ表示確認",
    "relatedRequirement": "NFR-007",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-056",
    "scenario": "画面解像度やウィンドウサイズ（PC幅、タブレット幅、スマートフォン表示幅等）を変化させた状態で、設定画面およびエクスポートエディション選択モーダルダイアログを開き、UI要素の表示崩れや操作不可状態が発生しないか検証する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能の設定画面（SCR-002）およびMarkdownファイル閲覧画面（SCR-001）を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "ブラウザウィンドウ幅を1280px（PCサイズ）から768px（タブレットサイズ）、375px（スマートフォンサイズ）へ段階的に変更する",
        "expectedResult": "「リポジトリタイプ」ラジオボタン、「カスタムリポジトリURL」テキストボックス、「エディション」ラジオボタン、「保存」ボタン、「接続テスト」ボタンの各UI要素が折り返され、文字切れや重なりなく表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックして「エクスポートエディションの選択」モーダルダイアログを表示させ、ウィンドウ幅を縮小する",
        "expectedResult": "モーダルダイアログ（ktm-modal-box）が画面中央に追従・維持され、「エクスポート」ボタンおよび「キャンセル」ボタンが押下可能な状態で表示されること"
      }
    ],
    "expectedResult": "各画面解像度・ウィンドウサイズにおいて、設定フォームおよびモーダルダイアログのレイアウトが崩れず正常に操作可能であること",
    "testData": "ウィンドウ幅=1280px / 768px / 375px",
    "acceptanceCriteria": "公式リポジトリ/カスタムURLおよび複数エディション（Lite/Standard/Full）の表示において画面レイアウトが崩れず視認性・操作性が維持されること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-036",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM動的監視・追従",
      "small": "SPA自動再挿入可用性"
    },
    "testCase": "SPA遷移・DOM更新時のエクスポートボタン自動再挿入検証",
    "relatedRequirement": "NFR-003",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-030",
    "scenario": "GitHub閲覧中に画面全体の刷新を伴わないSPA遷移（画面内リンク移動やファイル切り替え）を連続して行った際、MutationObserverが正常に追従し、ボタンの消滅や重複生成を起こさず可用性を維持することを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "拡張機能が有効化されており、GitHubのリポジトリファイル一覧画面からMarkdownファイルへ遷移する準備が整っていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で「doc1.md」のリンクをクリックしてファイル表示画面を開く",
        "expectedResult": "DOM更新を検知し、アクションバー内に「かんたんMDエクスポート」ボタンが1つのみ挿入されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "ブラウザの戻る操作を行わずに、パンくずリストから別の「doc2.md」をクリックしてSPA遷移する",
        "expectedResult": "旧画面のボタンが除去され、新たに表示された「doc2.md」のアクションバー内に「かんたんMDエクスポート」ボタンが重複なく1つのみ自動再挿入されること"
      }
    ],
    "expectedResult": "SPA遷移を繰り返しても、99.9%以上の確率でボタンの不具合（重複挿入・非表示）が発生せず、常に利用可能な状態に保たれること",
    "testData": "遷移元ファイル=doc1.md, 遷移先ファイル=doc2.md",
    "acceptanceCriteria": "ページ遷移やReactベースのコンポーネント再描画を検知し、99.9%以上の確率でボタン重複なく確実にエクスポートボタンを自動再挿入すること",
    "priority": "高",
    "testType": "自動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-037",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "通信障害ハンドリング",
      "small": "ネットワーク切断リカバリ"
    },
    "testCase": "ネットワーク通信エラー・リソース不在時のエラーリカバリ確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-058",
    "scenario": "エクスポート処理中または設定画面での接続テスト実行中にネットワークが切断（オフライン状態）となった場合、適切にエラーが捕捉され、ユーザーへ警告アラートが表示された後に安全に操作可能状態へリカバリすることを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面を開いている、または設定画面を表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エディションダイアログで「エクスポート」ボタンをクリックする直前にネットワークをオフラインにする",
        "expectedResult": "バックグラウンドからの通信失敗を検知し、「エクスポートに失敗しました: Raw Markdownデータの取得に失敗しました」等のアラートダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "表示されたアラートの「OK」ボタンをクリックする",
        "expectedResult": "「かんたんMDエクスポート」ボタンの非活性状態（「エクスポート中...」）が解除され、通常のボタン表示に戻り再試行可能となること"
      },
      {
        "order": 3,
        "screen": "設定画面",
        "action": "ネットワークオフラインのまま「リポジトリタイプ」で「カスタム」を選択し、「カスタムリポジトリURL」に 'https://github.com/user/repo' を入力して「接続テスト」ボタンをクリックする",
        "expectedResult": "画面上に「接続失敗：サーバーへの疎通エラーが発生しました。」というエラーメッセージ（testResult）が赤字で表示され、画面フリーズ等が発生しないこと"
      }
    ],
    "expectedResult": "通信障害発生時にアプリケーションがハングアップせず、適切なエラーメッセージを表示して復帰動作（リカバリ）が行われること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/user/repo",
    "acceptanceCriteria": "ネットワーク障害時にエラーを補獲し、ユーザーに適切なエラーメッセージをフィードバックして再操作可能な状態に復元すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-038",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "通信障害ハンドリング",
      "small": "通信タイムアウト処理"
    },
    "testCase": "ネットワーク断・外部通信エラーハンドリング確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-009",
    "scenario": "テンプレートHTMLや画像添付ファイルの取得時にサーバー応答遅延やHTTP 404/500等の応答エラーが発生した場合に、処理が中断されずに適切なフォールバックまたは明確なエラー表示が行われるか確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdown閲覧画面にて「かんたんMDエクスポート」ボタンを押下できる状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "存在しないテンプレートURLが設定された状態で「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」をクリックする",
        "expectedResult": "「エクスポートに失敗しました: テンプレート読み込み失敗: テンプレートの取得に失敗しました。」というエラーメッセージダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "ダイアログを閉じ、ボタン状態を確認する",
        "expectedResult": "「かんたんMDエクスポート」ボタンが有効状態に再設定され、画面がフリーズせずに復帰すること"
      }
    ],
    "expectedResult": "外部フェッチ失敗時においても例外が捕捉され、システムがハングアップすることなく正常にリカバリ処理が完了すること",
    "testData": "テンプレートURL=https://tatesuke.github.io/KanTanMarkdown/dist/invalid.html",
    "acceptanceCriteria": "HTTPエラーおよびフェッチ失敗時にバックグラウンドスクリプトからエラー理由が伝播され、UI上で安全に復帰すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "変更区分": "拡張",
    "id": "ST-039",
    "category": "可用性・互換性",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "例外ハンドリング・リカバリ",
      "small": "権限拒否・アクセスエラー"
    },
    "testCase": "オプショナル権限拒否およびネットワーク障害時のリカバリ検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-035",
    "scenario": "カスタムリポジトリURLの接続テスト時に、Chrome拡張機能のオプショナルホスト権限リクエストダイアログでユーザーが「ブロック」または「拒否」を選択した場合に、エラーハンドリングが機能して設定画面の制御が回復することを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面（SCR-002）を開き、未許可のドメインをカスタムリポジトリURLに指定していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で「カスタム」を選択し、「カスタムリポジトリURL」に 'https://github.com/customuser/customrepo' を入力する",
        "expectedResult": "「接続テスト」ボタンが活性化されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックし、ブラウザから表示されるアクセス権限要求ポップアップで「拒否（Cancel）」をクリックする",
        "expectedResult": "「接続失敗：拡張機能へのホスト権限の承認が拒否されました。」というエラーメッセージが赤字（.error）で表示されること"
      },
      {
        "order": 3,
        "screen": "設定画面",
        "action": "権限拒否メッセージ表示後、「保存」ボタンまたは「キャンセル」ボタンをクリックする",
        "expectedResult": "ボタンが正常に反応し、画面を閉じるまたは設定変更のやり直しが支障なく行えること"
      }
    ],
    "expectedResult": "オプショナル権限が拒否された場合でもアプリケーションが不正終了せず、エラーメッセージ表示後に正常な操作状態へ復帰すること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/customuser/customrepo",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に準拠し、権限拒否時にも適切にキャッチしてUI上のリカバリを実行できること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-040",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "画面挿入・表示",
      "small": "DOM挿入・描画反映"
    },
    "testCase": "DOM挿入およびボタン描画反映の確認",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-001",
    "scenario": "GitHubのMarkdown閲覧画面を表示し、アクションバー内にエクスポート用ボタンが重複なく正確に挿入されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Chrome拡張機能が有効化されており、GitHub上で拡張子「.md」のファイルを表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "ファイルアクションバー内に「かんたんMDエクスポート」ボタン（または「かんたんMarkdownへエクスポート」ボタン）が崩れなく正しく挿入されること"
      }
    ],
    "expectedResult": "Markdown閲覧画面のアクションバー内に「かんたんMDエクスポート」ボタンが1つだけ正常に挿入・表示されること",
    "testData": "URL=https://github.com/user/repo/blob/main/README.md",
    "acceptanceCriteria": "DOM構造変化を検知し、アクションバー内に重複なく「かんたんMDエクスポート」ボタンが表示されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-041",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "エクスポート操作",
      "small": "ダイアログ表示・連携"
    },
    "testCase": "メッセージパッシング連携およびモーダルダイアログ動作確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-002",
    "scenario": "エクスポートボタンクリック時にエディション選択モーダルダイアログが表示され、選択内容がバックグラウンドに正しく送出されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面に「かんたんMDエクスポート」ボタンが表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "「エクスポートエディションの選択」モーダルダイアログが表示され、エディション選択肢（Lite, Standard, Full）が提示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "モーダルダイアログで「Standard (ktm-std.html)」を選択し、「エクスポート」ボタンをクリックする",
        "expectedResult": "バックグラウンドへメッセージ（action: exportMarkdown, edition: standard）が送信され、処理中表示「エクスポート中...」へボタンが変化すること"
      }
    ],
    "expectedResult": "モーダルダイアログで選択されたエディション情報がメッセージパッシングにより正しく送信され、エクスポート処理が開始されること",
    "testData": "edition=standard",
    "acceptanceCriteria": "モーダルダイアログのUI要素（セレクトボックス・エクスポートボタン・キャンセルボタン）が正常機能し、選択値がバックグラウンドに伝播すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-042",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・出力",
      "small": "HTML合成・ファイルダウンロード"
    },
    "testCase": "データ取得・フェッチおよび単一HTML出力確認",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-003",
    "scenario": "Raw MarkdownデータおよびテンプレートHTMLを取得・結合し、スタンドアロンで動作する「かんたんMarkdown」単一HTMLファイルが生成・ダウンロードされることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdownファイル閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "バックグラウンドでRaw MarkdownおよびテンプレートHTMLが取得され、Quine型単一HTMLファイルが生成されてブラウザのダウンロードが実行されること"
      }
    ],
    "expectedResult": "ダウンロードされたHTMLファイルをブラウザで開いた際、Markdown本文および添付ファイル情報が正常に埋め込まれて閲覧可能であること",
    "testData": "fileName=sample.md, edition=lite",
    "acceptanceCriteria": "Markdownテキストおよび画像等の添付ファイルデータが埋め込まれたHTMLファイルが自動ダウンロードされること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-043",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定画面操作",
      "small": "UI制御・入力バリデーション"
    },
    "testCase": "設定UI制御および入力バリデーション確認",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-004",
    "scenario": "設定画面において「リポジトリタイプ」の選択に応じて「カスタムリポジトリURL」入力欄および「接続テスト」ボタンの活性/非活性が切り替わり、形式チェックが機能することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能の設定画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで「カスタム」を選択する",
        "expectedResult": "「カスタムリポジトリURL」フィールドおよび「接続テスト」ボタンが有効化されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'invalid-url' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "「エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)」のエラーメッセージが表示されること"
      }
    ],
    "expectedResult": "不適切なURL形式に対してエラーが提示され、正しいフォーマット検証が行われること",
    "testData": "repo_type=custom, custom_repo_url=invalid-url",
    "acceptanceCriteria": "カスタム選択時のみ入力項目が有効化され、GitHubリポジトリURL形式以外の入力に対して接続テスト時にエラー表示が行われること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-044",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定保存",
      "small": "ストレージ永続化"
    },
    "testCase": "ストレージ連携および設定保存確認",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-005",
    "scenario": "設定画面で各項目を選択・入力して「保存」ボタンをクリックすると、設定値がストレージに永続化され再表示時に反映されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能の設定画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで「公式」を選択し、「エディション」ラジオボタンで「Full」を選択して「保存」ボタンをクリックする",
        "expectedResult": "保存トースト通知が表示され、設定画面が閉じること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "再度設定画面を開く",
        "expectedResult": "「リポジトリタイプ」で「公式」が、「エディション」で「Full」が選択状態として保持されていること"
      }
    ],
    "expectedResult": "変更した設定（repo_type, edition）がchrome.storage.localに正しく保存・再読み込みされること",
    "testData": "repo_type=original, edition=full",
    "acceptanceCriteria": "保存した設定情報がストレージに保持され、次回画面表示時に初期値として設定されること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-045",
    "category": "機能",
    "functionCategory": {
      "large": "CI/CD機能",
      "medium": "自動ビルド",
      "small": "パッケージング・リリース"
    },
    "testCase": "バージョン更新およびZIPパッケージング確認",
    "relatedRequirement": "FR-005",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-006",
    "scenario": "リポジトリにバージョンタグをプッシュした際、GitHub Actionsが起動してmanifest.jsonのバージョン更新とリリースZIP作成が行われることを確認する。",
    "actor": "開発者 / 運用担当者",
    "precondition": "GitHub Actionsのワークフロー（release-extension.yml）が設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub ワークフロー",
        "action": "Gitリポジトリに対してタグ 'v1.0.0' をプッシュする",
        "expectedResult": "GitHub Actionsの「Release Chrome Extension」ワークフローが正常に起動すること"
      },
      {
        "order": 2,
        "screen": "GitHub Releaseページ",
        "action": "ワークフロー完了後に発行されたGitHub Releaseを確認する",
        "expectedResult": "manifest.jsonのバージョンが '1.0.0' に補正され、'github-to-kantan-markdown.zip' が添付されたReleaseが作成されること"
      }
    ],
    "expectedResult": "タグプッシュを契機として自動パッケージ化およびGitHub Releaseの作成が正常完了すること",
    "testData": "tag=v1.0.0",
    "acceptanceCriteria": "GitHub Release内に必要なファイル（manifest.json, background.js, content.js, options.html, options.js等）を含むZIPが生成されること",
    "priority": "低",
    "testType": "自動"
  },
  {
    "id": "ST-046",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "業務シナリオ",
      "small": "エンドツーエンドエクスポート"
    },
    "testCase": "正常エクスポートフロー",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-016",
    "scenario": "ユーザーがGitHub上でMarkdownファイルを閲覧し、エクスポートボタンをクリックして「かんたんMarkdown」HTMLを入手する一連の正常フローを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "拡張機能がブラウザに導入されており、GitHubの.mdファイル閲覧画面を表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "ファイルアクションバー内に「かんたんMDエクスポート」ボタンが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "「エクスポート中...」の表示後、ファイル保存ダイアログまたは自動ダウンロードによりHTMLファイルが保存されること"
      }
    ],
    "expectedResult": "ユーザーの開始操作から成果物HTMLファイルの取得までの一連の業務フローがエラーなく完了すること",
    "testData": "fileName=document.md",
    "acceptanceCriteria": "エンドツーエンドの操作においてエラーや描画崩れが発生せず、完成したHTMLファイルが正常出力されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-047",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "業務シナリオ",
      "small": "カスタム設定・接続確認"
    },
    "testCase": "カスタムリポジトリ設定・接続フロー",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-017",
    "scenario": "設定画面でカスタムリポジトリURLを設定し、接続テストで成功を確認して設定を保存する一連のシナリオを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "独自に構築したテンプレートリポジトリ（GitHub Pages公開済み）が存在すること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで「カスタム」を選択する",
        "expectedResult": "「カスタムリポジトリURL」入力欄が編集可能状態になること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」に 'https://github.com/myuser/myrepo' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "「接続成功：かんたんMarkdownテンプレートを検出しました。」の成功メッセージが表示されること"
      },
      {
        "order": 3,
        "screen": "設定画面",
        "action": "「保存」ボタンをクリックする",
        "expectedResult": "設定値が保存され、画面が閉じること"
      }
    ],
    "expectedResult": "カスタムリポジトリURLの設定、接続確認、保存の一連の流れが正しく機能すること",
    "testData": "repo_type=custom, custom_repo_url=https://github.com/myuser/myrepo",
    "acceptanceCriteria": "接続テスト成功後に保存を行うことで、以降のエクスポート処理時に指定したカスタムURLが適用される状態になること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-048",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "画面描画・UI連携",
      "small": "DOM要素配置"
    },
    "testCase": "DOM挿入・描画反映",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-018",
    "scenario": "GitHubの画面レイアウト（ButtonGroup等）に合わせて、「かんたんMDエクスポート」ボタンが適切なスタイルで正しく挿入されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのファイルビューワー画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "[data-testid=\"raw-button\"] の近傍の ButtonGroup 内に wrapper 要素を伴って「かんたんMDエクスポート」ボタンが配備されること"
      }
    ],
    "expectedResult": "GitHub既存UIデザインと親和性のあるスタイルでボタンが正常にレンダリングされること",
    "testData": "画面コンテナ=[data-component=\"ButtonGroup\"]",
    "acceptanceCriteria": "ボタンの背景色・文字色・余白がデザイン定義通りに設定され、周囲のボタンと重ならないこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-049",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "画面描画・UI連携",
      "small": "入力形式バリデーション"
    },
    "testCase": "入力バリデーション連携",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-019",
    "scenario": "設定画面の保存処理において、不正なカスタムリポジトリURLが設定されている場合にダイアログで警告し保存を中断することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面で「リポジトリタイプ」に「カスタム」が選択されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」テキストボックスに 'http://invalid-domain.com' を入力し、「保存」ボタンをクリックする",
        "expectedResult": "「カスタムリポジトリURLの形式が正しくありません。」の警告アラートが表示され、保存処理が中断されること"
      }
    ],
    "expectedResult": "不正なURLフォーマットでの設定保存が防止されること",
    "testData": "repo_type=custom, custom_repo_url=http://invalid-domain.com",
    "acceptanceCriteria": "正規表現 (^https:\\/\\/github\\.com\\/[a-zA-Z0-9_-]+\\/[a-zA-Z0-9_-]+$) に適合しない入力値での保存要求を拒否すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-050",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "データ処理・データ整合性",
      "small": "ストレージ入出力"
    },
    "testCase": "ストレージ一連操作・データ整合性",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-020",
    "scenario": "設定画面での保存、変更、キャンセル操作を行った際、chrome.storage.localに保持されるデータが整合性を保っていることを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "初期状態として repo_type='original', edition='lite' が保存されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「エディション」で「Standard」を選択後、「キャンセル」ボタンをクリックする",
        "expectedResult": "設定画面が閉じ、ストレージの値は 'lite' のまま変更されないこと"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "再度設定画面を開き、「エディション」で「Full」を選択して「保存」ボタンをクリックする",
        "expectedResult": "ストレージの edition キーの値が 'full' に更新されること"
      }
    ],
    "expectedResult": "キャンセル時には保存されず、保存実行時のみストレージ情報が正確に更新されること",
    "testData": "初期データ: {repo_type:'original', edition:'lite'}, 変更データ: {edition:'full'}",
    "acceptanceCriteria": "chrome.storage.localに対する読み書き操作において、意図しないデータの更新や消失が発生しないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-051",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・データ整合性",
      "small": "メッセージ疎通・テンプレート合成"
    },
    "testCase": "テンプレート合成データ整合性・メッセージパッシング連携",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-021",
    "scenario": "Content ScriptとBackground Script間の通信で、Markdownおよび添付ファイルメタデータが失われずにテンプレートHTMLへと合成されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "画像・添付ファイルを含むMarkdown閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、「エクスポート」を実行する",
        "expectedResult": "Content ScriptからBackgroundへ attachmentsMetadata 等のペロードが正しく渡され、返却された結合データでHTML生成が行われること"
      }
    ],
    "expectedResult": "生成されたHTML内の <textarea id=\"editor\"> および <ul id=\"fileList\"> 内に、取得したMarkdownテキストおよびBase64変換された画像データが完全な形式で埋め込まれること",
    "testData": "attachmentsMetadata=[{uuid:'1234', filename:'test.png', url:'https://...'}]",
    "acceptanceCriteria": "メッセージパッシングを経由したデータ受け渡しにおいて、エンコード崩れや欠損が生じないこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-052",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "DOM追従・SPA対応",
      "small": "自動再挿入検知"
    },
    "testCase": "SPA遷移・DOM更新時のエクスポートボタン自動再挿入検証",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-030",
    "scenario": "GitHubのページ遷移（SPAによる画面の動的更新）が発生した際、MutationObserverにより自動的にエクスポートボタンが再挿入されることを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのリポジトリファイル一覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイル一覧から任意の「.md」ファイル（例: doc1.md）リンクをクリックして画面遷移する",
        "expectedResult": "SPA遷移完了後、MutationObserverがURL変化およびDOM更新を検知し、アクションバー内に「かんたんMDエクスポート」ボタンが再挿入されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "別の「.md」ファイル（例: doc2.md）へ画面遷移する",
        "expectedResult": "既存ボタンの重複を防止しつつ、新しい画面のアクションバー内に正しく1つだけボタンが維持・挿入されること"
      }
    ],
    "expectedResult": "SPA遷移を繰り返しても、常に「.md」閲覧画面においてボタンが正常に動的挿入されること",
    "testData": "遷移元=/blob/main/doc1.md, 遷移先=/blob/main/doc2.md",
    "acceptanceCriteria": "ページリロードを伴わない画面遷移において、99.9%以上の確率でボタンの重複なく自動挿入が行われること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-053",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "テンプレート切替",
      "small": "エディション・リポジトリ適用"
    },
    "testCase": "リポジトリタイプおよびエディション適用確認",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-036",
    "scenario": "設定されたリポジトリタイプ（original/custom）およびエディション（lite/standard/full）に応じて、フェッチされるテンプレートHTML（ktm-lite.html, ktm-std.html, ktm-full.html）の取得URLが正しく切り替わることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面にて repo_type='custom', custom_repo_url='https://github.com/myuser/myrepo', edition='full' に設定済みであること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」を実行する",
        "expectedResult": "Background Scriptにおいて 'https://myuser.github.io/myrepo/dist/ktm-full.html' からテンプレートHTMLがフェッチされること"
      }
    ],
    "expectedResult": "設定情報に完全合致するテンプレートHTMLのURLが生成・取得されること",
    "testData": "repo_type=custom, custom_repo_url=https://github.com/myuser/myrepo, edition=full",
    "acceptanceCriteria": "選択されたリポジトリタイプおよびエディションに基づき、適切なドメイン・ファイル名のテンプレートが要求されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-054",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "接続確認",
      "small": "HTTPフェッチ確認"
    },
    "testCase": "カスタムリポジトリURLバリデーションと接続確認",
    "relatedRequirement": "FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-037",
    "scenario": "設定画面の接続テストにおいて、有効なカスタムリポジトリURLに対してHEADリクエストを送信し、テンプレートが存在することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面で「リポジトリタイプ」が「カスタム」に設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」に 'https://github.com/tatesuke/KanTanMarkdown' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "HEADリクエストが実行され、HTTP 200 OK応答を受信して「接続成功：かんたんMarkdownテンプレートを検出しました。」と表示されること"
      }
    ],
    "expectedResult": "接続テスト機能により、対象リポジトリ上のテンプレートHTMLの存在判定が正常に行われること",
    "testData": "custom_repo_url=https://github.com/tatesuke/KanTanMarkdown",
    "acceptanceCriteria": "実在するGitHub Pages上のテンプレートURLに対して正常応答（HTTP 200）が得られ、成功メッセージが画面に反映されること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-055",
    "category": "機能",
    "functionCategory": {
      "large": "CI/CD機能",
      "medium": "自動リリース",
      "small": "マニフェスト動的書き換え"
    },
    "testCase": "バージョン自動書き換えおよびZIPパッケージ作成",
    "relatedRequirement": "FR-005",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-038",
    "scenario": "CI/CD環境においてタグ名から正規化されたバージョン番号が抽出され、manifest.jsonが動的に書き換えられた上でZIPアーカイブが作成されることを確認する。",
    "actor": "開発者 / 運用担当者",
    "precondition": "GitHub Actionsワークフローがタグプッシュをトリガーとして実行可能状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub ワークフロー",
        "action": "タグ 'v2.1.0-release' をプッシュしてワークフローを実行する",
        "expectedResult": "ワークフロー内のjqスクリプトがタグを '2.1.0' へ正規化し、manifest.jsonのversion値を更新すること"
      },
      {
        "order": 2,
        "screen": "GitHub Releaseページ",
        "action": "作成されたZIPパッケージを展開し manifest.json を確認する",
        "expectedResult": "manifest.json 内の \"version\": \"2.1.0\" と記載されており、必要な全構成ファイルが同梱されていること"
      }
    ],
    "expectedResult": "タグ名からのバージョン正規化、マニフェスト更新、ZIP圧縮が期待通りに自動実行されること",
    "testData": "REF_NAME=v2.1.0-release -> 抽出バージョン=2.1.0",
    "acceptanceCriteria": "jq処理によりmanifest.jsonが不正な構造になることなく適切に書き換えられ、配布用ZIPファイルが生成されること",
    "priority": "高",
    "testType": "自動"
  },
  {
    "id": "ST-056",
    "category": "機能",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "画面表示・描画",
      "small": "ブラウザ互換・描画確認"
    },
    "testCase": "GitHub SPA遷移およびDOM動的変化におけるボタン描画互換性確認",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-055",
    "scenario": "Reactベースの最新GitHub UIおよび従来のHTML構造の両方において、エクスポートボタンが崩れることなく正しくレンダリングされるか確認する。",
    "actor": "GitHubユーザー",
    "precondition": "最新のGitHub Reactビューワー環境およびフォールバック環境が用意されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "Reactベースの新UI構成（ButtonGroup要素あり）で.md画面を表示する",
        "expectedResult": "ktm-export-wrapper が生成され、ButtonGroupスタイルに合わせた「かんたんMDエクスポート」ボタンが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "従来型のコンテナ構造（.file-actions 等）の画面で.md画面を表示する",
        "expectedResult": "コンテナ内に直接ボタン要素が追加され、表示崩れなく設置されること"
      }
    ],
    "expectedResult": "新旧双方のGitHub UI構造に対応し、エクスポートボタンがレイアウトを崩さずに描画されること",
    "testData": "対象UI要素=[data-testid=\"raw-button\"], .file-actions",
    "acceptanceCriteria": "異なるGitHub UI構造のどちらにおいてもエラーを発生させずにボタンが正しい位置に表示されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-057",
    "category": "機能",
    "functionCategory": {
      "large": "設定管理",
      "medium": "画面表示・描画",
      "small": "レイアウト・レスポンシブ表示"
    },
    "testCase": "設定画面およびモーダルダイアログのUIレイアウト・レスポンシブ表示確認",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-056",
    "scenario": "設定画面およびエクスポート時のモーダルダイアログが、指定されたサイズおよびスタイルで崩れることなく中央表示されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面またはMarkdown閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "設定画面（options.html）を表示する",
        "expectedResult": "設定フォーム、操作ボタンエリア（接続テスト、保存、キャンセル）が整然と配置され、ラベルやトースト通知が崩れず表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックしてモーダルダイアログを表示する",
        "expectedResult": "ktm-modal-box が画面中央にオーバーレイ表示され、幅350pxの適切なレイアウトでタイトル・セレクトボックス・ボタン群が配置されること"
      }
    ],
    "expectedResult": "設定画面およびモーダルダイアログのUI要素が仕様通りに整列・表示されること",
    "testData": "modalWidth=350px",
    "acceptanceCriteria": "各種ブラウザ解像度において文字溢れやボタンの重なりが発生せず、画面定義書のレイアウトを満たしていること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-058",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "処理速度およびブラウザ描画負荷の抑制",
      "small": "エクスポート処理速度"
    },
    "testCase": "エクスポート処理および単一HTML生成速度の検証",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-007",
    "scenario": "Markdownファイル閲覧画面でエクスポート処理を開始し、Raw Markdownデータ取得・画像等のフェッチ・Base64変換・HTML合成処理が指定の制限時間内で完了することを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHub上で拡張子「.md」のファイル閲覧画面が表示されており、拡張機能のエクスポートボタンが正常に表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "「エクスポートエディションの選択」ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理が5秒以内に完了し、生成された単一HTMLファイルのダウンロードが開始されること（ネットワーク遅延を除く）"
      }
    ],
    "expectedResult": "フェッチ・Base64変換・HTML合成処理の一連のエクスポート処理が5秒以内に正常終了すること",
    "testData": "ファイル名=README.md, エディション=lite",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-059",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "処理速度およびブラウザ描画負荷の抑制",
      "small": "DOM監視デバウンス制御"
    },
    "testCase": "DOM監視におけるデバウンス制御および描画負荷抑制の検証",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-008",
    "scenario": "GitHubのMarkdownファイル閲覧画面でDOMの連続更新が発生した際、MutationObserverによる500msのデバウンス制御が正しく機能し、CPU高負荷や描画遅延が発生しないことを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのMarkdownファイル閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "画面上の要素変更を発生させる操作（動的なコンテンツ読み込みやスクロール）を連続して短時間（100ms間隔）で実行する",
        "expectedResult": "MutationObserverによるDOM監視が500msのデバウンス制御を行って連続呼び出しを抑制し、描画遅延やブラウザのCPU高負荷が発生しないこと"
      }
    ],
    "expectedResult": "DOMの連続変更に対してデバウンス制御（500ms）が効き、描画負荷が適切に抑制されること",
    "testData": "DOM変更発生間隔=100ms（連続10回発生）",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-060",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "処理時間検証"
    },
    "testCase": "エクスポート処理時間および接続テスト処理時間のレスポンス検証",
    "relatedRequirement": "FR-002, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-022",
    "scenario": "設定画面での接続テスト実行時および閲覧画面でのエクスポート処理実行時のレスポンス時間が実用的な範囲で遅延なく返却されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能の設定画面およびGitHubのMarkdown閲覧画面にアクセス可能な状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'カスタム' を選択し、「カスタムリポジトリURL」に 'https://github.com/testuser/testrepo' を入力後、「接続テスト」ボタンをクリックする",
        "expectedResult": "過度な遅延なく結果メッセージが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "エクスポート処理が滞りなく進行し、指定されたエディションに応じたHTMLファイルが速やかにダウンロード出力されること"
      }
    ],
    "expectedResult": "接続テストおよびエクスポート処理がストレスなく迅速に応答・完了すること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/testuser/testrepo, エディション=standard",
    "acceptanceCriteria": "各処理が遅延なく実行され、ネットワーク遅延を除き目標時間内で応答すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-061",
    "category": "性能",
    "functionCategory": {
      "large": "Markdownファイル閲覧画面でのエクスポートボタン挿入",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "MutationObserver描画負荷"
    },
    "testCase": "MutationObserver制御・描画負荷検証",
    "relatedRequirement": "FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-023",
    "scenario": "Markdown閲覧画面上のアクションバー監視において、MutationObserverが不要な再描画を引き起こさず描画負荷を抑制していることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHub上で「.md」拡張子のファイルを表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "ファイルアクションバー周辺のDOMが動的に変化する操作を行う",
        "expectedResult": "「かんたんMDエクスポート」ボタンが重複挿入されることなく、CPUやメモリへの不要な高負荷をかけることなくボタン描画が完了すること"
      }
    ],
    "expectedResult": "DOM変更検知時に適切な制御が行われ、描画負荷が増大しないこと",
    "testData": "対象画面=Markdownファイル閲覧画面",
    "acceptanceCriteria": "DOM監視処理による不必要な描画遅延やCPU負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-062",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "単一HTML生成処理時間"
    },
    "testCase": "エクスポート処理および単一HTML生成処理時間検証",
    "relatedRequirement": "NFR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-031",
    "scenario": "フェッチおよびBase64エンコードを含む単一HTML生成処理全体が目標パフォーマンス（5秒以内）を満たすかを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "複数の画像を含むMarkdownファイル閲覧画面が開かれていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "「エクスポートエディションの選択」ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「エクスポート」ボタンをクリックし、完了までの所要時間を計測する",
        "expectedResult": "ネットワーク通信時間を除く内部のフェッチ・Base64変換・HTML合成処理が5秒以内に完了し、HTMLファイルが保存されること"
      }
    ],
    "expectedResult": "単一HTML生成およびダウンロード開始までの内部処理時間が5秒以内であること",
    "testData": "ファイル名=doc_with_images.md, エディション=full",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-063",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "デバウンス制御負荷抑制"
    },
    "testCase": "MutationObserverデバウンス制御およびブラウザ描画負荷検証",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-032",
    "scenario": "画面内要素の更新に伴うMutationObserverのデバウンス処理が正常に機能し、メインスレッドのブロックや画面フリーズが発生しないことを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "Markdown閲覧画面が表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHubの画面内でツリービューの連続開閉等を行い、DOMツリーの変更を急激に発生させる",
        "expectedResult": "500msのデバウンス制御により初期化処理（init）の過度な頻発が防止され、ブラウザの描画レスポンスが滑らかに維持されること"
      }
    ],
    "expectedResult": "デバウンス制御（500ms）によって描画負荷が抑制され、画面動作の低下が生じないこと",
    "testData": "操作=ファイルツリー連続開閉",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-064",
    "category": "性能",
    "functionCategory": {
      "large": "Chrome拡張機能パッケージの自動ビルド・リリース機能",
      "medium": "CI/CDビルド・リリース実行パフォーマンス",
      "small": "自動パッケージング速度"
    },
    "testCase": "自動パッケージングパイプラインの処理速度検証",
    "relatedRequirement": "NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-039",
    "scenario": "バージョンタグのプッシュを契機とするGitHub Actionsワークフローが起動し、自動パッケージング・リリース作成処理が円滑かつ迅速に完了することを確認する。",
    "actor": "開発・運用担当者",
    "precondition": "リポジトリに適切なワークフローファイル（release-extension.yml）が配置されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "",
        "action": "Gitリポジトリにバージョンタグ 'v1.0.0' をプッシュし、GitHub Actionsの実行状況を確認する",
        "expectedResult": "ワークフロー（Release Chrome Extension）が起動し、manifest.jsonのバージョン補正・ZIP圧縮・GitHub Release作成が滞りなく完了すること"
      }
    ],
    "expectedResult": "CI/CDパイプラインがエラーなく迅速に終了し、リリースアセット（github-to-kantan-markdown.zip）が生成されること",
    "testData": "タグ名=v1.0.0",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること",
    "priority": "中",
    "testType": "自動"
  },
  {
    "id": "ST-065",
    "category": "性能",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "カスタムテンプレートURL解決レスポンス",
      "small": "URL解決と接続応答"
    },
    "testCase": "カスタムテンプレートURL解決と接続応答速度の検証",
    "relatedRequirement": "NFR-007",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-040",
    "scenario": "カスタムリポジトリURL指定時のドメイン・パス解決およびテンプレート確認リクエストがスムーズに応答することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'カスタム' を選択し、「カスタムリポジトリURL」に 'https://github.com/myorg/mytemplate' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "URL解決が行われ、『https://myorg.github.io/mytemplate/dist/ktm-lite.html』への接続検証結果メッセージが速やかに表示されること"
      }
    ],
    "expectedResult": "カスタムURL解決と接続テスト応答が遅延なく正常に完了すること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/myorg/mytemplate, エディション=lite",
    "acceptanceCriteria": "公式/カスタムURLおよび複数エディションへの対応において遅延なくURL解決と接続確認が行われること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-066",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "エクスポート処理速度確認"
    },
    "testCase": "エクスポート処理および単一HTML生成速度確認",
    "relatedRequirement": "NFR-001, FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-046",
    "scenario": "標準的なMarkdownファイル閲覧画面にて、エクスポート実行から単一HTMLファイルの生成・ダウンロード完了までの応答時間を測定・確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのMarkdown閲覧画面（.md）を表示中であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「エクスポート」ボタンをクリックする",
        "expectedResult": "ボタンが「エクスポート中...」に変化し、5秒以内に処理が終了してファイルダウンロードが行われること"
      }
    ],
    "expectedResult": "内部データフェッチ・変換・HTML合成が5秒以内に完了すること",
    "testData": "ファイル=README.md, エディション=lite",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-067",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "レスポンス・処理速度",
      "small": "大量データ処理安定性"
    },
    "testCase": "大量データ・多数添付ファイル処理時の動作安定性確認",
    "relatedRequirement": "NFR-001, FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-047",
    "scenario": "多数の画像および添付ファイルを含む大きなMarkdownファイルにおいて、非同期並列処理によるデータ取得とBase64変換が安定して完了することを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "多数の画像（20件以上）が含まれるMarkdown閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "多数の添付ファイルの並列フェッチとBase64埋め込みが正常に行われ、メモリエラー等を発生させずにネットワーク遅延を除く5秒以内に完了すること"
      }
    ],
    "expectedResult": "大量添付ファイルが存在する場合でもメモリ障害を起こさず目標時間内で安定して単一HTMLが生成されること",
    "testData": "添付ファイル数=20件, エディション=full",
    "acceptanceCriteria": "Raw Markdownおよび画像・添付ファイルのフェッチ・Base64変換・HTML合成処理を5秒以内に完了すること（ネットワーク遅延を除く）",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-068",
    "category": "性能",
    "functionCategory": {
      "large": "設定情報およびカスタムリポジトリURL管理機能",
      "medium": "接続テスト・設定処理速度",
      "small": "接続テストレスポンス"
    },
    "testCase": "カスタムリポジトリURL接続テストのレスポンス確認",
    "relatedRequirement": "FR-003, FR-004, NFR-007",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-048",
    "scenario": "設定画面において「接続テスト」ボタンをクリックした際、権限リクエスト確認からHTTPレスポンス評価までの表示が遅延なく行われることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'カスタム' を選択し、「カスタムリポジトリURL」に 'https://github.com/validuser/validrepo' を入力後、「接続テスト」ボタンをクリックする",
        "expectedResult": "「接続テスト中...」のメッセージが即座に表示され、続いて「接続成功：かんたんMarkdownテンプレートを検出しました。」が迅速に表示されること"
      }
    ],
    "expectedResult": "接続テスト実行時に待たされることなく速やかに結果が表示されること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/validuser/validrepo, エディション=lite",
    "acceptanceCriteria": "接続テスト処理がユーザーを無駄に待たせることなく短時間で応答すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-069",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "描画パフォーマンス"
    },
    "testCase": "MutationObserverデバウンス制御と描画パフォーマンス確認",
    "relatedRequirement": "NFR-002, NFR-003, FR-001",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-049",
    "scenario": "GitHubのSPA遷移およびReactコンポーネント再描画が頻発する状況において、500msのデバウンス制御によりボタンが重複なく正確に挿入され、描画性能が維持されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHub上でSPA遷移可能な状態（リポジトリファイルツリー内）であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "SPA遷移により別の「.md」ファイル画面へ切り替える",
        "expectedResult": "URL変化を検知してデバウンス（500ms）後に「かんたんMDエクスポート」ボタンが1つだけ重複なく再挿入され、画面のフレームレートが低下しないこと"
      }
    ],
    "expectedResult": "SPA遷移時においても画面負荷を抑えつつ99.9%以上の確率で重複なくボタンが正常挿入されること",
    "testData": "遷移元=README.md, 遷移先=DOC.md",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-070",
    "category": "性能",
    "functionCategory": {
      "large": "Chrome拡張機能パッケージの自動ビルド・リリース機能",
      "medium": "CI/CDパイプライン処理速度",
      "small": "リリースワークフロー時間"
    },
    "testCase": "自動パッケージングおよびリリースワークフローの処理時間確認",
    "relatedRequirement": "FR-005, NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-050",
    "scenario": "GitHub Actionsにおけるリリース自動化ワークフローが過度な処理遅延を起こすことなく一定時間内で自動完了することを確認する。",
    "actor": "開発・運用担当者",
    "precondition": "タグのプッシュ権限を有していること。",
    "steps": [
      {
        "order": 1,
        "screen": "",
        "action": "リポジトリに『v1.1.0』タグをプッシュし、GitHub Actions実行ログの所要時間を確認する",
        "expectedResult": "すべてのビルド・書き換え・ZIP圧縮・GitHub Release発行処理が数分以内の適切な時間でエラーなく完了すること"
      }
    ],
    "expectedResult": "自動リリースワークフローが正常かつスムーズに完了すること",
    "testData": "REF_NAME=v1.1.0",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること",
    "priority": "中",
    "testType": "自動"
  },
  {
    "id": "ST-071",
    "category": "性能",
    "functionCategory": {
      "large": "かんたんMarkdownデータ取得およびエクスポート機能",
      "medium": "DOM監視・ブラウザ負荷抑制",
      "small": "描画性能確認"
    },
    "testCase": "MutationObserverデバウンス制御および描画性能確認",
    "relatedRequirement": "NFR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-057",
    "scenario": "GitHub画面内のDOM要素監視がブラウザのレスポンスに影響を与えないよう、500msのデバウンス機能が正確に稼働していることを検証する。",
    "actor": "GitHubユーザー",
    "precondition": "GitHubのMarkdown閲覧画面が開かれていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "DOMツリーに多数の変更を短時間で加える操作を行う",
        "expectedResult": "タイマーデバウンス(500ms)により毎回のDOM変更ごとの重い初期化実行が回避され、描画遅延やブラウザの操作引っかかりが発生しないこと"
      }
    ],
    "expectedResult": "DOM監視によるデバウンス制御が意図通り機能し、描画性能が維持されること",
    "testData": "監視対象=document",
    "acceptanceCriteria": "MutationObserverによるDOM監視において500msのデバウンス制御を行い、ブラウザの描画遅延やCPU高負荷を発生させないこと",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-072",
    "category": "障害",
    "functionCategory": {
      "large": "拡張機能管理",
      "medium": "通信・データフェッチ処理",
      "small": "ネットワーク断ハンドリング"
    },
    "testCase": "ネットワーク断・外部通信エラーハンドリング確認",
    "relatedRequirement": "FR-002, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-009",
    "scenario": "オフライン（ネットワーク非接続）状態でエクスポート処理および接続テストを実行し、適切に通信エラーがキャッチされエラーアラートおよびメッセージが表示されるかを確認する。",
    "actor": "一般ユーザー",
    "precondition": "拡張機能が正常にインストールされており、ネットワーク接続を切断した状態（オフライン状態）であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "エクスポート処理が失敗し、「エラーが発生しました」または Raw Markdownデータ取得失敗を示すアラートダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」に 'custom' を選択し、「カスタムリポジトリURL」に 'https://github.com/example/repo' を入力して「接続テスト」ボタンをクリックする",
        "expectedResult": "「接続失敗：サーバーへの疎通エラーが発生しました。」のエラーメッセージが赤文字で表示されること"
      }
    ],
    "expectedResult": "ネットワーク不通時において、システムがクラッシュすることなく明確なエラーメッセージを表示し処理を安全に終了すること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/example/repo",
    "acceptanceCriteria": "外部通信エラー発生時に適切なエラーダイアログまたは通知メッセージを表示し、無応答や異常終了が発生しないこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-073",
    "category": "障害",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理機能",
      "small": "オプショナル権限拒否ハンドリング"
    },
    "testCase": "オプショナル権限拒否時の動作確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-010",
    "scenario": "カスタムリポジトリURLの接続テスト時、ブラウザが表示するホスト権限リクエストポップアップに対してユーザーが権限要求を拒否した場合の挙動を確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面が開かれており、まだ対象ドメインのオプショナル権限が許可されていない状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」に 'custom' を選択し、「カスタムリポジトリURL」に 'https://github.com/user/custom-template' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "Chromeブラウザの権限要求ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "権限要求ポップアップで「ブロック」または「キャンセル」を選択し権限を拒否する",
        "expectedResult": "「接続失敗：拡張機能へのホスト権限の承認が拒否されました。」の警告メッセージが表示され、接続テストが安全に中断されること"
      }
    ],
    "expectedResult": "オプショナル権限が拒否された場合に例外処理が行われ、エラーメッセージが画面に正しく反映されること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/user/custom-template",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に従い、オプショナル権限拒否時でもアプリがクラッシュせず拒否理由をユーザーに明示すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-074",
    "category": "障害",
    "functionCategory": {
      "large": "拡張機能管理",
      "medium": "フェッチおよびエラーハンドリング",
      "small": "外部リソース通信失敗検証"
    },
    "testCase": "外部フェッチエラーハンドリング",
    "relatedRequirement": "FR-002, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-024",
    "scenario": "テンプレートHTMLや画像等の外部リソース取得時にHTTP 404や500エラーが発生した場合に、バックグラウンドスクリプトが適切にエラーを検知してUIへ通知することを確認する。",
    "actor": "一般ユーザー",
    "precondition": "存在しないカスタムリポジトリURLまたは削除されたテンプレートURLが設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、モダールダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "バックグラウンドスクリプトからのエラー応答を受信し、「エクスポートに失敗しました: テンプレート読み込み失敗: ...」のアラートが表示されること"
      }
    ],
    "expectedResult": "外部HTTPエラー発生時にバックグラウンドスクリプトでtry-catchが正常に働き、ユーザーに適切な失敗ダイアログを表示すること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/nonexistent-user/nonexistent-repo",
    "acceptanceCriteria": "HTTPエラーステータス検知時に例外をキャッチし、呼び出し元の画面にエラー理由を含むメッセージを返すこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-075",
    "category": "障害",
    "functionCategory": {
      "large": "設定管理",
      "medium": "アクセス制限・権限制御",
      "small": "アクセス権限未付与時の挙動確認"
    },
    "testCase": "オプショナル権限拒否時の挙動",
    "relatedRequirement": "FR-002, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-025",
    "scenario": "オプショナルホスト権限が付与されていない状態でカスタムリポジトリへのフェッチを伴う操作を行った際、適切なアクセスエラーのメッセージが表示されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "カスタムリポジトリURLが設定されているが、当該ホストへの権限（chrome.permissions）が許可されていない状態。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」に 'https://github.com/private-org/private-repo' が入力されている状態で「接続テスト」ボタンをクリックする",
        "expectedResult": "権限要求に対して拒否を選択した場合、「接続失敗：拡張機能へのホスト権限の承認が拒否されました。」と表示されること"
      }
    ],
    "expectedResult": "アクセス権限がないリソースへの接続時に、システムエラーに落とし込まず制御されたエラーメッセージが出力されること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/private-org/private-repo",
    "acceptanceCriteria": "権限拒否時のエラーハンドリングが実装され、画面上に期待通りの警告文言が出力されること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-076",
    "category": "障害",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限リカバリ処理",
      "small": "複合障害時リカバリ確認"
    },
    "testCase": "オプショナル権限拒否およびネットワーク障害時のリカバリ検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-035",
    "scenario": "権限拒否やネットワーク断が発生した後に、ユーザーが再度正常なネットワーク環境や権限付与を行った際、システムが正常状態に即座に復帰できるかを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "直前の操作で権限拒否またはネットワークエラーが発生した状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "ネットワークを復旧させた上で「接続テスト」ボタンをクリックし、権限要求ポップアップで「許可」を選択する",
        "expectedResult": "「接続成功：かんたんMarkdownテンプレートを検出しました。」の成功メッセージが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、「エクスポート」を実行する",
        "expectedResult": "エラーが発生せず正常にHTMLファイルがダウンロードされること"
      }
    ],
    "expectedResult": "障害原因（ネットワーク断や権限未付与）を取り除いた後、再起動なしで正常機能へ復帰できること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/tatesuke/KanTanMarkdown",
    "acceptanceCriteria": "障害解消後の再実行において、エラー状態が残留せずに正常系フローへ復帰すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-077",
    "category": "障害",
    "functionCategory": {
      "large": "設定管理",
      "medium": "外部接続テスト",
      "small": "非疎通エラーハンドリング"
    },
    "testCase": "カスタムリポジトリ非疎通時のハンドリング",
    "relatedRequirement": "NFR-007, FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-041",
    "scenario": "指定されたカスタムリポジトリのGitHub Pagesが有効化されていない（404 Not Found等の非疎通）場合に、「接続テスト」で適切なエラーメッセージが出力されるかを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面が表示されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'custom' を選択し、「カスタムリポジトリURL」に GitHub Pages が未公開のリポジトリURL 'https://github.com/dummy/unpublished-repo' を入力する",
        "expectedResult": "「接続テスト」ボタンが有効化されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「接続テスト」ボタンをクリックする",
        "expectedResult": "「接続テストエラー：テンプレートが見つかりません。GitHub Pagesの公開状態を確認してください。」というエラーメッセージが赤文字で表示されること"
      }
    ],
    "expectedResult": "テンプレートファイル非存在時に正確なエラー事由がユーザーにフィードバックされること",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/dummy/unpublished-repo",
    "acceptanceCriteria": "テンプレート疎通確認フェッチにおいてHTTP非200系レスポンスを検知し、適切なエラー表示を行うこと",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-078",
    "category": "障害",
    "functionCategory": {
      "large": "ビルド・リリース管理",
      "medium": "CI/CDパイプライン",
      "small": "自動ビルド異常系検証"
    },
    "testCase": "ビルドスクリプト・パーミッション異常時の挙動",
    "relatedRequirement": "NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-042",
    "scenario": "不正な形式のバージョンタグ（数値を含まない不当な文字列タグなど）をプッシュした際、CI/CDパイプラインが不当なファイルをリリースせずに適切に失敗またはフォールバックすることを確認する。",
    "actor": "開発者 / CIシステム",
    "precondition": "GitHub Actionsワークフローが設定されているリポジトリであること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub ワークフロー実行環境",
        "action": "正規のセマンティックバジョニングに合致しないタグ 'v_invalid_tag' を作成しリモートリポジトリにプッシュする",
        "expectedResult": "ワークフロー 'Release Chrome Extension' が起動するが、バージョン抽出ステップにて正規化処理が行われるか、エラー検知により後続のリリース作成が制御されること"
      }
    ],
    "expectedResult": "不当なタグプッシュに対して壊れた manifest.json を持つパッケージがリリースされないこと",
    "testData": "タグ名=v_invalid_tag",
    "acceptanceCriteria": "異常なタグ入力時にもスクリプトが安全に動作し、正しくない構成のリリースzipが出力・公開されないこと",
    "priority": "中",
    "testType": "自動"
  },
  {
    "id": "ST-079",
    "category": "障害",
    "functionCategory": {
      "large": "拡張機能管理",
      "medium": "リカバリ処理",
      "small": "通信障害リカバリ検証"
    },
    "testCase": "ネットワーク通信エラー・リソース不在時のエラーリカバリ確認",
    "relatedRequirement": "FR-002, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-058",
    "scenario": "Raw Markdown取得対象のファイル削除やネットワーク一斉遮断など重大な障害が発生した場合、UIのボタンが「エクスポート中...」のままフリーズせず、元の状態に復旧することを確認する。",
    "actor": "一般ユーザー",
    "precondition": "Markdownファイル閲覧画面でエクスポートボタンがクリック可能状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、ダイアログで「エクスポート」を選択した直後に開発者ツール等でネットワークをオフラインにする",
        "expectedResult": "エラーメッセージのアラートダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "アラートダイアログの「OK」ボタンをクリックして閉じる",
        "expectedResult": "「かんたんMDエクスポート」ボタンの非活性状態が解除され、ラベルが「かんたんMarkdownへエクスポート」（元のテキスト）に戻り、再操作が可能になること"
      }
    ],
    "expectedResult": "障害発生時にUI状態（ボタンの活性/非活性およびラベル）が適切にロールバック・リカバリされること",
    "testData": "ネットワーク状態=非接続（オフライン）",
    "acceptanceCriteria": "非同期処理失敗時に finally ブロック等でボタンのディザブル状態およびラベルが正常に復元されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-080",
    "category": "障害",
    "functionCategory": {
      "large": "設定管理",
      "medium": "入力バリデーション",
      "small": "形式エラーリカバリ確認"
    },
    "testCase": "権限拒否・入力フォーマットエラー時のリカバリ確認",
    "relatedRequirement": "FR-004, NFR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-059",
    "scenario": "設定画面で不正なURL形式を入力して保存またはテストを試みた際、エラーにより保存処理が阻止され、正しいURLを入力し直すことで正常保存できるかを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面が開かれていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」に 'custom' を選択し、「カスタムリポジトリURL」に 不正な形式の文字列 'invalid-url-format' を入力して「保存」ボタンをクリックする",
        "expectedResult": "「カスタムリポジトリURLの形式が正しくありません。」と警告ダイアログ（alert）が表示され、設定情報の保存および画面クローズが行われないこと"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」に 正しいURL 'https://github.com/tatesuke/KanTanMarkdown' を入力し、「保存」ボタンをクリックする",
        "expectedResult": "トースト通知が表示され、設定情報が正常に保存されて1秒後に設定画面が閉じること"
      }
    ],
    "expectedResult": "入力フォーマットエラーが発生しても不正データは保存されず、正しい修正入力によって即座にリカバリ可能であること",
    "testData": "不正URL=invalid-url-format, 正常URL=https://github.com/tatesuke/KanTanMarkdown",
    "acceptanceCriteria": "正規表現によるバリデーションガードが機能し、エラー時の入力補助・リカバリが円滑に行えること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-081",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理",
      "small": "Manifest V3最小権限検証"
    },
    "testCase": "Manifest V3規約準拠および最小権限の検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-011",
    "scenario": "設定画面において不要なパーミッションを保持せず、必要時にのみオプショナル権限を動的要求することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能がインストールされており、オプショナル権限が付与されていない状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで 'カスタム' を選択し、「カスタムリポジトリURL」フィールドに 'https://github.com/myuser/myrepo' を入力して「接続テスト」ボタンをクリックする",
        "expectedResult": "chrome.permissions APIが呼び出され、ホスト権限の要求ダイアログが表示されること"
      }
    ],
    "expectedResult": "不要な常時権限を持たず、オプショナル権限要求のみで最小権限動作が実現されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/myuser/myrepo, エディション=lite",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-082",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・変換",
      "small": "XSS防止検証"
    },
    "testCase": "XSS（クロスサイトスクリプティング）防止構造の検証",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-012",
    "scenario": "Markdown内にスクリプトタグが含まれる場合でも、エクスポート出力HTML内で特殊文字がサニタイズ/エスケープ処理されることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "スクリプトタグ `<script>alert('XSS')</script>` を含むMarkdownファイルを閲覧画面で表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "HTMLファイルがダウンロードされ、textarea内に '&lt;script&gt;alert('XSS')&lt;/script&gt;' としてエスケープ埋め込みされていること"
      }
    ],
    "expectedResult": "ダウンロードされたHTMLを開いた際、スクリプトが実行されず安全に埋め込まれていること。",
    "testData": "Markdownテキスト=<script>alert('XSS')</script>, エディション=lite",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-083",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理",
      "small": "権限最小化検証"
    },
    "testCase": "権限最小化・Manifest V3検証",
    "relatedRequirement": "FR-003",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-026",
    "scenario": "設定画面での操作時、manifest.jsonのpermissions宣言が最小限に抑えられていることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能がChromeに読み込まれている状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで '公式' を選択し、「保存」ボタンをクリックする",
        "expectedResult": "広域ホスト権限を要求せずにchrome.storage.localへの保存処理が完了し、トースト通知が表示されること"
      }
    ],
    "expectedResult": "公式リポジトリ利用時には一切の外部追加権限を要求せず正常動作すること。",
    "testData": "リポジトリタイプ=original, エディション=standard",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、追加権限なしでストレージ保存・読み込みが行われること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-084",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・変換",
      "small": "特殊文字エスケープ処理検証"
    },
    "testCase": "特殊文字エスケープ処理",
    "relatedRequirement": "FR-002",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-027",
    "scenario": "HTMLタグや特殊文字（&, <, >）およびダブルクォーテーションを含む添付ファイルキーが安全に置換・エスケープされることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "特殊文字（&, <, >）を含む画像ファイル名やMarkdownテキストが存在する閲覧画面を開いていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、エクスポートエディションの選択ダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "生成された単一HTML内のtextareaタグおよびscriptタグ内で、'&'が'&amp;'、'<'が'&lt;'、'>'が'&gt;'にエスケープされて出力されること"
      }
    ],
    "expectedResult": "エスケープ漏れによるHTML構造の破損やスクリプト実行が発生しないこと。",
    "testData": "添付ファイル名=test&<>.png, Markdown内容=# Title & Test <script>",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-085",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理",
      "small": "オプショナル権限要求制御検証"
    },
    "testCase": "Manifest V3規約準拠およびオプショナル権限要求制御検証",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-033",
    "scenario": "カスタムリポジトリURLへの接続テスト時にオプショナル権限（chrome.permissions.request）が呼び出され、権限の確認と制御が行われることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面が開かれており、対象オリジンのホスト権限が未許可の状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで 'カスタム' を選択し、「カスタムリポジトリURL」フィールドに 'https://github.com/testuser/testrepo' を入力して「接続テスト」ボタンをクリックする",
        "expectedResult": "chrome.permissions.containsによる権限確認の後、未許可のため権限要求ポップアップが起動すること"
      }
    ],
    "expectedResult": "Manifest V3仕様に則り、動的にオプショナル権限のリクエスト制御が実行されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/testuser/testrepo, エディション=lite",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-086",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・変換",
      "small": "HTMLテンプレート埋め込みエスケープ検証"
    },
    "testCase": "HTMLテンプレート埋め込み時の特殊文字エスケープ検証",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-034",
    "scenario": "添付ファイルのDataURLやファイル名がHTMLのscript要素内に埋め込まれる際、閉じタグがエスケープされることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "ファイル名や添付データ内に '</script>' 文字列を含むテストデータが用意されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "生成されたHTML内で '</script>' が '<\\/script>' に置換され、script要素が誤って閉じられないこと"
      }
    ],
    "expectedResult": "スクリプトタグのエスケープ処理により、HTML構文解析エラーやスクリプト挿入が防がれていること。",
    "testData": "添付ファイル名=sample</script>.png, エディション=full",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-087",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "動的権限管理",
      "small": "動的権限要求確認"
    },
    "testCase": "chrome.permissionsによる動的権限要求確認",
    "relatedRequirement": "NFR-007",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-043",
    "scenario": "ユーザーがオプショナル権限要求ダイアログで「拒否」を選択した場合の安全なハンドリングを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面で「リポジトリタイプ」に 'カスタム' を選択していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'https://github.com/customowner/customrepo' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "権限許可ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "権限許可ダイアログで '拒否' を選択する",
        "expectedResult": "画面上の結果表示エリアに '接続失敗：拡張機能へのホスト権限の承認が拒否されました。' とエラーメッセージが表示されること"
      }
    ],
    "expectedResult": "権限拒否時にもクラッシュせず、適切なエラーメッセージが表示されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/customowner/customrepo, エディション=standard",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-088",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "アクセス制御",
      "small": "オプショナルホスト権限アクセス制御確認"
    },
    "testCase": "オプショナルホスト権限のリクエストとアクセス制御確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-051",
    "scenario": "権限が正常に許可された場合のみ、対象GitHub Pagesのドメインに対して通信が実行されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面にてカスタムリポジトリURLを入力していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'https://github.com/validuser/validrepo' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "権限確認ダイアログが表示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "権限許可ダイアログで '許可' を選択する",
        "expectedResult": "https://validuser.github.io/validrepo/dist/ktm-lite.html へのHEADリクエストが実行され、'接続成功：かんたんMarkdownテンプレートを検出しました。' と表示されること"
      }
    ],
    "expectedResult": "許可された特定のホストオリジンにのみアクセスが限定され、通信が成功すること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/validuser/validrepo, エディション=lite",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、オプション機能の外部接続にはオプショナル権限リクエスト（chrome.permissions）を使用すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-089",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理",
      "small": "Manifest V3最小化確認"
    },
    "testCase": "Manifest V3仕様に準拠した権限の最小化確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-052",
    "scenario": "chrome.storage.localなどのローカルストレージAPI利用時に不要なWebアクセス権限が使用されていないことを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を表示している状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「エディション」ラジオボタンで 'Full (ktm-full.html)' を選択し、「保存」ボタンをクリックする",
        "expectedResult": "ネットワーク通信を伴わずにchrome.storage.localの設定値更新が行われ、トースト通知が表示された後設定画面が閉じること"
      }
    ],
    "expectedResult": "設定値のストレージ保存において余分なネットワーク権限やホスト権限の消費が発生しないこと。",
    "testData": "リポジトリタイプ=original, エディション=full",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、権限の最小化が維持されること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-090",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "エクスポート機能",
      "medium": "データ処理・変換",
      "small": "Markdown・添付ファイル情報エスケープ確認"
    },
    "testCase": "HTMLテンプレート結合時のMarkdown・添付ファイル情報エスケープ確認",
    "relatedRequirement": "NFR-005",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-053",
    "scenario": "Markdown本文中にHTMLエンティティやスクリプトタグが含まれる場合、テキストエリアへの埋め込み時にサニタイズ処理が行われることを確認する。",
    "actor": "GitHubユーザー",
    "precondition": "'<div class=\"test\">' や '&copy;' 等のHTML表記を含むMarkdownページを表示していること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックし、表示されたモーダルダイアログで「エクスポート」ボタンをクリックする",
        "expectedResult": "ダウンロードされたHTML内の '<textarea id=\"editor\">' タグ内に '&lt;div class=\"test\"&gt;' および '&amp;copy;' として正しくエスケープ出力されること"
      }
    ],
    "expectedResult": "かんたんMarkdownのHTML構造を破綻させることなく、安全にMarkdownテキストが埋め込まれていること。",
    "testData": "Markdown内容=<div class=\"test\">Text & Test</div>, エディション=standard",
    "acceptanceCriteria": "HTMLテンプレート内へのMarkdownテキストおよび添付ファイル情報の埋め込み時、特殊文字の確実なエスケープ処理を実施すること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-091",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "入力値検証",
      "small": "不正スキーム遮断確認"
    },
    "testCase": "カスタムリポジトリURLのバリデーションおよび不正スキーム遮断確認",
    "relatedRequirement": "BR-005",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-054",
    "scenario": "「カスタムリポジトリURL」にjavascript:等の不正スキームや正規表現パターンに合致しない文字列が入力された場合に接続テストおよび保存が遮断されることを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を表示し、リポジトリタイプで「カスタム」を選択していること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'javascript:alert(1)' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "結果表示エリアに 'エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)' と表示され、フェッチ処理が実行されないこと"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「保存」ボタンをクリックする",
        "expectedResult": "アラートダイアログで 'カスタムリポジトリURLの形式が正しくありません。' と表示され、ストレージへの保存処理が中断されること"
      }
    ],
    "expectedResult": "不正なURLスキームやフォーマットの入力が確実に遮断され、セキュリティリスクが排除されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=javascript:alert(1), エディション=lite",
    "acceptanceCriteria": "GitHubリポジトリ形式（https://github.com/ユーザー名/リポジトリ名）を満たしているかのフォーマット検証を行い、不正入力を遮断すること",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-092",
    "category": "セキュリティ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "権限管理",
      "small": "最小権限動作確認"
    },
    "testCase": "オプショナル権限要求および最小権限動作確認",
    "relatedRequirement": "NFR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-060",
    "scenario": "拡張機能全体において、Manifest V3で定義された必要最小限の権限で基本機能が動作することを確認する。",
    "actor": "拡張機能利用者",
    "precondition": "拡張機能が新規インストールされた初期状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「エディション」ラジオボタンで 'Lite (ktm-lite.html)' を選択し、「保存」ボタンをクリックする",
        "expectedResult": "追加の権限プロンプトを表示することなく、設定が保存されトースト表示が行われること"
      }
    ],
    "expectedResult": "基本機能が追加パーミッションを要求せず最小権限で正常完了すること。",
    "testData": "リポジトリタイプ=original, エディション=lite",
    "acceptanceCriteria": "Chrome Extension Manifest V3仕様に完全準拠し、権限の最小化が達成されていること",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-093",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "エクスポート管理",
      "medium": "エクスポート運用フロー",
      "small": "標準エクスポートE2E"
    },
    "testCase": "標準設定におけるMarkdownファイル閲覧からかんたんMarkdownエクスポートまでの一連運用フロー検証",
    "relatedRequirement": "BR-001, BR-002, BR-004",
    "relatedScreens": [
      "SCR-001"
    ],
    "relatedViewpoint": "STV-L3-013",
    "scenario": "ユーザーがGitHubのMarkdownファイル閲覧画面で「かんたんMDエクスポート」ボタンをクリックし、エディションを選択して変換HTMLファイルをダウンロードする一連の運用フローを確認する。",
    "actor": "一般ユーザー",
    "precondition": "Google Chrome拡張機能が有効化されており、設定画面のデフォルトエディションがliteに設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上で拡張子「.md」のファイル閲覧画面を表示する",
        "expectedResult": "DOMの変更を検知し、ファイルアクションバー内に「かんたんMDエクスポート」ボタンが挿入・表示されること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "モーダルダイアログが表示され、ドロップダウン「ktm-edition-select」に初期値「Lite (ktm-lite.html)」が選択されていること"
      },
      {
        "order": 3,
        "screen": "Markdownファイル閲覧画面",
        "action": "モーダルダイアログ内の「エクスポート」ボタンをクリックする",
        "expectedResult": "ボタンの表示が「エクスポート中...」に変化し、処理完了後に変換されたHTMLファイルがダウンロードされること"
      }
    ],
    "expectedResult": "エクスポート処理が正常に完了し、選択したエディション（Lite）に基づくQuine型単一HTMLファイルがローカルに保存されること。",
    "testData": "edition=lite, ファイル名=README.md",
    "acceptanceCriteria": "Raw MarkdownデータとテンプレートHTMLが結合され、エラーなく単一HTMLファイルが生成・ダウンロードされること。",
    "priority": "高",
    "testType": "手動"
  },
  {
    "id": "ST-094",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "カスタム設定運用フロー",
      "small": "カスタムリポジトリ接続確認E2E"
    },
    "testCase": "設定画面でのカスタムリポジトリURLの入力・接続テスト・設定保存および画面クローズの一連運用フロー検証",
    "relatedRequirement": "BR-003, BR-005, FR-004",
    "relatedScreens": [
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-014",
    "scenario": "ユーザーが設定画面でリポジトリタイプを「カスタム」に切り替え、カスタムリポジトリURLを入力後に接続テストを実施し、正常であることを確認した上で設定を保存する運用フローを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "Chrome拡張機能の設定画面が開かれていること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」ラジオボタンで「カスタム」を選択する",
        "expectedResult": "「カスタムリポジトリURL」テキストボックスおよび「接続テスト」ボタンが有効化（入力可能）されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「カスタムリポジトリURL」フィールドに 'https://github.com/myuser/myrepo' を入力し、「接続テスト」ボタンをクリックする",
        "expectedResult": "テスト結果表示エリア（testResult）に「接続成功：かんたんMarkdownテンプレートを検出しました。」という成功メッセージが表示されること"
      },
      {
        "order": 3,
        "screen": "設定画面",
        "action": "「エディション」ラジオボタンで「standard」を選択し、「保存」ボタンをクリックする",
        "expectedResult": "トースト通知が表示され、約1秒後に設定画面が自動的に閉じられること"
      }
    ],
    "expectedResult": "カスタムリポジトリURLおよびエディションの設定情報がchrome.storage.localに正常に保存されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/myuser/myrepo, エディション=standard",
    "acceptanceCriteria": "設定保存後に設定情報がストレージに保持され、トースト表示後に画面が閉じること。",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-095",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "自動リリース管理",
      "medium": "CI/CDワークフロー運用",
      "small": "自動リリース実行E2E"
    },
    "testCase": "バージョンタグプッシュを起点とする自動パッケージングおよびGitHub Release作成の運用フロー検証",
    "relatedRequirement": "FR-005, NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-015",
    "scenario": "開発者がリポジトリに対してバージョンタグ（例: v1.0.0）をプッシュし、GitHub Actionsが自動起動してmanifest.jsonのバージョン補正、ZIPアーカイブ作成、GitHub Release発行までの一連フローを実行する。",
    "actor": "開発者",
    "precondition": "リポジトリのGitHub Actionsワークフロー（release-extension.yml）が設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHubリポジトリ",
        "action": "Gitコマンドでバージョンタグ 'v1.0.0' を作成し、GitHubリポジトリにプッシュする",
        "expectedResult": "GitHub Actionsの「Release Chrome Extension」ワークフローが自動的に起動すること"
      },
      {
        "order": 2,
        "screen": "GitHub Actions",
        "action": "GitHub Actionsのワークフロー実行ログを確認する",
        "expectedResult": "manifest.jsonのversionが '1.0.0' に書き換えられ、'github-to-kantan-markdown.zip' が作成されること"
      },
      {
        "order": 3,
        "screen": "GitHub Release",
        "action": "GitHubのReleasesページを確認する",
        "expectedResult": "タグ 'v1.0.0' に対応するリリースが作成され、ZIPパッケージが添付されていること"
      }
    ],
    "expectedResult": "バージョンタグプッシュをトリガーとして、パッケージの作成からRelease発行までのCI/CD運用フローが成功すること。",
    "testData": "タグ名=v1.0.0, パッケージ名=github-to-kantan-markdown.zip",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること。",
    "priority": "中",
    "testType": "自動"
  },
  {
    "id": "ST-096",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "自動リリース管理",
      "medium": "リリースフロー検証",
      "small": "パッケージング実行"
    },
    "testCase": "release-extension.ymlによるChrome拡張機能アーカイブ作成およびリリースワークフローの正常実行検証",
    "relatedRequirement": "FR-005",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-028",
    "scenario": "GitHub Actions上でパッケージ作成に必要な全構成ファイル（manifest.json, background.js, content.js, options.html, options.js, LICENSE, README.md）が漏れなくZIPファイルに集約・リリースされることを検証する。",
    "actor": "CI/CDパイプライン",
    "precondition": "GitHubリポジトリに release-extension.yml ワークフローファイルが存在していること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHub Actions",
        "action": "タグ 'v1.0.1' をリポジトリにプッシュしてワークフローをトリガーする",
        "expectedResult": "ワークフロー内の 'Create Extension Zip Package' ステップが正常に実行されること"
      },
      {
        "order": 2,
        "screen": "GitHub Release",
        "action": "作成された 'github-to-kantan-markdown.zip' の内部構成を検証する",
        "expectedResult": "zip内に manifest.json, background.js, content.js, options.html, options.js, LICENSE, README.md が含まれていること"
      }
    ],
    "expectedResult": "拡張機能の動作に必要なすべてのソースコードおよび構成要素が正しく圧縮パッケージ化され、リリースファイルとして提供されること。",
    "testData": "REF_NAME=v1.0.1, ZIP構成要素=[manifest.json, background.js, content.js, options.html, options.js, LICENSE, README.md]",
    "acceptanceCriteria": "必要ファイル群がすべてZIPパッケージに含まれ、欠損なく自動ビルド・リリースされること。",
    "priority": "中",
    "testType": "自動"
  },
  {
    "id": "ST-097",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "設定管理",
      "medium": "設定UI運用",
      "small": "ユーザー通知・エラーログ確認"
    },
    "testCase": "設定画面およびエクスポート処理におけるトースト通知およびエラーダイアログの表示運用検証",
    "relatedRequirement": "FR-002, FR-003, FR-004",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-029",
    "scenario": "設定保存時のトースト通知表示およびカスタムリポジトリ接続テスト失敗時のエラーメッセージ通知がユーザーに対して正しくフィードバックされる運用動作を確認する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面を開き、各種操作を行える状態であること。",
    "steps": [
      {
        "order": 1,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'original' を選択し、「保存」ボタンをクリックする",
        "expectedResult": "画面上にトースト通知（toast）が表示され、設定が保存されたことが提示されること"
      },
      {
        "order": 2,
        "screen": "設定画面",
        "action": "「リポジトリタイプ」で 'custom' を選択し、「カスタムリポジトリURL」に不正なURL 'https://invalid-url' を入力して「接続テスト」ボタンをクリックする",
        "expectedResult": "テスト結果表示エリア（testResult）にエラーメッセージ「エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)」が表示されること"
      }
    ],
    "expectedResult": "操作結果（成功・失敗・警告）に応じた画面フィードバックおよび通知が正しく機能すること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://invalid-url",
    "acceptanceCriteria": "設定保存時のトースト通知および不正入力時のエラーメッセージが適切なタイミングと内容で画面に表示されること。",
    "priority": "低",
    "testType": "手動"
  },
  {
    "id": "ST-098",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "自動リリース管理",
      "medium": "GitHub Release運用",
      "small": "GitHub Release自動発行"
    },
    "testCase": "自動リリースパイプラインにおけるGitHub Releaseの発行およびリリース本文・添付ファイルの整合性検証",
    "relatedRequirement": "NFR-006, FR-005",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-044",
    "scenario": "バージョンタグプッシュにより生成されるGitHub Releaseにおいて、リリース本文（body）および添付されるアーカイブパッケージ（github-to-kantan-markdown.zip）の整合性を検証する。",
    "actor": "CI/CDシステム",
    "precondition": "リポジトリのSecretsに GITHUB_TOKEN が設定されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHubリポジトリ",
        "action": "バージョンタグ 'v2.0.0' をリモートリポジトリへプッシュする",
        "expectedResult": "softprops/action-gh-release アクションが呼び出され、Releaseが自動作成されること"
      },
      {
        "order": 2,
        "screen": "GitHub Release",
        "action": "生成されたGitHub Releaseのメタデータおよび添付アセットを確認する",
        "expectedResult": "リリース本文にインストール手順が記載され、'github-to-kantan-markdown.zip' が添付されていること"
      }
    ],
    "expectedResult": "正しい手順説明およびパッケージファイルを含むGitHub Releaseが自動発行されること。",
    "testData": "タグ名=v2.0.0, 添付ファイル=github-to-kantan-markdown.zip",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること。",
    "priority": "高",
    "testType": "自動"
  },
  {
    "id": "ST-099",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "エクスポート管理",
      "medium": "設定連携エクスポート",
      "small": "カスタム設定反映エクスポートフロー"
    },
    "testCase": "カスタムリポジトリおよびFullエディション設定保存後のMarkdownエクスポート連携シナリオ検証",
    "relatedRequirement": "NFR-007, FR-003",
    "relatedScreens": [
      "SCR-001",
      "SCR-002"
    ],
    "relatedViewpoint": "STV-L3-045",
    "scenario": "設定画面でカスタムリポジトリURLとFullエディションを設定・保存したのち、Markdownファイル閲覧画面においてその設定がエクスポート処理に自動適用されるシナリオを検証する。",
    "actor": "拡張機能利用者",
    "precondition": "設定画面にてリポジトリタイプ「カスタム」、カスタムリポジトリURL「https://github.com/testuser/testrepo」、エディション「full」を設定・保存済みであること。",
    "steps": [
      {
        "order": 1,
        "screen": "Markdownファイル閲覧画面",
        "action": "GitHub上のMarkdownファイル閲覧画面を開き、「かんたんMDエクスポート」ボタンをクリックする",
        "expectedResult": "モーダルダイアログが表示され、初期選択エディションとして「Full (ktm-full.html)」が選択状態になっていること"
      },
      {
        "order": 2,
        "screen": "Markdownファイル閲覧画面",
        "action": "ダイアログの「エクスポート」ボタンをクリックする",
        "expectedResult": "バックグラウンド処理にて 'https://testuser.github.io/testrepo/dist/ktm-full.html' からテンプレートが取得され、エクスポートファイルが生成・ダウンロードされること"
      }
    ],
    "expectedResult": "設定画面で保持されたカスタムリポジトリURLおよびデフォルトエディションがエクスポート処理に正しく反映されること。",
    "testData": "リポジトリタイプ=custom, カスタムリポジトリURL=https://github.com/testuser/testrepo, エディション=full",
    "acceptanceCriteria": "カスタムリポジトリのテンプレートHTML（ktm-full.html）が読み込まれ、正常に単一HTMLファイルとしてエクスポートされること。",
    "priority": "中",
    "testType": "手動"
  },
  {
    "id": "ST-100",
    "category": "運用シナリオ",
    "functionCategory": {
      "large": "自動リリース管理",
      "medium": "CI/CDパイプライン運用",
      "small": "リリースワークフロー一連確認"
    },
    "testCase": "自動パッケージングおよびリリースワークフロー全体の正常完了とアーティファクト出力検証",
    "relatedRequirement": "FR-005, NFR-006",
    "relatedScreens": [],
    "relatedViewpoint": "STV-L3-061",
    "scenario": "タグプッシュからmanifest.jsonの正規化（接頭辞vの削除および数値部分の抽出）、ZIPパッケージ化、リリース作成までの一貫したワークフロー実行を確認する。",
    "actor": "開発者",
    "precondition": "release-extension.yml が更新・配置されていること。",
    "steps": [
      {
        "order": 1,
        "screen": "GitHubリポジトリ",
        "action": "接頭辞付きタグ 'v1.2.3_20261031' を作成しリモートリポジトリへプッシュする",
        "expectedResult": "ワークフロー内の 'Update Version in manifest.json' ステップでバージョン文字列が '1.2.3' に正規化されること"
      },
      {
        "order": 2,
        "screen": "GitHub Release",
        "action": "ワークフロー実行後の成果物およびGitHub Releaseを確認する",
        "expectedResult": "manifest.jsonのversionが '1.2.3' に更新されたZIPパッケージがリリースアセットとして正しく公開されること"
      }
    ],
    "expectedResult": "バージョンタグの正規化処理を含む自動パッケージング・リリースワークフローが正常に完了すること。",
    "testData": "REF_NAME=v1.2.3_20261031, 正規化バージョン=1.2.3",
    "acceptanceCriteria": "バージョンタグプッシュ時にGitHub Actionsが正常完了し、manifest.jsonのバージョン補正とリリースZIPの作成が自動的に行われること。",
    "priority": "中",
    "testType": "自動"
  }
]
```