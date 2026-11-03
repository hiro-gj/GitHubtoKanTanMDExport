chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportMarkdown') {
    handleExport(request.payload)
      .then(result => {
        sendResponse({ success: true, payload: result });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // 応答を非同期で返す
  }
});

/**
 * GitHubのURL（リポジトリルート、tree/blobサブパス、サブディレクトリ指定等）を解析する。
 * @param {string} inputUrl
 * @returns {{ username: string, repo: string, subPath: string } | null}
 */
function parseGitHubRepoUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const trimmed = inputUrl.trim().replace(/\/+$/, '');
  const githubUrlPattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git)?(?:\/([^\s?#]*))?$/;
  const match = trimmed.match(githubUrlPattern);
  if (!match) return null;

  const username = match[1];
  const repo = match[2];
  const rawRest = (match[3] || '').replace(/^\/+|\/+$/g, '');

  let subPath = '';
  if (rawRest) {
    const treeBlobMatch = rawRest.match(/^(?:tree|blob)\/[^/]+(?:\/(.*))?$/);
    if (treeBlobMatch) {
      subPath = (treeBlobMatch[1] || '').replace(/^\/+|\/+$/g, '');
    } else {
      subPath = rawRest;
    }
    // 末尾に ktm-*.html 等のファイル名が直接指定されている場合は親ディレクトリパスを抽出
    subPath = subPath.replace(/(?:^|\/)ktm-[a-zA-Z0-9_-]+\.html?$/i, '').replace(/^\/+|\/+$/g, '');
  }

  return { username, repo, subPath };
}

/**
 * 解析済みGitHub URL情報とテンプレートファイル名から、探索候補となるGitHub Pages URLリストを生成する。
 * @param {{ username: string, repo: string, subPath: string }} parsed
 * @param {string} templateFile
 * @returns {string[]}
 */
function buildTemplateCandidateUrls(parsed, templateFile) {
  const pagesBase = `https://${parsed.username}.github.io/${parsed.repo}`;
  const candidates = [];
  const addCandidate = (url) => {
    if (!candidates.includes(url)) {
      candidates.push(url);
    }
  };

  if (parsed.subPath) {
    addCandidate(`${pagesBase}/${parsed.subPath}/${templateFile}`);
    addCandidate(`${pagesBase}/${parsed.subPath}/dist/${templateFile}`);
    if (!parsed.subPath.startsWith('dist/') && parsed.subPath !== 'dist') {
      addCandidate(`${pagesBase}/dist/${parsed.subPath}/${templateFile}`);
    }
  }

  addCandidate(`${pagesBase}/dist/${templateFile}`);
  addCandidate(`${pagesBase}/${templateFile}`);
  addCandidate(`${pagesBase}/dist/preview/${templateFile}`);

  return candidates;
}

/**
 * テンプレート取得URLにキャッシュバスター（?t=...）を付与する。
 * @param {string} url
 * @param {number|string} [timestamp]
 * @returns {string}
 */
function appendCacheBuster(url, timestamp = Date.now()) {
  if (!url || typeof url !== 'string') return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
}

/**
 * ktm-*.html 取得前に Cache Storage 内のテンプレートキャッシュをクリアする。
 * @param {string[]} candidateUrls
 */
async function clearTemplateCache(candidateUrls = []) {
  if (typeof caches === 'undefined' || !caches || typeof caches.keys !== 'function') {
    return;
  }
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        const cache = await caches.open(cacheName);
        if (!cache) return;

        if (typeof cache.delete === 'function') {
          await Promise.all(
            candidateUrls.map((url) => cache.delete(url, { ignoreSearch: true }).catch(() => false))
          );
        }

        if (typeof cache.keys === 'function' && typeof cache.delete === 'function') {
          const requests = await cache.keys();
          await Promise.all(
            requests
              .filter((req) => {
                const reqUrl = typeof req === 'string' ? req : (req && req.url ? req.url : '');
                return /ktm-[a-zA-Z0-9_-]+\.html?(?:[?#]|$)/i.test(reqUrl);
              })
              .map((req) => cache.delete(req).catch(() => false))
          );
        }
      })
    );
  } catch (err) {
    console.warn('テンプレートキャッシュのクリア中に警告が発生しました:', err);
  }
}

async function handleExport({ markdownFetchUrl, repoInfo, fileName, rawUrl, attachmentsMetadata, edition: payloadEdition }) {
  // 1. 設定情報を取得
  const settings = await chrome.storage.local.get(['repo_type', 'custom_repo_url', 'edition']);
  const repoType = settings.repo_type || 'fork';
  const customRepoUrl = settings.custom_repo_url || (repoType === 'original' ? 'https://github.com/tatesuke/KanTanMarkdown' : 'https://github.com/hiro-gj/KanTanMarkdown');
  const edition = payloadEdition || settings.edition || 'lite';

  // 1.5 BackgroundからMarkdownデータをフェッチ
  let mdText = '';
  try {
    const mdResponse = await fetch(markdownFetchUrl);
    if (!mdResponse.ok) {
      throw new Error(`Raw Markdownデータの取得に失敗しました（HTTP ${mdResponse.status}）。`);
    }
    mdText = await mdResponse.text();
  } catch (err) {
    throw new Error(`Raw Markdownデータの取得に失敗しました: ${err.message}`);
  }

  // 2. テンプレートHTMLのURLを決定
  let templateBaseUrl = 'https://hiro-gj.github.io/KanTanMarkdown';
  const editionTemplates = {
    lite: 'ktm-lite.html',
    standard: 'ktm-std.html',
    full: 'ktm-full.html'
  };
  const templateFile = editionTemplates[edition] || 'ktm-lite.html';
  let candidateUrls = [`${templateBaseUrl}/dist/${templateFile}`];

  if (customRepoUrl) {
    const parsed = parseGitHubRepoUrl(customRepoUrl);
    if (parsed) {
      templateBaseUrl = `https://${parsed.username}.github.io/${parsed.repo}`;
      candidateUrls = buildTemplateCandidateUrls(parsed, templateFile);
    }
  } else if (repoType === 'original') {
    const parsed = parseGitHubRepoUrl('https://github.com/tatesuke/KanTanMarkdown');
    if (parsed) {
      templateBaseUrl = `https://${parsed.username}.github.io/${parsed.repo}`;
      candidateUrls = buildTemplateCandidateUrls(parsed, templateFile);
    }
  } else if (repoType === 'fork') {
    templateBaseUrl = 'https://hiro-gj.github.io/KanTanMarkdown';
    candidateUrls = [`${templateBaseUrl}/dist/${templateFile}`];
  }

  // 3. テンプレートHTML取得前にキャッシュをクリアし、キャッシュバスター(?t=)を併用してフェッチ
  await clearTemplateCache(candidateUrls);
  const cacheBuster = Date.now();
  let templateHtml = null;
  let lastError = null;
  for (const templateHtmlUrl of candidateUrls) {
    try {
      const fetchUrl = appendCacheBuster(templateHtmlUrl, cacheBuster);
      const res = await fetch(fetchUrl, { cache: 'no-store' });
      if (res.ok) {
        templateHtml = await res.text();
        break;
      }
      lastError = new Error('テンプレートの取得に失敗しました。');
    } catch (err) {
      lastError = err;
    }
  }
  if (templateHtml === null) {
    throw new Error(`テンプレート読み込み失敗: ${(lastError || new Error('テンプレートの取得に失敗しました。')).message}`);
  }

  // 4. 画像URLを抽出してフェッチ＆Base64エンコード
  const imgPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlImgPattern = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  const imagePromises = [];
  const imageMap = {};
  const uuidRegex = /user-attachments\/assets\/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})/i;

  // (A) Markdown記法画像
  while ((match = imgPattern.exec(mdText)) !== null) {
    const src = match[2];
    addImageToMap(src);
  }

  // (B) HTML <img> 画像
  while ((match = htmlImgPattern.exec(mdText)) !== null) {
    const src = match[1];
    addImageToMap(src);
  }

  function addImageToMap(src) {
    if (!imageMap[src]) {
      // UUIDから添付メタデータに一致するものがあるか確認
      const uuidMatch = src.match(uuidRegex);
      let cleanKey = null;
      if (uuidMatch) {
        const uuid = uuidMatch[1].toLowerCase();
        const meta = attachmentsMetadata?.find(m => m.uuid.toLowerCase() === uuid);
        if (meta) {
          cleanKey = meta.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
        }
      }

      if (!cleanKey) {
        const filename = src.split('/').pop().split('?')[0];
        cleanKey = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      }

      imageMap[src] = {
        key: cleanKey,
        originalSrc: src,
        dataUrl: null,
        success: false
      };
      
      // 絶対URLに解決 (new URL を使用し、rawUrl基準で ./ や ../ を解決)
      let absoluteSrc = src;
      if (!src.startsWith('http://') && !src.startsWith('https://')) {
        try {
          absoluteSrc = new URL(src, rawUrl).href;
        } catch (e) {
          // フォールバック
          absoluteSrc = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/refs/heads/${repoInfo.branch}/${src.replace(/^\.\//, '')}`;
        } 
      }

      const p = fetchImageAsBase64(absoluteSrc)
        .then(dataUrl => {
          imageMap[src].dataUrl = dataUrl;
          imageMap[src].success = true;
        })
        .catch(err => {
          console.warn(`画像の取得に失敗しました: ${src}`, err);
          imageMap[src].success = false;
        });
      imagePromises.push(p);
    }
  }

  // (C) attachmentsMetadata (動画・ドキュメントなどの添付ファイル) の並列フェッチ
  const attachmentMap = {};
  if (attachmentsMetadata && Array.isArray(attachmentsMetadata)) {
    attachmentsMetadata.forEach(item => {
      const cleanKey = item.filename.replace(/[^a-zA-Z0-9.-]/g, '_');
      attachmentMap[item.uuid.toLowerCase()] = {
        key: cleanKey,
        filename: item.filename,
        uuid: item.uuid,
        url: item.url,
        dataUrl: null,
        success: false
      };

      const p = fetchImageAsBase64(item.url)
        .then(dataUrl => {
          attachmentMap[item.uuid.toLowerCase()].dataUrl = dataUrl;
          attachmentMap[item.uuid.toLowerCase()].success = true;
        })
        .catch(err => {
          console.warn(`添付ファイルの取得に失敗しました: ${item.filename}`, err);
          attachmentMap[item.uuid.toLowerCase()].success = false;
        });
      imagePromises.push(p);
    });
  }

  await Promise.all(imagePromises);

  // 5. Markdownテキストの画像記述、およびHTML画像、添付ファイルの置換
  let finalMdText = mdText;

  // (A) 画像（Markdown ＆ HTML）の置換
  for (const src in imageMap) {
    const item = imageMap[src];
    if (item.success && item.dataUrl) {
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const escapedSrc = escapeRegex(src);

      // Markdown画像 ![alt](src) を ![alt](attach:cleanKey) に置換
      const mdRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapedSrc}\\)`, 'g');
      finalMdText = finalMdText.replace(mdRegex, (match, alt) => {
        return `![${alt}](attach:${item.key})`;
      });

      // HTML画像 <img ... src="src" ...> を <img ... src="attach:cleanKey" ...> に置換
      const htmlRegex = new RegExp(`(<img[^>]+src=["'])${escapedSrc}(["'])`, 'gi');
      finalMdText = finalMdText.replace(htmlRegex, `$1attach:${item.key}$2`);
    }
  }

  // (B) 添付ファイルの置換
  for (const uuid in attachmentMap) {
    const item = attachmentMap[uuid];
    if (item.success && item.dataUrl) {
      // Markdownリンク [text](https://github.com/user-attachments/assets/UUID) の置換
      const mdLinkRegex = new RegExp(`\\[([^\\]]*)\\]\\(https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}\\)`, 'gi');
      finalMdText = finalMdText.replace(mdLinkRegex, `[$1](attach:${item.key})`);

      // HTML属性 src="https://github.com/user-attachments/assets/UUID" または href="..." の置換
      const htmlAttrRegex = new RegExp(`(src|href)=["']https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}["']`, 'gi');
      finalMdText = finalMdText.replace(htmlAttrRegex, `$1="attach:${item.key}"`);

      // 生のURL https://github.com/user-attachments/assets/UUID を置換。ideal形式に合わせて [filename](attach:cleanKey) に置換する
      const rawUrlRegex = new RegExp(`https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}`, 'gi');
      finalMdText = finalMdText.replace(rawUrlRegex, `[${item.filename}](attach:${item.key})`);
    }
  }

  // HTML画像の固定サイズ指定はエクスポート時に除去する。
  // かんたんMarkdown側の表示領域に応じて画像を可変表示できるよう、
  // <img> 開始タグ内の width / height 属性だけを対象とする。
  finalMdText = finalMdText.replace(/<img\b[^>]*>/gi, imgTag => {
    return imgTag.replace(
      /\s+(?:width|height)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi,
      ''
    );
  });

  // 6. パッケージ用のデータオブジェクトを作成
  const attachments = {};
  for (const src in imageMap) {
    const item = imageMap[src];
    if (item.success && item.dataUrl && item.dataUrl.startsWith('data:')) {
      attachments[item.key] = item.dataUrl;
    }
  }
  for (const uuid in attachmentMap) {
    const item = attachmentMap[uuid];
    if (item.success && item.dataUrl && item.dataUrl.startsWith('data:')) {
      attachments[item.key] = item.dataUrl;
    }
  }

  let outputFileName = `${repoInfo.repo}_${fileName.replace(/\.md$/, '')}.html`;
  const h1Match = mdText.match(/^#\s+(.+)$/m);
  if (h1Match) {
    const h1Title = h1Match[1].trim();
    const sanitizedTitle = h1Title.replace(/[\\/:*?"<>|#]/g, '_');
    if (sanitizedTitle) {
      outputFileName = `${sanitizedTitle}.html`;
    }
  }

  return {
    templateHtml: templateHtml,
    markdown: finalMdText,
    attachments: attachments,
    outputFileName: outputFileName
  };
}

async function fetchImageAsBase64(url) {
  // MV3サービスワーカーではFileReaderが利用できないため、Blob.arrayBuffer()で変換する。
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`添付ファイルフェッチエラー: ${response.status}`);

    const blob = await response.blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const chunkSize = 0x8000;
    let binary = '';

    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }

    const mimeType = blob.type || 'application/octet-stream';
    return `data:${mimeType};base64,${btoa(binary)}`;
  } catch (e) {
    throw new Error(`添付ファイルのフェッチ失敗: ${url}. エラー: ${e.message}`);
  }
}
