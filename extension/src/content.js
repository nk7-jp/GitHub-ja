// GitHub-ja — GitHub の画面を日本語にして、用語に説明を付ける
//
// しくみ
//   1. 画面の文字（テキストノード）を 1 つずつ見て、辞書のキーと「完全一致」したものだけ置き換える
//   2. コード・README・コメント・題名・名前などユーザーが書いた部分は、最初から見ない（EXCLUDE）
//   3. GitHub はページを部分的に書き換えるので、MutationObserver で変わった所だけ訳し直す
//   4. 用語を含む要素には data-ghja-term を付け、カーソルを乗せると説明を出す
//   5. 元の英語は覚えておき、オフにしたらその場で元に戻す
(() => {
	'use strict';
	const DICT = globalThis.GHJA_DICT;
	const TERMS = globalThis.GHJA_TERMS;
	if (!DICT || !TERMS || globalThis.__ghjaLoaded) return;
	globalThis.__ghjaLoaded = true;

	const hasChrome = typeof chrome !== 'undefined' && chrome.storage;
	// termStyle：用語の出し方　en＝英語のまま（説明は出る）／both＝カタカナ (English)／ja＝カタカナだけ
	const DEFAULTS = { enabled: true, termStyle: 'en', tooltips: true, collect: false };
	let settings = Object.assign({}, DEFAULTS);

	// ---------------------------------------------------------------- 訳さない場所
	const EXCLUDE = [
		'script', 'style', 'noscript', 'template', 'svg',
		'pre', 'code', 'kbd', 'samp', 'textarea', 'input', 'select', 'option', '[contenteditable]', '[contenteditable="true"]',
		// README・コメント・コード
		'.markdown-body', '.comment-body', '.js-comment-body', '.blob-code', '.blob-wrapper', '.react-code-lines',
		'.react-code-file-contents', '.react-blob-print-hide', '.js-file-line-container', '.diff-table', '.highlight',
		// 名前・題名・説明（ユーザーが付けたもの）
		'a[href*="/commit/"]', 'a[href*="/tree/"]', 'a[href*="/blob/"]', 'a[href*="/releases/tag/"]',
		'.commit-title', '.commit-desc', '.commit-message', '.markdown-title', '.js-issue-title', 'bdi',
		'[data-testid="issue-title"]', '[data-testid="issue-pr-title-link"]', '[data-testid="listitem-title-link"]',
		'[data-hovercard-type]', '.author', '.IssueLabel', '.topic-tag', '.branch-name', '.commit-ref', '.ref-name',
		'[itemprop="name"]', '[itemprop="description"]', '[itemprop="additionalName"]', '.p-name', '.p-nickname',
		'.vcard-names', '.user-profile-bio', '.repo', '.wb-break-all',
		// 検索（ここを触ると検索が動かなくなる報告が他の拡張機能であったため）
		'qbsearch-input', 'query-builder', '.header-search-button', '[data-target="qbsearch-input.inputButton"]',
		// 翻訳しない印・この拡張機能自身
		'.notranslate', '[translate="no"]', '.ghja-skip', '#ghja-tip-host'
	].join(',');

	// ---------------------------------------------------------------- 訳す
	// 辞書の値 '[[pr]]を作成' → { text: 'Pull requestを作成'（設定によって 'プルリクエスト (Pull request)を作成'）, terms: ['pr'] }
	function render(value) {
		const terms = [];
		const text = value.replace(/\[\[([a-z]+)(?:\|([^\]]+))?\]\]/g, (m, id, en) => {
			const t = TERMS[id];
			if (!t) return en || id;
			terms.push(id);
			const english = en || t.en;
			if (settings.termStyle === 'ja' || t.plain) return t.ja;
			if (settings.termStyle !== 'both' || t.ja.toLowerCase() === english.toLowerCase()) return english;
			return t.ja + ' (' + english + ')';
		});
		return { text, terms };
	}

	function translate(raw) {
		const key = raw.replace(/\s+/g, ' ').trim();
		if (!key || !/[A-Za-z]/.test(key)) return null;
		let value = Object.prototype.hasOwnProperty.call(DICT.exact, key) ? DICT.exact[key] : null;
		if (value === null) {
			for (const [re, rep] of DICT.patterns) {
				if (re.test(key)) { value = key.replace(re, rep); break; }
			}
		}
		if (value === null) return null;
		const r = render(value);
		// 前後の空白は元のまま残す（レイアウトが崩れないように）
		const lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
		r.text = lead + r.text + tail;
		return r;
	}

	// ---------------------------------------------------------------- 元に戻すための記録
	const textRecords = new Map();   // Text → { orig, done }
	const attrRecords = new Map();   // Element → { attr: orig }
	const termEls = new Set();       // data-ghja-term を付けた要素

	function prune() {
		for (const n of textRecords.keys()) if (!n.isConnected) textRecords.delete(n);
		for (const n of attrRecords.keys()) if (!n.isConnected) attrRecords.delete(n);
		for (const n of termEls) if (!n.isConnected) termEls.delete(n);
	}

	function markTerms(el, terms) {
		if (!el || !terms.length) return;
		const cur = (el.getAttribute('data-ghja-term') || '').split(' ').filter(Boolean);
		for (const t of terms) if (!cur.includes(t)) cur.push(t);
		el.setAttribute('data-ghja-term', cur.join(' '));
		termEls.add(el);
	}

	function doText(node) {
		const val = node.nodeValue;
		const rec = textRecords.get(node);
		if (rec && val === rec.done) return; // 自分で訳したまま
		const r = translate(val);
		if (!r) {
			if (rec) textRecords.delete(node); // GitHub が別の文字に書き換えた
			if (settings.collect) collect(node, val);
			return;
		}
		textRecords.set(node, { orig: val, done: r.text });
		node.nodeValue = r.text;
		markTerms(node.parentElement, r.terms);
	}

	const ATTRS = ['placeholder', 'title'];
	function doAttrs(el) {
		if (el.localName === 'relative-time' || el.localName === 'time-ago' || el.localName === 'local-time') {
			// 日付は GitHub の部品自体が日本語で表示してくれる
			if (el.getAttribute('lang') !== 'ja') {
				const rec = attrRecords.get(el) || {};
				if (!('lang' in rec)) rec.lang = el.getAttribute('lang');
				attrRecords.set(el, rec);
				el.setAttribute('lang', 'ja');
			}
			return;
		}
		for (const a of ATTRS) {
			if (!el.hasAttribute(a)) continue;
			const v = el.getAttribute(a);
			const rec = attrRecords.get(el);
			if (rec && rec['_' + a] === v) continue;
			const r = translate(v);
			if (!r) continue;
			const nrec = rec || {};
			nrec[a] = v; nrec['_' + a] = r.text.trim();
			attrRecords.set(el, nrec);
			el.setAttribute(a, r.text.trim());
		}
	}

	// 入力欄の placeholder は訳したい（入力欄そのものは EXCLUDE に入っているので別に扱う）
	function doInputPlaceholder(el) {
		if (!el.hasAttribute('placeholder') || el.closest('qbsearch-input, query-builder')) return;
		const v = el.getAttribute('placeholder');
		const rec = attrRecords.get(el);
		if (rec && rec._placeholder === v) return;
		const r = translate(v);
		if (!r) return;
		const nrec = rec || {};
		nrec.placeholder = v; nrec._placeholder = r.text.trim();
		attrRecords.set(el, nrec);
		el.setAttribute('placeholder', r.text.trim());
	}

	function walk(root) {
		if (!settings.enabled) return;
		if (root.nodeType === 3) {
			if (root.parentElement && !root.parentElement.closest(EXCLUDE)) doText(root);
			return;
		}
		if (root.nodeType !== 1) return;
		if (root.closest(EXCLUDE)) {
			if (root.matches('input, textarea')) doInputPlaceholder(root);
			root.querySelectorAll && root.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(doInputPlaceholder);
			return;
		}
		const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
			acceptNode(n) {
				if (n.nodeType === 3) return NodeFilter.FILTER_ACCEPT;
				if (n.matches(EXCLUDE)) {
					if (n.matches('input, textarea')) doInputPlaceholder(n);
					else n.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(doInputPlaceholder);
					return NodeFilter.FILTER_REJECT;
				}
				doAttrs(n);
				return NodeFilter.FILTER_SKIP;
			}
		});
		if (root.nodeType === 1) doAttrs(root);
		const texts = [];
		while (tw.nextNode()) texts.push(tw.currentNode);
		texts.forEach(doText);
	}

	// ---------------------------------------------------------------- 元に戻す
	function restoreAll() {
		for (const [n, rec] of textRecords) if (n.isConnected && n.nodeValue === rec.done) n.nodeValue = rec.orig;
		textRecords.clear();
		for (const [el, rec] of attrRecords) {
			for (const a of Object.keys(rec)) {
				if (a[0] === '_') continue;
				if (rec[a] === null) el.removeAttribute(a); else el.setAttribute(a, rec[a]);
			}
		}
		attrRecords.clear();
		for (const el of termEls) el.removeAttribute('data-ghja-term');
		termEls.clear();
		hideTip();
	}

	// ---------------------------------------------------------------- 変化を見張る
	let queue = new Set(), scheduled = false;
	function flush() {
		scheduled = false;
		const items = [...queue];
		queue.clear();
		observer.disconnect();
		try {
			for (const n of items) if (n.isConnected) walk(n);
		} finally {
			observe();
		}
	}
	function enqueue(n) {
		queue.add(n);
		if (!scheduled) { scheduled = true; requestAnimationFrame(flush); }
	}
	const observer = new MutationObserver((list) => {
		if (!settings.enabled) return;
		for (const m of list) {
			if (m.type === 'childList') m.addedNodes.forEach(enqueue);
			else if (m.type === 'characterData') enqueue(m.target);
			else if (m.type === 'attributes') enqueue(m.target);
		}
	});
	function observe() {
		observer.observe(document.body, {
			childList: true, subtree: true, characterData: true,
			attributes: true, attributeFilter: ['placeholder', 'title']
		});
	}

	// ---------------------------------------------------------------- 用語の説明（ホバー）
	let tipHost = null, tipBox = null, tipTimer = 0, tipFor = null;
	function ensureTip() {
		if (tipHost) return;
		tipHost = document.createElement('div');
		tipHost.id = 'ghja-tip-host';
		const shadow = tipHost.attachShadow({ mode: 'open' });
		shadow.innerHTML = `<style>
			.tip { position: fixed; z-index: 2147483647; max-width: 340px; padding: 10px 12px; border-radius: 10px;
				background: #1f2328; color: #f0f6fc; font: 13px/1.6 -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", "Meiryo", sans-serif;
				box-shadow: 0 8px 24px rgba(0,0,0,.35); pointer-events: none; opacity: 0; transform: translateY(4px);
				transition: opacity .12s, transform .12s; }
			.tip.show { opacity: 1; transform: none; }
			.term + .term { margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.15); }
			.h { font-weight: 600; font-size: 13.5px; }
			.en { opacity: .65; font-weight: 400; margin-left: 4px; }
			.d { margin-top: 2px; }
			.m { margin-top: 4px; opacity: .75; font-size: 12px; }
			.brand { margin-top: 6px; opacity: .45; font-size: 10.5px; text-align: right; }
		</style><div class="tip" role="tooltip"></div>`;
		tipBox = shadow.querySelector('.tip');
		document.documentElement.appendChild(tipHost);
	}
	function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
	function showTip(el) {
		ensureTip();
		const ids = (el.getAttribute('data-ghja-term') || '').split(' ').filter(id => TERMS[id]);
		if (!ids.length) return;
		tipBox.innerHTML = ids.map(id => {
			const t = TERMS[id];
			return `<div class="term"><div class="h">${esc(t.ja)}<span class="en">${esc(t.en)}</span></div>` +
				`<div class="d">${esc(t.desc)}</div>${t.more ? `<div class="m">${esc(t.more)}</div>` : ''}</div>`;
		}).join('') + '<div class="brand">GitHub-ja</div>';
		const r = el.getBoundingClientRect();
		tipBox.classList.remove('show');
		tipBox.style.left = '0px'; tipBox.style.top = '0px';
		const w = tipBox.offsetWidth, h = tipBox.offsetHeight;
		let left = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
		let top = r.bottom + 8;
		if (top + h > window.innerHeight - 8) top = Math.max(8, r.top - h - 8);
		tipBox.style.left = left + 'px'; tipBox.style.top = top + 'px';
		tipBox.classList.add('show');
	}
	function hideTip() {
		clearTimeout(tipTimer);
		tipFor = null;
		if (tipBox) tipBox.classList.remove('show');
	}
	document.addEventListener('mouseover', (e) => {
		if (!settings.enabled || !settings.tooltips) return;
		const el = e.target instanceof Element ? e.target.closest('[data-ghja-term]') : null;
		if (el === tipFor) return;
		hideTip();
		if (!el) return;
		tipFor = el;
		tipTimer = setTimeout(() => { if (tipFor === el) showTip(el); }, 350);
	}, true);
	document.addEventListener('scroll', hideTip, true);
	document.addEventListener('mousedown', hideTip, true);

	// ---------------------------------------------------------------- 訳されていない文字を集める（任意）
	const missing = new Map();
	let missingTimer = 0;
	function collect(node, val) {
		const key = val.replace(/\s+/g, ' ').trim();
		if (key.length < 2 || key.length > 90 || !/[A-Za-z]{2}/.test(key)) return;
		if (/^[\w.-]+\/[\w.-]+$/.test(key) || /^[0-9a-f]{7,40}$/.test(key) || /^[@#]/.test(key)) return;
		const p = node.parentElement;
		if (!p || !p.closest('header, nav, button, a, label, summary, th, h1, h2, h3, h4, [role], .btn, .Label, .Counter, .Box-header, .Subhead, dialog, details-menu, action-menu, .Layout-sidebar, aside')) return;
		const cur = missing.get(key) || { n: 0, path: location.pathname.replace(/^\/[^/]+\/[^/]+/, '/:owner/:repo') };
		cur.n++;
		missing.set(key, cur);
		clearTimeout(missingTimer);
		missingTimer = setTimeout(saveMissing, 3000);
	}
	function saveMissing() {
		if (!hasChrome || !missing.size) return;
		chrome.storage.local.get({ missing: {} }, (got) => {
			const all = got.missing || {};
			for (const [k, v] of missing) {
				const old = all[k] || { n: 0, path: v.path };
				all[k] = { n: old.n + v.n, path: old.path };
			}
			missing.clear();
			const keys = Object.keys(all);
			if (keys.length > 1500) {
				keys.sort((a, b) => all[a].n - all[b].n).slice(0, keys.length - 1500).forEach(k => delete all[k]);
			}
			chrome.storage.local.set({ missing: all });
		});
	}

	// ---------------------------------------------------------------- 起動・設定の変更
	function applyClass() {
		document.documentElement.classList.toggle('ghja-tips', settings.enabled && settings.tooltips);
	}
	function start() {
		applyClass();
		if (!settings.enabled) return;
		document.documentElement.setAttribute('data-ghja', '1');
		walk(document.body);
		observe();
		setInterval(prune, 30000);
	}
	function retranslate() {
		observer.disconnect();
		restoreAll();
		applyClass();
		if (settings.enabled) { walk(document.body); observe(); }
	}

	// GitHub の React が画面を組み立て終わるのを少し待ってから始める
	function boot() {
		const go = () => (window.requestIdleCallback || setTimeout)(start, { timeout: 800 });
		if (document.readyState === 'complete') go();
		else window.addEventListener('load', go, { once: true });
	}

	if (hasChrome) {
		chrome.storage.sync.get(DEFAULTS, (s) => { settings = Object.assign({}, DEFAULTS, s); boot(); });
		chrome.storage.onChanged.addListener((changes, area) => {
			if (area !== 'sync') return;
			let changed = false;
			for (const k of Object.keys(DEFAULTS)) {
				if (changes[k]) { settings[k] = changes[k].newValue; changed = true; }
			}
			if (changed) retranslate();
		});
	} else {
		boot();
	}

	// テスト用
	globalThis.__ghja = { translate, walk, restoreAll, settings: () => settings, set: (s) => { Object.assign(settings, s); } };
})();
