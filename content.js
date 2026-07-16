// ページのロードおよびSPA遷移、またGitHubのDOM更新を検知してボタンを挿入する
let lastUrl = location.href;
let debounceTimeout = null;

const observer = new MutationObserver(() => {
  // href変更時の即時再初期化、および同一URL内でのDOM変更に対するデバウンス再初期化
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    init();
  } else {
    // 同一URL内の部分更新に追従するためデバウンス実行
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      init();
    }, 500);
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
  // 重複挿入を防止：すでにボタンが存在する場合は何もせず終了
  const existingBtn = document.getElementById('ktm-export-btn');
  if (existingBtn) return;
  const existingWrapper = document.getElementById('ktm-export-wrapper');
  if (existingWrapper) return;

  // GitHubのファイル表示画面のアクションバーを探索する
  // (Raw, Blameボタン等が含まれるコンテナ)
  const rawButton = document.querySelector('[data-testid="raw-button"]');
  let actionContainer = null;
  let useWrapper = false;

  if (rawButton) {
    // 最新のReactベースのファイルビューワーのButtonGroupを取得
    actionContainer = rawButton.closest('[data-component="ButtonGroup"]') || rawButton.parentElement.parentElement;
    useWrapper = true;
  }

  if (!actionContainer) {
    // 従来型/フォールバック用のコンテナを探索
    actionContainer = document.querySelector('.Box-header .d-flex') || 
                      document.querySelector('[data-testid="file-action-button-group"]') ||
                      document.querySelector('.file-header .file-actions');
  }

  if (!actionContainer) return;

  // ボタン要素を生成
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

  if (useWrapper) {
    // ButtonGroupのレイアウト崩れを防ぐため、他アイテムと同様のラッパーDIVを作成
    const itemWrapper = document.createElement('div');
    itemWrapper.id = 'ktm-export-wrapper';
    
    // 既存のButtonGroupの子要素のクラス名を模倣
    const sampleItem = actionContainer.querySelector('div');
    if (sampleItem && sampleItem.className) {
      itemWrapper.className = sampleItem.className;
    }
    
    // スタイル調整 (GitHubのReact ButtonGroup内に美しく配置するため)
    btn.className = 'prc-Button-ButtonBase-9n-Xk BlobViewHeader-module__LinkButton__X9kx2';
    btn.style.height = '32px';
    btn.style.padding = '0 12px';
    btn.style.fontSize = '14px';
    btn.style.fontWeight = '600';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.border = '1px solid rgba(27, 31, 36, 0.15)';
    btn.style.backgroundColor = '#2da44e';
    btn.style.color = '#ffffff';
    btn.style.marginLeft = '8px';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';

    itemWrapper.appendChild(btn);
    actionContainer.appendChild(itemWrapper);
  } else {
    actionContainer.appendChild(btn);
  }
}

function getAttachmentsMetadata() {
  const metadataByUuid = new Map();
  const markdownBody = document.querySelector('.markdown-body');
  if (!markdownBody) return [];

  const uuidRegex = /([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/i;

  function getDisplayFilename(element, fallback) {
    const details = element.closest('details');
    const summaryName = details?.querySelector('summary span')?.textContent?.trim();
    return summaryName || element.getAttribute('title')?.trim() || fallback;
  }

  function addAttachment(url, filename) {
    const match = url.match(uuidRegex);
    if (!match || !url) return;

    const uuid = match[1];
    const existing = metadataByUuid.get(uuid);
    // videoのsrcよりもsourceの実配信URLを優先し、UUID単位で重複を除去する。
    if (!existing || url.startsWith('https://')) {
      metadataByUuid.set(uuid, { uuid, url, filename });
    }
  }

  // GitHubの動画はvideo要素ではなく子のsource要素に実URLを持つ場合がある。
  markdownBody.querySelectorAll('video').forEach(video => {
    const fallback = `video_${uuidRegex.exec(video.outerHTML)?.[1] || 'attachment'}.mp4`;
    const filename = getDisplayFilename(video, fallback);
    addAttachment(
      video.currentSrc ||
        video.getAttribute('src') ||
        video.getAttribute('data-canonical-src') ||
        video.querySelector('source')?.getAttribute('src') ||
        video.querySelector('source')?.getAttribute('data-canonical-src') ||
        '',
      filename
    );
  });

  markdownBody.querySelectorAll('source').forEach(source => {
    const video = source.closest('video');
    const fallback = `video_${uuidRegex.exec(source.outerHTML)?.[1] || 'attachment'}.mp4`;
    addAttachment(
      source.getAttribute('src') || source.getAttribute('data-canonical-src') || '',
      getDisplayFilename(video || source, fallback)
    );
  });

  // 動画以外の直アップロード添付ファイル。
  markdownBody.querySelectorAll('a').forEach(a => {
    const href = a.href || a.getAttribute('href') || a.getAttribute('data-canonical-src') || '';
    const fallback = a.textContent.trim() || `file_attachment`;
    addAttachment(href, getDisplayFilename(a, fallback));
  });

  return [...metadataByUuid.values()];
}

async function handleExportClick(btn) {
  const originalText = btn.textContent;
  btn.textContent = 'エクスポート中...';
  btn.disabled = true;

  try {
    const attachmentsMetadata = getAttachmentsMetadata();

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

    // 3. background script に処理を依頼（フェッチやテンプレート読み込み、rawUrlを引き渡す）
    chrome.runtime.sendMessage({
      action: 'exportMarkdown',
      payload: {
        mdText,
        repoInfo: { owner, repo, branch },
        fileName,
        rawUrl,
        attachmentsMetadata
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
  // かんたんMarkdownのQuine型単一HTML動作仕様に基づき、HTMLファイルをパッケージングする
  let finalHtml = templateHtml;

  // 1. Markdown本文を <textarea id="editor"> の中へ静的にインジェクション
  // エディタ（Prettier等）による実体参照への自動逆変換を防ぐため、文字列を分割してエスケープを記述する
  const escapedMarkdown = markdown
    .replace(/&/g, '&' + 'amp;')
    .replace(/</g, '&' + 'lt;')
    .replace(/>/g, '&' + 'gt;');
  finalHtml = finalHtml.replace('<textarea id="editor"></textarea>', `<textarea id="editor">${escapedMarkdown}</textarea>`);

  // 2. 添付ファイルを <ul id="fileList"> の中へ <li> + <script> の静的DOM構造としてインジェクション
  // fileListが空の場合だけでなく、既存添付を含む場合にも追記する。
  // 既に同一IDが存在するものは重複注入しない。
  finalHtml = finalHtml.replace(
    /(<ul\s+id=["']fileList["'][^>]*>)([\s\S]*?)(<\/ul>)/i,
    (wholeMatch, openingTag, existingContent, closingTag) => {
      let missingAttachHtml = '';

      for (const key in attachments) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existingIdRegex = new RegExp(
          `\\bid=["']attach-${escapedKey}["']`,
          'i'
        );
        if (!existingIdRegex.test(existingContent)) {
          const safeKey = key
            .replace(/&/g, '&' + 'amp;')
            .replace(/"/g, '&' + 'quot;')
            .replace(/</g, '&' + 'lt;')
            .replace(/>/g, '&' + 'gt;');
          const safeDataUrl = attachments[key].replace(/<\/script>/gi, '<\\/script>');
          const editDisabled = /^data:image\//i.test(attachments[key]) ? '' : ' disabled';

          // KanTanMarkdown は添付実体の script 要素だけでなく、
          // 以下の操作UIを含む li を添付一覧の項目として復元する。
          missingAttachHtml += `<li><script type="text/template" id="attach-${safeKey}" title="${safeKey}">${safeDataUrl}</script><script type="text/template" class="layerContent"></script><script type="text/template" class="trimInfo"></script><button class="upButton">↑</button><button class="downButton">↓</button><input type="text" class="fileName"><button class="insertButton">Insert Tag</button><button class="editButton"${editDisabled}>Edit</button><button class="downloadButton">Download</button><button class="detachButton">×</button></li>`;
        }
      }

      return `${openingTag}${existingContent}${missingAttachHtml}${closingTag}`;
    }
  );

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