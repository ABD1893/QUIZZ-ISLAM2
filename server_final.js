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
:root{--gold:#c9a84c;--gold-light:#f0d080;--dark:#1a1a2e;--darker:#0f0f1a;--card:#ffffff;--bg:#f5f3ee;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden;}

/* ISLAMIC PATTERN BG */
body::before{content:"";position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23c9a84c' stroke-width='0.5' opacity='0.15'/%3E%3Cpath d='M30 10L50 30L30 50L10 30Z' fill='none' stroke='%23c9a84c' stroke-width='0.5' opacity='0.1'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.wrap{position:relative;z-index:1;padding:1rem;max-width:1200px;margin:0 auto;}

/* CARDS */
.card{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:2rem;max-width:460px;margin:2rem auto;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.08);}
.card-wide{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:1.5rem;max-width:720px;margin:1.5rem auto;box-shadow:0 4px 24px rgba(0,0,0,.08);}

/* TITLE */
.logo{font-size:28px;font-weight:800;color:var(--dark);margin-bottom:.2rem;letter-spacing:-.5px;}
.logo span{color:var(--gold);}
.sub{font-size:13px;color:#999;margin-bottom:1.5rem;}
.gold-line{width:60px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light));border-radius:99px;margin:.5rem auto 1.5rem;}

/* BUTTONS */
.btn{width:100%;padding:13px;border-radius:12px;border:none;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:10px;}
.btn-dark{background:var(--dark);color:#fff;}
.btn-dark:hover{background:#2d2d4e;transform:translateY(-1px);}
.btn-dark:disabled{opacity:.4;cursor:default;transform:none;}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-light));color:#1a1a00;box-shadow:0 4px 15px rgba(201,168,76,.35);}
.btn-gold:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(201,168,76,.5);}
.btn-gold:disabled{opacity:.4;cursor:default;transform:none;}
.btn-outline{background:#fff;border:1.5px solid #ddd;color:#555;font-weight:600;}
.btn-outline:hover{background:#f5f5f5;}
.btn-sm{padding:6px 14px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#444;}
.btn-sm:hover{background:#f5f5f5;}
.btn-sm:disabled{opacity:.4;cursor:default;}
.btn-green-sm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #5ecb9a;background:#e6f9f0;color:#1a6641;cursor:pointer;font-weight:600;}
.btn-red-sm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;font-weight:600;}
.btn-grey-sm{padding:5px 10px;font-size:11px;border-radius:7px;border:1px solid #ddd;background:#fff;color:#555;cursor:pointer;}

/* ENTRY */
.entry-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:.5rem;}
.entry-btn{padding:18px 12px;border-radius:14px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;text-align:center;transition:all .2s;}
.entry-btn:hover{background:#f0ede6;border-color:var(--gold);transform:translateY(-2px);}
.entry-icon{font-size:28px;margin-bottom:6px;}
.entry-label{font-size:13px;font-weight:700;color:#1a1a1a;}
.entry-sub{font-size:11px;color:#aaa;margin-top:2px;}

/* PIN */
.pin-dots{display:flex;justify-content:center;gap:12px;margin-bottom:1.2rem;}
.pin-dot{width:44px;height:44px;border-radius:12px;border:1.5px solid #ddd;background:#faf9f6;display:flex;align-items:center;justify-content:center;font-size:24px;transition:all .2s;}
.pin-dot.filled{border-color:var(--gold);background:#fffbe6;}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:210px;margin:0 auto 1rem;}
.pin-key{padding:13px;border-radius:11px;border:1px solid #e0ddd6;background:#faf9f6;font-size:18px;cursor:pointer;font-weight:600;transition:all .15s;}
.pin-key:hover{background:#f0ede6;border-color:var(--gold);}
.pin-error{font-size:12px;color:#e74c3c;height:18px;margin-bottom:.4rem;font-weight:600;}

/* INPUTS */
.inp{width:100%;padding:12px 14px;border-radius:11px;border:1.5px solid #ddd;background:#faf9f6;font-size:15px;color:#1a1a1a;margin-bottom:1rem;outline:none;text-align:center;transition:border .2s;}
.inp:focus{border-color:var(--gold);}
.sel{width:100%;padding:11px 14px;border-radius:11px;border:1.5px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:1.2rem;}

/* TAGS */
.tag{font-size:11px;padding:3px 10px;border-radius:99px;display:inline-block;font-weight:600;}
.tag-ready{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-wait{background:#fff8e6;color:#a07020;border:1px solid #f5d97a;}
.tag-ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-ko{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.tag-ans{background:#f0f0f0;color:#555;border:1px solid #ddd;}
.tag-host{background:#eef3ff;color:#1a3a8b;border:1px solid #b0c4f7;}

/* WAITING ROOM */
.team-slot{display:flex;align-items:center;justify-content:space-between;padding:11px 16px;border-radius:12px;background:#faf9f6;border:1px solid #eee;margin-bottom:8px;flex-wrap:wrap;gap:6px;transition:all .3s;}
.team-slot.is-ready{background:#f0faf5;border-color:#b0e0c8;}
.slot-name{font-size:13px;font-weight:700;}
.slot-code{font-size:13px;font-family:monospace;font-weight:700;background:#f0ede6;padding:3px 10px;border-radius:7px;color:var(--dark);letter-spacing:.05em;}

/* GAME HEADER */
.game-hdr{text-align:center;padding:.6rem 0 .4rem;}
.game-hdr h1{font-size:18px;font-weight:800;color:var(--dark);}
.game-hdr h1 span{color:var(--gold);}
.game-hdr .prog{font-size:12px;color:#999;margin-top:1px;}

/* TIMER */
.timer-wrap{position:relative;margin-bottom:.3rem;}
.timer-bg{background:#eee;border-radius:99px;height:10px;overflow:hidden;}
.timer-bar{height:10px;border-radius:99px;transition:width 1s linear,background .5s;}
.timer-bar.pulse{animation:pulse 1s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.6;}}
.timer-num{text-align:center;font-size:22px;font-weight:800;margin:.3rem 0 .6rem;transition:color .5s;}
.timer-num.flash{animation:flashRed .5s;}
@keyframes flashRed{0%,100%{opacity:1;}50%{opacity:0;}}

/* SCORES */
.scores-bar{display:grid;gap:8px;margin-bottom:.8rem;}
.sc-card{background:var(--card);border-radius:13px;border:1px solid #e8e4da;padding:.5rem .8rem;text-align:center;position:relative;overflow:hidden;}
.sc-card .scn{font-size:11px;font-weight:700;margin-bottom:1px;}
.sc-card .scv{font-size:20px;font-weight:800;}
.sc-card .sc-bar{position:absolute;bottom:0;left:0;height:3px;border-radius:0 3px 3px 0;transition:width .5s ease;}
.pts-anim{position:absolute;top:4px;right:8px;font-size:12px;font-weight:700;color:#22b87a;animation:floatUp .8s ease forwards;pointer-events:none;}
@keyframes floatUp{0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(-20px);}}

/* QUESTION */
.q-box{background:var(--card);border-radius:16px;border:1px solid #e8e4da;padding:1.1rem 1.4rem;margin-bottom:.8rem;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.05);}
.q-num{font-size:10px;color:var(--gold);letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:5px;}
.q-text{font-size:14px;font-weight:700;line-height:1.65;color:var(--dark);}

/* PROOF */
.proof-box{background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:14px;border:1px solid #b0e0c8;padding:1rem 1.2rem;margin-bottom:.8rem;font-size:12px;color:#1a4a30;line-height:1.7;animation:slideIn .4s ease;}
@keyframes slideIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.proof-box strong{color:#0a3a20;}

/* TEAM CARDS */
.teams-grid{display:grid;gap:8px;margin-bottom:.8rem;}
.t-card{background:var(--card);border-radius:15px;border:1px solid #e8e4da;padding:.85rem;border-top:4px solid #ccc;transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.t-card.answered{opacity:.85;}
.t-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.t-name{font-size:13px;font-weight:800;}
.t-pts{font-size:12px;color:#888;font-weight:600;}

/* MODE CARDS */
.mode-grid{display:flex;flex-direction:column;gap:6px;}
.mode-card{padding:10px 12px;border-radius:11px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .2s;font-size:12px;font-weight:600;}
.mode-card:hover{transform:translateY(-1px);}
.mode-card.cash-c{border-color:#f0c060;background:#fffbe6;}
.mode-card.cash-c:hover{border-color:var(--gold);}
.mode-card.square-c{border-color:#90c0f0;background:#eef5ff;}
.mode-card.square-c:hover{border-color:#4f8ef7;}
.mode-card.duo-c{border-color:#90dbb0;background:#edfaf3;}
.mode-card.duo-c:hover{border-color:#22b87a;}
.mode-pts{font-weight:800;font-size:13px;}
.mode-confirm-box{background:#faf9f6;border-radius:11px;border:1.5px solid #e0ddd6;padding:10px 12px;text-align:center;}
.mode-confirm-box p{font-size:12px;color:#444;margin-bottom:8px;font-weight:600;}
.confirm-row{display:flex;gap:7px;justify-content:center;}
.btn-conf{padding:7px 18px;border-radius:8px;border:none;background:var(--dark);color:#fff;font-size:12px;font-weight:700;cursor:pointer;}
.btn-canc{padding:7px 12px;border-radius:8px;border:1.5px solid #ccc;background:#fff;font-size:12px;cursor:pointer;color:#555;font-weight:600;}

/* OPT BUTTONS */
.opt-btn{width:100%;padding:8px 11px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:12px;cursor:pointer;text-align:left;color:var(--dark);margin-bottom:4px;line-height:1.3;font-weight:600;transition:all .2s;}
.opt-btn:hover:not(:disabled){background:#f0ede6;border-color:#bbb;}
.opt-btn:disabled{cursor:default;}
.opt-btn.sel{background:#eef3ff;border-color:#4f8ef7;}
.opt-btn.correct{background:#e6f9f0;border-color:#22b87a;color:#0a4a25;animation:popIn .4s ease;}
.opt-btn.wrong{background:#fdecea;border-color:#e74c3c;color:#5a0a0a;animation:shake .4s ease;}
@keyframes popIn{0%{transform:scale(1);}50%{transform:scale(1.03);}100%{transform:scale(1);}}
@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}

/* CASH */
.cash-inp{width:100%;padding:9px 11px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:13px;color:var(--dark);margin-bottom:5px;outline:none;font-weight:600;}
.cash-inp:focus{border-color:var(--gold);}
.cash-sub{width:100%;padding:8px;border-radius:10px;border:none;background:var(--dark);font-size:12px;cursor:pointer;color:#fff;font-weight:700;}

/* MODE LABEL */
.mode-lbl{font-size:10px;padding:2px 8px;border-radius:99px;border:1px solid #e0ddd6;color:#888;margin-bottom:6px;display:inline-block;font-weight:600;}

/* HOST PANEL */
.host-panel{background:var(--card);border-radius:15px;border:1px solid #e8e4da;padding:.9rem;margin-top:.7rem;box-shadow:0 2px 12px rgba(0,0,0,.05);}
.host-panel h3{font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.7rem;}
.h-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;padding:8px 10px;background:#faf9f6;border-radius:10px;border:1px solid #eee;flex-wrap:wrap;}
.h-mode{font-size:10px;color:#aaa;min-width:44px;text-transform:uppercase;font-weight:700;}
.h-team{font-size:12px;font-weight:800;min-width:75px;}
.h-ans{font-size:12px;color:#333;flex:1;font-style:italic;}
.h-inp{padding:4px 8px;font-size:12px;border-radius:7px;border:1px solid #ccc;background:#fff;color:var(--dark);width:130px;}
.h-correct{font-size:12px;color:#0a3a20;padding:8px 12px;background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:9px;border:1px solid #b0e0c8;margin-bottom:.7rem;font-weight:600;}
.rev-area{text-align:center;margin-top:.8rem;padding-top:.8rem;border-top:1px solid #eee;}
.rev-hint{font-size:11px;color:#aaa;margin-top:4px;}
.timer-ctrl{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:.7rem;flex-wrap:wrap;}
.timer-ctrl span{font-size:12px;color:#666;font-weight:600;}
.host-toggle{text-align:center;margin-top:.4rem;}
.host-toggle button{font-size:11px;color:#bbb;background:none;border:none;cursor:pointer;text-decoration:underline;}

/* CODE TABLE */
.code-tbl{width:100%;border-collapse:collapse;margin-top:.5rem;}
.code-tbl th{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.05em;padding:5px 8px;text-align:left;border-bottom:1px solid #eee;font-weight:700;}
.code-tbl td{padding:8px 8px;border-bottom:1px solid #f5f5f5;}
.code-pill{font-family:monospace;font-weight:800;font-size:16px;background:linear-gradient(135deg,#fffbe6,#fff3cc);padding:3px 12px;border-radius:7px;border:1px solid var(--gold);color:var(--dark);letter-spacing:.05em;}

/* CONN STATUS */
.conn{position:fixed;bottom:12px;right:12px;font-size:11px;padding:5px 12px;border-radius:99px;font-weight:700;z-index:999;transition:all .3s;}
.conn.ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.conn.off{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}

/* ══════════════════════
   FINAL SCREEN
══════════════════════ */
.final-wrap{padding:2rem 0;min-height:100vh;display:flex;align-items:center;justify-content:center;}
.final-card{background:var(--card);border-radius:24px;padding:2.5rem 2rem;max-width:560px;width:100%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,.12);}
.final-title{font-size:26px;font-weight:800;color:var(--dark);margin-bottom:.3rem;}
.final-title span{color:var(--gold);}
.podium{display:flex;align-items:flex-end;justify-content:center;gap:12px;margin:2rem 0 1.5rem;height:160px;}
.podium-col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;}
.podium-name{font-size:12px;font-weight:700;margin-bottom:5px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.podium-score{font-size:11px;color:#888;margin-bottom:4px;font-weight:600;}
.podium-medal{font-size:24px;margin-bottom:4px;}
.podium-block{border-radius:10px 10px 0 0;width:80px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;animation:riseUp .8s ease forwards;}
.p1{height:120px;background:linear-gradient(180deg,var(--gold-light),var(--gold));animation-delay:.1s;}
.p2{height:85px;background:linear-gradient(180deg,#c0c8d8,#8090a8);animation-delay:.3s;}
.p3{height:60px;background:linear-gradient(180deg,#e0b080,#c07830);animation-delay:.5s;}
@keyframes riseUp{from{height:0;opacity:0;}to{opacity:1;}}
.f-row{display:flex;align-items:center;justify-content:space-between;padding:11px 1rem;border-radius:11px;margin-bottom:7px;background:#faf9f6;border:1px solid #eee;}
.f-rank{font-size:20px;min-width:32px;}
.f-name{font-size:14px;font-weight:700;}
.f-pts{font-size:13px;color:#888;font-weight:600;}

/* CONFETTI */
.confetti-piece{position:fixed;width:10px;height:10px;top:-10px;border-radius:2px;animation:confettiFall linear forwards;pointer-events:none;z-index:9999;}
@keyframes confettiFall{0%{transform:translateY(0) rotate(0deg);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}

@media(max-width:680px){.teams-grid{grid-template-columns:1fr!important;}.q-text{font-size:13px;}.entry-grid{grid-template-columns:1fr;}.podium{height:120px;}.p1{height:90px;}.p2{height:65px;}.p3{height:45px;}.podium-block{width:65px;}}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn off" id="conn">Connexion...</div>

<script>
const LABELS=["A","B","C","D"];
const MEDALS=["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];
const CONF_COLORS=["#f7934f","#4f8ef7","#22b87a","#c9a84c","#9b59b6","#e74c3c","#f0d080"];

// ── STATE ──
let role=null,myTeamIdx=null,serverState=null;
let phase="entry";
let pinEntry="",pinError="";
let teamNameInput="",myTeamNameInput="";
let editingTi=-1,hostPanelOpen=false;
let cashInputVal="",numTeams=3;
let prevScores=[];
let timerVal=45,timerDone=false;

// ── WEBSOCKET ──
const proto=location.protocol==="https:"?"wss:":"ws:";
let ws;
function connectWS(){
  ws=new WebSocket(proto+"//"+location.host);
  ws.onopen=()=>{setConn(true);};
  ws.onclose=()=>{setConn(false);setTimeout(connectWS,2000);};
  ws.onerror=()=>setConn(false);
  ws.onmessage=onMsg;
}
function setConn(ok){const el=document.getElementById("conn");if(!el)return;el.textContent=ok?"Connecté":"Reconnexion...";el.className="conn "+(ok?"ok":"off");}
function send(obj){if(ws&&ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj));}
connectWS();

function onMsg(evt){
  const msg=JSON.parse(evt.data);
  if(msg.type==="reset"){location.reload();return;}
  if(msg.type==="host-auth-ok"){role="host";phase="host-setup";render();return;}
  if(msg.type==="host-auth-fail"){pinError="Code incorrect";pinEntry="";render();return;}
  if(msg.type==="team-auth-ok"){role="team";myTeamIdx=msg.teamIdx;phase="team-name";render();return;}
  if(msg.type==="team-auth-fail"){pinError=msg.reason==="already-used"?"Code déjà utilisé":"Code invalide";pinEntry="";render();return;}
  if(msg.type==="timer"){updateTimer(msg.val,msg.done);return;}
  if(msg.type==="waiting"){
    if(phase!=="team-name"){phase="waiting";}
    serverState=msg;render();return;
  }
  if(msg.type==="state"){
    // Track score changes for animation
    if(serverState&&serverState.teams){
      prevScores=serverState.teams.map(t=>t.score);
    }
    serverState=msg;
    timerVal=msg.timerVal;timerDone=msg.timerDone;
    if(msg.phase==="waiting"&&phase!=="team-name")phase="waiting";
    if(msg.phase==="game")phase="game";
    if(msg.phase==="end"){phase="end";if(msg.revealed!==false)launchConfetti();}
    render();
    // Score animations
    if(msg.revealed&&serverState.teams){
      serverState.teams.forEach((t,i)=>{
        const prev=prevScores[i]||0;
        if(t.score>prev){
          setTimeout(()=>showPtsAnim(i,t.score-prev),200);
        }
      });
    }
    return;
  }
}

function updateTimer(val,done){
  timerVal=val;timerDone=done;
  const bar=document.getElementById("tBar");
  const num=document.getElementById("tNum");
  if(!bar||!num)return;
  const pct=Math.max(0,(val/45)*100);
  const color=val>20?"#22b87a":val>10?"#f7934f":"#e74c3c";
  bar.style.width=pct+"%";bar.style.background=color;
  bar.className="timer-bar"+(val<=10?" pulse":"");
  num.textContent=val+"s";num.style.color=color;
  if(val<=5&&val>0)num.classList.add("flash");else num.classList.remove("flash");
  const hv=document.getElementById("hTimerVal");if(hv)hv.textContent=val+"s";
}

function showPtsAnim(ti,pts){
  const card=document.querySelector(\`[data-ti="\${ti}"]\`);
  if(!card)return;
  const el=document.createElement("div");
  el.className="pts-anim";el.textContent="+"+pts;
  card.style.position="relative";card.appendChild(el);
  setTimeout(()=>el.remove(),900);
}

// ── CONFETTI ──
function launchConfetti(){
  for(let i=0;i<180;i++){
    setTimeout(()=>{
      const el=document.createElement("div");
      el.className="confetti-piece";
      el.style.left=Math.random()*100+"vw";
      el.style.background=CONF_COLORS[Math.floor(Math.random()*CONF_COLORS.length)];
      el.style.width=(8+Math.random()*8)+"px";
      el.style.height=(8+Math.random()*8)+"px";
      el.style.animationDuration=(2+Math.random()*3)+"s";
      el.style.animationDelay="0s";
      document.body.appendChild(el);
      setTimeout(()=>el.remove(),5500);
    },i*25);
  }
}

// ── RENDER ROUTER ──
function render(){
  const app=document.getElementById("app");
  if(!app)return;
  if(phase==="entry")rEntry(app);
  else if(phase==="host-pin")rPin(app,"Accès hôte","Code hôte requis",hPinPress,hPinDel);
  else if(phase==="host-setup")rHostSetup(app);
  else if(phase==="team-pin")rPin(app,"Rejoindre","Code reçu de l'hôte",tPinPress,tPinDel);
  else if(phase==="team-name")rTeamName(app);
  else if(phase==="waiting")rWaiting(app);
  else if(phase==="game")rGame(app);
  else if(phase==="end")rEnd(app);
}

// ── ENTRY ──
function rEntry(app){
  app.innerHTML=\`
  <div class="card">
    <div class="logo">Quiz <span>Coran</span></div>
    <div class="gold-line"></div>
    <p class="sub">50 questions · Sciences islamiques</p>
    <div class="entry-grid">
      <div class="entry-btn" onclick="phase='team-pin';pinEntry='';pinError='';render()">
        <div class="entry-icon">👥</div>
        <div class="entry-label">Rejoindre</div>
        <div class="entry-sub">Saisir mon code équipe</div>
      </div>
      <div class="entry-btn" onclick="phase='host-pin';pinEntry='';pinError='';render()">
        <div class="entry-icon">🎙️</div>
        <div class="entry-label">Hôte</div>
        <div class="entry-sub">Configurer la partie</div>
      </div>
    </div>
  </div>\`;
}

// ── PIN ──
function rPin(app,title,sub,onP,onD){
  const dots=[0,1,2,3].map(i=>\`<div class="pin-dot\${i<pinEntry.length?" filled":""}">\${i<pinEntry.length?"●":""}</div>\`).join("");
  const pad=[1,2,3,4,5,6,7,8,9].map(n=>\`<button class="pin-key" onclick="\${onP.name}('\${n}')">\${n}</button>\`).join("");
  app.innerHTML=\`
  <div class="card">
    <div class="logo">Quiz <span>Coran</span></div>
    <div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">\${title}</p>
    <p class="sub">\${sub}</p>
    <div class="pin-dots">\${dots}</div>
    <div class="pin-pad">\${pad}<button class="pin-key" onclick="\${onD.name}()">⌫</button><button class="pin-key" onclick="\${onP.name}('0')">0</button><div></div></div>
    <div class="pin-error">\${pinError}</div>
    <button class="btn btn-outline" onclick="phase='entry';pinEntry='';pinError='';render()">Retour</button>
  </div>\`;
}

function hPinPress(d){if(pinEntry.length>=4)return;pinEntry+=d;if(pinEntry.length===4)send({type:"host-auth",pin:pinEntry});render();}
function hPinDel(){if(pinEntry.length>0){pinEntry=pinEntry.slice(0,-1);render();}}
function tPinPress(d){if(pinEntry.length>=4)return;pinEntry+=d;if(pinEntry.length===4)send({type:"team-auth",code:pinEntry});render();}
function tPinDel(){if(pinEntry.length>0){pinEntry=pinEntry.slice(0,-1);render();}}

// ── HOST SETUP ──
function rHostSetup(app){
  app.innerHTML=\`
  <div class="card">
    <div class="logo">Quiz <span>Coran</span></div>
    <div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Configuration</p>
    <p class="sub">Combien d'équipes participent ?</p>
    <select class="sel" onchange="numTeams=parseInt(this.value)">
      <option value="2">2 équipes</option>
      <option value="3" selected>3 équipes</option>
      <option value="4">4 équipes</option>
      <option value="5">5 équipes</option>
      <option value="6">6 équipes</option>
    </select>
    <button class="btn btn-gold" onclick="send({type:'host-setup',numTeams})">Générer les codes</button>
  </div>\`;
}

// ── TEAM NAME ──
function rTeamName(app){
  app.innerHTML=\`
  <div class="card">
    <div class="logo">Quiz <span>Coran</span></div>
    <div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Bienvenue !</p>
    <p class="sub">Choisissez le nom de votre équipe</p>
    <input class="inp" placeholder="Nom de l'équipe..." maxlength="20" oninput="myTeamNameInput=this.value" onkeydown="if(event.key==='Enter')confirmName()" autofocus/>
    <button class="btn btn-gold" onclick="confirmName()">Confirmer</button>
  </div>\`;
  setTimeout(()=>{const el=app.querySelector(".inp");if(el)el.focus();},80);
}
function confirmName(){const n=myTeamNameInput.trim();if(!n)return;send({type:"team-set-name",name:n});phase="waiting";render();}

// ── WAITING ──
function rWaiting(app){
  const st=serverState;
  const teams=(st&&(st.teams||st.allCodes))||[];
  const teamList=st&&st.allCodes?st.allCodes:teams;
  const allReady=teamList.length>0&&teamList.every(t=>t.ready);

  const slots=teamList.map(t=>\`
    <div class="team-slot\${t.ready?" is-ready":""}">
      <span class="slot-name" style="color:\${t.color}">\${t.name}</span>
      \${role==="host"?\`<span class="slot-code">\${t.code}</span>\`:""}
      <span class="tag \${t.ready?"tag-ready":"tag-wait"}">\${t.ready?"Prête ✓":"En attente..."}</span>
    </div>\`).join("");

  const hostSection=role==="host"?\`
    <div style="margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid #eee;">
      <div style="font-size:11px;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:.8rem">Codes à distribuer</div>
      <table class="code-tbl">
        <tr><th>Équipe</th><th>Code</th><th>Statut</th></tr>
        \${teamList.map(t=>\`<tr>
          <td style="color:\${t.color};font-weight:800">\${t.name}</td>
          <td><span class="code-pill">\${t.code}</span></td>
          <td>\${t.ready?'<span class="tag tag-ready">Prête ✓</span>':'<span class="tag tag-wait">En attente</span>'}</td>
        </tr>\`).join("")}
      </table>
      <div style="text-align:center;margin-top:1.2rem">
        \${allReady
          ?\`<button class="btn btn-gold" onclick="send({type:'host-start'})">🚀 Lancer la partie !</button>\`
          :\`<p style="font-size:12px;color:#aaa;margin-bottom:.8rem">En attente de toutes les équipes...</p>\`}
        <button class="btn-sm" onclick="send({type:'host-reset'})" style="margin-top:.5rem">Réinitialiser</button>
      </div>
    </div>\`:
    \`<div style="text-align:center;margin-top:1rem">
      <button class="btn-sm" onclick="phase='team-pin';pinEntry='';pinError='';render()">Changer de code</button>
    </div>\`;

  app.innerHTML=\`
  <div class="card-wide">
    <div style="text-align:center;margin-bottom:1rem">
      <div class="logo">Quiz <span>Coran</span></div>
      <div class="gold-line"></div>
      <p class="sub">\${role==="host"?"Distribuez les codes ci-dessous aux équipes":"En attente du lancement par l'hôte..."}</p>
    </div>
    \${slots}
    \${hostSection}
  </div>\`;
}

// ── GAME ──
function rGame(app){
  if(!serverState){app.innerHTML=\`<div class="card"><p>Chargement...</p></div>\`;return;}
  const st=serverState,teams=st.teams||[],q=st.question;
  const pct=Math.max(0,(timerVal/45)*100);
  const tcolor=timerVal>20?"#22b87a":timerVal>10?"#f7934f":"#e74c3c";
  const maxScore=Math.max(1,...teams.map(t=>t.score));

  const scBar=\`<div class="scores-bar" style="grid-template-columns:repeat(\${teams.length},1fr)">\`+
    teams.map((t,ti)=>\`<div class="sc-card" data-ti="\${ti}">
      <div class="scn" style="color:\${t.color}">\${t.name}</div>
      <div class="scv">\${t.score}</div>
      <div class="sc-bar" style="width:\${(t.score/maxScore)*100}%;background:\${t.color}"></div>
    </div>\`).join("")+\`</div>\`;

  const cols=Math.min(teams.length,3);
  const cards=\`<div class="teams-grid" style="grid-template-columns:repeat(\${cols},minmax(0,1fr))">\`+
    teams.map((t,ti)=>rTeamCard(t,ti,q,st.revealed)).join("")+\`</div>\`;

  const proof=st.revealed?\`<div class="proof-box"><strong>📖 Preuve :</strong> \${q.proof}</div>\`:"";
  const nextBtn=st.revealed&&role==="host"?\`<div style="text-align:center;margin-bottom:.5rem">
    <button class="btn btn-gold" onclick="send({type:'host-next'})">\${st.current<st.total-1?"Question suivante →":"Voir les résultats 🏆"}</button>
  </div>\`:"";

  const hostPanelHTML=role==="host"?\`
    <div class="host-toggle"><button onclick="hostPanelOpen=!hostPanelOpen;render()">\${hostPanelOpen?"▼ Masquer panneau hôte":"▲ Panneau hôte"}</button></div>
    \${hostPanelOpen?rHostPanel(teams,q,st):""}\`:"";

  app.innerHTML=\`
  <div class="game-hdr"><h1>Quiz <span>Coran</span></h1><div class="prog">Q\${st.current+1}/\${st.total} · N°\${st.qid}</div></div>
  \${scBar}
  <div class="timer-wrap">
    <div class="timer-bg"><div class="timer-bar\${timerVal<=10?" pulse":""}" id="tBar" style="width:\${pct}%;background:\${tcolor}"></div></div>
  </div>
  <div class="timer-num" id="tNum" style="color:\${tcolor}">\${timerVal}s</div>
  <div class="q-box"><div class="q-num">Question \${st.current+1} · N°\${st.qid}</div><div class="q-text">\${q.q}</div></div>
  \${proof}
  \${cards}
  \${nextBtn}
  \${hostPanelHTML}\`;
}

function rTeamCard(t,ti,q,revealed){
  const isMe=(role==="team"&&ti===myTeamIdx);
  let inner="";
  if(!t.mode&&!t.pending){
    if(isMe){
      inner=\`<div class="mode-grid">
        <div class="mode-card cash-c" onclick="send({type:'team-select-mode',mode:'cash'})">
          <span>Cash — réponse libre</span><span class="mode-pts" style="color:var(--gold)">5 pts</span>
        </div>
        <div class="mode-card square-c" onclick="send({type:'team-select-mode',mode:'square'})">
          <span>Carré — 4 choix</span><span class="mode-pts" style="color:#4f8ef7">3 pts</span>
        </div>
        <div class="mode-card duo-c" onclick="send({type:'team-select-mode',mode:'duo'})">
          <span>Duo — 2 choix</span><span class="mode-pts" style="color:#22b87a">1 pt</span>
        </div>
      </div>\`;
    }else{inner=\`<div style="font-size:12px;color:#ccc;padding:6px 0;font-style:italic">Choix du mode...</div>\`;}
  }else if(t.pending&&!t.mode){
    const lbls={cash:"Cash — 5 pts",square:"Carré — 3 pts",duo:"Duo — 1 pt"};
    if(isMe){
      inner=\`<div class="mode-confirm-box">
        <p>Confirmer <strong>\${lbls[t.pending]}</strong> ?</p>
        <div class="confirm-row">
          <button class="btn-canc" onclick="send({type:'team-cancel-mode'})">Changer</button>
          <button class="btn-conf" onclick="send({type:'team-confirm-mode'})">Confirmer ✓</button>
        </div>
      </div>\`;
    }else{inner=\`<div style="font-size:12px;color:#ccc;padding:6px 0;font-style:italic">En cours de choix...</div>\`;}
  }else if(t.mode){
    const mlbls={cash:"Cash · 5 pts",square:"Carré · 3 pts",duo:"Duo · 1 pt"};
    const lbl=\`<span class="mode-lbl">\${mlbls[t.mode]}</span><br/>\`;
    if(!t.hasAnswer){
      if(isMe){
        if(t.mode==="cash"){
          inner=lbl+\`<input class="cash-inp" placeholder="Votre réponse..." oninput="cashInputVal=this.value" onkeydown="if(event.key==='Enter')send({type:'team-answer',answer:cashInputVal,cashText:cashInputVal})"/>
            <button class="cash-sub" onclick="send({type:'team-answer',answer:cashInputVal,cashText:cashInputVal})">Valider ✓</button>\`;
        }else if(t.mode==="square"){
          inner=lbl+q.opts.map((o,oi)=>\`<button class="opt-btn" onclick="send({type:'team-answer',answer:\${oi}})">\${LABELS[oi]}. \${o}</button>\`).join("");
        }else if(t.mode==="duo"){
          const duo=t.duoOpts||[];
          inner=lbl+duo.map((o,oi)=>\`<button class="opt-btn" onclick="send({type:'team-answer',answer:\${oi}})">\${LABELS[oi]}. \${o}</button>\`).join("");
        }
      }else{inner=lbl+\`<div style="font-size:12px;color:#ccc;padding:6px 0;font-style:italic">En train de répondre...</div>\`;}
    }else{
      if(t.mode==="cash"){
        const tg=revealed?(t.validated===true?\`<span class="tag tag-ok">Correct +5 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`):\`<span class="tag tag-ans">⏳ Hôte valide...</span>\`;
        inner=lbl+\`<div style="font-size:13px;padding:6px 0;color:#333;font-weight:600">\${revealed&&t.answer?"« "+t.answer+" »":"Réponse envoyée..."}</div>\${tg}\`;
      }else if(t.mode==="square"){
        const btns=q.opts.map((o,oi)=>{
          let cls="opt-btn";
          if(revealed){if(oi===q.ans)cls+=" correct";else if(t.answer!==null&&oi===t.answer)cls+=" wrong";}
          else if(t.answer!==null&&oi===t.answer)cls+=" sel";
          return \`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
        const tg=revealed?(t.answer===q.ans?\`<span class="tag tag-ok">Correct +3 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`):\`<span class="tag tag-ans">Répondu ✓</span>\`;
        inner=lbl+btns+tg;
      }else if(t.mode==="duo"){
        const duo=t.duoOpts||[];
        const btns=duo.map((o,oi)=>{
          let cls="opt-btn";
          if(revealed){if(o===q.opts[q.ans])cls+=" correct";else if(t.answer!==null&&oi===t.answer)cls+=" wrong";}
          else if(t.answer!==null&&oi===t.answer)cls+=" sel";
          return \`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
        const chosen=typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer;
        const isOk=chosen===q.opts[q.ans];
        const tg=revealed?(isOk?\`<span class="tag tag-ok">Correct +1 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`):\`<span class="tag tag-ans">Répondu ✓</span>\`;
        inner=lbl+btns+tg;
      }
    }
  }
  return \`<div class="t-card\${t.hasAnswer?" answered":""}" style="border-top-color:\${t.color}">
    <div class="t-head"><span class="t-name" style="color:\${t.color}">\${t.name}</span><span class="t-pts">\${t.score} pts</span></div>
    \${inner}
  </div>\`;
}

function rHostPanel(teams,q,st){
  const allAnswered=teams.every(t=>t.hasAnswer);
  const allCashOk=teams.every(t=>t.mode!=="cash"||(t.validated!==null&&t.validated!==undefined));
  const canReveal=(allAnswered||timerDone)&&allCashOk&&!st.revealed;

  const rows=teams.map((t,ti)=>{
    if(!t.mode)return\`<div class="h-row"><span class="h-mode">—</span><span class="h-team" style="color:\${t.color}">\${t.name}</span><span style="color:#ccc;font-size:12px">Choix du mode...</span></div>\`;
    let ans=\`<span style="color:#ccc;font-size:12px">En attente...</span>\`,act="";
    if(t.hasAnswer){
      if(t.mode==="cash"){
        if(editingTi===ti){
          ans=\`<input class="h-inp" id="hed\${ti}" value="\${t.answer||""}" onkeydown="if(event.key==='Enter'){send({type:'host-validate-cash',teamIdx:\${ti},ok:true,editedAnswer:document.getElementById('hed\${ti}').value});editingTi=-1;render()}"/>\`;
          act=\`<button class="btn-grey-sm" onclick="send({type:'host-validate-cash',teamIdx:\${ti},ok:true,editedAnswer:document.getElementById('hed\${ti}').value});editingTi=-1;render()">OK</button>\`;
        }else{
          ans=\`<span class="h-ans">« \${t.answer||"..."} »</span>\`;
          if(t.validated===null||t.validated===undefined){
            act=\`<button class="btn-grey-sm" onclick="editingTi=\${ti};render()">✏️</button>
              <button class="btn-green-sm" onclick="send({type:'host-validate-cash',teamIdx:\${ti},ok:true})">Valider ✓</button>
              <button class="btn-red-sm" onclick="send({type:'host-validate-cash',teamIdx:\${ti},ok:false})">✗</button>\`;
          }else{
            act=(t.validated?\`<span class="tag tag-ok" style="font-size:10px">Validé</span>\`:\`<span class="tag tag-ko" style="font-size:10px">Invalidé</span>\`)+
              \`<button class="btn-grey-sm" onclick="send({type:'host-recheck',teamIdx:\${ti}})">Revoir</button>\`;
          }
        }
      }else if(t.mode==="square"){
        ans=\`<span class="h-ans">\${t.answer!==null?LABELS[t.answer]+". "+q.opts[t.answer]:""}</span>\`;
      }else if(t.mode==="duo"){
        const duo=t.duoOpts||[];
        ans=\`<span class="h-ans">\${typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer||""}</span>\`;
      }
    }
    return\`<div class="h-row"><span class="h-mode">\${t.mode||"—"}</span><span class="h-team" style="color:\${t.color}">\${t.name}</span>\${ans}\${act}</div>\`;
  }).join("");

  const revBtn=!st.revealed?\`<div class="rev-area">
    <div class="timer-ctrl">
      <span>⏱ <span id="hTimerVal">\${timerVal}</span>s</span>
      <button class="btn-sm" onclick="send({type:'host-add-time'})">+15s</button>
      <button class="btn-sm" onclick="send({type:'host-stop-timer'})">Clôturer</button>
    </div>
    <button class="btn btn-gold" \${canReveal?"":"disabled"} onclick="send({type:'host-reveal'})" style="max-width:280px">Révéler + preuve</button>
    \${!canReveal?\`<div class="rev-hint">\${!allAnswered&&!timerDone?"En attente des équipes...":!allCashOk?"Validez les réponses cash":""}</div>\`:""}
  </div>\`:\`<div class="rev-area"><span class="tag tag-ok">✓ Réponses révélées</span></div>\`;

  return\`<div class="host-panel">
    <h3>🎙️ Panneau hôte</h3>
    <div class="h-correct"><strong>Bonne réponse :</strong> \${q.opts[q.ans]}</div>
    \${rows}\${revBtn}
  </div>\`;
}

// ── END ──
function rEnd(app){
  if(!serverState){app.innerHTML=\`<div class="card"><p>Fin de partie</p></div>\`;return;}
  const teams=(serverState.teams||[]);
  const sorted=[...teams].map((t,i)=>({...t,orig:i})).sort((a,b)=>b.score-a.score);
  const maxScore=Math.max(1,...sorted.map(t=>t.score));

  // Podium (top 3)
  const podiumOrder=[1,0,2]; // silver, gold, bronze visual order
  const podiumHTML=sorted.slice(0,Math.min(3,sorted.length)).length>=2?\`
  <div class="podium">
    \${[
      sorted[1]?{t:sorted[1],cls:"p2",h:85,medal:"🥈"}:null,
      sorted[0]?{t:sorted[0],cls:"p1",h:120,medal:"🥇"}:null,
      sorted[2]?{t:sorted[2],cls:"p3",h:60,medal:"🥉"}:null,
    ].filter(Boolean).map(({t,cls,medal})=>\`
      <div class="podium-col">
        <div class="podium-medal">\${medal}</div>
        <div class="podium-name" style="color:\${t.color}">\${t.name}</div>
        <div class="podium-score">\${t.score} pts</div>
        <div class="podium-block \${cls}">\${t.score}</div>
      </div>\`).join("")}
  </div>\`:"";

  const rows=sorted.map((t,rank)=>\`
    <div class="f-row">
      <span class="f-rank">\${MEDALS[rank]||""}</span>
      <span class="f-name" style="color:\${t.color}">\${t.name}</span>
      <span class="f-pts">\${t.score} pts</span>
    </div>\`).join("");

  const resetBtn=role==="host"?\`<button class="btn btn-gold" style="max-width:260px;margin-top:1.5rem" onclick="send({type:'host-reset'})">🔄 Nouvelle partie</button>\`:\`<p style="margin-top:1rem;font-size:13px;color:#aaa">En attente de l'hôte...</p>\`;

  app.innerHTML=\`<div class="final-wrap"><div class="final-card">
    <div class="final-title">Résultats <span>finaux</span></div>
    <div class="gold-line"></div>
    \${podiumHTML}
    \${rows}
    \${resetBtn}
  </div></div>\`;
}

render();
</script>
</body>
</html>
`;
app.get("/", (req, res) => res.send(HTML));

const HOST_PIN = "2293";
const PTS = { cash: 5, square: 3, duo: 1 };
const FIXED_ORDER = [34,7,42,19,50,11,28,3,45,16,22,38,1,49,9,31,44,14,6,47,23,36,13,40,17,5,32,20,43,10,27,48,2,37,15,41,25,8,46,12,33,21,35,4,29,18,39,24,30,26];
const COLORS = ["#4f8ef7","#22b87a","#f7934f","#9b59b6","#e74c3c","#1abc9c"];

let game = freshGame();
function freshGame() {
  return { phase:"setup", teams:[], teamCodes:{}, current:0, qState:[], revealed:false, timerVal:45, timerActive:false, timerDone:false };
}
function genCode() { return String(Math.floor(1000 + Math.random()*9000)); }

function setupTeams(n) {
  game.teams = []; game.teamCodes = {};
  for (let i=0;i<n;i++) {
    let code; do { code=genCode(); } while(game.teamCodes[code]!==undefined);
    game.teamCodes[code]=i;
    game.teams.push({name:`Équipe ${i+1}`,color:COLORS[i%COLORS.length],code,score:0,ready:false});
  }
  game.phase="waiting";
}

function startQuestion() {
  const qid=FIXED_ORDER[game.current], q=QUESTIONS[qid];
  game.qState=game.teams.map(()=>{
    const wrong=q.opts.filter((_,i)=>i!==q.ans);
    const pick=wrong[Math.floor(Math.random()*wrong.length)];
    const duo=Math.random()>.5?[q.opts[q.ans],pick]:[pick,q.opts[q.ans]];
    return {mode:null,pending:null,answer:null,cashText:"",validated:null,duoOpts:duo};
  });
  game.revealed=false; game.timerVal=45; game.timerDone=false;
  startTimer();
}

let timerInterval=null;
function startTimer() {
  stopTimer(); game.timerActive=true;
  timerInterval=setInterval(()=>{
    game.timerVal=Math.max(0,game.timerVal-1);
    if(game.timerVal<=0){game.timerDone=true;game.timerActive=false;stopTimer();}
    broadcast({type:"timer",val:game.timerVal,done:game.timerDone});
    if(game.qState.every(s=>s.mode&&s.answer!==null)){stopTimer();game.timerActive=false;broadcast({type:"timer",val:game.timerVal,done:false});}
  },1000);
}
function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null;}game.timerActive=false;}
function addTime(s){game.timerVal+=s;game.timerDone=false;if(!timerInterval)startTimer();broadcast({type:"timer",val:game.timerVal,done:false});}

function doReveal() {
  stopTimer(); game.revealed=true;
  const q=QUESTIONS[FIXED_ORDER[game.current]];
  game.qState.forEach((s,ti)=>{
    if(!s.mode||s.answer===null)return;
    if(s.mode==="cash"){if(s.validated===true)game.teams[ti].score+=PTS.cash;}
    else if(s.mode==="square"){if(s.answer===q.ans)game.teams[ti].score+=PTS.square;}
    else if(s.mode==="duo"){
      const chosen=typeof s.answer==="number"?s.duoOpts[s.answer]:s.answer;
      if(chosen===q.opts[q.ans])game.teams[ti].score+=PTS.duo;
    }
  });
  broadcastState();
}

const clients=new Map();
function broadcast(msg){const d=JSON.stringify(msg);wss.clients.forEach(ws=>{if(ws.readyState===WebSocket.OPEN)ws.send(d);});}
function sendTo(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj));}

function broadcastState() {
  const qid=FIXED_ORDER[game.current],q=QUESTIONS[qid];
  const hostPayload={
    type:"state",forHost:true,phase:game.phase,
    teams:game.teams.map((t,ti)=>{const s=game.qState[ti]||{};return{...t,mode:s.mode,pending:s.pending,answer:s.answer,hasAnswer:s.answer!==null,validated:s.validated,duoOpts:s.duoOpts};}),
    current:game.current,total:FIXED_ORDER.length,qid,
    question:{q:q.q,opts:q.opts,ans:q.ans,proof:q.proof},
    revealed:game.revealed,timerVal:game.timerVal,timerDone:game.timerDone,
    allCodes:game.teams.map(t=>({name:t.name,code:t.code,color:t.color,ready:t.ready})),
  };
  const pubPayload={
    type:"state",forHost:false,phase:game.phase,
    teams:game.teams.map((t,ti)=>{const s=game.qState[ti]||{};return{name:t.name,color:t.color,score:t.score,ready:t.ready,code:t.code,mode:s.mode,pending:s.pending,hasAnswer:s.answer!==null,answer:game.revealed?s.answer:null,validated:game.revealed?s.validated:null,duoOpts:s.duoOpts};}),
    current:game.current,total:FIXED_ORDER.length,qid,
    question:{q:q.q,opts:q.opts,ans:game.revealed?q.ans:-1,proof:game.revealed?q.proof:""},
    revealed:game.revealed,timerVal:game.timerVal,timerDone:game.timerDone,
  };
  wss.clients.forEach(ws=>{
    if(ws.readyState!==WebSocket.OPEN)return;
    const info=clients.get(ws);
    sendTo(ws,info&&info.role==="host"?hostPayload:pubPayload);
  });
}

function broadcastWaiting() {
  const hostPayload={type:"waiting",phase:"waiting",allCodes:game.teams.map(t=>({name:t.name,code:t.code,color:t.color,ready:t.ready}))};
  const pubPayload={type:"waiting",phase:"waiting",teams:game.teams.map(t=>({name:t.name,color:t.color,ready:t.ready,code:t.code}))};
  wss.clients.forEach(ws=>{
    if(ws.readyState!==WebSocket.OPEN)return;
    const info=clients.get(ws);
    sendTo(ws,info&&info.role==="host"?hostPayload:pubPayload);
  });
}

wss.on("connection",ws=>{
  clients.set(ws,{role:null,teamIdx:null});
  ws.on("message",raw=>{
    let msg;try{msg=JSON.parse(raw);}catch{return;}
    const info=clients.get(ws);
    switch(msg.type){
      case "host-auth":
        if(msg.pin===HOST_PIN){
          clients.set(ws,{role:"host",teamIdx:null});
          sendTo(ws,{type:"host-auth-ok"});
          if(game.phase==="waiting")broadcastWaiting();
          else if(game.phase==="game"||game.phase==="end")broadcastState();
        }else{sendTo(ws,{type:"host-auth-fail"});}
        break;
      case "host-setup":
        if(info.role!=="host")break;
        setupTeams(msg.numTeams);
        broadcastWaiting();
        break;
      case "host-start":
        if(info.role!=="host")break;
        game.phase="game";game.current=0;
        startQuestion();broadcastState();
        break;
      case "host-reveal":
        if(info.role!=="host")break;
        doReveal();break;
      case "host-next":
        if(info.role!=="host")break;
        game.current++;
        if(game.current>=FIXED_ORDER.length){game.phase="end";stopTimer();broadcastState();}
        else{startQuestion();broadcastState();}
        break;
      case "host-add-time":
        if(info.role!=="host")break;
        addTime(15);break;
      case "host-stop-timer":
        if(info.role!=="host")break;
        stopTimer();game.timerDone=true;
        broadcast({type:"timer",val:game.timerVal,done:true});break;
      case "host-validate-cash":
        if(info.role!=="host")break;
        if(game.qState[msg.teamIdx]){
          game.qState[msg.teamIdx].validated=msg.ok;
          if(msg.editedAnswer)game.qState[msg.teamIdx].answer=msg.editedAnswer;
          broadcastState();
        }break;
      case "host-recheck":
        if(info.role!=="host")break;
        if(game.qState[msg.teamIdx]){game.qState[msg.teamIdx].validated=null;broadcastState();}
        break;
      case "host-reset":
        if(info.role!=="host")break;
        stopTimer();game=freshGame();
        broadcast({type:"reset"});break;
      case "team-auth":
        const idx=game.teamCodes[msg.code];
        if(idx!==undefined&&!game.teams[idx].ready){
          clients.set(ws,{role:"team",teamIdx:idx});
          sendTo(ws,{type:"team-auth-ok",teamIdx:idx,team:game.teams[idx]});
        }else if(idx!==undefined){
          sendTo(ws,{type:"team-auth-fail",reason:"already-used"});
        }else{
          sendTo(ws,{type:"team-auth-fail",reason:"invalid"});
        }break;
      case "team-set-name":
        if(info.role!=="team")break;
        game.teams[info.teamIdx].name=msg.name.slice(0,20);
        game.teams[info.teamIdx].ready=true;
        broadcastWaiting();break;
      case "team-select-mode":
        if(info.role!=="team"||!game.qState[info.teamIdx])break;
        if(game.qState[info.teamIdx].mode)break;
        game.qState[info.teamIdx].pending=msg.mode;
        broadcastState();break;
      case "team-confirm-mode":
        if(info.role!=="team"||!game.qState[info.teamIdx])break;
        const qs=game.qState[info.teamIdx];
        if(qs.pending&&!qs.mode){qs.mode=qs.pending;qs.pending=null;broadcastState();}
        break;
      case "team-cancel-mode":
        if(info.role!=="team"||!game.qState[info.teamIdx])break;
        game.qState[info.teamIdx].pending=null;broadcastState();break;
      case "team-answer":
        if(info.role!=="team"||!game.qState[info.teamIdx])break;
        if(game.qState[info.teamIdx].answer!==null)break;
        game.qState[info.teamIdx].answer=msg.answer;
        if(msg.cashText)game.qState[info.teamIdx].cashText=msg.cashText;
        if(game.qState.every(s=>s.mode&&s.answer!==null))stopTimer();
        broadcastState();break;
    }
  });
  ws.on("close",()=>clients.delete(ws));
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
26:{q:"Dans quel lieu le Prophète ﷺ et Abu Bakr se sont-ils cachés pendant trois jours lors de la Hijra ?",opts:["La grotte de Hira","La grotte de Thawr","La vallée de Mina","Le mont Uhud"],ans:1,proof:"Coran At-Tawba (9:40) : « ...quand ils étaient deux dans la grotte, quand il dit à son compagnon : Ne t'afflige pas, Allah est avec nous. » — La grotte de Thawr, au sud de La Mecque."},
27:{q:"Quel homme tua Hamza (r.a.) à Uhud avant de se convertir à l'Islam ?",opts:["Khabbab ibn al-Aratt","Wahshi ibn Harb","Jubayr ibn Mut'im","Ikrimah ibn Abi Jahl"],ans:1,proof:"Wahshi ibn Harb, lanceur de javelot mandaté par Hind bint Utba, tua Hamza ibn Abd al-Muttalib lors de la bataille d'Uhud (3H). Il se convertit plus tard à l'Islam. (Sahih Bukhari)"},
28:{q:"Quelle épouse du Prophète ﷺ était surnommée « Umm al-Masakin » (la mère des pauvres) pour sa grande générosité ?",opts:["Sawda bint Zam'a","Zaynab bint Khuzayma","Hafsa bint Umar","Umm Salama"],ans:1,proof:"Zaynab bint Khuzayma al-Hilaliya, connue pour sa générosité envers les pauvres. Elle mourut peu après son mariage avec le Prophète ﷺ."},
29:{q:"Quel fut le premier prophète à utiliser le qalam (la plume pour écrire) ?",opts:["Ibrahim (as)","Idris (as)","Adam (as)","Nuh (as)"],ans:1,proof:"Selon de nombreux savants dont Ibn Kathir, Idris (Hénoch) est le premier à avoir écrit avec la plume. Le Coran jure par le qalam dans Al-Qalam (68:1)."},
30:{q:"Quel prophète le Prophète Muhammad ﷺ a-t-il rencontré au 5ème ciel lors du Mi'raj ?",opts:["Issa (as)","Musa (as)","Harun (as)","Ibrahim (as)"],ans:2,proof:"Selon les hadiths authentiques (Bukhari & Muslim) : 1er ciel=Adam, 2ème=Yahya & Issa, 3ème=Yusuf, 4ème=Idris, 5ème=Harun, 6ème=Musa, 7ème=Ibrahim."},
31:{q:"Quel prophète a eu 99 femmes, souhaité un fils cavalier combattant pour chacune, mais oublié de dire « Inch'Allah » ?",opts:["Dawud (as)","Sulayman (as)","Yusuf (as)","Ibrahim (as)"],ans:1,proof:"Hadith Bukhari (3424) : Sulayman dit « Cette nuit je passerai par 99 femmes... » Il oublia de dire Inch'Allah — aucune n'enfanta sauf une, qui donna naissance à un enfant incomplet."},
32:{q:"Quel compagnon est surnommé « le détenteur du secret du Prophète ﷺ concernant les hypocrites » ?",opts:["Hudhayfa ibn al-Yaman","Abu Hurayra","Abdullah ibn Masoud","Salman al-Farisi"],ans:0,proof:"Hudhayfa ibn al-Yaman fut le seul compagnon à qui le Prophète ﷺ confia les noms des hypocrites de Médine. (Sahih Muslim)"},
33:{q:"Quel compagnon a tué son propre père lors de la bataille de Badr ?",opts:["Ali ibn Abi Talib","Abu Ubayda ibn al-Jarrah","Sa'd ibn Abi Waqqas","Az-Zubayr ibn al-Awwam"],ans:1,proof:"Abu Ubayda ibn al-Jarrah tua son père Jarrah ibn Abdullah lors de Badr. Suite à cela, Allah révéla Al-Mujadila (58:22)."},
34:{q:"Quel compagnon fut le premier à réciter le Coran publiquement à La Mecque malgré les persécutions des Quraysh ?",opts:["Bilal ibn Rabah","Abdullah ibn Masoud","Ammar ibn Yasir","Khabbab ibn al-Aratt"],ans:1,proof:"Abdullah ibn Masoud fut le premier à réciter le Coran à voix haute à la Kaaba devant les Quraysh, récitant Ar-Rahman (55). Il fut frappé mais continua. (Ibn Hisham, Sira)"},
35:{q:"Quel compagnon ansari fut désigné par le Prophète ﷺ comme « le meilleur réciteur du Coran » parmi les Ansar ?",opts:["Sa'd ibn Mu'adh","Ubayy ibn Ka'b","Muadh ibn Jabal","Zayd ibn Thabit"],ans:1,proof:"Le Prophète ﷺ dit : « Le meilleur réciteur du Coran parmi ma communauté est Ubayy ibn Ka'b. » (Tirmidhi, Hassan Sahih)."},
36:{q:"Quel compagnon refusa de quitter La Mecque pour rester auprès de sa mère polythéiste malgré les persécutions ?",opts:["Abu Hurayra","Ammar ibn Yasir","Sa'd ibn Abi Waqqas","Mus'ab ibn Umayr"],ans:2,proof:"Sa'd ibn Abi Waqqas refusa de quitter l'Islam malgré la grève de la faim de sa mère. Allah révéla Luqman (31:15)."},
37:{q:"Quel compagnon portait l'étendard lors de la conquête de La Mecque, avant que le Prophète ﷺ ne le lui retire en raison de ses paroles ?",opts:["Ali ibn Abi Talib","Umar ibn al-Khattab","Sa'd ibn Ubada","Az-Zubayr ibn al-Awwam"],ans:2,proof:"Sa'd ibn Ubada portait l'étendard des Ansar à la conquête de La Mecque (8H). Après avoir dit « Aujourd'hui est le jour de la bataille », le Prophète ﷺ lui retira l'étendard. (Ibn Hisham)"},
38:{q:"Quel compagnon a proposé de creuser la tranchée lors de la bataille du Fossé (Al-Khandaq) ?",opts:["Umar ibn al-Khattab","Salman al-Farisi","Ali ibn Abi Talib","Hudhayfa ibn al-Yaman"],ans:1,proof:"Salman al-Farisi proposa la stratégie de creuser une tranchée autour de Médine — tactique militaire connue en Perse mais inconnue des Arabes. (Ibn Hisham)"},
39:{q:"Quel compagnon est connu pour avoir lavé le corps du Prophète ﷺ après sa mort ?",opts:["Umar ibn al-Khattab","Abu Bakr as-Siddiq","Ali ibn Abi Talib","Uthman ibn Affan"],ans:2,proof:"Ali ibn Abi Talib lava le corps du Prophète ﷺ, assisté de al-Abbas, al-Fadl et Usama ibn Zayd. (Sahih Bukhari, Kitab al-Jana'iz)"},
40:{q:"Quel compagnon fut le dernier des 10 promis au Paradis (Al-Ashara al-Mubashshara) à mourir ?",opts:["Ali ibn Abi Talib","Az-Zubayr ibn al-Awwam","Sa'd ibn Abi Waqqas","Talha ibn Ubaydillah"],ans:2,proof:"Sa'd ibn Abi Waqqas mourut en l'an 55H à Al-Aqiq, près de Médine. Il fut le dernier des dix Compagnons promis au Paradis. (Ibn Abd al-Barr, Al-Isti'ab)"},
41:{q:"Selon quel madhab la consommation de viande de chameau annule-t-elle les ablutions ?",opts:["Maliki","Shafi'i","Hanbali","Hanafi"],ans:2,proof:"Seul le madhab Hanbali considère que manger de la viande de chameau annule le wudu, basé sur le hadith de Jabir ibn Samura (Muslim 360)."},
42:{q:"Selon quel madhab le simple fait de toucher une femme non-mahram annule-t-il les ablutions sans condition ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Selon le madhab Shafi'i : tout contact peau à peau entre un homme et une femme non-mahram annule le wudu, basé sur Al-Ma'idah (5:6)."},
43:{q:"Selon quel madhab la basmala fait-elle partie intégrante de la Fatiha et est-elle obligatoire à réciter à voix haute ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Le madhab Shafi'i considère la basmala comme un verset de la Fatiha. Elle est donc obligatoire (fard) dans la prière et se récite à voix haute en prière jahriyya."},
44:{q:"Selon quel madhab la zakat est-elle obligatoire sur les bijoux en or portés par les femmes ?",opts:["Shafi'i","Maliki","Hanbali","Hanafi"],ans:3,proof:"Le madhab Hanafi impose la zakat sur les bijoux en or et en argent, même portés et utilisés. Les trois autres madhabs exemptent généralement les bijoux portés."},
45:{q:"Quel est le premier des 4 imams des madhabs à avoir enseigné l'un des autres imams ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:0,proof:"Imam Malik (93-179H) a directement enseigné Imam Shafi'i (150-204H), qui lui-même a enseigné Imam Ahmad (164-241H)."},
46:{q:"Qui est le plus âgé des 4 imams des madhabs ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:1,proof:"Imam Abu Hanifa est né en 80H (699 CE), Imam Malik en 93H, Imam Shafi'i en 150H et Imam Ahmad en 164H. Abu Hanifa est donc le doyen des quatre."},
47:{q:"Qui a écrit Riyad as-Salihin (Les Jardins des Vertueux) ?",opts:["Ibn Taymiyya","Ibn Hajar al-Asqalani","Imam An-Nawawi","Ibn Qudama"],ans:2,proof:"Riyad as-Salihin a été compilé par l'Imam Yahya ibn Sharaf An-Nawawi (631-676H), grand savant shafi'i de Syrie."},
48:{q:"Qui a écrit Majmu' al-Fatawa ?",opts:["Ibn Hajar al-Asqalani","Ibn Taymiyya","Ibn al-Qayyim","As-Suyuti"],ans:1,proof:"Majmu' al-Fatawa est le recueil des fatwas et écrits de Shaykh al-Islam Ibn Taymiyya (661-728H), compilé par son élève Ibn Qasim en 37 volumes."},
49:{q:"Quelle est la formule arabe utilisée pour exprimer qu'Allah s'est établi sur Son Trône ?",opts:["Allahu Akbar","Istawa 'ala al-'Arsh","Subhanahu wa Ta'ala","Fa'alun lima yurid"],ans:1,proof:"Istawa 'ala al-'Arsh (استوى على العرش) — mentionnée 7 fois dans le Coran, dont Al-A'raf (7:54), Ta-Ha (20:5), Al-Furqan (25:59)."},
50:{q:"Quelle personne fut la première martyre de l'Islam ?",opts:["Bilal ibn Rabah","Yasir ibn Amir","Sumayyah bint Khayyat","Khabbab ibn al-Aratt"],ans:2,proof:"Sumayyah bint Khayyat, mère d'Ammar ibn Yasir, fut tuée par Abu Jahl alors qu'elle refusait d'abjurer l'Islam. Elle est unanimement reconnue comme la première martyre de l'Islam. (Ibn Hisham, Sira)"}
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Quiz Coran OK port " + PORT));
