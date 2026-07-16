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

async function handleExport({ mdText, repoInfo, fileName, rawUrl }) {
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
  let match;
  const imagePromises = [];
  const imageMap = {};

  while ((match = imgPattern.exec(mdText)) !== null) {
    const alt = match[1];
    const src = match[2];

    // 重複を避けてフェッチ
    if (!imageMap[src]) {
      // 異なるパスの同名ファイルの衝突を防ぐため、フルパスから一意のキー（ファイル名）を生成する
      const cleanKey = src.replace(/[^a-zA-Z0-9.-]/g, '_');

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

  await Promise.all(imagePromises);

  // 5. Markdownテキストの画像記述を、かんたんMarkdown標準の添付ファイル参照形式（attach:画像キー）に置換 (フェッチ成功時のみ)
  let finalMdText = mdText;
  for (const src in imageMap) {
    const item = imageMap[src];
    if (item.success && item.dataUrl) {
      // ![alt](src) を ![alt](attach:cleanKey) に置換
      const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegex(src)}\\)`, 'g');
      finalMdText = finalMdText.replace(regex, (match, alt) => {
        return `![${alt}](attach:${item.key})`;
      });
    }
  }

  // 6. パッケージ用のデータオブジェクトを作成
  // かんたんMarkdownのHTMLテンプレート内に設定を注入
  // テンプレートの末尾などに、<script id="ktm-markdown" type="text/markdown">としてデータを埋め込み、
  // またはテンプレート内にあるプレースホルダーを置換する処理を記述
  // 一般的な「かんたんMarkdown」HTMLのインジェクション仕様に準拠

  // テンプレート内の特定の目印、またはエクスポート処理。
  // かんたんMarkdownは、HTML内に直接Markdownを埋め込むことで変換するため、
  // <script type="text/markdown" id="source">...</script> や添付ファイルをインジェクションする
  
  // テンプレートから変換。ここでは、成果物HTMLを構成する。
  // 添付ファイルオブジェクトの構築 (フェッチ成功時のみ)
  const attachments = {};
  for (const src in imageMap) {
    const item = imageMap[src];
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
  // 外部ドメインの場合、chrome.permissions (optional_host_permissions) の確認およびゲート処理
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const origin = new URL(url).origin + '/*';
    const hasPermission = await chrome.permissions.contains({ origins: [origin] });
    if (!hasPermission) {
      // 権限がない場合、バックグラウンドではプロンプトを表示してユーザーに要求できない場合が多いため、
      // 許可されているオリジン以外へのフェッチをブロックするか、可能な範囲でリクエストを試みる
      try {
        const granted = await chrome.permissions.request({ origins: [origin] });
        if (!granted) {
          throw new Error(`外部画像へのホスト権限がありません: ${origin}`);
        }
      } catch (e) {
        // バックグラウンドで非インタラクティブにリクエストできない場合は失敗扱いにし、オリジナル画像URLを保持
        throw new Error(`外部画像へのホスト権限が必要です: ${origin}. エラー: ${e.message}`);
      }
    }
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`画像フェッチエラー: ${response.status}`);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
