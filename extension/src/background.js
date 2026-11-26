// インストールしたときに、最初の設定画面を開く
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.tabs.create({ url: chrome.runtime.getURL('welcome/welcome.html') });
	}
});
