const i18nDict = {
  en: {
    pageTitle: 'KanTanMarkdown Conversion Extension Settings',
    officialRepoLink: 'KanTanMarkdown Original Repository (Archived) here',
    labelLanguage: 'Language',
    labelRepoType: 'KanTanMarkdown Repository Selection',
    repoOriginal: 'Original (tatesuke)',
    repoFork: 'Fork (hiro-gj)',
    repoCustom: 'Other (Custom Repository URL)',
    customRepoUrlPlaceholder: 'https://github.com/username/repository',
    labelEdition: 'Edition Selection',
    editionLite: 'Lite Edition',
    editionStandard: 'Standard Edition',
    editionFull: 'Full Edition',
    btnSave: 'Save',
    btnTest: 'Test Connection',
    btnCancel: 'Cancel',
    toastSaved: 'Settings saved successfully',
    alertInvalidUrl: 'Invalid custom repository URL format.',
    testErrorInvalidUrl: 'Error: Invalid URL format. (e.g. https://github.com/username/repository)',
    testTesting: 'Testing connection...',
    testPermissionDenied: 'Connection failed: Host permission was denied.',
    testSuccess: 'Connection successful: KanTanMarkdown template detected.',
    testErrorTemplateNotFound: 'Connection test error: Template not found. Please check GitHub Pages publication status.',
    testErrorNetwork: 'Connection failed: Network or server error occurred.'
  },
  ja: {
    pageTitle: 'かんたんMarkdown変換 拡張機能設定',
    officialRepoLink: 'かんたんMarkdown オリジナルリポジトリ（アーカイブ）はこちら',
    labelLanguage: '言語選択',
    labelRepoType: 'かんたんMarkdownリポジトリ選択',
    repoOriginal: 'オリジナル(tatesuke)',
    repoFork: 'フォーク(hiro-gj)',
    repoCustom: 'その他（カスタムリポジトリURL入力）',
    customRepoUrlPlaceholder: 'https://github.com/ユーザー名/リポジトリ名',
    labelEdition: 'エディション選択',
    editionLite: 'Liteエディション',
    editionStandard: 'Standardエディション',
    editionFull: 'Fullエディション',
    btnSave: '保存',
    btnTest: '接続テスト',
    btnCancel: 'キャンセル',
    toastSaved: '設定を保存しました',
    alertInvalidUrl: 'カスタムリポジトリURLの形式が正しくありません。',
    testErrorInvalidUrl: 'エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)',
    testTesting: '接続テスト中...',
    testPermissionDenied: '接続失敗：拡張機能へのホスト権限の承認が拒否されました。',
    testSuccess: '接続成功：かんたんMarkdownテンプレートを検出しました。',
    testErrorTemplateNotFound: '接続テストエラー：テンプレートが見つかりません。GitHub Pagesの公開状態を確認してください。',
    testErrorNetwork: '接続失敗：サーバーへの疎通エラーが発生しました。'
  }
};


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

document.addEventListener('DOMContentLoaded', () => {
  const languageRadios = document.querySelectorAll('input[name="language"]');
  const repoTypeRadios = document.querySelectorAll('input[name="repo_type"]');
  const customRepoUrlInput = document.getElementById('custom_repo_url');
  const editionRadios = document.querySelectorAll('input[name="edition"]');
  const saveBtn = document.getElementById('save-btn');
  const testBtn = document.getElementById('test-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const testResult = document.getElementById('test-result');
  const toast = document.getElementById('toast');

  let currentLanguage = 'en';
  let currentTestState = null;

  function applyLanguage(lang) {
    currentLanguage = lang;
    const dict = i18nDict[lang] || i18nDict.en;
    document.documentElement.lang = lang;
    document.title = dict.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    if (customRepoUrlInput) {
      customRepoUrlInput.placeholder = dict.customRepoUrlPlaceholder;
    }

    if (currentTestState && dict[currentTestState]) {
      testResult.textContent = dict[currentTestState];
    }
  }

  // 設定のロード（初期値フォールバック含む）
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['language', 'repo_type', 'custom_repo_url', 'edition'], (data) => {
      const lang = data.language || 'en';
      currentLanguage = lang;
      const targetLangRadio = document.querySelector(`input[name="language"][value="${lang}"]`);
      if (targetLangRadio) {
        targetLangRadio.checked = true;
      }

      // 保存された repo_type を取得（未設定時は fork）
      const repoType = data.repo_type || 'fork';
      const targetRepoRadio = document.querySelector(`input[name="repo_type"][value="${repoType}"]`);
      if (targetRepoRadio) {
        targetRepoRadio.checked = true;
      }
      toggleCustomRepoInput(repoType);

      if (data.custom_repo_url) {
        customRepoUrlInput.value = data.custom_repo_url;
      } else if (repoType === 'original') {
        customRepoUrlInput.value = 'https://github.com/tatesuke/KanTanMarkdown';
      } else {
        customRepoUrlInput.value = 'https://github.com/hiro-gj/KanTanMarkdown';
      }

      const edition = data.edition || 'lite';
      const targetEdition = document.querySelector(`input[name="edition"][value="${edition}"]`);
      if (targetEdition) {
        targetEdition.checked = true;
      }

      applyLanguage(lang);
    });
  } else {
    // ブラウザ単体テスト用フォールバック
    applyLanguage('en');
  }

  // 言語ラジオボタン変更イベント
  languageRadios.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  });

  // ラジオボタン変更イベント
  repoTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleCustomRepoInput(e.target.value);
    });
  });

  function toggleCustomRepoInput(value) {
    customRepoUrlInput.disabled = false;
    testBtn.disabled = false;
    if (value === 'custom') {
      if (!customRepoUrlInput.value) {
        customRepoUrlInput.value = 'https://github.com/hiro-gj/KanTanMarkdown';
      }
    } else if (value === 'fork') {
      customRepoUrlInput.value = 'https://github.com/hiro-gj/KanTanMarkdown';
    } else if (value === 'original') {
      customRepoUrlInput.value = 'https://github.com/tatesuke/KanTanMarkdown';
    } else {
      customRepoUrlInput.disabled = true;
      testBtn.disabled = true;
      customRepoUrlInput.value = '';
      testResult.textContent = '';
      testResult.className = '';
      currentTestState = null;
    }
  }

  // 接続テストボタンイベント
  testBtn.addEventListener('click', () => {
    const url = customRepoUrlInput.value.trim();
    testResult.textContent = '';
    testResult.className = '';
    currentTestState = null;

    const dict = i18nDict[currentLanguage] || i18nDict.en;
    const parsed = parseGitHubRepoUrl(url);

    if (!parsed) {
      currentTestState = 'testErrorInvalidUrl';
      testResult.textContent = dict.testErrorInvalidUrl;
      testResult.className = 'error';
      return;
    }

    currentTestState = 'testTesting';
    testResult.textContent = dict.testTesting;
    testResult.className = '';

    const selectedEdition = document.querySelector('input[name="edition"]:checked')?.value || 'lite';
    const editionTemplates = {
      lite: 'ktm-lite.html',
      standard: 'ktm-std.html',
      full: 'ktm-full.html'
    };
    const templateFile = editionTemplates[selectedEdition] || 'ktm-lite.html';
    const candidateUrls = buildTemplateCandidateUrls(parsed, templateFile);
    const targetUrl = candidateUrls[0];

    const executeFetch = async () => {
      const fetchDict = i18nDict[currentLanguage] || i18nDict.en;
      let hadNetworkError = false;

      for (const candidateUrl of candidateUrls) {
        try {
          const response = await fetch(candidateUrl, { method: 'HEAD' });
          if (response && response.ok) {
            currentTestState = 'testSuccess';
            testResult.textContent = fetchDict.testSuccess;
            testResult.className = 'success';
            return;
          }
          hadNetworkError = false;
        } catch {
          hadNetworkError = true;
        }
      }

      if (hadNetworkError) {
        currentTestState = 'testErrorNetwork';
        testResult.textContent = fetchDict.testErrorNetwork;
        testResult.className = 'error';
      } else {
        currentTestState = 'testErrorTemplateNotFound';
        testResult.textContent = fetchDict.testErrorTemplateNotFound;
        testResult.className = 'error';
      }
    };

    if (typeof chrome !== 'undefined' && chrome.permissions && chrome.permissions.contains) {
      const origin = new URL(targetUrl).origin + '/*';
      chrome.permissions.contains({ origins: [origin] }, (hasPermission) => {
        if (!hasPermission) {
          chrome.permissions.request({ origins: [origin] }, (granted) => {
            if (granted) {
              executeFetch();
            } else {
              currentTestState = 'testPermissionDenied';
              testResult.textContent = dict.testPermissionDenied;
              testResult.className = 'error';
            }
          });
        } else {
          executeFetch();
        }
      });
    } else {
      executeFetch();
    }
  });

  // 保存ボタンイベント
  saveBtn.addEventListener('click', () => {
    const dict = i18nDict[currentLanguage] || i18nDict.en;
    const repoType = document.querySelector('input[name="repo_type"]:checked')?.value || 'fork';
    let customRepoUrl = customRepoUrlInput.value.trim();
    const edition = document.querySelector('input[name="edition"]:checked')?.value || 'lite';

    if (repoType === 'fork' && !customRepoUrl) {
      customRepoUrl = 'https://github.com/hiro-gj/KanTanMarkdown';
    } else if (repoType === 'original' && !customRepoUrl) {
      customRepoUrl = 'https://github.com/tatesuke/KanTanMarkdown';
    }

    if (!parseGitHubRepoUrl(customRepoUrl)) {
      alert(dict.alertInvalidUrl);
      return;
    }

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        language: currentLanguage,
        repo_type: repoType,
        custom_repo_url: customRepoUrl,
        edition: edition
      }, () => {
        showToast();
        setTimeout(() => {
          window.close();
        }, 1000);
      });
    } else {
      showToast();
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  });

  // キャンセルボタンイベント
  cancelBtn.addEventListener('click', () => {
    window.close();
  });

  function showToast() {
    const dict = i18nDict[currentLanguage] || i18nDict.en;
    toast.textContent = dict.toastSaved;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 1500);
  }
});