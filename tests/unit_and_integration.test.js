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

  // parseGitHubRepoUrl, buildTemplateCandidateUrls, appendCacheBuster の動作検証
  const parseMatch = bgContent.match(/function parseGitHubRepoUrl[\s\S]*?function appendCacheBuster[\s\S]*?\n}/);
  assert.ok(parseMatch, 'URL解析・候補生成・キャッシュバスター関数が定義されていること');
  const { parseGitHubRepoUrl, buildTemplateCandidateUrls, appendCacheBuster } = new Function(
    `${parseMatch[0]}; return { parseGitHubRepoUrl, buildTemplateCandidateUrls, appendCacheBuster };`
  )();

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

  // (e) appendCacheBuster の動作検証（?t= 付与および &t= 付与）
  assert.strictEqual(
    appendCacheBuster('https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html', 1700000000000),
    'https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html?t=1700000000000'
  );
  assert.strictEqual(
    appendCacheBuster('https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html?foo=1', 1700000000000),
    'https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html?foo=1&t=1700000000000'
  );
  const autoBusted = appendCacheBuster('https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-std.html');
  assert.match(autoBusted, /^https:\/\/hiro-gj\.github\.io\/KanTanMarkdown\/dist\/ktm-std\.html\?t=\d+$/);
});

test('5. background.js handleExport における柔軟なテンプレート探索およびキャッシュクリア・キャッシュバスターの結合検証', async (t) => {
  const bgContent = fs.readFileSync(path.join(repoRoot, 'background.js'), 'utf-8');
  let messageListener = null;
  let mockSettings = {};
  const requestedCalls = [];
  const deletedCacheEntries = [];
  let templateVersion = 'v1';

  const mockCaches = {
    async keys() {
      return ['ktm-cache-v1'];
    },
    async open(cacheName) {
      return {
        async delete(reqOrUrl, options) {
          const target = typeof reqOrUrl === 'string' ? reqOrUrl : reqOrUrl.url;
          deletedCacheEntries.push({ cacheName, target, options });
          return true;
        },
        async keys() {
          return [
            { url: 'https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html?t=1000' },
            { url: 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-std.html' },
            { url: 'https://hiro-gj.github.io/KanTanMarkdown/assets/other.js' }
          ];
        }
      };
    }
  };

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

  const mockFetch = async (url, options) => {
    requestedCalls.push({ url, options });
    const baseUrl = url.split('?')[0];
    if (url === 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md') {
      return { ok: true, text: async () => '# Test Title\nHello' };
    }
    if (baseUrl === 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html') {
      return { ok: true, text: async () => `<html><body data-edition="lite" data-ver="${templateVersion}"><textarea id="editor"></textarea><ul id="fileList"></ul></body></html>` };
    }
    if (baseUrl === 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-std.html') {
      return { ok: true, text: async () => `<html><body data-edition="standard" data-ver="${templateVersion}"><textarea id="editor"></textarea><ul id="fileList"></ul></body></html>` };
    }
    if (baseUrl === 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-full.html') {
      return { ok: true, text: async () => `<html><body data-edition="full" data-ver="${templateVersion}"><textarea id="editor"></textarea><ul id="fileList"></ul></body></html>` };
    }
    return { ok: false, status: 404 };
  };

  const runner = new Function('chrome', 'fetch', 'caches', bgContent);
  runner(mockChrome, mockFetch, mockCaches);
  assert.ok(messageListener, 'onMessage リスナーが登録されていること');

  // ケース1: tree/master/dist/preview 指定時にキャッシュクリア・?t=付与・cache: 'no-store' で dist/preview/ktm-lite.html を取得できること
  mockSettings = {
    repo_type: 'custom',
    custom_repo_url: 'https://github.com/hiro-gj/KanTanMarkdown/tree/master/dist/preview',
    edition: 'lite'
  };
  requestedCalls.length = 0;
  deletedCacheEntries.length = 0;
  templateVersion = 'v1';

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
  assert.ok(deletedCacheEntries.length > 0, 'ktm-*.html 取得前に Cache Storage の削除処理が呼ばれていること');
  assert.ok(
    deletedCacheEntries.some(e => e.target === 'https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-lite.html' && e.options && e.options.ignoreSearch === true),
    '候補URLに対して ignoreSearch: true でキャッシュ削除が実行されること'
  );
  assert.ok(
    deletedCacheEntries.some(e => e.target === 'https://hiro-gj.github.io/KanTanMarkdown/dist/ktm-lite.html?t=1000'),
    '既存の ktm-*.html キャッシュエントリが削除対象になること'
  );
  assert.ok(
    !deletedCacheEntries.some(e => e.target === 'https://hiro-gj.github.io/KanTanMarkdown/assets/other.js'),
    'ktm-*.html 以外の無関係なエントリは削除しないこと'
  );
  assert.match(
    requestedCalls[1].url,
    /^https:\/\/hiro-gj\.github\.io\/KanTanMarkdown\/dist\/preview\/ktm-lite\.html\?t=\d+$/,
    'テンプレート取得URLに ?t=<timestamp> が付与されていること'
  );
  assert.deepStrictEqual(
    requestedCalls[1].options,
    { cache: 'no-store' },
    'テンプレート取得時に { cache: "no-store" } が指定されていること'
  );
  assert.ok(res1.payload.templateHtml.includes('data-edition="lite" data-ver="v1"'));

  // ケース2: テンプレート更新後およびエディション変更時（standard / full）に古いキャッシュが使われず最新版が取得されること
  mockSettings = {
    repo_type: 'custom',
    custom_repo_url: 'https://github.com/hiro-gj/KanTanMarkdown/tree/master',
    edition: 'lite'
  };
  requestedCalls.length = 0;
  templateVersion = 'v2-updated';

  const res2 = await new Promise((resolve) => {
    messageListener({
      action: 'exportMarkdown',
      payload: {
        markdownFetchUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        repoInfo: { owner: 'hiro-gj', repo: 'test', branch: 'main' },
        fileName: 'README.md',
        rawUrl: 'https://raw.githubusercontent.com/hiro-gj/test/main/README.md',
        attachmentsMetadata: [],
        edition: 'standard'
      }
    }, {}, resolve);
  });

  assert.strictEqual(res2.success, true, '候補URLを順次探索して存在する ktm-std.html を見つけられること');
  const templateCalls = requestedCalls.slice(1);
  assert.ok(
    templateCalls.every(c => /\?t=\d+$/.test(c.url) && c.options && c.options.cache === 'no-store'),
    'すべてのテンプレート候補リクエストに ?t= と cache: "no-store" が適用されていること'
  );
  assert.ok(
    templateCalls.some(c => c.url.startsWith('https://hiro-gj.github.io/KanTanMarkdown/dist/preview/ktm-std.html?t=')),
    '指定エディション(standard)の候補URLへ ?t= 付きでアクセスしていること'
  );
  assert.ok(
    res2.payload.templateHtml.includes('data-edition="standard" data-ver="v2-updated"'),
    '更新後の最新テンプレートかつ指定エディションが取得されていること'
  );
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

