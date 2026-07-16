// ページのロードおよびSPA遷移（GitHubはTurbo/Pjaxで遷移する）を検知する
let lastUrl = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    init();
  }
});
observer.observe(document, { subtree: true, childList: true });

init();

function init() {
  // Markdownファイル閲覧ページ（拡張子.md）を検知
  if (isMarkdownPage()) {
    injectExportButton();
  }
}

function isMarkdownPage() {
  const path = location.pathname;
  return path.endsWith('.md');
}

function injectExportButton() {
  // 既存のボタンがある場合は一旦削除
  const existingBtn = document.getElementById('ktm-export-btn');
  if (existingBtn) existingBtn.remove();

  // GitHubのファイル表示画面のアクションバーを探索する
  // (Raw, Blameボタン等が含まれるコンテナ)
  // セレクタはGitHubのDOM構造変更に合わせる必要があるが、代表的なアクションボタンコンテナを指定
  const actionContainer = document.querySelector('.Box-header .d-flex') || 
                          document.querySelector('[data-testid="file-action-button-group"]') ||
                          document.querySelector('.file-header .file-actions');

  if (!actionContainer) return;

  const btn = document.createElement('button');
  btn.id = 'ktm-export-btn';
  btn.className = 'btn btn-sm btn-primary ml-2';
  btn.style.marginLeft = '8px';
  btn.style.backgroundColor = '#2da44e';
  btn.style.color = '#ffffff';
  btn.style.borderColor = 'rgba(27, 31, 36, 0.15)';
  btn.textContent = 'かんたんMarkdownへエクスポート';

  btn.addEventListener('click', () => {
    handleExportClick(btn);
  });

  actionContainer.appendChild(btn);
}

async function handleExportClick(btn) {
  const originalText = btn.textContent;
  btn.textContent = 'エクスポート中...';
  btn.disabled = true;

  try {
    // 1. プレビュー画面からRaw Markdownテキストを取得
    // GitHubのRaw URLからデータをフェッチするのが確実
    const rawUrl = location.href
      .replace('https://github.com/', 'https://raw.githubusercontent.com/')
      .replace('/blob/', '/');

    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error('Raw Markdownデータの取得に失敗しました。');
    const mdText = await response.text();

    // 2. リポジトリ情報（owner, repo, branch, ファイル名）をURLから抽出
    const pathParts = location.pathname.split('/');
    const owner = pathParts[1];
    const repo = pathParts[2];
    const branch = pathParts[4];
    const fileName = pathParts.slice(5).join('/');

    // 3. background script に処理を依頼（フェッチやテンプレート読み込み）
    chrome.runtime.sendMessage({
      action: 'exportMarkdown',
      payload: {
        mdText,
        repoInfo: { owner, repo, branch },
        fileName
      }
    }, (res) => {
      btn.textContent = originalText;
      btn.disabled = false;

      if (chrome.runtime.lastError) {
        alert(`エラー: ${chrome.runtime.lastError.message}`);
        return;
      }

      if (res && res.success) {
        const { templateHtml, markdown, attachments, outputFileName } = res.payload;
        downloadGeneratedFile(templateHtml, markdown, attachments, outputFileName);
      } else {
        alert(`エクスポートに失敗しました: ${res ? res.error : '不明なエラー'}`);
      }
    });

  } catch (err) {
    btn.textContent = originalText;
    btn.disabled = false;
    alert(`エラーが発生しました: ${err.message}`);
  }
}

function downloadGeneratedFile(templateHtml, markdown, attachments, outputFileName) {
  // かんたんMarkdownのHTMLファイルをパッケージングする
  // テンプレートHTML内にMarkdownと添付ファイル情報を埋め込む
  // 一般的なかんたんMarkdownの構成：
  // テンプレート内に `<!-- ktm-markdown -->` のようなプレースホルダーがある、
  // または独自形式のインジェクション。
  // 今回は、テンプレートの下部に添付ファイルとmarkdownデータを動的に差し込むコードを埋め込み、単一の自己完結HTMLファイルを構築する
  
  let finalHtml = templateHtml;

  // 添付ファイル（attachments）およびMarkdownをHTMLの中に埋め込む（スクリプトインジェクションなど）
  // かんたんMarkdownのLite/Standard/FullはHTML内の特定の要素や変数をパースするため、その定義に沿わせる
  const configScript = `
<script>
  window.KTM_CONFIG = {
    markdown: ${JSON.stringify(markdown)},
    attachments: ${JSON.stringify(attachments)}
  };
  
  // ロード時に自動挿入する処理
  document.addEventListener('DOMContentLoaded', () => {
    // 既存のかんたんMarkdownローダーにデータを読み込ませるための処理
    if (window.loadKtmData) {
      window.loadKtmData(window.KTM_CONFIG.markdown, window.KTM_CONFIG.attachments);
    } else {
      // プレースホルダーの要素へ挿入
      const sourceElem = document.getElementById('source') || document.querySelector('pre#source');
      if (sourceElem) {
        sourceElem.textContent = window.KTM_CONFIG.markdown;
      }
      // 画像等の読み込みフック
      window.ktmAttachments = window.KTM_CONFIG.attachments;
    }
  });
</script>
`;

  // HTMLの </head> または </body> の直前にスクリプトを追加
  if (finalHtml.includes('</head>')) {
    finalHtml = finalHtml.replace('</head>', `${configScript}</head>`);
  } else {
    finalHtml += configScript;
  }

  // Blob を作成してダウンロードを実行
  const blob = new Blob([finalHtml], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = outputFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}