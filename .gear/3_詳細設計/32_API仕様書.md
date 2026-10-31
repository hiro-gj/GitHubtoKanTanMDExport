# API仕様書

独自HTTP APIサーバーはない。Chromeメッセージ、Chrome API、外部HTTP取得を分ける。Chrome APIをPOST/PUTと表記しない。

## API-001: exportMarkdown（FR-002 / BP-004）
送信: content.js chrome.runtime.sendMessage。受信: background.js chrome.runtime.onMessage。payloadの実行時スキーマ検証なし。

```json
{
  "action": "exportMarkdown",
  "payload": {
    "markdownFetchUrl": "https://raw.githubusercontent.com/example/docs/main/README.md",
    "repoInfo": {"owner": "example", "repo": "docs", "branch": "main"},
    "fileName": "README.md",
    "rawUrl": "https://raw.githubusercontent.com/example/docs/main/README.md",
    "attachmentsMetadata": [],
    "edition": "lite"
  }
}
```

これは構造説明用の例で、存在する配信リソースを保証しない。各項目の型・構築方法は22と31。
通常UIではすべて送る。Workerはedition未指定を保存値/liteで補う。attachmentsMetadataなしは添付走査を省くが、画像UUID照合は適切な配列を前提とする。

成功:
```json
{
  "success": true,
  "payload": {
    "templateHtml": "<textarea id=\"editor\"></textarea><ul id=\"fileList\"></ul>",
    "markdown": "# 文書\n![図](attach:figure.png)",
    "attachments": {"figure.png": "data:image/png;base64,AQID"},
    "outputFileName": "文書.html"
  }
}
```

失敗例（HTTP404の本文取得失敗）:
```json
{
  "success": false,
  "error": "Raw Markdownデータの取得に失敗しました: Raw Markdownデータの取得に失敗しました（HTTP 404）。"
}
```

errorは人向け文字列であり固定のエラーコードなし。FETCH_MD_FAILED/FETCH_TEMPLATE_FAILEDは実装されていない。個別添付失敗ではsuccess:trueになり得る。Chromeメッセージ配送エラーはchrome.runtime.lastErrorとして別扱い。要求ID、進捗通知、取消、独自timeout、sender認証処理なし。onMessageはreturn trueで非同期応答を保持する。

## API-002: 変換時の外部HTTP（FR-002 / FR-008）
| 目的 | メソッド | URL | 成功時 | 非成功時 |
| --- | --- | --- | --- | --- |
| Raw本文 | GET | markdownFetchUrl（DOM Rawリンク優先） | response.text() | 全体失敗 |
| テンプレート | GET | {base}/dist/{editionFile} | response.text() | 全体失敗 |
| 画像 | GET | 絶対src、またはnew URL(src, rawUrl) | blobからData URL | warn、置換省略 |
| DOM添付 | GET | attachmentsMetadata[].url | blobからData URL | warn、置換省略 |

base: 公式 https://tatesuke.github.io/KanTanMarkdown、形式一致するcustomは https://{owner}.github.io/{repo}。
editionFile: lite=ktm-lite.html、standard=ktm-std.html、full=ktm-full.html、未知値=ktm-lite.html。
独自Authorization/リクエストbody/credentials/AbortController指定なし。認証が必要な資源の取得はブラウザ状態・配信URL・権限による。HTTP ok以外は失敗。テンプレートのContent-Type・editor/fileList構造を検証しない。

## API-003: 設定ストレージ（FR-003）
| 呼出元 | Chrome API | 内容 |
| --- | --- | --- |
| Options | local.get(['repo_type','custom_repo_url','edition'], callback) | 読込→フォーム |
| Content Script | local.get(['edition'], callback) | モーダル既定値 |
| Worker | await local.get(['repo_type','custom_repo_url','edition']) | 配信元・edition fallback |
| Options | local.set({repo_type, custom_repo_url, edition}, callback) | 保存後通知・終了 |

storage権限を使用。データ定義は22。設定の同期、履歴API、DB通信はない。

## API-004: 接続テスト・権限（FR-004）
Optionsからpermissions.contains({origins:[origin+'/*']}, callback)で確認、未許可ならpermissions.requestで要求。許可時にfetch(targetUrl,{method:'HEAD'})。
| edition | 接続テスト | 変換時GET |
| --- | --- | --- |
| lite | ktm-lite.html | ktm-lite.html |
| standard | ktm-std.htm | ktm-std.html |
| full | ktm-full.html | ktm-full.html |

LIM-01: Standardの拡張子不一致を現状として記録する。HEAD成功はHTML内部構造の検証ではない。必要ホストが必須権限に含まれる場合、requestなしで進む。URL正規表現と結果文言は26参照。

## 非API: Releaseワークフロー
タグpushはGitHubイベント。github-actions/release-extensionというPOSTエンドポイントは実装しない。処理仕様はBP-009。
