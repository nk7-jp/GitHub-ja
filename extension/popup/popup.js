// GitHub-ja のポップアップ（設定）
const DEFAULTS = { enabled: true, termStyle: 'ja', tooltips: true, collect: false, mt: false };
const KEYS = Object.keys(DEFAULTS);

let mtUnsupported = false;
function syncDisabled() {
	const on = document.getElementById('enabled').checked;
	document.getElementById('termStyle').disabled = !on;
	document.getElementById('tooltips').disabled = !on;
	if (!mtUnsupported) document.getElementById('mt').disabled = !on;
}

chrome.storage.sync.get(DEFAULTS, (s) => {
	for (const k of KEYS) {
		const box = document.getElementById(k);
		const isCheck = box.type === 'checkbox';
		if (isCheck) box.checked = !!s[k]; else box.value = s[k];
		box.addEventListener('change', () => {
			chrome.storage.sync.set({ [k]: isCheck ? box.checked : box.value });
			syncDisabled();
		});
	}
	syncDisabled();
	if (s.collect) document.getElementById('dev').open = true;
});

function refreshCount() {
	chrome.storage.local.get({ missing: {} }, (got) => {
		document.getElementById('missingCount').textContent = Object.keys(got.missing || {}).length;
	});
}
refreshCount();

document.getElementById('copyMissing').addEventListener('click', (e) => {
	chrome.storage.local.get({ missing: {} }, async (got) => {
		const list = Object.entries(got.missing || {})
			.sort((a, b) => b[1].n - a[1].n)
			.map(([text, v]) => `${text}\t${v.n}\t${v.path}`);
		await navigator.clipboard.writeText('文字列\t回数\tページ\n' + list.join('\n'));
		e.target.textContent = 'コピーしました';
		setTimeout(() => { e.target.textContent = 'コピー'; }, 1500);
	});
});
document.getElementById('clearMissing').addEventListener('click', () => {
	chrome.storage.local.set({ missing: {} }, refreshCount);
});

document.getElementById('ver').textContent = 'v' + chrome.runtime.getManifest().version;

// Chrome 内蔵の翻訳が使えない環境では、切り替えを無効にして理由を出す
if (typeof Translator === 'undefined') {
	mtUnsupported = true;
	document.getElementById('mt').disabled = true;
	document.getElementById('mtNote').textContent = 'この Chrome では使えません（パソコン版 Chrome 138 以降）';
}
