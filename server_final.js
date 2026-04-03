const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const HTML = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Quiz Coran</title>
<style>
:root{--g:#c9a84c;--gl:#f0d080;--dk:#1a1a2e;--bg:#f5f3ee;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,sans-serif;background:var(--bg);min-height:100vh;}
.wrap{padding:1rem;max-width:1100px;margin:0 auto;}
.card{background:#fff;border-radius:18px;border:1px solid #e8e4da;padding:2rem;max-width:460px;margin:2rem auto;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.07);}
.cw{background:#fff;border-radius:18px;border:1px solid #e8e4da;padding:1.5rem;max-width:720px;margin:1.5rem auto;box-shadow:0 4px 20px rgba(0,0,0,.07);}
.logo{font-size:24px;font-weight:800;color:var(--dk);}
.logo b{color:var(--g);}
.gl{width:44px;height:3px;background:linear-gradient(90deg,var(--g),var(--gl));border-radius:99px;margin:.4rem auto 1rem;}
.sub{font-size:12px;color:#999;margin-bottom:1rem;}
.btn{width:100%;padding:12px;border-radius:11px;border:none;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px;display:block;transition:all .15s;}
.bg{background:var(--dk);color:#fff;}.bg:hover{background:#333;}.bg:disabled{opacity:.4;cursor:default;}
.bgo{background:linear-gradient(135deg,var(--g),var(--gl));color:#1a1000;box-shadow:0 3px 12px rgba(201,168,76,.3);}
.bgo:hover{transform:translateY(-1px);}.bgo:disabled{opacity:.4;cursor:default;transform:none;}
.bou{background:#fff;border:1.5px solid #ddd;color:#555;font-weight:600;}.bou:hover{background:#f5f5f5;}
.bred{background:#fdecea;border:1.5px solid #f5a0a0;color:#8b1a1a;font-weight:700;}.bred:hover{background:#fbd5d5;}
.bsm{padding:6px 12px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#444;}.bsm:hover{background:#f0ede6;}
.bgrsm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #5ecb9a;background:#e6f9f0;color:#1a6641;cursor:pointer;font-weight:700;}
.brdsm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;font-weight:700;}
.bgsm{padding:5px 9px;font-size:11px;border-radius:7px;border:1px solid #ddd;background:#fff;color:#555;cursor:pointer;}
.eg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:.5rem;}
.eb{padding:18px 12px;border-radius:13px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;text-align:center;transition:all .2s;}
.eb:hover{background:#f0ede6;border-color:var(--g);transform:translateY(-1px);}
.ei{font-size:26px;margin-bottom:5px;}.el{font-size:13px;font-weight:700;}.es{font-size:10px;color:#aaa;margin-top:2px;}
.pd{display:flex;justify-content:center;gap:11px;margin-bottom:1rem;}
.pdot{width:42px;height:42px;border-radius:11px;border:1.5px solid #ddd;background:#faf9f6;display:flex;align-items:center;justify-content:center;font-size:22px;}
.pdot.f{border-color:var(--g);background:#fffbe6;}
.pp{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:210px;margin:0 auto 1rem;}
.pk{padding:12px;border-radius:11px;border:1px solid #e0ddd6;background:#faf9f6;font-size:17px;cursor:pointer;font-weight:600;}.pk:hover{background:#f0ede6;}
.perr{font-size:12px;color:#e74c3c;height:18px;margin-bottom:.4rem;font-weight:600;}
.inp{width:100%;padding:11px 13px;border-radius:10px;border:1.5px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:.8rem;outline:none;}
.inp:focus{border-color:var(--g);}
.sel{width:100%;padding:10px 13px;border-radius:10px;border:1.5px solid #ddd;background:#faf9f6;font-size:14px;margin-bottom:1rem;}
.tag{font-size:11px;padding:3px 9px;border-radius:99px;display:inline-block;font-weight:600;}
.tok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}.twt{background:#fff8e6;color:#a07020;border:1px solid #f5d97a;}
.tko{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}.tan{background:#f0f0f0;color:#555;border:1px solid #ddd;}
.toff{background:#f0f0f0;color:#aaa;border:1px solid #ddd;}
.mr{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
.mi{flex:1;padding:8px 11px;border-radius:9px;border:1.5px solid #ddd;background:#faf9f6;font-size:13px;outline:none;}.mi:focus{border-color:var(--g);}
.mdel{padding:5px 10px;border-radius:8px;border:1px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;font-size:13px;font-weight:700;}
.ts{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:11px;background:#faf9f6;border:1px solid #eee;margin-bottom:7px;flex-wrap:wrap;gap:5px;}
.ts.rdy{background:#f0faf5;border-color:#b0e0c8;}.ts.off{opacity:.6;}
.tn{font-size:13px;font-weight:700;}.tc{font-size:13px;font-family:monospace;font-weight:700;background:#f0ede6;padding:2px 9px;border-radius:6px;color:var(--dk);}
.ct{width:100%;border-collapse:collapse;margin-top:.4rem;}
.ct th{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.05em;padding:5px 8px;text-align:left;border-bottom:1px solid #eee;font-weight:700;}
.ct td{padding:7px 8px;border-bottom:1px solid #f5f5f5;}
.cpill{font-family:monospace;font-weight:800;font-size:15px;background:linear-gradient(135deg,#fffbe6,#fff3cc);padding:3px 11px;border-radius:7px;border:1px solid var(--g);color:var(--dk);}
.gh{text-align:center;padding:.5rem 0 .3rem;}
.gh h1{font-size:18px;font-weight:800;color:var(--dk);}.gh h1 b{color:var(--g);}
.gh .pr{font-size:11px;color:#999;margin-top:1px;}
.tbg{background:#eee;border-radius:99px;height:10px;overflow:hidden;margin-bottom:.4rem;}
.tbar{height:10px;border-radius:99px;transition:width 1s linear,background .5s;}
.tbar.pulse{animation:tp 1s infinite;}@keyframes tp{0%,100%{opacity:1;}50%{opacity:.5;}}
.tnum{text-align:center;font-size:22px;font-weight:800;margin:.2rem 0 .5rem;}
.sb{display:grid;gap:7px;margin-bottom:.7rem;}
.sc{background:#fff;border-radius:12px;border:1px solid #e8e4da;padding:.5rem .7rem;text-align:center;position:relative;overflow:hidden;}
.scn{font-size:10px;font-weight:700;margin-bottom:1px;}.scv{font-size:19px;font-weight:800;}
.scp{position:absolute;bottom:0;left:0;height:3px;border-radius:0 3px 3px 0;transition:width .6s;}
.pp2{position:absolute;top:2px;right:6px;font-size:12px;font-weight:800;color:#22b87a;animation:pf .9s ease forwards;pointer-events:none;}
@keyframes pf{0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(-20px);}}
.qb{background:#fff;border-radius:14px;border:1px solid #e8e4da;padding:1rem 1.3rem;margin-bottom:.7rem;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.qn{font-size:10px;color:var(--g);letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:4px;}
.qt{font-size:14px;font-weight:700;line-height:1.65;color:var(--dk);}
.pb{background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:13px;border:1px solid #b0e0c8;padding:.9rem 1.1rem;margin-bottom:.7rem;font-size:12px;color:#1a4a30;line-height:1.7;animation:si .35s ease;}
@keyframes si{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.fb{background:linear-gradient(135deg,#fffbe6,#fff3cc);border-radius:12px;border:1px solid var(--g);padding:.6rem 1rem;margin-bottom:.7rem;text-align:center;font-size:13px;color:#7a6000;font-weight:700;}
.tg{display:grid;gap:8px;margin-bottom:.7rem;}
.tc2{background:#fff;border-radius:14px;border:1px solid #e8e4da;padding:.8rem;border-top:4px solid #ccc;box-shadow:0 2px 6px rgba(0,0,0,.04);}
.th2{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.tnm{font-size:13px;font-weight:800;}.tpt{font-size:12px;color:#888;font-weight:600;}
.mg{display:flex;flex-direction:column;gap:5px;}
.mc{padding:9px 11px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .2s;font-size:12px;font-weight:600;}
.mc:hover{transform:translateY(-1px);}
.cc{border-color:#f0c060;background:#fffbe6;}.cc:hover{border-color:var(--g);}
.sqc{border-color:#90c0f0;background:#eef5ff;}.sqc:hover{border-color:#4f8ef7;}
.dc{border-color:#90dbb0;background:#edfaf3;}.dc:hover{border-color:#22b87a;}
.mpt{font-weight:800;font-size:12px;}
.ob{width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:12px;cursor:pointer;text-align:left;color:var(--dk);margin-bottom:4px;line-height:1.3;font-weight:600;transition:all .2s;}
.ob:hover:not(:disabled){background:#f0ede6;}.ob:disabled{cursor:default;}
.ob.sel{background:#eef3ff;border-color:#4f8ef7;}
.ob.correct{background:#e6f9f0;border-color:#22b87a;color:#0a4a25;animation:pi .4s;font-weight:700;}
.ob.wrong{background:#fdecea;border-color:#e74c3c;color:#5a0a0a;animation:sh .4s;}
@keyframes pi{0%{transform:scale(1);}50%{transform:scale(1.02);}100%{transform:scale(1);}}
@keyframes sh{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
.ci{width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:13px;color:var(--dk);margin-bottom:5px;outline:none;font-weight:600;}.ci:focus{border-color:var(--g);}
.ml{font-size:10px;padding:2px 7px;border-radius:99px;border:1px solid #e0ddd6;color:#888;margin-bottom:5px;display:inline-block;font-weight:600;}
.hp{background:#fff;border-radius:14px;border:1px solid #e8e4da;padding:.9rem;margin-top:.6rem;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.hp h3{font-size:10px;font-weight:800;color:var(--g);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.6rem;}
.hr{display:flex;align-items:center;gap:6px;margin-bottom:5px;padding:8px 10px;background:#faf9f6;border-radius:9px;border:1px solid #eee;flex-wrap:wrap;}
.hm{font-size:10px;color:#aaa;min-width:44px;text-transform:uppercase;font-weight:700;}
.htm{font-size:11px;font-weight:800;min-width:72px;}
.han{font-size:11px;color:#333;flex:1;font-style:italic;}
.hi{padding:4px 7px;font-size:12px;border-radius:7px;border:1px solid #ccc;background:#fff;color:var(--dk);width:120px;}
.hcr{font-size:12px;color:#0a3a20;padding:7px 11px;background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:9px;border:1px solid #b0e0c8;margin-bottom:.6rem;font-weight:600;}
.bns{margin-top:.5rem;padding-top:.5rem;border-top:1px solid #eee;}
.bnr{display:flex;align-items:center;gap:5px;margin-bottom:5px;padding:5px 9px;background:#fffbe6;border-radius:9px;border:1px solid #f0d080;flex-wrap:wrap;}
.bnt{font-size:11px;font-weight:800;min-width:72px;}
.bb{padding:3px 8px;border-radius:6px;border:1.5px solid var(--g);background:#fffbe6;color:#7a5000;font-size:11px;font-weight:700;cursor:pointer;}.bb:hover{background:#f0d080;}
.bbm{border-color:#f5a0a0;background:#fdecea;color:#8b1a1a;}.bbm:hover{background:#fbd5d5;}
.ra{text-align:center;margin-top:.7rem;padding-top:.7rem;border-top:1px solid #eee;}
.rh{font-size:11px;color:#aaa;margin-top:3px;}
.tc3{display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:.6rem;flex-wrap:wrap;}
.tc3 span{font-size:12px;color:#666;font-weight:600;}
.ht{text-align:center;margin-top:.4rem;}
.ht button{font-size:11px;color:#bbb;background:none;border:none;cursor:pointer;text-decoration:underline;}
.conn{position:fixed;bottom:10px;right:10px;font-size:11px;padding:4px 11px;border-radius:99px;font-weight:700;z-index:999;}
.conn.ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}.conn.off{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.reconn{position:fixed;bottom:10px;left:10px;font-size:11px;padding:5px 12px;border-radius:99px;font-weight:700;z-index:999;background:#fff8e6;color:#a07020;border:1px solid #f5d97a;display:none;}
.fw{padding:2rem 0;min-height:100vh;display:flex;align-items:center;justify-content:center;}
.fc{background:#fff;border-radius:22px;padding:2.2rem 1.8rem;max-width:500px;width:100%;text-align:center;box-shadow:0 8px 36px rgba(0,0,0,.1);}
.ft{font-size:24px;font-weight:800;color:var(--dk);margin-bottom:.3rem;}.ft b{color:var(--g);}
.ps{display:flex;flex-direction:column;gap:8px;margin:1.2rem 0;}
.pr2{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:13px;background:#faf9f6;border:1px solid #eee;}
.pr2.first{background:linear-gradient(135deg,#fffbe6,#fff3cc);border:2px solid var(--g);}
.prk{font-size:24px;min-width:36px;text-align:center;}
.prn{font-size:14px;font-weight:800;flex:1;text-align:left;}
.prp{font-size:15px;font-weight:800;color:#555;}
.prest{display:flex;flex-direction:column;gap:6px;margin-top:.5rem;}
.prr{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:9px;background:#faf9f6;border:1px solid #eee;font-size:13px;}
.cf{position:fixed;width:9px;height:9px;top:-10px;border-radius:2px;animation:cfl linear forwards;pointer-events:none;z-index:9999;}
@keyframes cfl{0%{transform:translateY(0) rotate(0);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}
@media(max-width:660px){.tg{grid-template-columns:1fr!important;}.qt{font-size:13px;}.eg{grid-template-columns:1fr;}}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn off" id="conn">Connexion...</div>
<div class="reconn" id="reconn">Reconnexion en cours...</div>
<script>
const L=["A","B","C","D"],CC=["#f7934f","#4f8ef7","#22b87a","#c9a84c","#9b59b6","#e74c3c","#f0d080"];
const STORAGE_KEY="quiz_coran_token";
const STORAGE_TI="quiz_coran_ti";

let role=null,myTi=null,st=null,phase="entry",pin="",pinErr="";
let myName="",myMem=[""],hOpen=false,cashVal="",nTeams=3,sfrom=1;
let prevSc=[],tv=60,td=false,hEditTi=-1;
let myToken=null; // session token for reconnection

// ─── Load saved token ───
function loadToken(){
  try{
    myToken=localStorage.getItem(STORAGE_KEY)||null;
    const ti=localStorage.getItem(STORAGE_TI);
    if(ti!==null)myTi=parseInt(ti);
  }catch(e){}
}
function saveToken(token,ti){
  try{localStorage.setItem(STORAGE_KEY,token);localStorage.setItem(STORAGE_TI,String(ti));}catch(e){}
  myToken=token;
}
function clearToken(){
  try{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(STORAGE_TI);}catch(e){}
  myToken=null;myTi=null;
}

loadToken();

// ─── WebSocket ───
const proto=location.protocol==="https:"?"wss:":"ws:";
let ws;
function cwS(){
  ws=new WebSocket(proto+"//"+location.host);
  ws.onopen=()=>{
    setC(true);
    // Try token reconnection automatically if we have one
    if(myToken&&phase!=="entry"&&role==="team"){
      showReconn(true);
      snd({type:"team-reconnect",token:myToken});
    } else if(myToken&&phase==="entry"){
      // Page was reloaded — try to reconnect automatically
      showReconn(true);
      snd({type:"team-reconnect",token:myToken});
    }
  };
  ws.onclose=()=>{setC(false);showReconn(false);setTimeout(cwS,2000);};
  ws.onerror=()=>setC(false);
  ws.onmessage=onM;
}
function setC(ok){const e=document.getElementById("conn");if(!e)return;e.textContent=ok?"Connecté":"Reconnexion...";e.className="conn "+(ok?"ok":"off");}
function showReconn(v){const e=document.getElementById("reconn");if(e)e.style.display=v?"block":"none";}
function snd(o){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(o));}
cwS();

function onM(evt){
  const m=JSON.parse(evt.data);

  if(m.type==="reset"){clearToken();location.reload();return;}

  // ── Host auth ──
  if(m.type==="host-auth-ok"){role="host";phase="host-setup";render();return;}
  if(m.type==="host-auth-fail"){pinErr="Code incorrect";pin="";render();return;}

  // ── Team first auth ──
  if(m.type==="team-auth-ok"){
    role="team";myTi=m.teamIdx;
    saveToken(m.token,m.teamIdx); // save token for future reconnections
    phase="team-members";render();return;
  }
  if(m.type==="team-auth-fail"){pinErr=m.reason==="already-used"?"Code déjà utilisé":"Code invalide";pin="";render();return;}

  // ── Token reconnection ──
  if(m.type==="team-reconnect-ok"){
    showReconn(false);
    role="team";myTi=m.teamIdx;
    // Don't redirect to members screen — we're already registered
    // State will come right after from server
    return;
  }
  if(m.type==="team-reconnect-fail"){
    showReconn(false);
    // Token invalid (game was reset) — clear token and show entry
    clearToken();
    role=null;myTi=null;phase="entry";render();return;
  }

  // ── Timer ──
  if(m.type==="timer"){tv=m.val;td=m.done;updT();return;}

  // ── Waiting ──
  if(m.type==="waiting"){
    showReconn(false);
    // If we reconnected and are already registered, go to waiting
    if(role==="team"&&myTi!==null)phase="waiting";
    else if(phase!=="team-members"&&phase!=="team-name")phase="waiting";
    st=m;render();return;
  }

  // ── Game state ──
  if(m.type==="state"){
    showReconn(false);
    if(st&&st.teams)prevSc=st.teams.map(t=>t.score||0);
    st=m;tv=m.timerVal;td=m.timerDone;
    // Sync phase
    if(m.phase==="waiting"&&role==="team"&&myTi!==null)phase="waiting";
    else if(m.phase==="waiting"&&phase!=="team-members"&&phase!=="team-name")phase="waiting";
    if(m.phase==="game")phase="game";
    if(m.phase==="end")phase="end";
    render();
    if(m.revealed&&st.teams)st.teams.forEach((t,i)=>{if((t.score||0)>(prevSc[i]||0))setTimeout(()=>shP(i,(t.score||0)-(prevSc[i]||0)),200);});
    return;
  }
}

function updT(){
  const b=document.getElementById("tBar"),n=document.getElementById("tNum");
  if(!b||!n)return;
  const pct=Math.max(0,(tv/60)*100),col=tv>20?"#22b87a":tv>10?"#f7934f":"#e74c3c";
  b.style.width=pct+"%";b.style.background=col;
  b.className="tbar"+(tv<=10&&tv>0?" pulse":"");
  n.textContent=tv+"s";n.style.color=col;
  const hv=document.getElementById("hTv");if(hv)hv.textContent=tv+"s";
}
function shP(ti,pts){
  const c=document.querySelector(\`[data-ti="\${ti}"]\`);if(!c)return;
  const e=document.createElement("div");e.className="pp2";e.textContent="+"+pts;
  c.style.position="relative";c.appendChild(e);setTimeout(()=>e.remove(),1000);
}
function confetti(){
  for(let i=0;i<180;i++)setTimeout(()=>{
    const e=document.createElement("div");e.className="cf";
    e.style.left=Math.random()*100+"vw";e.style.background=CC[Math.floor(Math.random()*CC.length)];
    const s=(7+Math.random()*8)+"px";e.style.width=s;e.style.height=s;
    e.style.animationDuration=(2+Math.random()*3)+"s";
    document.body.appendChild(e);setTimeout(()=>e.remove(),5500);
  },i*22);
}

function render(){
  const app=document.getElementById("app");if(!app)return;
  if(phase==="entry")rEntry(app);
  else if(phase==="host-pin")rPin(app,"Accès hôte","Code hôte requis",hPP,hPD);
  else if(phase==="host-setup")rHS(app);
  else if(phase==="team-pin")rPin(app,"Rejoindre","Code reçu de l'hôte",tPP,tPD);
  else if(phase==="team-members")rMem(app);
  else if(phase==="team-name")rTN(app);
  else if(phase==="waiting")rWait(app);
  else if(phase==="game")rGame(app);
  else if(phase==="end")rEnd(app);
}

function rEntry(app){app.innerHTML=\`<div class="card"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div>
  <p class="sub">51 questions · Sciences islamiques</p>
  <div class="eg">
    <div class="eb" onclick="phase='team-pin';pin='';pinErr='';render()"><div class="ei">👥</div><div class="el">Rejoindre</div><div class="es">Code équipe</div></div>
    <div class="eb" onclick="phase='host-pin';pin='';pinErr='';render()"><div class="ei">🎙️</div><div class="el">Hôte</div><div class="es">Configurer</div></div>
  </div></div>\`;}

function rPin(app,tit,sub,onP,onD){
  const dots=[0,1,2,3].map(i=>\`<div class="pdot\${i<pin.length?" f":""}">\${i<pin.length?"●":""}</div>\`).join("");
  const pad=[1,2,3,4,5,6,7,8,9].map(n=>\`<button class="pk" onclick="\${onP.name}('\${n}')">\${n}</button>\`).join("");
  app.innerHTML=\`<div class="card"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div>
  <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">\${tit}</p><p class="sub">\${sub}</p>
  <div class="pd">\${dots}</div><div class="pp">\${pad}<button class="pk" onclick="\${onD.name}()">⌫</button><button class="pk" onclick="\${onP.name}('0')">0</button><div></div></div>
  <div class="perr">\${pinErr}</div><button class="btn bou" onclick="phase='entry';pin='';pinErr='';render()">Retour</button></div>\`;}
function hPP(d){if(pin.length>=4)return;pin+=d;if(pin.length===4)snd({type:"host-auth",pin});render();}
function hPD(){if(pin.length>0){pin=pin.slice(0,-1);render();}}
function tPP(d){if(pin.length>=4)return;pin+=d;if(pin.length===4)snd({type:"team-auth",code:pin});render();}
function tPD(){if(pin.length>0){pin=pin.slice(0,-1);render();}}

function rHS(app){app.innerHTML=\`<div class="card"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div>
  <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Configuration</p><p class="sub">Combien d'équipes ?</p>
  <select class="sel" onchange="nTeams=parseInt(this.value)">
    <option value="1">1 équipe</option><option value="2">2 équipes</option><option value="3" selected>3 équipes</option>
    <option value="4">4 équipes</option><option value="5">5 équipes</option><option value="6">6 équipes</option>
  </select>
  <button class="btn bgo" onclick="snd({type:'host-setup',numTeams:nTeams})">Générer les codes →</button></div>\`;}

function rMem(app){
  const rows=myMem.map((v,i)=>\`<div class="mr"><input class="mi" placeholder="Pseudo \${i+1}" value="\${v}" oninput="myMem[\${i}]=this.value"/>
    \${myMem.length>1?\`<button class="mdel" onclick="myMem.splice(\${i},1);render()">✕</button>\`:""}</div>\`).join("");
  app.innerHTML=\`<div class="card"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div>
  <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Membres</p><p class="sub">1 à 6 membres</p>
  \${rows}\${myMem.length<6?\`<button class="btn bou" onclick="myMem.push('');render()" style="margin-bottom:.5rem">+ Ajouter</button>\`:""}
  <button class="btn bgo" onclick="phase='team-name';render()">Continuer →</button>
  <button class="btn bou" onclick="phase='team-pin';pin='';pinErr='';render()">Retour</button></div>\`;}

function rTN(app){
  app.innerHTML=\`<div class="card"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div>
  <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Nom de l'équipe</p>
  <input class="inp" placeholder="Nom..." maxlength="20" oninput="myName=this.value" onkeydown="if(event.key==='Enter')confTeam()" autofocus/>
  <button class="btn bgo" onclick="confTeam()">Rejoindre ✓</button>
  <button class="btn bou" onclick="phase='team-members';render()">Retour</button></div>\`;
  setTimeout(()=>{const e=app.querySelector(".inp");if(e)e.focus();},80);}
function confTeam(){const n=myName.trim();if(!n)return;snd({type:"team-set-info",name:n,members:myMem.map(m=>m.trim()).filter(Boolean)});phase="waiting";render();}

function rWait(app){
  const teams=(st&&(st.allCodes||st.teams))||[];
  const allRdy=teams.length>0&&teams.every(t=>t.ready);
  const slots=teams.map(t=>\`<div class="ts\${t.ready?" rdy":""}\${t.ready&&!t.online?" off":""}">
    <span class="tn" style="color:\${t.color}">\${t.name}</span>
    \${role==="host"?\`<span class="tc">\${t.code}</span>\`:""}
    <div style="display:flex;gap:5px;align-items:center">
      <span class="tag \${t.ready?"tok":"twt"}">\${t.ready?"Prête":"En attente..."}</span>
      \${t.ready?\`<span class="tag \${t.online?"tok":"toff"}">\${t.online?"🟢 En ligne":"🔴 Hors ligne"}</span>\`:""}
    </div>
  </div>\`).join("");
  const hSec=role==="host"?\`<div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee">
    <div style="font-size:10px;color:var(--g);text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:.6rem">Codes à distribuer</div>
    <table class="ct"><tr><th>Équipe</th><th>Code</th><th>Membres</th><th>Statut</th></tr>
      \${teams.map(t=>\`<tr><td style="color:\${t.color};font-weight:800">\${t.name}</td><td><span class="cpill">\${t.code}</span></td>
        <td style="font-size:11px;color:#888">\${t.members&&t.members.length?t.members.join(", "):"—"}</td>
        <td>\${t.ready?\`<span class="tag \${t.online?"tok":"toff"}">\${t.online?"🟢 En ligne":"🔴 Hors ligne"}</span>\`:'<span class="tag twt">Attente</span>'}</td></tr>\`).join("")}
    </table>
    <div style="margin-top:.8rem">
      <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:.3rem">Démarrer à la question :</label>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:.8rem">
        <input type="number" min="1" max="51" value="\${sfrom}" class="inp" style="width:80px;margin:0;text-align:center" oninput="sfrom=parseInt(this.value)||1"/>
        <span style="font-size:12px;color:#999">/ 51</span>
      </div>
      \${allRdy?\`<button class="btn bgo" onclick="snd({type:'host-start',startFrom:sfrom})">🚀 Lancer !</button>\`:\`<p style="font-size:12px;color:#aaa;text-align:center;margin-bottom:.6rem">En attente de toutes les équipes...</p>\`}
      <button class="btn bred" onclick="if(confirm('Réinitialiser ?'))snd({type:'host-close'})" style="margin-top:.4rem">⏹ Clôturer</button>
    </div></div>\`:\`<div style="text-align:center;margin-top:.8rem"><p style="font-size:12px;color:#aaa">En attente du lancement...</p></div>\`;
  app.innerHTML=\`<div class="cw"><div style="text-align:center;margin-bottom:.8rem"><div class="logo">Quiz <b>Coran</b></div><div class="gl"></div><p class="sub">\${role==="host"?"Distribuez les codes":"En attente..."}</p></div>\${slots}\${hSec}</div>\`;}

function rGame(app){
  if(!st){app.innerHTML=\`<div class="card"><p>Chargement...</p></div>\`;return;}
  const teams=st.teams||[],q=st.question,isFun=st.qid===51;
  const pct=Math.max(0,(tv/60)*100),tc=tv>20?"#22b87a":tv>10?"#f7934f":"#e74c3c";
  const mx=Math.max(1,...teams.map(t=>t.score||0));

  const scBar=\`<div class="sb" style="grid-template-columns:repeat(\${teams.length},1fr)">\`+
    teams.map((t,ti)=>\`<div class="sc" data-ti="\${ti}">
      <div class="scn" style="color:\${t.color}">\${t.name}\${t.online===false?' 🔴':''}</div>
      <div class="scv">\${t.score||0}</div>
      <div class="scp" style="width:\${((t.score||0)/mx)*100}%;background:\${t.color}"></div></div>\`).join("")+\`</div>\`;

  const cols=Math.min(teams.length,3);
  const cards=\`<div class="tg" style="grid-template-columns:repeat(\${cols},minmax(0,1fr))">\`+
    teams.map((t,ti)=>rCard(t,ti,q,st.revealed,isFun)).join("")+\`</div>\`;

  const proof=st.revealed&&q.proof?\`<div class="pb"><strong>📖 Preuve :</strong> \${q.proof}</div>\`:"";
  const nextBtn=st.revealed&&role==="host"?\`<div style="text-align:center;margin-bottom:.5rem"><button class="btn bgo" onclick="snd({type:'host-next'})" style="max-width:280px">\${st.current<st.total-1?"Question suivante →":"Voir les résultats 🏆"}</button></div>\`:"";
  const hHTML=role==="host"?\`<div class="ht"><button onclick="hOpen=!hOpen;render()">\${hOpen?"▼ Masquer hôte":"▲ Panneau hôte"}</button></div>\${hOpen?rHP(teams,q,st,isFun):""}\`:""

  app.innerHTML=\`<div class="gh"><h1>Quiz <b>Coran</b></h1><div class="pr">Q\${st.current+1}/\${st.total} · N°\${st.qid}</div></div>
    \${scBar}
    <div class="tbg"><div class="tbar\${tv<=10&&tv>0?" pulse":""}" id="tBar" style="width:\${pct}%;background:\${tc}"></div></div>
    <div class="tnum" id="tNum" style="color:\${tc}">\${tv}s</div>
    <div class="qb"><div class="qn">Question \${st.current+1} · N°\${st.qid}\${isFun?" · 🎉 BONUS":""}</div><div class="qt">\${q.q}</div></div>
    \${isFun?\`<div class="fb">🎉 Question bonus</div>\`:""}\${proof}\${cards}\${nextBtn}\${hHTML}\`;}

function rCard(t,ti,q,revealed,isFun){
  const isMe=(role==="team"&&ti===myTi);
  let inner="";
  if(!isMe){
    let status="En cours...";
    if(t.hasAnswer){if(revealed){if(t.mode==="cash")status=t.validated===true?"✓ Correct":"✗ Incorrect";else if(t.mode==="square")status=t.answer===q.ans?"✓ Correct":"✗ Incorrect";else if(t.mode==="duo"){const duo=t.duoOpts||[];const ch=typeof t.answer==="number"?duo[t.answer]:t.answer;status=ch===q.opts[q.ans]?"✓ Correct":"✗ Incorrect";}}else status="Réponse envoyée ✓";}
    else if(t.mode)status="En train de répondre...";
    inner=\`<div style="font-size:12px;color:#aaa;padding:5px 0;text-align:center;font-style:italic">\${status}</div>\`;
    if(revealed&&t.mode&&t.hasAnswer){
      const ml2={cash:"Cash",square:"Carré",duo:"Duo"};
      inner=\`<span class="ml">\${ml2[t.mode]||t.mode}</span><br/>\`;
      if(t.mode==="square"&&t.answer!==null){inner+=q.opts.map((o,oi)=>{let c="ob";if(isFun||oi===q.ans)c+=" correct";else if(oi===t.answer)c+=" wrong";return\`<button class="\${c}" disabled>\${L[oi]}. \${o}</button>\`;}).join("");}
      else if(t.mode==="duo"&&t.answer!==null){const duo=t.duoOpts||[];inner+=duo.map((o,oi)=>{let c="ob";if(isFun||o===q.opts[q.ans])c+=" correct";else if(oi===t.answer)c+=" wrong";return\`<button class="\${c}" disabled>\${L[oi]}. \${o}</button>\`;}).join("");}
      else if(t.mode==="cash"){inner+=\`<div style="font-size:12px;color:#333;padding:4px 0">\${t.answer?"« "+t.answer+" »":""}</div>\`;inner+=t.validated===true?\`<span class="tag tok">✓ Correct</span>\`:\`<span class="tag tko">✗ Incorrect</span>\`;}
    }
    return\`<div class="tc2" style="border-top-color:\${t.color}"><div class="th2"><span class="tnm" style="color:\${t.color}">\${t.name}</span><span class="tpt">\${t.score||0} pts</span></div>\${inner}</div>\`;
  }
  // My team
  if(!t.mode){
    if(isFun){inner=\`<div class="mg"><div class="mc sqc" onclick="snd({type:'team-select-mode',mode:'square'})"><span>Répondre</span><span class="mpt" style="color:#4f8ef7">Bonus</span></div></div>\`;}
    else{inner=\`<div class="mg">
      <div class="mc cc" onclick="snd({type:'team-select-mode',mode:'cash'})"><span>Cash — libre</span><span class="mpt" style="color:var(--g)">5 pts</span></div>
      <div class="mc sqc" onclick="snd({type:'team-select-mode',mode:'square'})"><span>Carré — 4 choix</span><span class="mpt" style="color:#4f8ef7">3 pts</span></div>
      <div class="mc dc" onclick="snd({type:'team-select-mode',mode:'duo'})"><span>Duo — 2 choix</span><span class="mpt" style="color:#22b87a">1 pt</span></div>
    </div>\`;}
  }else if(!t.hasAnswer){
    const ml3={cash:"Cash · 5 pts",square:isFun?"Bonus":"Carré · 3 pts",duo:"Duo · 1 pt"};
    const lbl=\`<span class="ml">\${ml3[t.mode]}</span><br/>\`;
    if(t.mode==="cash"){
      inner=lbl+\`<input class="ci" placeholder="Votre réponse..." oninput="cashVal=this.value" onkeydown="if(event.key==='Enter'&&cashVal.trim())snd({type:'team-answer',answer:cashVal.trim(),cashText:cashVal.trim()})"/>
        <button class="btn bg" style="padding:8px;font-size:12px;margin-bottom:0" onclick="if(cashVal.trim())snd({type:'team-answer',answer:cashVal.trim(),cashText:cashVal.trim()})">Envoyer ✓</button>\`;
    }else if(t.mode==="square"){
      inner=lbl+q.opts.map((o,oi)=>\`<button class="ob" onclick="snd({type:'team-answer',answer:\${oi}})">\${L[oi]}. \${o}</button>\`).join("");
    }else if(t.mode==="duo"){
      const duo=t.duoOpts||[];
      inner=lbl+duo.map((o,oi)=>\`<button class="ob" onclick="snd({type:'team-answer',answer:\${oi}})">\${L[oi]}. \${o}</button>\`).join("");
    }
  }else{
    const ml4={cash:"Cash · 5 pts",square:isFun?"Bonus":"Carré · 3 pts",duo:"Duo · 1 pt"};
    const lbl=\`<span class="ml">\${ml4[t.mode]}</span><br/>\`;
    if(t.mode==="cash"){const tg=revealed?(t.validated===true?\`<span class="tag tok">Correct +5 🎯</span>\`:\`<span class="tag tko">Incorrect ✗</span>\`):\`<span class="tag tan">⏳ Validation hôte...</span>\`;inner=lbl+\`<div style="font-size:13px;padding:5px 0;color:#333;font-weight:600">\${revealed&&t.answer?"« "+t.answer+" »":"Réponse envoyée ✓"}</div>\${tg}\`;}
    else if(t.mode==="square"){const btns=q.opts.map((o,oi)=>{let c="ob";if(revealed){if(isFun||oi===q.ans)c+=" correct";else if(oi===t.answer)c+=" wrong";}else if(oi===t.answer)c+=" sel";return\`<button class="\${c}" disabled>\${L[oi]}. \${o}</button>\`;}).join("");const tg=revealed?(isFun?\`<span class="tag tok">🎉</span>\`:(t.answer===q.ans?\`<span class="tag tok">Correct +3 🎯</span>\`:\`<span class="tag tko">Incorrect ✗</span>\`)):\`<span class="tag tan">Répondu ✓</span>\`;inner=lbl+btns+tg;}
    else if(t.mode==="duo"){const duo=t.duoOpts||[];const btns=duo.map((o,oi)=>{let c="ob";if(revealed){if(isFun||o===q.opts[q.ans])c+=" correct";else if(oi===t.answer)c+=" wrong";}else if(oi===t.answer)c+=" sel";return\`<button class="\${c}" disabled>\${L[oi]}. \${o}</button>\`;}).join("");const ch=typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer;const ok2=ch===q.opts[q.ans];const tg=revealed?(ok2?\`<span class="tag tok">Correct +1 🎯</span>\`:\`<span class="tag tko">Incorrect ✗</span>\`):\`<span class="tag tan">Répondu ✓</span>\`;inner=lbl+btns+tg;}
  }
  return\`<div class="tc2" style="border-top-color:\${t.color}"><div class="th2"><span class="tnm" style="color:\${t.color}">\${t.name}</span><span class="tpt">\${t.score||0} pts</span></div>\${inner}</div>\`;
}

function rHP(teams,q,st2,isFun){
  const allAns=teams.every(t=>t.hasAnswer);
  const canRev=(st2.timerDone||td||allAns)&&!st2.revealed;
  const rows=teams.map((t,ti)=>{
    if(!t.mode)return\`<div class="hr"><span class="hm">—</span><span class="htm" style="color:\${t.color}">\${t.name}</span><span style="color:#ccc;font-size:11px">Mode non choisi</span></div>\`;
    let ans=\`<span style="color:#ccc;font-size:11px">En attente...</span>\`,act="";
    if(t.hasAnswer){
      if(t.mode==="cash"){
        if(hEditTi===ti){ans=\`<input class="hi" id="hed\${ti}" value="\${t.answer||""}" onkeydown="if(event.key==='Enter')sC(\${ti})"/>\`;act=\`<button class="bgsm" onclick="sC(\${ti})">OK</button>\`;}
        else{ans=\`<span class="han">« \${t.answer||"..."} »</span>\`;
          if(t.validated===null||t.validated===undefined){act=\`<button class="bgsm" onclick="hEditTi=\${ti};render()">✏️</button><button class="bgrsm" onclick="snd({type:'host-validate-cash',teamIdx:\${ti},ok:true})">✓ Valider</button><button class="brdsm" onclick="snd({type:'host-validate-cash',teamIdx:\${ti},ok:false})">✗</button>\`;}
          else{act=(t.validated?\`<span class="tag tok" style="font-size:10px">Validé</span>\`:\`<span class="tag tko" style="font-size:10px">Invalidé</span>\`)+\`<button class="bgsm" onclick="snd({type:'host-recheck',teamIdx:\${ti}})">Revoir</button>\`;}}
      }else if(t.mode==="square"){ans=\`<span class="han">\${t.answer!==null&&t.answer!==undefined?L[t.answer]+". "+q.opts[t.answer]:""}</span>\`;}
      else if(t.mode==="duo"){const duo=t.duoOpts||[];ans=\`<span class="han">\${typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer||""}</span>\`;}
    }
    return\`<div class="hr"><span class="hm">\${t.mode||"—"}</span><span class="htm" style="color:\${t.color}">\${t.name}\${t.online===false?' 🔴':''}</span>\${ans}\${act}</div>\`;
  }).join("");
  const bonusRows=teams.map((t,ti)=>\`<div class="bnr"><span class="bnt" style="color:\${t.color}">\${t.name}</span>
    <div style="display:flex;gap:4px;flex-wrap:wrap">
      <button class="bb bbm" onclick="snd({type:'host-bonus',teamIdx:\${ti},pts:-1})">-1</button>
      <button class="bb" onclick="snd({type:'host-bonus',teamIdx:\${ti},pts:1})">+1</button>
      <button class="bb" onclick="snd({type:'host-bonus',teamIdx:\${ti},pts:2})">+2</button>
      <button class="bb" onclick="snd({type:'host-bonus',teamIdx:\${ti},pts:3})">+3</button>
      <button class="bb" onclick="snd({type:'host-bonus',teamIdx:\${ti},pts:5})">+5</button>
    </div></div>\`).join("");
  const revBtn=!st2.revealed
    ?\`<button class="btn bgo" style="max-width:260px" \${canRev?"":\`disabled\`} onclick="snd({type:'host-reveal'})">🎯 Révéler réponse + preuve</button>\${!canRev?\`<div class="rh">Attente équipes ou fin timer...</div>\`:""}\`
    :\`<span class="tag tok">✓ Réponses révélées</span>\`;
  return\`<div class="hp"><h3>🎙️ Panneau hôte</h3>
    <div class="hcr"><strong>Bonne réponse :</strong> \${isFun?"toutes (bonus)":q.opts&&q.ans>=0?q.opts[q.ans]:"—"}</div>
    <div style="font-size:11px;color:var(--g);background:#fffbe6;padding:5px 9px;border-radius:8px;border:1px solid #f0d080;margin-bottom:.5rem;font-style:italic">\${q.fullProof||""}</div>
    \${rows}
    <div class="bns"><div style="font-size:10px;color:var(--g);text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:.4rem">Points bonus</div>\${bonusRows}</div>
    <div class="ra">
      <div class="tc3"><span>⏱ <span id="hTv">\${tv}</span>s</span>
        <button class="bsm" onclick="snd({type:'host-add-time'})">+15s</button>
        <button class="bsm" onclick="snd({type:'host-stop-timer'})">Clôturer ⏹</button>
      </div>
      \${revBtn}
      <div style="margin-top:.7rem;padding-top:.6rem;border-top:1px solid #eee">
        <button class="btn bred" onclick="if(confirm('Clôturer ?'))snd({type:'host-close'})" style="max-width:260px;padding:9px">⏹ Clôturer le quiz</button>
      </div>
    </div></div>\`;}

function sC(ti){const e=document.getElementById("hed"+ti);if(!e)return;snd({type:"host-validate-cash",teamIdx:ti,ok:true,editedAnswer:e.value});hEditTi=-1;}

function rEnd(app){
  if(!st){app.innerHTML=\`<div class="card"><p>Fin</p></div>\`;return;}
  const teams=st.teams||[];
  const sorted=[...teams].sort((a,b)=>(b.score||0)-(a.score||0));
  const top3=sorted.slice(0,Math.min(3,sorted.length));
  const rest=sorted.slice(3);
  const medals=["🥇","🥈","🥉"];
  const podHTML=\`<div class="ps">\${top3.map((t,i)=>\`<div class="pr2\${i===0?" first":""}"><span class="prk">\${medals[i]}</span><span class="prn" style="color:\${t.color}">\${t.name}</span><span class="prp">\${t.score||0} pts</span></div>\`).join("")}</div>\`;
  const restHTML=rest.length?\`<div class="prest">\${rest.map(t=>\`<div class="prr"><span style="font-weight:700;color:\${t.color}">\${t.name}</span><span style="color:#888;font-weight:600">\${t.score||0} pts</span></div>\`).join("")}</div>\`:"";
  const resetBtn=role==="host"?\`<button class="btn bgo" style="max-width:260px;margin-top:1.2rem" onclick="snd({type:'host-close'})">🔄 Nouvelle partie</button>\`:\`<p style="font-size:12px;color:#aaa;margin-top:1rem">En attente de l'hôte...</p>\`;
  app.innerHTML=\`<div class="fw"><div class="fc"><div class="ft">Résultats <b>finaux</b></div><div class="gl"></div>\${podHTML}\${restHTML}\${resetBtn}</div></div>\`;
  confetti();
}

render();
</script>
</body>
</html>
`;
app.get("/", (req, res) => res.send(HTML));
const HOST_PIN = "2293";
const PTS = { cash:5, square:3, duo:1 };
const COLORS = ["#4f8ef7","#22b87a","#f7934f","#9b59b6","#e74c3c","#1abc9c"];
const FIXED_ORDER = [34,7,42,19,50,11,28,3,45,16,22,38,1,49,9,31,44,14,6,47,23,36,13,40,17,5,32,20,43,10,27,48,2,37,15,41,25,8,46,12,33,21,35,4,29,18,39,24,30,26,51];

let game = fresh();
function fresh() {
  return {
    phase:"setup", teams:[], teamCodes:{},
    teamTokens:{}, // token -> teamIdx (for reconnection)
    current:0, qState:[],
    revealed:false, timerVal:60, timerDone:false
  };
}
function genCode() { return String(Math.floor(1000+Math.random()*9000)); }
function genToken() {
  return Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
}

function setupTeams(n) {
  game.teams=[]; game.teamCodes={}; game.teamTokens={};
  for(let i=0;i<n;i++){
    let c; do{c=genCode();}while(game.teamCodes[c]!==undefined);
    game.teamCodes[c]=i;
    game.teams.push({name:`Équipe ${i+1}`,color:COLORS[i%COLORS.length],code:c,score:0,ready:false,members:[],online:false});
  }
  game.phase="waiting";
}

function startQ() {
  const q=QUESTIONS[FIXED_ORDER[game.current]];
  game.qState=game.teams.map(()=>{
    const w=q.opts.filter((_,i)=>i!==q.ans);
    const pick=w[Math.floor(Math.random()*w.length)];
    const duo=Math.random()>.5?[q.opts[q.ans],pick]:[pick,q.opts[q.ans]];
    return {mode:null,answer:null,cashText:"",validated:null,duoOpts:duo};
  });
  game.revealed=false; game.timerVal=60; game.timerDone=false;
  startTimer();
}

let timerInt=null;
function startTimer(){
  stopTimer();
  timerInt=setInterval(()=>{
    game.timerVal=Math.max(0,game.timerVal-1);
    if(game.timerVal<=0){game.timerDone=true;stopTimer();}
    broadcast({type:"timer",val:game.timerVal,done:game.timerDone});
    if(!game.timerDone&&game.qState.every(s=>s.mode&&s.answer!==null)){
      stopTimer();broadcast({type:"timer",val:game.timerVal,done:false});
    }
  },1000);
}
function stopTimer(){if(timerInt){clearInterval(timerInt);timerInt=null;}}
function forceStop(){stopTimer();game.timerVal=0;game.timerDone=true;broadcast({type:"timer",val:0,done:true});}
function addTime(s){game.timerVal+=s;game.timerDone=false;if(!timerInt)startTimer();broadcast({type:"timer",val:game.timerVal,done:false});}

function doReveal(){
  stopTimer(); game.revealed=true;
  const q=QUESTIONS[FIXED_ORDER[game.current]];
  const isFun=q.fun===true;
  game.qState.forEach((s,ti)=>{
    if(isFun||!s.mode||s.answer===null)return;
    if(s.mode==="cash"){if(s.validated===true)game.teams[ti].score+=PTS.cash;}
    else if(s.mode==="square"){if(s.answer===q.ans)game.teams[ti].score+=PTS.square;}
    else if(s.mode==="duo"){const c=typeof s.answer==="number"?s.duoOpts[s.answer]:s.answer;if(c===q.opts[q.ans])game.teams[ti].score+=PTS.duo;}
  });
  broadcastState();
}

const clients=new Map();
function broadcast(msg){const d=JSON.stringify(msg);wss.clients.forEach(ws=>{if(ws.readyState===WebSocket.OPEN)ws.send(d);});}
function sendTo(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj));}

function buildState(forHost){
  const qid=FIXED_ORDER[game.current],q=QUESTIONS[qid];
  return {
    type:"state",forHost,phase:game.phase,
    teams:game.teams.map((t,ti)=>{
      const s=game.qState[ti]||{};
      return forHost
        ?{...t,mode:s.mode,answer:s.answer,hasAnswer:s.answer!==null,validated:s.validated,duoOpts:s.duoOpts}
        :{name:t.name,color:t.color,score:t.score,ready:t.ready,code:t.code,members:t.members,online:t.online,
          mode:s.mode,hasAnswer:s.answer!==null,
          answer:game.revealed?s.answer:null,
          validated:game.revealed?s.validated:null,
          duoOpts:s.duoOpts};
    }),
    current:game.current,total:FIXED_ORDER.length,qid,
    question:{q:q.q,opts:q.opts,ans:game.revealed?q.ans:-1,proof:game.revealed?q.proof:"",isFun:q.fun===true,fullProof:forHost?q.proof:""},
    revealed:game.revealed,timerVal:game.timerVal,timerDone:game.timerDone,
    allCodes:forHost?game.teams.map(t=>({name:t.name,code:t.code,color:t.color,ready:t.ready,members:t.members,online:t.online})):undefined
  };
}

function broadcastState(){
  const hd=JSON.stringify(buildState(true)),pd=JSON.stringify(buildState(false));
  wss.clients.forEach(ws=>{if(ws.readyState!==WebSocket.OPEN)return;const i=clients.get(ws);ws.send(i&&i.role==="host"?hd:pd);});
}
function broadcastWaiting(){
  const hd={type:"waiting",allCodes:game.teams.map(t=>({name:t.name,code:t.code,color:t.color,ready:t.ready,members:t.members,online:t.online}))};
  const pd={type:"waiting",teams:game.teams.map(t=>({name:t.name,color:t.color,ready:t.ready,code:t.code,online:t.online}))};
  wss.clients.forEach(ws=>{if(ws.readyState!==WebSocket.OPEN)return;const i=clients.get(ws);sendTo(ws,i&&i.role==="host"?hd:pd);});
}

// Send current state to a single newly reconnected client
function sendStateTo(ws, forHost) {
  if(game.phase==="waiting") {
    const info=clients.get(ws);
    const isHost=info&&info.role==="host";
    const hd={type:"waiting",allCodes:game.teams.map(t=>({name:t.name,code:t.code,color:t.color,ready:t.ready,members:t.members,online:t.online}))};
    const pd={type:"waiting",teams:game.teams.map(t=>({name:t.name,color:t.color,ready:t.ready,code:t.code,online:t.online}))};
    sendTo(ws,isHost?hd:pd);
  } else if(game.phase==="game"||game.phase==="end") {
    sendTo(ws,buildState(forHost));
  }
}

wss.on("connection",ws=>{
  clients.set(ws,{role:null,teamIdx:null});

  ws.on("message",raw=>{
    let msg;try{msg=JSON.parse(raw);}catch{return;}
    const info=clients.get(ws);

    switch(msg.type){

      // ── HOST AUTH ──
      case "host-auth":
        if(msg.pin===HOST_PIN){
          clients.set(ws,{role:"host",teamIdx:null});
          sendTo(ws,{type:"host-auth-ok"});
          sendStateTo(ws,true);
        }else sendTo(ws,{type:"host-auth-fail"});
        break;

      case "host-setup":
        if(info.role!=="host")break;setupTeams(msg.numTeams);broadcastWaiting();break;

      case "host-start":
        if(info.role!=="host")break;
        game.phase="game";
        game.current=Math.max(0,Math.min((msg.startFrom||1)-1,FIXED_ORDER.length-1));
        startQ();broadcastState();break;

      case "host-reveal":
        if(info.role!=="host")break;doReveal();break;

      case "host-next":
        if(info.role!=="host")break;
        game.current++;
        if(game.current>=FIXED_ORDER.length){game.phase="end";stopTimer();broadcastState();}
        else{startQ();broadcastState();}
        break;

      case "host-add-time":
        if(info.role!=="host")break;addTime(15);break;

      case "host-stop-timer":
        if(info.role!=="host")break;forceStop();break;

      case "host-validate-cash":
        if(info.role!=="host"||!game.qState[msg.teamIdx])break;
        game.qState[msg.teamIdx].validated=msg.ok;
        if(msg.editedAnswer)game.qState[msg.teamIdx].answer=msg.editedAnswer;
        broadcastState();break;

      case "host-bonus":
        if(info.role!=="host"||!game.teams[msg.teamIdx])break;
        game.teams[msg.teamIdx].score=Math.max(0,game.teams[msg.teamIdx].score+msg.pts);
        broadcastState();break;

      case "host-close":
        if(info.role!=="host")break;
        stopTimer();game=fresh();broadcast({type:"reset"});break;

      // ── TEAM AUTH (first time) ──
      case "team-auth":
        const idx=game.teamCodes[msg.code];
        if(idx!==undefined&&!game.teams[idx].ready){
          // First connection — generate token
          const token=genToken();
          game.teamTokens[token]=idx;
          game.teams[idx].online=true;
          clients.set(ws,{role:"team",teamIdx:idx});
          sendTo(ws,{type:"team-auth-ok",teamIdx:idx,team:game.teams[idx],token});
        }else if(idx!==undefined&&game.teams[idx].ready){
          // Already registered — allow reconnect by code + matching name if provided
          // But for first-time we reject (they need to use token)
          sendTo(ws,{type:"team-auth-fail",reason:"already-used"});
        }else{
          sendTo(ws,{type:"team-auth-fail",reason:"invalid"});
        }
        break;

      // ── TEAM TOKEN RECONNECT ──
      case "team-reconnect":
        const rIdx=game.teamTokens[msg.token];
        if(rIdx!==undefined){
          game.teams[rIdx].online=true;
          clients.set(ws,{role:"team",teamIdx:rIdx});
          sendTo(ws,{type:"team-reconnect-ok",teamIdx:rIdx,team:game.teams[rIdx]});
          // Send current game state immediately
          sendStateTo(ws,false);
          // Notify host that team is back online
          broadcastState();
        }else{
          // Token not found (e.g. game reset) — ask to rejoin normally
          sendTo(ws,{type:"team-reconnect-fail"});
        }
        break;

      case "team-set-info":
        if(info.role!=="team")break;
        game.teams[info.teamIdx].name=msg.name.slice(0,20);
        game.teams[info.teamIdx].members=msg.members||[];
        game.teams[info.teamIdx].ready=true;
        broadcastWaiting();break;

      case "team-select-mode":
        if(info.role!=="team"||!game.qState[info.teamIdx]||game.qState[info.teamIdx].mode)break;
        game.qState[info.teamIdx].mode=msg.mode;broadcastState();break;

      case "team-answer":
        if(info.role!=="team"||!game.qState[info.teamIdx]||game.qState[info.teamIdx].answer!==null)break;
        game.qState[info.teamIdx].answer=msg.answer;
        if(msg.cashText)game.qState[info.teamIdx].cashText=msg.cashText;
        if(game.qState.every(s=>s.mode&&s.answer!==null))stopTimer();
        broadcastState();break;
    }
  });

  ws.on("close",()=>{
    const info=clients.get(ws);
    if(info&&info.role==="team"&&info.teamIdx!==null){
      game.teams[info.teamIdx].online=false;
      // Don't remove token — keep it for reconnection
      broadcastState(); // notify host team went offline
    }
    clients.delete(ws);
  });
});

const QUESTIONS={
1:{q:"Dans quelle sourate trouve-t-on le mot « wal yatalattaf » correspondant à la moitié du Coran et signifiant équilibre ?",opts:["Maryam (19)","Al-Isra (17)","Al-Kahf (18)","Taha (20)"],ans:2,proof:"Sourate Al-Kahf (18), verset 19. Le mot « wal yatalattaf » est considéré par certains savants comme le milieu exact du Coran."},
2:{q:"Dans quelle sourate Ibrahim est-il appelé « Khalil Allah » (l'ami d'Allah) ?",opts:["Al-Baqara (2)","An-Nisa (4)","Ibrahim (14)","Al-Anbiya (21)"],ans:1,proof:"Sourate An-Nisa (4:125) : « Et Allah a pris Ibrahim pour ami intime (khalil). »"},
3:{q:"Quelle sourate contient le nom d'Allah dans chacun de ses versets ?",opts:["Al-Mujadila (58)","Al-Ikhlas (112)","Al-Haqqah (69)","Al-Qalam (68)"],ans:0,proof:"Al-Mujadila (58) est la seule sourate du Coran où le nom « Allah » apparaît dans chacun de ses 22 versets, sans exception."},
4:{q:"Dans quelle sourate Allah interdit clairement la moquerie, les mauvaises suppositions et la médisance — avec notamment la parole « l'un de vous mangerait-il la chair de son frère mort ? »",opts:["An-Nur (24)","Al-Hujurat (49)","Al-Isra (17)","Al-Ma'idah (5)"],ans:1,proof:"Sourate Al-Hujurat (49:11-12) : interdiction de la moquerie (v.11), interdiction de la suspicion et de la médisance avec la métaphore de manger la chair de son frère mort (v.12)."},
5:{q:"Combien de sourates sont mecquoises selon la majorité des savants ?",opts:["82","84","86","90"],ans:2,proof:"Selon l'avis majoritaire des ulémas, 86 sourates sont mecquoises et 28 sont médinoises. (Al-Itqan, As-Suyuti)"},
6:{q:"Quelles sourates commencent par les lettres mystérieuses « Ta-Sin-Mim » (طسم) ?",opts:["Al-Qasas (28) & As-Saffat (37)","Al-Qasas (28) & Ash-Shu'ara (26)","Al-Qasas (28) & Ad-Dukhan (44)","Al-Qasas (28) & Hud (11)"],ans:1,proof:"Seules Ash-Shu'ara (26) et Al-Qasas (28) commencent par « Ta-Sin-Mim » parmi les Huruf Muqatta'at."},
7:{q:"Combien de sourates commencent par des lettres mystérieuses (Huruf Muqatta'at) ?",opts:["25","29","33","37"],ans:1,proof:"29 sourates du Coran commencent par des lettres isolées mystérieuses (Huruf Muqatta'at), dont Alif-Lam-Mim, Ya-Sin, etc."},
8:{q:"Quel prophète a failli porter un jugement injuste dans la sourate 38 (Sad) ?",opts:["Sulayman","Musa","Dawud","Ibrahim"],ans:2,proof:"Sourate Sad (38:21-25) : Dawud fut mis à l'épreuve par deux hommes venus soumettre un différend. Il se hâta de juger, puis se repentit. Allah lui pardonna."},
9:{q:"Dans quelle sourate sont décrits les attributs des 'Ibad Ar-Rahman ?",opts:["Maryam (19)","Al-Furqan (25)","Ya-Sin (36)","Al-Mulk (67)"],ans:1,proof:"Sourate Al-Furqan (25:63-74) : liste des qualités des 'Ibad Ar-Rahman — humilité, prière de nuit, modération, invocation..."},
10:{q:"Qui a dit « Allahu Al-Musta'an » (Allah est Celui dont on implore le secours) ?",opts:["Yusuf","Yaqoub","Ibrahim","Ismail"],ans:1,proof:"Sourate Yusuf (12:18) : Yaqoub dit « fa sabrun jamilun wal-Llahu l-musta'an » après qu'on lui présenta la chemise ensanglantée de Yusuf."},
11:{q:"Quel est le numéro de la sourate Ash-Shura (La Consultation) ?",opts:["40","42","44","46"],ans:1,proof:"Ash-Shura est la 42ème sourate du Coran, révélée à La Mecque, composée de 53 versets."},
12:{q:"Combien de versets de prosternation (sajda) y a-t-il dans le Coran ?",opts:["11","13","15","17"],ans:2,proof:"Il y a 15 versets de sajda dans le Coran selon la majorité : dans les sourates 7, 13, 16, 17, 19, 22 (x2), 25, 27, 32, 38, 41, 53, 84 et 96."},
13:{q:"Quelle est la 2ème sourate révélée selon l'avis majoritaire des savants ?",opts:["Al-Muddathir (74)","Al-Qalam (68)","Al-Fatiha (1)","Al-Muzzammil (73)"],ans:1,proof:"Selon Ibn Abbas et la majorité des savants, Al-Qalam (68) est la 2ème sourate révélée, après Al-Alaq (96:1-5)."},
14:{q:"Dans quelle sourate Allah dit qu'une montagne se serait fendue par crainte d'Allah si le Coran y avait été révélé ?",opts:["Al-Waqi'a (56)","Al-Hashr (59)","Qaf (50)","Al-Kahf (18)"],ans:1,proof:"Sourate Al-Hashr (59:21) : « Si Nous avions fait descendre ce Coran sur une montagne, tu l'aurais vue s'humilier et se fendre par crainte d'Allah. »"},
15:{q:"Quelle sourate contient deux fois la basmala (Bismillah ir-Rahman ir-Rahim) ?",opts:["Al-Hadid (57)","An-Naml (27)","Al-Baqara (2)","Ya-Sin (36)"],ans:1,proof:"An-Naml (27) contient la basmala au verset 1 (début) et au verset 30 dans la lettre de Sulayman à Bilqis."},
16:{q:"Dans quelle sourate 'Issa (Jésus) annonce-t-il la venue du Prophète Muhammad ﷺ ?",opts:["Maryam (19)","As-Saff (61)","Al-Ma'idah (5)","Al-Qamar (54)"],ans:1,proof:"Sourate As-Saff (61:6) : 'Issa dit : « ...et annonçant la bonne nouvelle d'un Messager qui viendra après moi et dont le nom sera Ahmad. »"},
17:{q:"Quel est l'autre nom de Médine mentionné dans le Coran ?",opts:["Tayba","Yathrib","Dar al-Hijra","Madinat Rasul"],ans:1,proof:"Sourate Al-Ahzab (33:13) : « ...Ô gens de Yathrib, vous ne pouvez tenir... » C'est le seul endroit du Coran où Médine est appelée Yathrib."},
18:{q:"Combien de sourates portent le nom d'un prophète ?",opts:["5","6","7","8"],ans:1,proof:"6 sourates portent le nom d'un prophète : Yunus (10), Hud (11), Yusuf (12), Ibrahim (14), Muhammad (47), Nuh (71)."},
19:{q:"Dans quelle sourate Allah ordonne de dire la formule complète « A'oudhu billahi mina shaytan ir-rajim » avant de réciter le Coran ?",opts:["Al-Baqara (2)","An-Nahl (16)","Al-Isra (17)","Ya-Sin (36)"],ans:1,proof:"Sourate An-Nahl (16:98) : « Quand tu récites le Coran, demande la protection d'Allah contre le Shaytan maudit (rajim). »"},
20:{q:"Dans quelle sourate Allah dit qu'Il est « plus proche de l'homme que sa veine jugulaire » ?",opts:["Al-Baqara (2)","Qaf (50)","Al-Hadid (57)","Al-Waqi'a (56)"],ans:1,proof:"Sourate Qaf (50:16) : « Nous avons créé l'homme et Nous savons ce que son âme lui suggère. Et Nous sommes plus proche de lui que sa veine jugulaire. »"},
21:{q:"Dans quelle sourate Allah dit « quiconque place sa confiance en Allah, Il lui suffit » ?",opts:["Al-Baqara (2)","At-Talaq (65)","Al-Imran (3)","Az-Zumar (39)"],ans:1,proof:"Sourate At-Talaq (65:3) : « ...Et quiconque place sa confiance en Allah, Il lui suffit. Car Allah atteint ce qu'Il Se propose. »"},
22:{q:"Dans quelle sourate Allah dit « certes avec la difficulté vient la facilité » ?",opts:["Ad-Duha (93)","Ash-Sharh / Al-Inshirah (94)","Al-Buruj (85)","Al-Balad (90)"],ans:1,proof:"Sourate Ash-Sharh (94:5-6) : « Car avec la difficulté vient certes la facilité. Oui, avec la difficulté vient la facilité. » — répété deux fois."},
23:{q:"Dans quelle sourate Allah dit « ton Seigneur n'est point injuste envers Ses serviteurs » ?",opts:["Al-Baqara (2)","Fussilat (41)","Az-Zumar (39)","Al-Kahf (18)"],ans:1,proof:"Sourate Fussilat (41:46) : « Quiconque fait le bien, c'est pour lui-même... et ton Seigneur n'est point injuste envers Ses serviteurs. »"},
24:{q:"Dans quelle sourate Allah dit « Allah ne change pas l'état d'un peuple tant que celui-ci ne change pas ce qui est en lui-même » ?",opts:["Al-Baqara (2)","Ar-Ra'd (13)","Al-Anfal (8)","An-Nahl (16)"],ans:1,proof:"Sourate Ar-Ra'd (13:11) : « En vérité, Allah ne modifie point l'état d'un peuple tant que les individus ne modifient pas ce qui est en eux-mêmes. »"},
25:{q:"Dans quelle sourate Allah dit « Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah » ?",opts:["Al-Baqara (2)","Az-Zumar (39)","An-Nisa (4)","Al-Imran (3)"],ans:1,proof:"Sourate Az-Zumar (39:53) : « Dis : Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés. »"},
26:{q:"Dans quel lieu le Prophète ﷺ et Abu Bakr se sont-ils cachés pendant trois jours lors de la Hijra ?",opts:["La grotte de Hira","La grotte de Thawr","La vallée de Mina","Le mont Uhud"],ans:1,proof:"Coran At-Tawba (9:40) : « ...quand ils étaient deux dans la grotte... » — La grotte de Thawr, au sud de La Mecque."},
27:{q:"Quel homme, mandaté pour tuer l'oncle du Prophète ﷺ lors d'une bataille, accomplit sa mission avec un javelot avant d'embrasser l'Islam des années plus tard ?",opts:["Khabbab ibn al-Aratt","Wahshi ibn Harb","Jubayr ibn Mut'im","Ikrimah ibn Abi Jahl"],ans:1,proof:"Wahshi ibn Harb tua Hamza ibn Abd al-Muttalib à Uhud (3H) sur ordre de Hind bint Utba. Il se convertit à l'Islam après la conquête de La Mecque. (Sahih Bukhari)"},
28:{q:"Quelle épouse du Prophète ﷺ était surnommée « Umm al-Masakin » (la mère des pauvres) pour sa grande générosité ?",opts:["Sawda bint Zam'a","Zaynab bint Khuzayma","Hafsa bint Umar","Umm Salama"],ans:1,proof:"Zaynab bint Khuzayma al-Hilaliya, connue pour sa générosité envers les pauvres. Elle mourut peu après son mariage avec le Prophète ﷺ."},
29:{q:"Quel fut le premier prophète à utiliser le qalam (la plume pour écrire) ?",opts:["Ibrahim (as)","Idris (as)","Adam (as)","Nuh (as)"],ans:1,proof:"Selon de nombreux savants dont Ibn Kathir, Idris (Hénoch) est le premier à avoir écrit avec la plume. Le Coran jure par le qalam dans Al-Qalam (68:1)."},
30:{q:"Quel prophète le Prophète Muhammad ﷺ a-t-il rencontré au 5ème ciel lors du Mi'raj ?",opts:["Issa (as)","Musa (as)","Harun (as)","Ibrahim (as)"],ans:2,proof:"Selon les hadiths authentiques (Bukhari & Muslim) : 1er=Adam, 2ème=Yahya & Issa, 3ème=Yusuf, 4ème=Idris, 5ème=Harun, 6ème=Musa, 7ème=Ibrahim."},
31:{q:"Quel prophète déclara qu'il passerait cette nuit-là par toutes ses épouses pour qu'elles enfantent chacune un fils moudjahid dans la voie d'Allah — sans prononcer « Inch'Allah » — et vit sa parole ne pas s'accomplir ?",opts:["Dawud (as)","Sulayman (as)","Yusuf (as)","Ibrahim (as)"],ans:1,proof:"Hadith Bukhari (3424) : Sulayman dit « Cette nuit je passerai par 99 femmes... » Il oublia de dire Inch'Allah — aucune n'enfanta sauf une qui donna naissance à un enfant incomplet."},
32:{q:"Quel compagnon est surnommé « le détenteur du secret du Prophète ﷺ concernant les hypocrites » ?",opts:["Hudhayfa ibn al-Yaman","Abu Hurayra","Abdullah ibn Masoud","Salman al-Farisi"],ans:0,proof:"Hudhayfa ibn al-Yaman fut le seul compagnon à qui le Prophète ﷺ confia les noms des hypocrites de Médine. (Sahih Muslim)"},
33:{q:"Quel compagnon a tué son propre père lors de la bataille de Badr ?",opts:["Ali ibn Abi Talib","Abu Ubayda ibn al-Jarrah","Sa'd ibn Abi Waqqas","Az-Zubayr ibn al-Awwam"],ans:1,proof:"Abu Ubayda ibn al-Jarrah tua son père Jarrah ibn Abdullah lors de Badr. Suite à cela, Allah révéla Al-Mujadila (58:22)."},
34:{q:"Quel compagnon fut le premier à réciter le Coran publiquement à La Mecque malgré les persécutions des Quraysh ?",opts:["Sa'd ibn Abi Waqqas","Abdullah ibn Masoud","Mus'ab ibn Umayr","Khabbab ibn al-Aratt"],ans:1,proof:"Abdullah ibn Masoud fut le premier à réciter le Coran à voix haute à la Kaaba devant les Quraysh, récitant Ar-Rahman (55). Il fut frappé mais continua. (Ibn Hisham, Sira)"},
35:{q:"Quel compagnon ansari fut désigné par le Prophète ﷺ comme « le meilleur réciteur du Coran » parmi les Ansar ?",opts:["Sa'd ibn Mu'adh","Ubayy ibn Ka'b","Muadh ibn Jabal","Zayd ibn Thabit"],ans:1,proof:"Le Prophète ﷺ dit : « Le meilleur réciteur du Coran parmi ma communauté est Ubayy ibn Ka'b. » (Tirmidhi, Hassan Sahih)."},
36:{q:"Quel compagnon refusa de quitter La Mecque pour rester auprès de sa mère polythéiste malgré les persécutions ?",opts:["Abu Hurayra","Ammar ibn Yasir","Sa'd ibn Abi Waqqas","Mus'ab ibn Umayr"],ans:2,proof:"Sa'd ibn Abi Waqqas refusa de quitter l'Islam malgré la grève de la faim de sa mère. Allah révéla Luqman (31:15)."},
37:{q:"Quel compagnon portait l'étendard lors de la conquête de La Mecque, avant que le Prophète ﷺ ne le lui retire en raison de ses paroles ?",opts:["Ali ibn Abi Talib","Umar ibn al-Khattab","Sa'd ibn Ubada","Az-Zubayr ibn al-Awwam"],ans:2,proof:"Sa'd ibn Ubada portait l'étendard des Ansar à la conquête de La Mecque (8H). Après avoir dit « Aujourd'hui est le jour de la bataille », le Prophète ﷺ lui retira l'étendard. (Ibn Hisham)"},
38:{q:"Quel compagnon a proposé de creuser la tranchée lors de la bataille du Fossé (Al-Khandaq) ?",opts:["Umar ibn al-Khattab","Salman al-Farisi","Ali ibn Abi Talib","Hudhayfa ibn al-Yaman"],ans:1,proof:"Salman al-Farisi proposa la stratégie de creuser une tranchée autour de Médine — tactique militaire connue en Perse mais inconnue des Arabes. (Ibn Hisham)"},
39:{q:"Quel compagnon est connu pour avoir lavé le corps du Prophète ﷺ après sa mort ?",opts:["Umar ibn al-Khattab","Abu Bakr as-Siddiq","Ali ibn Abi Talib","Uthman ibn Affan"],ans:2,proof:"Ali ibn Abi Talib lava le corps du Prophète ﷺ, assisté de al-Abbas, al-Fadl et Usama ibn Zayd. (Sahih Bukhari, Kitab al-Jana'iz)"},
40:{q:"Quel compagnon fut le dernier des 10 promis au Paradis (Al-Ashara al-Mubashshara) à mourir ?",opts:["Ali ibn Abi Talib","Az-Zubayr ibn al-Awwam","Sa'd ibn Abi Waqqas","Talha ibn Ubaydillah"],ans:2,proof:"Sa'd ibn Abi Waqqas mourut en l'an 55H à Al-Aqiq, près de Médine. Il fut le dernier des dix Compagnons promis au Paradis. (Ibn Abd al-Barr, Al-Isti'ab)"},
41:{q:"Selon quel madahib la consommation de viande de chameau annule-t-elle les ablutions ?",opts:["Maliki","Shafi'i","Hanbali","Hanafi"],ans:2,proof:"Seul le madahib Hanbali considère que manger de la viande de chameau annule le wudu, basé sur le hadith de Jabir ibn Samura (Muslim 360)."},
42:{q:"Selon quel madahib le simple fait de toucher une femme non-mahram annule-t-il les ablutions sans condition ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Selon le madahib Shafi'i : tout contact peau à peau entre un homme et une femme non-mahram annule le wudu, basé sur Al-Ma'idah (5:6)."},
43:{q:"Selon quel madahib la basmala fait-elle partie intégrante de la Fatiha et est-elle obligatoire à réciter à voix haute ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Le madahib Shafi'i considère la basmala comme un verset de la Fatiha. Elle est donc obligatoire (fard) dans la prière et se récite à voix haute en prière jahriyya."},
44:{q:"Selon quel madahib la zakat est-elle obligatoire sur les bijoux en or portés par les femmes ?",opts:["Shafi'i","Maliki","Hanbali","Hanafi"],ans:3,proof:"Le madahib Hanafi impose la zakat sur les bijoux en or et en argent, même portés et utilisés. Les trois autres madahib exemptent généralement les bijoux portés."},
45:{q:"Quel est le premier des 4 imams des madahib à avoir enseigné l'un des autres imams ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:0,proof:"Imam Malik (93-179H) a directement enseigné Imam Shafi'i (150-204H), qui lui-même a enseigné Imam Ahmad (164-241H)."},
46:{q:"Qui est le plus âgé des 4 imams des madahib ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:1,proof:"Imam Abu Hanifa est né en 80H (699 CE), Imam Malik en 93H, Imam Shafi'i en 150H et Imam Ahmad en 164H. Abu Hanifa est donc le doyen des quatre."},
47:{q:"Qui a écrit Riyad as-Salihin (Les Jardins des Vertueux) ?",opts:["Ibn Taymiyya","Ibn Hajar al-Asqalani","Imam An-Nawawi","Ibn Qudama"],ans:2,proof:"Riyad as-Salihin a été compilé par l'Imam Yahya ibn Sharaf An-Nawawi (631-676H), grand savant shafi'i de Syrie."},
48:{q:"Qui a écrit Majmu' al-Fatawa ?",opts:["Ibn Hajar al-Asqalani","Ibn Taymiyya","Ibn al-Qayyim","As-Suyuti"],ans:1,proof:"Majmu' al-Fatawa est le recueil des fatwas et écrits de Shaykh al-Islam Ibn Taymiyya (661-728H), compilé par son élève Ibn Qasim en 37 volumes."},
49:{q:"Quelle est la formule arabe utilisée pour exprimer qu'Allah s'est établi sur Son Trône ?",opts:["Jalasa 'ala al-'Arsh","Istawa 'ala al-'Arsh","Fawqa 'ala al-'Arsh","Istaqarra 'ala al-'Arsh"],ans:1,proof:"Istawa 'ala al-'Arsh (استوى على العرش) — mentionnée 7 fois dans le Coran, dont Al-A'raf (7:54), Ta-Ha (20:5), Al-Furqan (25:59). Jalasa, fawqa et istaqarra sont des expressions non coraniques."},
50:{q:"Quelle personne fut la première martyre de l'Islam ?",opts:["Bilal ibn Rabah","Yasir ibn Amir","Sumayyah bint Khayyat","Khabbab ibn al-Aratt"],ans:2,proof:"Sumayyah bint Khayyat, mère d'Ammar ibn Yasir, fut tuée par Abu Jahl alors qu'elle refusait d'abjurer l'Islam. Elle est unanimement reconnue comme la première martyre de l'Islam. (Ibn Hisham, Sira)"},
51:{q:"Qui est le plus grand défenseur de la cause féminine du groupe ?",opts:["ABD","Ablaye","Abdallah ibn Kawsu","Abdoulaye"],ans:0,proof:"Question bonus — toutes les réponses sont correctes !",fun:true}
};

const PORT=process.env.PORT||3000;
server.listen(PORT,()=>console.log("Quiz OK port "+PORT));
