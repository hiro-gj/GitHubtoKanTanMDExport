document.addEventListener('DOMContentLoaded', () => {
  const repoTypeRadios = document.querySelectorAll('input[name="repo_type"]');
  const customRepoUrlInput = document.getElementById('custom_repo_url');
  const editionRadios = document.querySelectorAll('input[name="edition"]');
  const saveBtn = document.getElementById('save-btn');
  const testBtn = document.getElementById('test-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const testResult = document.getElementById('test-result');
  const toast = document.getElementById('toast');

  // 設定のロード
  chrome.storage.local.get(['repo_type', 'custom_repo_url', 'edition'], (data) => {
    if (data.repo_type) {
      document.querySelector(`input[name="repo_type"][value="${data.repo_type}"]`).checked = true;
      toggleCustomRepoInput(data.repo_type);
    }
    if (data.custom_repo_url) {
      customRepoUrlInput.value = data.custom_repo_url;
    }
    if (data.edition) {
      const targetEdition = document.querySelector(`input[name="edition"][value="${data.edition}"]`);
      if (targetEdition) {
        targetEdition.checked = true;
      }
    }
  });

  // ラジオボタン変更イベント
  repoTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleCustomRepoInput(e.target.value);
    });
  });

  function toggleCustomRepoInput(value) {
    if (value === 'custom') {
      customRepoUrlInput.disabled = false;
      testBtn.disabled = false;
    } else {
      customRepoUrlInput.disabled = true;
      testBtn.disabled = true;
      customRepoUrlInput.value = '';
      testResult.textContent = '';
      testResult.className = '';
    }
  }

  // 接続テストボタンイベント
  testBtn.addEventListener('click', () => {
    const url = customRepoUrlInput.value.trim();
    testResult.textContent = '';
    testResult.className = '';

    // バリデーション
    const githubRepoPattern = /^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/;
    const match = url.match(githubRepoPattern);

    if (!match) {
      testResult.textContent = 'エラー：URLの形式が正しくありません。(形式: https://github.com/ユーザー名/リポジトリ名)';
      testResult.className = 'error';
      return;
    }

    testResult.textContent = '接続テスト中...';
    testResult.className = '';

    const username = match[1];
    const repo = match[2];
    // GitHub Pagesのktm-lite.htmlにアクセス
    const targetUrl = `https://${username}.github.io/${repo}/dist/ktm-lite.html`;

    fetch(targetUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          testResult.textContent = '接続成功：かんたんMarkdownテンプレートを検出しました。';
          testResult.className = 'success';
        } else {
          testResult.textContent = '接続テストエラー：テンプレートが見つかりません。GitHub Pagesの公開状態を確認してください。';
          testResult.className = 'error';
        }
      })
      .catch(error => {
        testResult.textContent = '接続失敗：サーバーへの疎通エラーが発生しました。';
        testResult.className = 'error';
      });
  });

  // 保存ボタンイベント
  saveBtn.addEventListener('click', () => {
    const repoType = document.querySelector('input[name="repo_type"]:checked').value;
    const customRepoUrl = customRepoUrlInput.value.trim();
    const edition = document.querySelector('input[name="edition"]:checked').value;

    if (repoType === 'custom') {
      const githubRepoPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/;
      if (!githubRepoPattern.test(customRepoUrl)) {
        alert('カスタムリポジトリURLの形式が正しくありません。');
        return;
      }
    }

    chrome.storage.local.set({
      repo_type: repoType,
      custom_repo_url: customRepoUrl,
      edition: edition
    }, () => {
      showToast();
      setTimeout(() => {
        window.close();
      }, 1000);
    });
  });

  // キャンセルボタンイベント
  cancelBtn.addEventListener('click', () => {
    window.close();
  });

  function showToast() {
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 1500);
  }
});