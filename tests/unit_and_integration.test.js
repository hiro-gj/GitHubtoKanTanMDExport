const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

test('1. options.html 静的初期状態の検証 (シナリオ1 & 5)', (t) => {
  const html = fs.readFileSync(path.join(repoRoot, 'options.html'), 'utf-8');

  // 言語選択ラジオグループの存在と初期値
  assert.ok(html.includes('name="language" value="en" checked'), '言語Englishが初期チェックされていること');
  assert.ok(html.includes('name="language" value="ja"'), '言語日本語の選択肢が存在すること');

  // タイトルと見出しの初期英語表示
  assert.ok(html.includes('KanTanMarkdown Conversion Extension Settings'), '見出し/タイトルが英語であること');

  // 公式アーカイブリンクの文言
  assert.ok(html.includes('KanTanMarkdown Original Repository (Archived) here'), 'アーカイブリンクラベルが英語であること');

  // オリジナル(tatesuke)が disabled かつ radio-disabled スタイルを持つこと
  assert.ok(/<input[^>]+name="repo_type"[^>]+value="original"[^>]+disabled/.test(html), 'オリジナルラジオがdisabledであること');
  assert.ok(html.includes('class="radio-disabled"'), '非活性スタイルクラスが付与されていること');

  // リポジトリ選択の初期値が fork (hiro-gj) であること
  assert.ok(/<input[^>]+name="repo_type"[^>]+value="fork"[^>]+checked/.test(html), 'forkラジオが初期チェックされていること');
  assert.ok(html.includes('name="repo_type" value="custom"'), 'customラジオが存在すること');

  // URLの初期値が hiro-gj であること
  assert.ok(html.includes('value="https://github.com/hiro-gj/KanTanMarkdown"'), 'URL初期値が設定されていること');

  // 接続テストボタンが活性（disabled がついていない）こと
  assert.ok(/<button[^>]+id="test-btn"[^>]+data-i18n="btnTest">Test Connection<\/button>/.test(html), '接続テストボタンが活性状態であること');

  // 各i18n属性が存在すること
  assert.ok(html.includes('data-i18n="pageTitle"'), 'data-i18n="pageTitle" が存在すること');
  assert.ok(html.includes('data-i18n="officialRepoLink"'), 'data-i18n="officialRepoLink" が存在すること');
  assert.ok(html.includes('data-i18n="labelLanguage"'), 'data-i18n="labelLanguage" が存在すること');
  assert.ok(html.includes('data-i18n="labelRepoType"'), 'data-i18n="labelRepoType" が存在すること');
  assert.ok(html.includes('data-i18n="repoOriginal"'), 'data-i18n="repoOriginal" が存在すること');
  assert.ok(html.includes('data-i18n="repoFork"'), 'data-i18n="repoFork" が存在すること');
  assert.ok(html.includes('data-i18n="repoCustom"'), 'data-i18n="repoCustom" が存在すること');
  assert.ok(html.includes('data-i18n="labelEdition"'), 'data-i18n="labelEdition" が存在すること');
  assert.ok(html.includes('data-i18n="btnSave"'), 'data-i18n="btnSave" が存在すること');
  assert.ok(html.includes('data-i18n="btnTest"'), 'data-i18n="btnTest" が存在すること');
  assert.ok(html.includes('data-i18n="btnCancel"'), 'data-i18n="btnCancel" が存在すること');
});

test('2. options.js の多言語辞書およびロジック検証 (シナリオ3)', (t) => {
  const jsContent = fs.readFileSync(path.join(repoRoot, 'options.js'), 'utf-8');

  // i18nDict の抽出
  const match = jsContent.match(/const i18nDict = ({[\s\S]*?\n};)/);
  assert.ok(match, 'i18nDict が定義されていること');

  const fn = new Function(`return ${match[1]}`);
  const i18nDict = fn();

  assert.ok(i18nDict.en, '英語辞書が存在すること');
  assert.ok(i18nDict.ja, '日本語辞書が存在すること');

  // 英語・日本語のキー整合性検証
  const enKeys = Object.keys(i18nDict.en);
  const jaKeys = Object.keys(i18nDict.ja);
  assert.deepStrictEqual(enKeys.sort(), jaKeys.sort(), 'en と ja の辞書キーが一致していること');

  // 主要文言の検証
  assert.strictEqual(i18nDict.en.pageTitle, 'KanTanMarkdown Conversion Extension Settings');
  assert.strictEqual(i18nDict.ja.pageTitle, 'かんたんMarkdown変換 拡張機能設定');
  assert.strictEqual(i18nDict.en.officialRepoLink, 'KanTanMarkdown Original Repository (Archived) here');
  assert.strictEqual(i18nDict.ja.officialRepoLink, 'かんたんMarkdown オリジナルリポジトリ（アーカイブ）はこちら');
  assert.strictEqual(i18nDict.en.repoFork, 'Fork (hiro-gj)');
  assert.strictEqual(i18nDict.ja.repoFork, 'フォーク(hiro-gj)');
  assert.strictEqual(i18nDict.en.btnSave, 'Save');
  assert.strictEqual(i18nDict.ja.btnSave, '保存');
  assert.strictEqual(i18nDict.en.testSuccess, 'Connection successful: KanTanMarkdown template detected.');
  assert.strictEqual(i18nDict.ja.testSuccess, '接続成功：かんたんMarkdownテンプレートを検出しました。');
});

test('3. background.js の初期値フォールバックおよびURL解決ロジック検証', (t) => {
  const bgContent = fs.readFileSync(path.join(repoRoot, 'background.js'), 'utf-8');

  // フォールバックコードの存在
  assert.ok(bgContent.includes("settings.repo_type !== 'original'"), 'original 設定時の安全フォールバックロジックが存在すること');
  assert.ok(bgContent.includes("settings.repo_type : 'fork'"), '未設定時のフォールバック repo_type が fork であること');
  assert.ok(bgContent.includes("'https://github.com/hiro-gj/KanTanMarkdown'"), '未設定時のフォールバックURLが hiro-gj であること');
  assert.ok(bgContent.includes("templateBaseUrl = 'https://hiro-gj.github.io/KanTanMarkdown'"), 'デフォルト templateBaseUrl が hiro-gj であること');

  // parseGitHubRepoUrl と buildTemplateCandidateUrls の動作検証
  const parseMatch = bgContent.match(/function parseGitHubRepoUrl[\s\S]*?function buildTemplateCandidateUrls[\s\S]*?\n}/);
  assert.ok(parseMatch, 'URL解析・候補生成関数が定義されていること');
  const { parseGitHubRepoUrl, buildTemplateCandidateUrls } = new Function(`${parseMatch[0]}; return { parseGitHubRepoUrl, buildTemplateCandidateUrls };`)();

  // (a) 標準リポジトリURL
  const rootParsed = parseGitHubRepoUrl('https://github.com/hiro-gj/KanTanMarkdown');
  assert.deepStrictEqual(rootParsed, { username: 'hiro-gj', repo: 'KanTanMarkdown', subPath: '' });
  const rootCandidates = buildTemplateCandidateUrls(rootParsed, 'ktm-lite.html');
  assert.strictEqual(rootCandidates[0], 'https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html');

  // (b) /tree/master/dist/preview 指定URL
  const previewParsed = parseGitHubRepoUrl('https://github.com/hiro-gj/KanTanMarkdown/tree/master/dist/preview');
  assert.deepStrictEqual(previewParsed, { username: 'hiro-gj', repo: 'KanTanMarkdown', subPath: 'dist/preview' });
  const previewCandidates = buildTemplateCandidateUrls(previewParsed, 'ktm-lite.html');
  assert.strictEqual(previewCandidates[0], 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html');
  assert.ok(previewCandidates.includes('https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html'));

  // (c) /blob/master/dist/preview/ktm-std.html 直接ファイル指定URL
  const blobParsed = parseGitHubRepoUrl('https://github.com/hiro-gj/KanTanMarkdown/blob/master/dist/preview/ktm-std.html');
  assert.deepStrictEqual(blobParsed, { username: 'hiro-gj', repo: 'KanTanMarkdown', subPath: 'dist/preview' });
  const blobCandidates = buildTemplateCandidateUrls(blobParsed, 'ktm-full.html');
  assert.strictEqual(blobCandidates[0], 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-full.html');

  // (d) GitHub以外の不正URLは null を返すこと
  assert.strictEqual(parseGitHubRepoUrl('https://example.com/hiro-gj/KanTanMarkdown'), null);
  assert.strictEqual(parseGitHubRepoUrl('http://github.com/hiro-gj/KanTanMarkdown'), null);
});

test('5. background.js handleExport における柔軟なテンプレート探索の結合検証', async (t) => {
  const bgContent = fs.readFileSync(path.join(repoRoot, 'background.js'), 'utf-8');
  let messageListener = null;
  let mockSettings = {};
  const requestedUrls = [];

  const mockChrome = {
    runtime: {
      onMessage: {
        addListener(fn) {
          messageListener = fn;
        }
      }
    },
    storage: {
      local: {
        async get() {
          return mockSettings;
        }
      }
    }
  };

  const mockFetch = async (url) => {
    requestedUrls.push(url);
    if (url === 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md') {
      return { ok: true, text: async () => '# Test Title\nHello' };
    }
    if (url === 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html') {
      return { ok: true, text: async () => '<html><body><textarea id="editor"></textarea><ul id="fileList"></ul></body></html>' };
    }
    return { ok: false, status: 404 };
  };

  const runner = new Function('chrome', 'fetch', bgContent);
  runner(mockChrome, mockFetch);
  assert.ok(messageListener, 'onMessage リスナーが登録されていること');

  // ケース1: tree/master/dist/preview 指定時に dist/preview/ktm-lite.html を直接取得できること
  mockSettings = {
    repo_type: 'custom',
    custom_repo_url: 'https://github.com/hiro-gj/KanTanMarkdown/tree/master/dist/preview',
    edition: 'lite'
  };
  requestedUrls.length = 0;

  const res1 = await new Promise((resolve) => {
    messageListener({
      action: 'exportMarkdown',
      payload: {
        markdownFetchUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        repoInfo: { owner: 'hiro-gj', repo: 'test', branch: 'main' },
        fileName: 'README.md',
        rawUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        attachmentsMetadata: [],
        edition: 'lite'
      }
    }, {}, resolve);
  });

  assert.strictEqual(res1.success, true, 'dist/preview URLでエクスポートが成功すること');
  assert.strictEqual(requestedUrls[1], 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html');

  // ケース2: リポジトリの別パスが入力されても候補探索で dist/preview/ktm-lite.html を見つけて成功すること
  mockSettings = {
    repo_type: 'custom',
    custom_repo_url: 'https://github.com/hiro-gj/KanTanMarkdown/tree/master',
    edition: 'lite'
  };
  requestedUrls.length = 0;

  const res2 = await new Promise((resolve) => {
    messageListener({
      action: 'exportMarkdown',
      payload: {
        markdownFetchUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        repoInfo: { owner: 'hiro-gj', repo: 'test', branch: 'main' },
        fileName: 'README.md',
        rawUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        attachmentsMetadata: [],
        edition: 'lite'
      }
    }, {}, resolve);
  });

  assert.strictEqual(res2.success, true, '候補URLを順次探索して存在する ktm-lite.html を見つけられること');
  assert.ok(requestedUrls.includes('https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html'));
});

test('4. content.js の多言語連動ロジック検証', (t) => {
  const contentJs = fs.readFileSync(path.join(repoRoot, 'content.js'), 'utf-8');

  // 初期ボタンラベルが英語であること
  assert.ok(contentJs.includes("btn.textContent = 'Export to KanTanMarkdown'"), 'ボタン初期テキストが英語であること');
  // 日本語時の切り替え
  assert.ok(contentJs.includes("btn.textContent = 'かんたんMarkdownへエクスポート'"), '日本語時に日本語ラベルへ切り替わること');

  // モーダルタイトルの多言語切り替え
  assert.ok(contentJs.includes("isJa ? 'エクスポートエディションの選択' : 'Select Export Edition'"), 'モーダルタイトルが多言語化されていること');
  assert.ok(contentJs.includes("isJa ? 'キャンセル' : 'Cancel'"), 'モーダルキャンセルボタンが多言語化されていること');
  assert.ok(contentJs.includes("isJa ? 'エクスポート' : 'Export'"), 'モーダルエクスポートボタンが多言語化されていること');
  assert.ok(contentJs.includes("isJa ? 'エクスポート中...' : 'Exporting...'"), 'エクスポート中ラベルが多言語化されていること');
});

