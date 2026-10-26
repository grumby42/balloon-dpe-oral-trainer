// Builds index.html from src/: merges question packs, applies the accuracy-review errata, enforces the
// length-tell gates (fails the build if the correct answer is predictable by length), and stamps BALN-YYYYMMDD-HHMMZ.
const path=require("path");const ROOT=path.join(__dirname,"..");
const fs=require("fs");const {BANK,PTS}=require(path.join(ROOT,"src/bank/01-core.js")),{KEYS}=require(path.join(ROOT,"src/bank/display-keys.js")),{DISP}=require(path.join(ROOT,"src/bank/display-distractors.js"));
const {BANK2}=require(path.join(ROOT,"src/bank/02-expansion.js"));const {BANK3}=require(path.join(ROOT,"src/bank/03-limits-emergencies.js"));const {BANK4}=require(path.join(ROOT,"src/bank/04-fitness-adm.js"));
const err=[];
const {ERRATA}=require(path.join(ROOT,"src/errata.js"));
const ids=new Set(BANK.map(q=>q.id));
for(const q of [...BANK2,...BANK3,...BANK4]){ if(ids.has(q.id))err.push("dup "+q.id); ids.add(q.id);
 if(!q.m)err.push("no model "+q.id);
 const B=q.ans.filter(a=>a[0]==="B").length,S=q.ans.filter(a=>a[0]==="S").length,W=q.ans.filter(a=>a[0]==="W").length;
 if(B!==1||S<1||W<1||W>3)err.push("shape "+q.id);
 q.ans.forEach(a=>{if(a.length!==3||!a[2])err.push("why "+q.id); if(a[1].length<60||a[1].length>110)err.push("len "+q.id+" "+a[0]+a[1].length)});
 if(!PTS.find(p=>p.a===q.a&&p.tasks.find(t=>t[0]===q.t)))err.push("task "+q.id);
 KEYS[q.id]=q.ans.find(a=>a[0]==="B")[1]; q.ans=q.ans.map(a=>a[0]==="B"?["B",q.m,a[2]]:a); delete q.m; BANK.push(q);}
for(const e of ERRATA){const q=BANK.find(x=>x.id===e.id);if(!q){err.push("errata bad id "+e.id);continue}
 for(const f of ["q","ref","fu","s","c","t","a"])if(e[f]!==undefined)q[f]=e[f];
 if(e.i!==undefined){const a=q.ans[e.i];if(!a){err.push("errata bad idx "+e.id+" "+e.i);continue}
  if(e.type)a[0]=e.type;
  if(e.shown!==undefined){if(a[0]==="B")KEYS[q.id]=e.shown;else{DISP[q.id+"|"+e.i]=e.shown;a[1]=e.full||e.shown}}
  if(e.model!==undefined)a[1]=e.model; if(e.why!==undefined)a[2]=e.why;}}
const ERRLOG=ERRATA.map(e=>({id:e.id,i:e.i,note:e.note||"",src:e.src||""}));
for(const q of BANK){if(!KEYS[q.id])err.push("no key "+q.id);
 const L=q.ans.map((x,i)=>[x[0],x[0]==="B"?KEYS[q.id].length:(DISP[q.id+"|"+i]||x[1]).length]);
 const b=L.find(x=>x[0]==="B")[1],o=L.filter(x=>x[0]!=="B").map(x=>x[1]);
 if(b>=Math.max(...o)*1.1)err.push("TELL long "+q.id);if(b<=Math.min(...o)*0.9)err.push("TELL short "+q.id);}
for(const p of PTS)for(const t of p.tasks)if(!BANK.some(q=>q.a===p.a&&q.t===t[0]))err.push("uncovered "+p.a+t[0]);
{let lg=0,sh=0;for(const q of BANK){const L=q.ans.map((x,i)=>[x[0],(x[0]==="B"?KEYS[q.id]:(DISP[q.id+"|"+i]||x[1])).length]).sort((a,b)=>b[1]-a[1]);if(L[0][0]==="B")lg++;if(L[L.length-1][0]==="B")sh++;}
 const AGG={longest:lg/BANK.length,shortest:sh/BANK.length};console.log("pick-longest",(AGG.longest*100).toFixed(0)+"%","pick-shortest",(AGG.shortest*100).toFixed(0)+"%");
 if(AGG.longest>0.30)err.push("AGG pick-longest too high");if(AGG.shortest>0.30)err.push("AGG pick-shortest too high");}
if(err.length){console.error(err);process.exit(1)}
const d=new Date(),pad=n=>String(n).padStart(2,"0");
const bid=`BALN-${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}Z`,stamp=d.toISOString().slice(0,16)+"Z";
const strip=s=>s.replace(/if \(typeof module[^\n]*\n?/,"");
const data="const ERRLOG="+JSON.stringify(ERRLOG)+";\nconst PTS="+JSON.stringify(PTS)+";\nconst BANK="+JSON.stringify(BANK)+";\nconst KEYS="+JSON.stringify(KEYS)+";\n"+"const DISP = "+JSON.stringify(DISP,null,0).replace(/^\{/,"{\n").replace(/\}$/,"\n}")+";\n";
const h=fs.readFileSync(path.join(ROOT,"src/app.html"),"utf8").replace("%%BANK%%",()=>data).replaceAll("%%BUILD%%",bid).replaceAll("%%STAMP%%",stamp);
fs.writeFileSync(path.join(ROOT,"index.html"),h);const per=PTS.map(p=>p.a+" "+p.tasks.map(t=>t[0]+BANK.filter(q=>q.a===p.a&&q.t===t[0]).length).join(" ")).join(" | ");console.log("questions",BANK.length,"scenarios",BANK.filter(q=>q.s).length,"critical",BANK.filter(q=>q.c).length);console.log(per);console.log("built",bid,stamp,h.length,"bytes; tell-check passed");
