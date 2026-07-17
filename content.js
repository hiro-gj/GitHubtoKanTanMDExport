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

  // GitHub of ファイル表示画面のアクションバーを探索する
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

function getRawMarkdownUrl(fallbackUrl) {
  const rawButton = document.querySelector('[data-testid="raw-button"]');
  if (!rawButton) return fallbackUrl;

  const rawLink = rawButton.matches('a[href]')
    ? rawButton
    : rawButton.querySelector('a[href]') || rawButton.closest('a[href]');

  const href = rawLink?.getAttribute('href') || rawButton.getAttribute('href');
  return href ? new URL(href, location.origin).href : fallbackUrl;
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

  function addAttachment(url, filename, priority = 0) {
    const match = url.match(uuidRegex);
    if (!match || !url) return;

    const uuid = match[1];
    const existing = metadataByUuid.get(uuid);

    // UUIDが重複する場合は、直接アップロード画像の alt 属性など、
    // 明示的に解決されたファイル名を汎用フォールバック名で上書きしない。
    // 同一優先度では https の実配信URLを優先し、動画のsource URL選択も維持する。
    if (
      !existing ||
      priority > existing.priority ||
      (priority === existing.priority && url.startsWith('https://'))
    ) {
      metadataByUuid.set(uuid, { uuid, url, filename, priority });
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
      filename,
      1
    );
  });

  markdownBody.querySelectorAll('source').forEach(source => {
    const video = source.closest('video');
    const fallback = `video_${uuidRegex.exec(source.outerHTML)?.[1] || 'attachment'}.mp4`;
    addAttachment(
      source.getAttribute('src') || source.getAttribute('data-canonical-src') || '',
      getDisplayFilename(video || source, fallback),
      2
    );
  });

  // GitHubは直アップロード画像の表示URLを、元の
  // github.com/user-attachments/assets/UUID から
  // private-user-images.githubusercontent.com/...-UUID.png?... へ変換する。
  // どちらの形式でもUUIDとalt由来の名前を取得する。
  markdownBody.querySelectorAll('img').forEach(img => {
    const src =
      img.currentSrc ||
      img.getAttribute('src') ||
      img.getAttribute('data-canonical-src') ||
      '';
    const isUploadedImage =
      uuidRegex.test(src) &&
      (
        src.includes('user-attachments/assets/') ||
        src.includes('private-user-images.githubusercontent.com/')
      );

    if (isUploadedImage) {
      const alt = img.getAttribute('alt')?.trim();
      const fallback = alt || 'image_attachment';
      let filename = fallback;
      if (!/\.[a-zA-Z0-9]+$/.test(filename)) {
        filename += '.png';
      }
      addAttachment(src, getDisplayFilename(img, filename), 3);
    }
  });

  // 動画以外の直アップロード添付ファイル。
  markdownBody.querySelectorAll('a').forEach(a => {
    const href = a.href || a.getAttribute('href') || a.getAttribute('data-canonical-src') || '';
    const fallback = a.textContent.trim() || `file_attachment`;
    addAttachment(href, getDisplayFilename(a, fallback));
  });

  return [...metadataByUuid.values()].map(({ uuid, url, filename }) => ({ uuid, url, filename }));
}

function showEditionSelector(defaultEdition, onSelect, onCancel) {
  const existing = document.getElementById('ktm-modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'ktm-modal-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.zIndex = '1000000';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';

  const modal = document.createElement('div');
  modal.id = 'ktm-modal-box';
  modal.style.backgroundColor = 'var(--color-canvas-overlay, #ffffff)';
  modal.style.color = 'var(--color-fg-default, #24292f)';
  modal.style.border = '1px solid var(--color-border-default, #d0d7de)';
  modal.style.borderRadius = '8px';
  modal.style.padding = '20px';
  modal.style.width = '350px';
  modal.style.boxShadow = '0 8px 24px rgba(140, 149, 159, 0.2)';
  modal.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

  const title = document.createElement('h3');
  title.textContent = 'エクスポートエディションの選択';
  title.style.margin = '0 0 15px 0';
  title.style.fontSize = '16px';
  title.style.fontWeight = '600';

  const desc = document.createElement('p');
  desc.textContent = '出力するHTMLのテンプレートエディションを選択してください。';
  desc.style.margin = '0 0 15px 0';
  desc.style.fontSize = '12px';
  desc.style.color = 'var(--color-fg-muted, #57606a)';

  const select = document.createElement('select');
  select.id = 'ktm-edition-select';
  select.style.width = '100%';
  select.style.padding = '6px 12px';
  select.style.fontSize = '14px';
  select.style.borderRadius = '6px';
  select.style.border = '1px solid var(--color-border-default, #d0d7de)';
  select.style.backgroundColor = 'var(--color-canvas-default, #ffffff)';
  select.style.color = 'var(--color-fg-default, #24292f)';
  select.style.marginBottom = '20px';
  select.style.boxSizing = 'border-box';

  const options = [
    { value: 'lite', text: 'Lite (ktm-lite.html)' },
    { value: 'standard', text: 'Standard (ktm-std.html)' },
    { value: 'full', text: 'Full (ktm-full.html)' }
  ];

  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt.value;
    o.textContent = opt.text;
    if (opt.value === defaultEdition) {
      o.selected = true;
    }
    select.appendChild(o);
  });

  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.justifyContent = 'flex-end';
  btnContainer.style.gap = '8px';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'キャンセル';
  cancelBtn.className = 'btn btn-sm';
  cancelBtn.style.padding = '5px 16px';
  cancelBtn.style.fontSize = '14px';
  cancelBtn.style.fontWeight = '500';
  cancelBtn.style.borderRadius = '6px';
  cancelBtn.style.border = '1px solid var(--color-btn-border, #d0d7de)';
  cancelBtn.style.backgroundColor = 'var(--color-btn-bg, #f6f8fa)';
  cancelBtn.style.color = 'var(--color-btn-text, #24292f)';
  cancelBtn.style.cursor = 'pointer';

  const exportBtn = document.createElement('button');
  exportBtn.textContent = 'エクスポート';
  exportBtn.className = 'btn btn-sm btn-primary';
  exportBtn.style.padding = '5px 16px';
  exportBtn.style.fontSize = '14px';
  exportBtn.style.fontWeight = '500';
  exportBtn.style.borderRadius = '6px';
  exportBtn.style.border = '1px solid rgba(27, 31, 36, 0.15)';
  exportBtn.style.backgroundColor = 'var(--color-btn-primary-bg, #2da44e)';
  exportBtn.style.color = 'var(--color-btn-primary-text, #ffffff)';
  exportBtn.style.cursor = 'pointer';

  function close() {
    overlay.remove();
    document.removeEventListener('keydown', handleEsc);
  }

  function handleEsc(e) {
    if (e.key === 'Escape') {
      close();
      onCancel();
    }
  }

  cancelBtn.addEventListener('click', () => {
    close();
    onCancel();
  });

  exportBtn.addEventListener('click', () => {
    const selected = select.value;
    close();
    onSelect(selected);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
      onCancel();
    }
  });

  document.addEventListener('keydown', handleEsc);

  modal.appendChild(title);
  modal.appendChild(desc);
  modal.appendChild(select);
  btnContainer.appendChild(cancelBtn);
  btnContainer.appendChild(exportBtn);
  modal.appendChild(btnContainer);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

async function handleExportClick(btn) {
  const originalText = btn.textContent;

  chrome.storage.local.get(['edition'], (settings) => {
    const defaultEdition = settings.edition || 'lite';
    showEditionSelector(defaultEdition, async (selectedEdition) => {
      btn.textContent = 'エクスポート中...';
      btn.disabled = true;

      try {
        const attachmentsMetadata = getAttachmentsMetadata();

        // 1. プレビュー画面からRaw Markdownテキストを取得するためのURLを取得
        // rawUrlは相対画像解決用のcanonicalなURLとして維持し、
        // 本文取得にはGitHub画面が提供するRawリンクを優先して使用する。
        const rawUrl = location.href
          .replace('https://github.com/', 'https://raw.githubusercontent.com/')
          .replace('/blob/', '/');
        const markdownFetchUrl = getRawMarkdownUrl(rawUrl);

        // 2. リポジトリ情報（owner, repo, branch, ファイル名）をURLから抽出
        const pathParts = location.pathname.split('/');
        const owner = pathParts[1];
        const repo = pathParts[2];
        const branch = pathParts[4];
        const fileName = pathParts.slice(5).join('/');

        // 3. background script にフェッチおよび処理を依頼（CORS回避のため、フェッチはBackground側で実行）
        chrome.runtime.sendMessage({
          action: 'exportMarkdown',
          payload: {
            markdownFetchUrl,
            repoInfo: { owner, repo, branch },
            fileName,
            rawUrl,
            attachmentsMetadata,
            edition: selectedEdition
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
    }, () => {
      // キャンセル時のコールバック
      btn.textContent = originalText;
      btn.disabled = false;
    });
  });
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