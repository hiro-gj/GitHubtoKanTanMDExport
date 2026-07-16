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

async function handleExport({ mdText, repoInfo, fileName, rawUrl, attachmentsMetadata }) {
  // 1. 設定情報を取得
  const settings = await chrome.storage.local.get(['repo_type', 'custom_repo_url', 'edition']);
  const repoType = settings.repo_type || 'original';
  const customRepoUrl = settings.custom_repo_url || '';
  const edition = settings.edition || 'lite';

  // 2. テンプレートHTMLのURLを決定
  let templateBaseUrl = 'https://tatesuke.github.io/KanTanMarkdown';
  if (repoType === 'custom' && customRepoUrl) {
    const githubRepoPattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/;
    const match = customRepoUrl.match(githubRepoPattern);
    if (match) {
      const username = match[1];
      const repo = match[2];
      templateBaseUrl = `https://${username}.github.io/${repo}`;
    }
  }

  const editionTemplates = {
    lite: 'ktm-lite.html',
    standard: 'ktm-std.htm',
    full: 'ktm-full.html'
  };
  const templateFile = editionTemplates[edition] || 'ktm-lite.html';
  const templateHtmlUrl = `${templateBaseUrl}/dist/${templateFile}`;

  // 3. テンプレートHTMLをフェッチ
  let templateHtml;
  try {
    const res = await fetch(templateHtmlUrl);
    if (!res.ok) throw new Error('テンプレートの取得に失敗しました。');
    templateHtml = await res.text();
  } catch (err) {
    throw new Error(`テンプレート読み込み失敗: ${err.message}`);
  }

  // 4. 画像URLを抽出してフェッチ＆Base64エンコード
  const imgPattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const htmlImgPattern = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  const imagePromises = [];
  const imageMap = {};

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
      // パスを除去してファイル名のみから一意のキー（cleanKey）を生成する
      const filename = src.split('/').pop().split('?')[0];
      const cleanKey = filename.replace(/[^a-zA-Z0-9.-]/g, '_');

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
      attachmentMap[item.uuid] = {
        key: cleanKey,
        filename: item.filename,
        uuid: item.uuid,
        url: item.url,
        dataUrl: null,
        success: false
      };

      const p = fetchImageAsBase64(item.url)
        .then(dataUrl => {
          attachmentMap[item.uuid].dataUrl = dataUrl;
          attachmentMap[item.uuid].success = true;
        })
        .catch(err => {
          console.warn(`添付ファイルの取得に失敗しました: ${item.filename}`, err);
          attachmentMap[item.uuid].success = false;
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
      const mdLinkRegex = new RegExp(`\\[([^\\]]*)\\]\\(https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}\\)`, 'g');
      finalMdText = finalMdText.replace(mdLinkRegex, `[$1](attach:${item.key})`);

      // HTML属性 src="https://github.com/user-attachments/assets/UUID" または href="..." の置換
      const htmlAttrRegex = new RegExp(`(src|href)=["']https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}["']`, 'g');
      finalMdText = finalMdText.replace(htmlAttrRegex, `$1="attach:${item.key}"`);

      // 生のURL https://github.com/user-attachments/assets/UUID を置換。ideal形式に合わせて [filename](attach:cleanKey) に置換する
      const rawUrlRegex = new RegExp(`https:\\/\\/github\\.com\\/user-attachments\\/assets\\/${uuid}`, 'g');
      finalMdText = finalMdText.replace(rawUrlRegex, `[${item.filename}](attach:${item.key})`);
    }
  }

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

  const outputFileName = `${repoInfo.repo}_${fileName.replace(/\.md$/, '')}.html`;

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