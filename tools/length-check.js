// Reports how often each "guess by answer length" strategy would find the book answer in the built index.html.
// Random chance is ~25% (4-option average). The build already fails if any strategy exceeds 30%.
const fs=require("fs"),path=require("path");
const h=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
const grab=n=>{const i=h.indexOf("const "+n+"=")+("const "+n+"=").length;return JSON.parse(h.slice(i,h.indexOf(";\n",i)))};
const BANK=grab("BANK"),KEYS=grab("KEYS");const ds=h.indexOf("const DISP = ")+13;const DISP=eval("("+h.slice(ds,h.indexOf("\n};",ds)+2)+")");
let s={longest:0,second:0,shortest:0,median:0},ch=0;
for(const q of BANK){const L=q.ans.map((a,i)=>[a[0],(a[0]==="B"?KEYS[q.id]:(DISP[q.id+"|"+i]||a[1])).length]).sort((x,y)=>y[1]-x[1]);const pB=x=>x[0]==="B"?1:0;s.longest+=pB(L[0]);s.second+=pB(L[1]);s.shortest+=pB(L[L.length-1]);s.median+=pB(L[L.length>>1]);ch+=1/q.ans.length}
for(const k in s)s[k]=(s[k]/BANK.length*100).toFixed(0)+"%";
console.log("Length-guess hit rates over",BANK.length,"questions:",JSON.stringify(s),"| random chance",(ch/BANK.length*100).toFixed(0)+"%");
