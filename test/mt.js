// 機械翻訳のテスト（Translator API をまねる）
const {JSDOM}=require('jsdom');const fs=require('fs');
const html=`<body><h2>Latest from our changelog</h2><ul>
<li><a href="https://github.blog/changelog/2026-11-25-x">Copilot code review billing will default to the organization</a></li>
<li><a href="https://github.blog/changelog/2026-11-24-y">More predictable notifications on GitHub.com</a></li></ul>
<a href="https://github.com/o/r/commit/abc">Fix the thing that broke</a>
<div class="markdown-body"><a href="https://github.blog/changelog/z">Should stay English</a></div></body>`;
function run(avail, cb){
 const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;
 let created=0;
 w.Translator={availability:async()=>avail,create:async()=>{created++;return {translate:async t=>'【訳】'+t}}};
 w.eval(fs.readFileSync(__dirname+'/../extension/src/terms.js','utf8'));
 w.eval(fs.readFileSync(__dirname+'/../extension/src/dict-ja.js','utf8'));
 w.eval(fs.readFileSync(__dirname+'/../extension/src/content.js','utf8'));
 w.__ghja.set({mt:true});
 setTimeout(async()=>{ await w.__ghja.mtInit(); setTimeout(()=>cb(w,created),200); },1200);
}
const check=(n,g,e)=>console.log((JSON.stringify(g)===JSON.stringify(e)?'OK  ':'NG  ')+n,JSON.stringify(g));
run('available',(w)=>{
 const d=w.document,T=s=>[...d.querySelectorAll(s)].map(e=>e.textContent.trim());
 check('heading via dict',T('h2'),['GitHub の最新の更新']);
 check('changelog translated',T('li a'),['【訳】Copilot code review billing will default to the organization','【訳】More predictable notifications on GitHub.com']);
 check('original kept in attr',d.querySelector('li a').getAttribute('data-ghja-mt'),'Copilot code review billing will default to the organization');
 check('commit untouched',T('a[href*=commit]'),['Fix the thing that broke']);
 check('markdown untouched',T('.markdown-body a'),['Should stay English']);
 // 動的に追加
 const li=d.createElement('li');li.innerHTML='<a href="https://github.blog/changelog/new">Brand new feature shipped</a>';d.querySelector('ul').appendChild(li);
 setTimeout(()=>{
  check('dynamic changelog',li.textContent.trim(),'【訳】Brand new feature shipped');
  w.__ghja.restoreAll();
  check('restore',T('li a'),['Copilot code review billing will default to the organization','More predictable notifications on GitHub.com','Brand new feature shipped']);
  check('restore attr',d.querySelectorAll('[data-ghja-mt]').length,0);
  run('downloadable',(w2,created)=>{
   check('needs download → chip shown',!!w2.document.getElementById('ghja-chip-host'),true);
   check('state',w2.__ghja.mtState(),'needs-download');
   check('not translated yet',w2.document.querySelector('li a').textContent,'Copilot code review billing will default to the organization');
   const w3=new JSDOM('<body><a href="https://github.blog/changelog/a">Hello world again</a></body>',{runScripts:'outside-only'}).window;
   w3.eval(fs.readFileSync(__dirname+'/../extension/src/terms.js','utf8'));w3.eval(fs.readFileSync(__dirname+'/../extension/src/dict-ja.js','utf8'));w3.eval(fs.readFileSync(__dirname+'/../extension/src/content.js','utf8'));
   w3.__ghja.set({mt:true});
   setTimeout(async()=>{await w3.__ghja.mtInit();check('no Translator → unsupported',w3.__ghja.mtState(),'unsupported');process.exit(0)},1200);
  });
 },300);
});
