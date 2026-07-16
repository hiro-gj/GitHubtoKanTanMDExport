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

async function handleExport({ mdText, repoInfo, fileName }) {
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
  const templateHtmlUrl = `${templateBaseUrl}/dist/ktm-${edition}.html`;

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
      imageMap[src] = {
        placeholder: `[かんたんMarkdown添付ファイル:${src.split('/').pop()}]`,
        originalSrc: src,
        dataUrl: null
      };
      
      // 絶対URLに解決
      let absoluteSrc = src;
      if (!src.startsWith('http://') && !src.startsWith('https://')) {
        // 相対パスの場合はGitHub上の絶対Rawパスに変換する
        // 例: https://raw.githubusercontent.com/{owner}/{repo}/refs/heads/{branch}/{path}
        absoluteSrc = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/refs/heads/${repoInfo.branch}/${src.replace(/^\.\//, '')}`;
      }

      const p = fetchImageAsBase64(absoluteSrc)
        .then(dataUrl => {
          imageMap[src].dataUrl = dataUrl;
        })
        .catch(err => {
          console.warn(`画像の取得に失敗しました: ${src}`, err);
          // 失敗した場合は元のURLをそのまま使用する
          imageMap[src].dataUrl = src;
        });
      imagePromises.push(p);
    }
  }

  await Promise.all(imagePromises);

  // 5. Markdownテキストの画像記述をかんたんMarkdown仕様の添付挿入独自タグに置換
  let finalMdText = mdText;
  for (const src in imageMap) {
    const item = imageMap[src];
    // ![]() 形式を置換
    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegex(src)}\\)`, 'g');
    finalMdText = finalMdText.replace(regex, item.placeholder);
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
  // 添付ファイルオブジェクトの構築
  const attachments = {};
  for (const src in imageMap) {
    const item = imageMap[src];
    if (item.dataUrl && item.dataUrl.startsWith('data:')) {
      const filename = src.split('/').pop();
      attachments[filename] = item.dataUrl;
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