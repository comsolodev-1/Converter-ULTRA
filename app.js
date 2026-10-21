(()=>{const $=s=>document.querySelector(s),ck=n=>(document.cookie.split('; ').find(r=>r.startsWith(n+'='))||'').split('=')[1];
const sc=(n,v)=>document.cookie=`${n}=${v};max-age=31536000;path=/;SameSite=Lax${location.protocol=='https:'?';Secure':''}`;
// Cookie consent: device ID + visit counter are set only after Accept
const vis=t=>document.querySelectorAll('.visit').forEach(e=>e.textContent=t),ls=(k,v)=>{try{if(v===undefined)return localStorage[k];localStorage[k]=v}catch(e){}};
function track(){let id=ck('cv_id');if(!id){id=crypto.randomUUID();sc('cv_id',id)}let n=+ck('cv_n')||0;try{if(!sessionStorage.cv){sessionStorage.cv=1;sc('cv_n',++n)}}catch(e){}vis(n>1?`Welcome back! This is your visit #${n}.`:'Welcome! This is your first visit.')}
const bn=document.createElement('div');bn.className='cb';bn.setAttribute('role','region');bn.setAttribute('aria-label','Cookie notice');bn.hidden=true;
bn.innerHTML='<p>We can use two small cookies to remember your device and count your visits. No ads, no tracking. <a href="/privacy.html">Details</a></p><div><button type="button" id="ca">Accept</button> <button type="button" id="cd" class="alt">Decline</button></div>';document.body.append(bn);
const pick=a=>{ls('cv_c',a?1:0);bn.hidden=true;if(a)track();else{['cv_id','cv_n'].forEach(k=>document.cookie=`${k}=;max-age=0;path=/`);vis('Visit counter is off.')}};
bn.querySelector('#ca').onclick=()=>pick(1);bn.querySelector('#cd').onclick=()=>pick(0);
const fp=document.querySelector('footer p');if(fp){const a=document.createElement('a');a.href='#';a.textContent='Cookie settings';a.onclick=e=>{e.preventDefault();bn.hidden=false;bn.querySelector('#ca').focus()};fp.append(a)}
const cs=ls('cv_c');if(cs=='1')track();else if(cs=='0')vis('Visit counter is off.');else bn.hidden=false;
const F={image:['png','jpg','webp','bmp','pdf'],audio:['wav','mp3'],video:['mp4','webm','gif','mp3','wav'],text:['txt','html','md','json','csv','pdf','docx']};
const O=f=>kind(f)=='doc'?(ext(f)=='pdf'?['txt','docx','png','jpg']:['txt','html','pdf']):F[kind(f)];
const M={txt:'text/plain',html:'text/html',md:'text/markdown',json:'application/json',csv:'text/csv'};
const ext=f=>f.name.split('.').pop().toLowerCase().replace('jpeg','jpg').replace('htm','html').replace('markdown','md');
const kind=f=>/^(pdf|docx)$/.test(ext(f))?'doc':/^(mp4|webm|mov|mkv|m4v|avi)$/.test(ext(f))||f.type.startsWith('video/')?'video':f.type.startsWith('image/')?'image':f.type.startsWith('audio/')?'audio':(/^(txt|md|html|json|csv)$/.test(ext(f))||f.type.startsWith('text/'))?'text':null;
const sz=b=>b>1e6?(b/1e6).toFixed(1)+' MB':Math.max(1,Math.round(b/1e3))+' KB';
async function img(f,to){const u=URL.createObjectURL(f),i=new Image();i.src=u;await i.decode();const w=i.naturalWidth||1024,h=i.naturalHeight||1024,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
if(to!='png'&&to!='webp'){x.fillStyle='#fff';x.fillRect(0,0,w,h)}x.drawImage(i,0,0,w,h);URL.revokeObjectURL(u);if(to=='pdf'){await L('jspdf');const p=new jspdf.jsPDF({unit:'px',format:[w,h],orientation:w>h?'l':'p'});p.addImage(c.toDataURL('image/jpeg',.92),'JPEG',0,0,w,h);return p.output('blob')}
if(to=='bmp'){const d=x.getImageData(0,0,w,h).data,rs=(w*3+3)&~3,v=new DataView(new ArrayBuffer(54+rs*h));v.setUint16(0,19778,true);v.setUint32(2,54+rs*h,true);v.setUint32(10,54,true);v.setUint32(14,40,true);v.setInt32(18,w,true);v.setInt32(22,h,true);v.setUint16(26,1,true);v.setUint16(28,24,true);v.setUint32(34,rs*h,true);
for(let y=0;y<h;y++)for(let k=0;k<w;k++){const p=((h-1-y)*w+k)*4,o=54+y*rs+k*3;v.setUint8(o,d[p+2]);v.setUint8(o+1,d[p+1]);v.setUint8(o+2,d[p])}return new Blob([v],{type:'image/bmp'})}
return new Promise(r=>c.toBlob(b=>r(b),{png:'image/png',jpg:'image/jpeg',webp:'image/webp'}[to],.92))}
const SRC={lamejs:'lamejs/1.2.1/lame.min.js',jspdf:'jspdf/2.5.1/jspdf.umd.min.js',jszip:'jszip/3.10.1/jszip.min.js',mammoth:'mammoth/1.6.0/mammoth.browser.min.js',pdfjs:'pdf.js/3.11.174/pdf.min.js',ffmpeg:'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js',futil:'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/umd/index.js'},G={lamejs:'lamejs',jspdf:'jspdf',jszip:'JSZip',mammoth:'mammoth',pdfjs:'pdfjsLib',ffmpeg:'FFmpegWASM',futil:'FFmpegUtil'},CDN='https://cdnjs.cloudflare.com/ajax/libs/';
const L=k=>window[G[k]]?0:new Promise((a,b)=>{const s=document.createElement('script');s.src=SRC[k].startsWith('http')?SRC[k]:CDN+SRC[k];s.onload=a;s.onerror=()=>b(Error('A conversion library could not load. Check your connection.'));document.head.append(s)});
async function aud(f,to){const ac=new AudioContext(),buf=await ac.decodeAudioData(await f.arrayBuffer());ac.close();const ch=Math.min(2,buf.numberOfChannels),sr=buf.sampleRate,L=buf.getChannelData(0),R=ch>1?buf.getChannelData(1):L;
const pcm=a=>{const o=new Int16Array(a.length);for(let i=0;i<a.length;i++){const s=Math.max(-1,Math.min(1,a[i]));o[i]=s<0?s*32768:s*32767}return o},l=pcm(L),r=pcm(R),n=l.length;
if(to=='mp3'){await L('lamejs');const e=new lamejs.Mp3Encoder(ch,sr,128),out=[];for(let i=0;i<n;i+=1152){const a=ch>1?e.encodeBuffer(l.subarray(i,i+1152),r.subarray(i,i+1152)):e.encodeBuffer(l.subarray(i,i+1152));if(a.length)out.push(a)}out.push(e.flush());return new Blob(out,{type:'audio/mpeg'})}
const v=new DataView(new ArrayBuffer(44+n*ch*2)),s=(o,t)=>[...t].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));
s(0,'RIFF');v.setUint32(4,36+n*ch*2,true);s(8,'WAVEfmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,ch,true);v.setUint32(24,sr,true);v.setUint32(28,sr*ch*2,true);v.setUint16(32,ch*2,true);v.setUint16(34,16,true);s(36,'data');v.setUint32(40,n*ch*2,true);
let o=44;for(let i=0;i<n;i++){v.setInt16(o,l[i],true);o+=2;if(ch>1){v.setInt16(o,r[i],true);o+=2}}return new Blob([v],{type:'audio/wav'})}
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const parse=s=>{const r=[];let row=[],c='',q=0;for(let i=0;i<s.length;i++){const k=s[i];if(q){if(k=='"'){if(s[i+1]=='"'){c+='"';i++}else q=0}else c+=k}else if(k=='"')q=1;else if(k==','){row.push(c);c=''}else if(k=='\n'){row.push(c.replace(/\r$/,''));r.push(row);row=[];c=''}else c+=k}if(c||row.length){row.push(c);r.push(row)}return r};
async function txt(f,to){const t=await f.text(),from=ext(f);let s=t;
if(to=='pdf'||to=='docx')return mk(from=='html'?new DOMParser().parseFromString(t,'text/html').body.textContent:t,to);
if(from=='csv'&&to=='json'){const r=parse(t),h=r.shift();s=JSON.stringify(r.map(a=>Object.fromEntries(h.map((k,i)=>[k,a[i]??'']))),null,2)}
else if(from=='json'&&to=='csv'){let a=JSON.parse(t);a=Array.isArray(a)?a:[a];const k=[...new Set(a.flatMap(Object.keys))],q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';s=[k.map(q).join(','),...a.map(o=>k.map(x=>q(o[x])).join(','))].join('\n')}
else if(to=='json')s=from=='json'?t:JSON.stringify(from=='csv'?parse(t):{text:t},null,2);
else if(to=='csv')s=from=='csv'?t:'"text"\n'+t.split('\n').map(x=>'"'+x.replace(/"/g,'""')+'"').join('\n');
else if(to=='html')s=from=='html'?t:from=='md'?'<p>'+esc(t).replace(/^### (.*)$/gm,'<h3>$1</h3>').replace(/^## (.*)$/gm,'<h2>$1</h2>').replace(/^# (.*)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'<i>$1</i>').replace(/\[(.+?)\]\((https?:[^)]+)\)/g,'<a href="$2">$1</a>').replace(/\n{2,}/g,'</p><p>')+'</p>':'<p>'+esc(t).replace(/\n{2,}/g,'</p><p>')+'</p>';
else if(to=='md'&&from=='html')s=t.replace(/<h([1-3])[^>]*>(.*?)<\/h\1>/gis,(m,l,x)=>'#'.repeat(l)+' '+x+'\n\n').replace(/<[^>]+>/g,'');
else if(to=='txt')s=from=='html'?new DOMParser().parseFromString(t,'text/html').body.textContent:from=='md'?t.replace(/[#*_`]/g,''):t;
return new Blob([s],{type:M[to]+';charset=utf-8'})}
async function mk(t,to){
if(to=='pdf'){await L('jspdf');const p=new jspdf.jsPDF();let y=15;p.splitTextToSize(t,180).forEach(l=>{if(y>282){p.addPage();y=15}p.text(l,15,y);y+=6});return p.output('blob')}
await L('jszip');const z=new JSZip(),X='<?xml version="1.0" encoding="UTF-8"?>',P='http://schemas.openxmlformats.org/';
z.file('[Content_Types].xml',X+`<Types xmlns="${P}package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`);
z.file('_rels/.rels',X+`<Relationships xmlns="${P}package/2006/relationships"><Relationship Id="rId1" Type="${P}officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
z.file('word/document.xml',X+`<w:document xmlns:w="${P}wordprocessingml/2006/main"><w:body>`+t.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').split('\n').map(l=>'<w:p><w:r><w:t xml:space="preserve">'+esc(l)+'</w:t></w:r></w:p>').join('')+'</w:body></w:document>');
return z.generateAsync({type:'blob',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}
const txtb=t=>new Blob([t],{type:'text/plain;charset=utf-8'});
async function dc(f,to){
if(ext(f)=='docx'){await L('mammoth');const a={arrayBuffer:await f.arrayBuffer()};
if(to=='html')return new Blob([(await mammoth.convertToHtml(a)).value],{type:'text/html;charset=utf-8'});
const t=(await mammoth.extractRawText(a)).value;return to=='pdf'?mk(t,'pdf'):txtb(t)}
await L('pdfjs');pdfjsLib.GlobalWorkerOptions.workerSrc=CDN+SRC.pdfjs.replace('pdf.min','pdf.worker.min');
const d=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;
if(to=='png'||to=='jpg'){const g=await d.getPage(1),v=g.getViewport({scale:2}),c=document.createElement('canvas');c.width=v.width;c.height=v.height;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);await g.render({canvasContext:x,viewport:v}).promise;return new Promise(r=>c.toBlob(b=>r(b),to=='png'?'image/png':'image/jpeg',.92))}
let t='';for(let i=1;i<=d.numPages;i++)t+=(await(await d.getPage(i)).getTextContent()).items.map(e=>e.str).join(' ')+'\n\n';
if(!t.trim())throw Error('No selectable text found (scanned PDF?).');return to=='docx'?mk(t,'docx'):txtb(t)}
let ff,PS;
async function eng(){if(ff)return ff;await L('ffmpeg');await L('futil');const{FFmpeg}=FFmpegWASM,{toBlobURL}=FFmpegUtil,B='https://cdn.jsdelivr.net/npm/@ffmpeg/',o=new FFmpeg();
o.on('progress',e=>PS&&(PS.textContent='Converting… '+Math.min(100,Math.max(0,Math.round(e.progress*100)))+'%'));
await o.load({classWorkerURL:await toBlobURL(B+'ffmpeg@0.12.10/dist/umd/814.ffmpeg.js','text/javascript'),coreURL:await toBlobURL(B+'core@0.12.6/dist/umd/ffmpeg-core.js','text/javascript'),wasmURL:await toBlobURL(B+'core@0.12.6/dist/umd/ffmpeg-core.wasm','application/wasm')});return ff=o}
async function ffm(f,to){const o=await eng().catch(()=>{throw Error('LOAD')}),i='in.'+ext(f),n='out.'+to,A={mp4:['-c:v','libx264','-preset','ultrafast','-crf','28','-c:a','aac','-movflags','+faststart'],webm:['-c:v','libvpx','-b:v','1M','-deadline','realtime','-cpu-used','8','-c:a','libvorbis'],gif:['-vf','fps=12,scale=480:-1:flags=lanczos','-an']};
await o.writeFile(i,new Uint8Array(await f.arrayBuffer()));if(await o.exec(['-i',i,...A[to],n])!==0)throw Error('This video could not be converted.');
const d=await o.readFile(n);await o.deleteFile(i);await o.deleteFile(n);return new Blob([d],{type:{mp4:'video/mp4',webm:'video/webm',gif:'image/gif'}[to]})}
async function rec(f){if(!window.MediaRecorder)throw Error('This browser cannot record video.');const v=document.createElement('video'),u=URL.createObjectURL(f);v.src=u;v.muted=true;v.playsInline=true;
await new Promise((a,b)=>{v.onloadedmetadata=a;v.onerror=()=>b(Error('This video could not be read.'))});
const m=MediaRecorder.isTypeSupported('video/webm')?'video/webm':'video/mp4',r=new MediaRecorder(v.captureStream?v.captureStream():v.mozCaptureStream(),{mimeType:m}),ch=[];r.ondataavailable=e=>e.data.size&&ch.push(e.data);
const end=new Promise(a=>r.onstop=a);v.onended=()=>r.stop();v.ontimeupdate=()=>{if(PS&&v.duration)PS.textContent='Recording… '+Math.round(v.currentTime/v.duration*100)+'%'};r.start();await v.play();await end;URL.revokeObjectURL(u);return new Blob(ch,{type:m})}
async function vd(f,to){if(to=='mp3'||to=='wav')return aud(f,to);try{return await ffm(f,to)}catch(e){if(e.message!='LOAD')throw e;if(to=='webm')return rec(f);throw Error('Video engine could not load. Check your connection, or choose WebM.')}}
const H={image:img,audio:aud,text:txt,doc:dc,video:vd},rows=[],q=$('#q'),msg=$('#msg'),go=$('#go');
function add(list){msg.textContent='';[...list].forEach(f=>{const k=kind(f);if(!k){msg.textContent+=`“${f.name}” isn't supported. Try an image, audio or text file. `;return}
if(k=='video'&&f.size>3e8)msg.textContent+=`“${f.name}” is large and may run out of browser memory. `;const li=document.createElement('li');li.className='row';li.innerHTML='<div class="nm"><strong></strong><small></small></div><button type="button" class="x" aria-label="Remove">✕</button><label>Convert to <select></select></label><span><span class="st" role="status">Ready</span> <span class="act"></span></span>';
li.querySelector('strong').textContent=f.name;li.querySelector('small').textContent=`${k} · ${sz(f.size)}`;
const s=li.querySelector('select');O(f).forEach(x=>s.add(new Option(x.toUpperCase(),x)));s.value=O(f).find(x=>x!=ext(f));
const r={f,k,li};li.querySelector('.x').onclick=()=>{rows.splice(rows.indexOf(r),1);li.remove();go.disabled=!rows.length};rows.push(r);q.append(li)});go.disabled=!rows.length}
async function run(r){const st=r.li.querySelector('.st'),to=r.li.querySelector('select').value;st.className='st';PS=st;st.textContent='Converting…';
try{const b=await H[r.k](r.f,to);if(!b)throw Error('The browser could not create this format.');const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=r.f.name.replace(/\.[^.]+$/,'')+'.'+to;a.className='btn sm';a.textContent=`Download .${to} (${sz(b.size)})`;r.li.querySelector('.act').replaceChildren(a);st.textContent='Done ✓';st.className='st ok'}
catch(e){st.textContent='Failed: '+(e.message||'file could not be read. Check it is not corrupted.');st.className='st er'}}
go.onclick=async()=>{go.disabled=true;for(const r of rows)await run(r);go.disabled=false};
const d=$('.drop'),inp=$('#f');inp.onchange=()=>{add(inp.files);inp.value=''};
['dragover','dragenter'].forEach(e=>d.addEventListener(e,x=>{x.preventDefault();d.classList.add('over')}));
['dragleave','drop'].forEach(e=>d.addEventListener(e,x=>{x.preventDefault();d.classList.remove('over')}));d.addEventListener('drop',x=>add(x.dataTransfer.files));
})();
