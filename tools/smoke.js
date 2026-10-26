// Headless smoke test (requires Playwright: npm i -D playwright && npx playwright install chromium).
// Runs every DPE level in both modes, checks pass/fail outcomes, the bank view, and that a candidate
// giving every book answer at the Strict level always passes.
const path=require("path");const {chromium}=require("playwright");
const URL="file://"+path.join(__dirname,"..","index.html");
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800}});
const errs=[];p.on("pageerror",e=>errs.push(e.message));p.on("dialog",d=>d.accept());
await p.goto(URL);let fail=0;
async function run(lvl,mode,choice){
 await p.evaluate(()=>view("setup"));await p.check(`input[name=lvl][value="${lvl}"]`);await p.check(`input[name=mode][value="${mode}"]`);
 await p.click("button.pri:has-text('Build plan of action')");await p.click("button.pri:text-is('Begin oral')");
 for(let n=0;n<500;n++){
  if(await p.$("button.pri:has-text('Receive Notice')")){await p.click("button.pri:has-text('Receive Notice')");break}
  if(await p.$("button.pri:text-is('Continue for credit')")){await p.click("button.pri:text-is('Continue for credit')");continue}
  if(await p.$("button.pri:text-is('Next')")){await p.click("button.pri:text-is('Next')");continue}
  const r=await p.evaluate(c=>{if(!S||S.done)return"done";const q=Q();let k=q.ans.findIndex((a,i)=>a[0]===c&&!S.tried.includes(i));if(k<0)k=q.ans.findIndex((a,i)=>!S.tried.includes(i));grade(k);return"ok"},choice);
  if(r==="done")break;}
 return p.evaluate(()=>({plan:S.plan.length,cert:!!document.querySelector(".cert"),nod:!!document.querySelector(".nod")}));}
const cases=[[1,"cand","W",null],[2,"exam","S",null],[2,"cand","B","cert"],[3,"exam","B","cert"],[3,"exam","W","nod"]];
for(const [l,m,c,expect] of cases){const o=await run(l,m,c);const ok=!expect||o[expect];if(!ok)fail++;console.log(`L${l} ${m.padEnd(4)} all-${c}: ${o.plan} items → ${o.cert?"PASS":"DISAPPROVED"} ${ok?"✓":"✗ expected "+expect}`)}
for(let i=0;i<5;i++){const o=await run(3,"exam","B");if(!o.cert){fail++;console.log("✗ strict all-book run",i,"did not pass")}}
await p.evaluate(()=>view("bank"));console.log("bank cards:",await p.$$eval("#bl .card",x=>x.length));
console.log("page errors:",errs.length);await b.close();process.exit(fail||errs.length?1:0)})();
