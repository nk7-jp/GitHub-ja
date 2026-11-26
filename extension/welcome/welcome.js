// GitHub-ja の最初の設定画面
const DICT = globalThis.GHJA_DICT;
const TERMS = globalThis.GHJA_TERMS;

// content.js と同じ書き方で、辞書の値を表示用の HTML にする（見本用）
function render(value, style) {
	const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
	return esc(value).replace(/\[\[([a-z]+)(?:\|([^\]]+))?\]\]/g, (m, id, en) => {
		const t = TERMS[id];
		if (!t) return en || id;
		const english = en || t.en;
		let text;
		if (style === 'ja' || t.plain) text = t.ja;
		else if (style !== 'both' || t.ja.toLowerCase() === english.toLowerCase()) text = english;
		else text = t.ja + ' (' + english + ')';
		return `<span class="t" data-term="${id}">${text}</span>`;
	});
}
const tr = (key, style) => render(DICT.exact[key] || key, style);

// 見本を作る（GitHub のリポジトリのページ風）
document.querySelectorAll('.mock').forEach((box) => {
	const s = box.dataset.style;
	box.innerHTML =
		`<span class="nav">${['Code', 'Issues', 'Pull requests', 'Actions'].map((k) => `<span>${tr(k, s)}</span>`).join('')}</span>` +
		`<span class="body">` +
		`<span class="btn">${tr('Fork', s)} 12</span>` +
		`<span class="btn green">${tr('New pull request', s)}</span>` +
		`<span>${tr('Latest commit', s)} ・ ${tr('Default branch', s)}</span>` +
		`</span>`;
});

// 用語の説明（見本の上でも、試し用の言葉の上でも出す）
const tip = document.getElementById('tip');
function showTip(el) {
	const t = TERMS[el.dataset.term];
	if (!t || !document.getElementById('tooltips').checked) return;
	tip.innerHTML = `<div class="h">${t.ja}<span class="en">${t.en}</span></div><div>${t.desc}</div>${t.more ? `<div class="m">${t.more}</div>` : ''}`;
	tip.hidden = false;
	const r = el.getBoundingClientRect();
	const w = tip.offsetWidth, h = tip.offsetHeight;
	tip.style.left = Math.min(Math.max(8, r.left), innerWidth - w - 8) + 'px';
	tip.style.top = (r.bottom + h + 16 > innerHeight ? r.top - h - 8 : r.bottom + 8) + 'px';
}
document.addEventListener('mouseover', (e) => {
	const el = e.target.closest('[data-term]');
	if (el) showTip(el); else tip.hidden = true;
});
document.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.term) showTip(e.target); });
document.addEventListener('focusout', () => { tip.hidden = true; });

// 今の設定を読み込む（2回目以降に開いたとき用）
const DEFAULTS = { termStyle: 'ja', tooltips: true, mt: false };
chrome.storage.sync.get(DEFAULTS, (s) => {
	const r = document.querySelector(`input[name=termStyle][value="${s.termStyle}"]`) || document.querySelector('input[value=ja]');
	r.checked = true;
	document.getElementById('tooltips').checked = !!s.tooltips;
	document.getElementById('mt').checked = !!s.mt;
});

// Chrome 内蔵の翻訳が使えるか
const MT_OPTS = { sourceLanguage: 'en', targetLanguage: 'ja' };
const mtStatus = document.getElementById('mtStatus');
let mtAvail = 'unavailable';
(async () => {
	if (typeof Translator === 'undefined') {
		mtStatus.textContent = 'この Chrome では使えません（パソコン版の Chrome 138 以降が必要です）。';
		document.getElementById('mt').disabled = true;
		return;
	}
	try { mtAvail = await Translator.availability(MT_OPTS); } catch (e) { mtAvail = 'unavailable'; }
	if (mtAvail === 'unavailable') {
		mtStatus.textContent = 'この端末では使えません。';
		document.getElementById('mt').disabled = true;
	} else if (mtAvail === 'available') {
		mtStatus.textContent = '言語パックは準備できています。';
	}
})();

// 「始める」を押したときに、必要なら言語パックを準備する（クリックが必要なため）
async function prepareMt() {
	if (mtAvail !== 'downloadable' && mtAvail !== 'downloading') return;
	mtStatus.textContent = '言語パックを準備しています…';
	try {
		await Translator.create(Object.assign({}, MT_OPTS, {
			monitor(m) { m.addEventListener('downloadprogress', (e) => { mtStatus.textContent = '言語パックを準備しています… ' + Math.round((e.loaded || 0) * 100) + '%'; }); }
		}));
		mtStatus.textContent = '言語パックの準備ができました。';
	} catch (e) {
		mtStatus.textContent = '言語パックを準備できませんでした。GitHub のページでもう一度準備できます。';
	}
}

document.getElementById('start').addEventListener('click', () => {
	const termStyle = document.querySelector('input[name=termStyle]:checked').value;
	const tooltips = document.getElementById('tooltips').checked;
	const mt = document.getElementById('mt').checked;
	if (mt) prepareMt();
	chrome.storage.sync.set({ termStyle, tooltips, mt, enabled: true, onboarded: true }, () => {
		document.getElementById('start').textContent = '保存しました';
		document.getElementById('done').hidden = false;
	});
});
