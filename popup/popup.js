// GitHub-ja のポップアップ（設定）
const DEFAULTS = { enabled: true, showEnglish: true, tooltips: true, collect: false };
const KEYS = Object.keys(DEFAULTS);

function syncDisabled() {
	const on = document.getElementById('enabled').checked;
	document.getElementById('showEnglish').disabled = !on;
	document.getElementById('tooltips').disabled = !on;
}

chrome.storage.sync.get(DEFAULTS, (s) => {
	for (const k of KEYS) {
		const box = document.getElementById(k);
		box.checked = !!s[k];
		box.addEventListener('change', () => {
			chrome.storage.sync.set({ [k]: box.checked });
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
