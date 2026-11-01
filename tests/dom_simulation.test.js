const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

// 軽量DOMモック環境
class ElementMock {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attrs = { ...attrs };
    this.textContent = '';
    this.value = attrs.value || '';
    this.checked = attrs.checked !== undefined ? attrs.checked : false;
    this.disabled = attrs.disabled !== undefined ? attrs.disabled : false;
    this.className = attrs.class || '';
    this.placeholder = attrs.placeholder || '';
    this.style = {};
    this.listeners = {};
  }

  getAttribute(key) {
    return this.attrs[key] !== undefined ? this.attrs[key] : null;
  }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  click() {
    if (this.disabled) return;
    if (this.attrs.type === 'radio') {
      const name = this.attrs.name;
      allElements.filter(el => el.attrs.name === name).forEach(el => el.checked = false);
      this.checked = true;
    }
    if (this.listeners['click']) this.listeners['click'].forEach(fn => fn({ target: this }));
    if (this.listeners['change']) this.listeners['change'].forEach(fn => fn({ target: this }));
  }
}
function mockDocument() {
  allElements = [];
  const enRadio = new ElementMock('input', { type: 'radio', name: 'language', value: 'en', checked: true });
  const jaRadio = new ElementMock('input', { type: 'radio', name: 'language', value: 'ja', checked: false });
  const origRadio = new ElementMock('input', { type: 'radio', name: 'repo_type', value: 'original', disabled: true, checked: false });
  const forkRadio = new ElementMock('input', { type: 'radio', name: 'repo_type', value: 'fork', checked: true });
  const customRadio = new ElementMock('input', { type: 'radio', name: 'repo_type', value: 'custom', checked: false });
  const customUrlInput = new ElementMock('input', { id: 'custom_repo_url', value: 'https://github.com/hiro-gj/KanTanMarkdown', disabled: true });
  const editionLite = new ElementMock('input', { type: 'radio', name: 'edition', value: 'lite', checked: true });
  const saveBtn = new ElementMock('button', { id: 'save-btn', 'data-i18n': 'btnSave' });
  const testBtn = new ElementMock('button', { id: 'test-btn', 'data-i18n': 'btnTest' });
  const cancelBtn = new ElementMock('button', { id: 'cancel-btn', 'data-i18n': 'btnCancel' });
  const testResult = new ElementMock('div', { id: 'test-result' });
  const toast = new ElementMock('div', { id: 'toast', 'data-i18n': 'toastSaved' });
  const officialLink = new ElementMock('a', { id: 'official-repo-link', 'data-i18n': 'officialRepoLink' });
  const labelRepoFork = new ElementMock('span', { id: 'label-repo-fork', 'data-i18n': 'repoFork' });
  const labelRepoCustom = new ElementMock('span', { id: 'label-repo-custom', 'data-i18n': 'repoCustom' });

  allElements = [
    enRadio, jaRadio, origRadio, forkRadio, customRadio,
    customUrlInput, editionLite, saveBtn, testBtn, cancelBtn,
    testResult, toast, officialLink, labelRepoFork, labelRepoCustom
  ];

  const doc = {
    title: '',
    documentElement: { lang: 'en' },
    getElementById(id) {
      return allElements.find(el => el.attrs.id === id) || null;
    },
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="language"]') return allElements.filter(el => el.attrs.name === 'language');
      if (selector === 'input[name="repo_type"]') return allElements.filter(el => el.attrs.name === 'repo_type');
      if (selector === 'input[name="edition"]') return allElements.filter(el => el.attrs.name === 'edition');
      if (selector === '[data-i18n]') return allElements.filter(el => el.attrs['data-i18n'] !== undefined);
      if (selector.startsWith('input[name="language"][value="')) {
        const val = selector.match(/value="([^"]+)"/)[1];
        return allElements.filter(el => el.attrs.name === 'language' && el.attrs.value === val);
      }
      if (selector.startsWith('input[name="repo_type"][value="')) {
        const val = selector.match(/value="([^"]+)"/)[1];
        return allElements.filter(el => el.attrs.name === 'repo_type' && el.attrs.value === val);
      }
      if (selector.startsWith('input[name="edition"][value="')) {
        const val = selector.match(/value="([^"]+)"/)[1];
        return allElements.filter(el => el.attrs.name === 'edition' && el.attrs.value === val);
      }
      if (selector === 'input[name="repo_type"]:checked') return allElements.filter(el => el.attrs.name === 'repo_type' && el.checked);
      if (selector === 'input[name="edition"]:checked') return allElements.filter(el => el.attrs.name === 'edition' && el.checked);
      return [];
    },
    addEventListener(event, fn) {
      if (event === 'DOMContentLoaded') setTimeout(fn, 0);
    }
  };

  return { doc, elements: { enRadio, jaRadio, origRadio, forkRadio, customRadio, customUrlInput, editionLite, saveBtn, testBtn, cancelBtn, testResult, toast, officialLink, labelRepoFork, labelRepoCustom } };
}


test('DOM Simulation - options.js 全機能とユーザー要望の整合性検証', async (t) => {
  const { doc, elements } = mockDocument();
  global.document = doc;
  global.window = { close: () => {} };

  let mockStorage = {};
  global.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const res = {};
          keys.forEach(k => {
            if (mockStorage[k] !== undefined) res[k] = mockStorage[k];
          });
          cb(res);
        },
        set: (data, cb) => {
          Object.assign(mockStorage, data);
          if (cb) cb();
        }
      }
    },
    permissions: { contains: (o, cb) => cb(true) }
  };

  // options.js を評価
  const jsCode = fs.readFileSync(path.join(repoRoot, 'options.js'), 'utf-8');
  eval(jsCode);

  await new Promise(r => setTimeout(r, 20));

  // 1. 初期ロード検証
  assert.strictEqual(elements.enRadio.checked, true, '初期言語は英語');
  assert.strictEqual(elements.forkRadio.checked, true, '初期リポジトリ選択はfork (hiro-gj)');
  assert.strictEqual(elements.origRadio.disabled, true, 'オリジナルはdisabled');
  assert.strictEqual(elements.customUrlInput.value, 'https://github.com/hiro-gj/KanTanMarkdown', 'URLはhiro-gj');
  assert.strictEqual(elements.customUrlInput.disabled, true, 'fork選択時はURL非活性');
  assert.strictEqual(elements.testBtn.disabled, false, '接続テストボタンは活性');
  assert.strictEqual(elements.officialLink.textContent, 'KanTanMarkdown Original Repository (Archived) here', '公式リンクラベルがアーカイブ表示');

  // 2. ラジオボタン連動検証
  elements.customRadio.click();
  assert.strictEqual(elements.customRadio.checked, true);
  assert.strictEqual(elements.customUrlInput.disabled, false, 'その他選択時はURL欄活性化');

  elements.forkRadio.click();
  assert.strictEqual(elements.forkRadio.checked, true);
  assert.strictEqual(elements.customUrlInput.value, 'https://github.com/hiro-gj/KanTanMarkdown', 'フォークURLが再セットされる');
  assert.strictEqual(elements.customUrlInput.disabled, true, 'フォーク選択時はURL欄非活性');

  // 3. リアルタイム言語切り替え検証
  elements.jaRadio.click();
  assert.strictEqual(doc.title, 'かんたんMarkdown変換 拡張機能設定');
  assert.strictEqual(elements.officialLink.textContent, 'かんたんMarkdown オリジナルリポジトリ（アーカイブ）はこちら');
  assert.strictEqual(elements.labelRepoFork.textContent, 'フォーク(hiro-gj)');
  assert.strictEqual(elements.labelRepoCustom.textContent, 'その他（カスタムリポジトリURL入力）');
  assert.strictEqual(elements.saveBtn.textContent, '保存');
  assert.strictEqual(elements.testBtn.textContent, '接続テスト');
  assert.strictEqual(elements.cancelBtn.textContent, 'キャンセル');

  // 4. 設定保存検証
  elements.saveBtn.click();
  assert.strictEqual(mockStorage.language, 'ja');
  assert.strictEqual(mockStorage.repo_type, 'fork');
  assert.strictEqual(mockStorage.custom_repo_url, 'https://github.com/hiro-gj/KanTanMarkdown');
  assert.strictEqual(mockStorage.edition, 'lite');
});

let allElements = [];
