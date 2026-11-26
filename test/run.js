const {JSDOM}=require('jsdom');const fs=require('fs');
const html=fs.readFileSync(__dirname+'/fixture.html','utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;
for(const f of ['terms.js','dict-ja.js','content.js']) w.eval(fs.readFileSync(__dirname+'/../extension/src/'+f,'utf8'));
setTimeout(()=>{
 const d=w.document, T=s=>[...d.querySelectorAll(s)].map(e=>e.textContent.trim());
 const check=(name,got,exp)=>console.log((JSON.stringify(got)===JSON.stringify(exp)?'OK  ':'NG  ')+name, JSON.stringify(got));
 check('global nav', T('header nav > *'), ['製品','料金']);
 check('search untouched', T('qbsearch-input span'), ['Search or jump to...']);
 check('repo nav (en)', T('nav[aria-label=Repository] a > span:first-child'), ['コード','Issues','Pull requests','Actions']);
 check('fork (en)', d.querySelector('a[href$=fork] span').textContent, 'Fork');
 check('fork term attr', d.querySelector('a[href$=fork] span').getAttribute('data-ghja-term'), 'fork');
 check('placeholder', d.querySelector('input').placeholder, 'ファイルへ移動');
 check('code button keeps spaces', d.getElementById('code').textContent, '  コード  ');
 check('commits pattern', T('a[href$="commits/main"] span'), ['172,650 件のCommits']);
 check('file/commit links untouched', T('table a'), ['Code','Update']);
 check('relative-time lang', d.querySelector('relative-time').getAttribute('lang'), 'ja');
 check('description untouched', T('[itemprop=description]'), ['Pull requests']);
 check('markdown untouched', T('.markdown-body *'), ['Pull requests','Fork']);
 check('issue title untouched', T('a[data-hovercard-type]'), ['Fork']);
 check('title attr', d.querySelector('[title]').title, 'パスをコピー');
 check('Updated + user text untouched', T('span').filter(s=>s.startsWith('Updated U')), ['Updated Update README']);
 check('Updated time', T('span').filter(s=>s.includes('に更新')), ['2 日前に更新']);
 check('stars span', T('span').filter(s=>s.includes('195.8k')), ['stars 195.8k']);
 // dynamic
 const s=d.createElement('span'); s.textContent='New issue'; d.body.appendChild(s);
 setTimeout(()=>{
  check('dynamic', s.textContent, '新しいIssue');
  s.firstChild.nodeValue='Close issue';
  setTimeout(()=>{
   check('react text change', s.textContent, 'Issueをクローズ');
   w.__ghja.set({termStyle:'both'}); w.__ghja.restoreAll(); w.__ghja.walk(d.body);
   check('both', T('nav[aria-label=Repository] a > span:first-child'), ['コード','イシュー (Issues)','プルリクエスト (Pull requests)','アクション (Actions)']);
   w.__ghja.set({termStyle:'ja'}); w.__ghja.restoreAll(); w.__ghja.walk(d.body);
   check('ja', T('nav[aria-label=Repository] a > span:first-child'), ['コード','イシュー','プルリクエスト','アクション']);
   for (const [src,exp] of [['Nov 23, 2026','2026年11月23日'],['Settings: nk7-jp/classroom-download','設定：nk7-jp/classroom-download'],['0 watchers','ウォッチしている人 0'],['November 18, 2026 – November 25, 2026','2026年11月18日 ～ 2026年11月25日'],['Workflow runs','ワークフローの実行']]) check('pattern '+src, w.__ghja.translate(src).text, exp);
   w.__ghja.restoreAll();
   check('restore', T('nav[aria-label=Repository] a > span:first-child').concat([d.querySelector('input').placeholder, d.querySelector('[title]').title]), ['Code','Issues','Pull requests','Actions','Go to file','Copy path']);
   check('restore attr removed', d.querySelectorAll('[data-ghja-term]').length, 0);
   process.exit(0);
  },100);
 },100);
},1500);
