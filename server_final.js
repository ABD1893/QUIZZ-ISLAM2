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
:root{--gold:#c9a84c;--gold-l:#f0d080;--dark:#1a1a2e;--card:#fff;--bg:#f5f3ee;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden;}
body::before{content:"";position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%23c9a84c' stroke-width='0.5' opacity='0.12'/%3E%3C/svg%3E");pointer-events:none;z-index:0;}
.wrap{position:relative;z-index:1;padding:1rem;max-width:1200px;margin:0 auto;}
.card{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:2rem;max-width:480px;margin:2rem auto;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.07);}
.card-wide{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:1.5rem;max-width:760px;margin:1.5rem auto;box-shadow:0 4px 20px rgba(0,0,0,.07);}
.logo{font-size:26px;font-weight:800;color:var(--dark);}
.logo span{color:var(--gold);}
.gold-line{width:50px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-l));border-radius:99px;margin:.4rem auto 1.1rem;}
.sub{font-size:12px;color:#999;margin-bottom:1.1rem;}
.btn{width:100%;padding:12px;border-radius:12px;border:none;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:8px;display:block;}
.btn-dark{background:var(--dark);color:#fff;}
.btn-dark:hover{background:#2d2d4e;transform:translateY(-1px);}
.btn-dark:disabled{opacity:.4;cursor:default;transform:none;}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-l));color:#1a1000;box-shadow:0 3px 12px rgba(201,168,76,.3);}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(201,168,76,.4);}
.btn-gold:disabled{opacity:.4;cursor:default;transform:none;}
.btn-outline{background:#fff;border:1.5px solid #ddd;color:#555;font-weight:600;}
.btn-outline:hover{background:#f5f5f5;}
.btn-red{background:#fdecea;border:1.5px solid #f5a0a0;color:#8b1a1a;font-weight:700;}
.btn-red:hover{background:#fbd5d5;}
.btn-sm{padding:6px 13px;border-radius:8px;border:1px solid #ddd;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#444;}
.btn-sm:hover{background:#f0ede6;}
.btn-sm:disabled{opacity:.4;cursor:default;}
.btn-green-sm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #5ecb9a;background:#e6f9f0;color:#1a6641;cursor:pointer;font-weight:700;}
.btn-red-sm{padding:5px 10px;font-size:11px;border-radius:7px;border:1.5px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;font-weight:700;}
.btn-grey-sm{padding:5px 9px;font-size:11px;border-radius:7px;border:1px solid #ddd;background:#fff;color:#555;cursor:pointer;}
.entry-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:.5rem;}
.entry-btn{padding:18px 12px;border-radius:14px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;text-align:center;transition:all .2s;}
.entry-btn:hover{background:#f0ede6;border-color:var(--gold);transform:translateY(-2px);}
.entry-icon{font-size:26px;margin-bottom:5px;}
.entry-label{font-size:13px;font-weight:700;}
.entry-sub{font-size:10px;color:#aaa;margin-top:2px;}
.pin-dots{display:flex;justify-content:center;gap:12px;margin-bottom:1rem;}
.pin-dot{width:42px;height:42px;border-radius:11px;border:1.5px solid #ddd;background:#faf9f6;display:flex;align-items:center;justify-content:center;font-size:22px;transition:all .2s;}
.pin-dot.filled{border-color:var(--gold);background:#fffbe6;}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:210px;margin:0 auto 1rem;}
.pin-key{padding:12px;border-radius:11px;border:1px solid #e0ddd6;background:#faf9f6;font-size:17px;cursor:pointer;font-weight:600;transition:all .15s;}
.pin-key:hover{background:#f0ede6;border-color:var(--gold);}
.pin-error{font-size:12px;color:#e74c3c;height:18px;margin-bottom:.4rem;font-weight:600;}
.inp{width:100%;padding:11px 13px;border-radius:10px;border:1.5px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:.8rem;outline:none;transition:border .2s;}
.inp:focus{border-color:var(--gold);}
.sel{width:100%;padding:10px 13px;border-radius:10px;border:1.5px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:1rem;}
.tag{font-size:11px;padding:3px 9px;border-radius:99px;display:inline-block;font-weight:600;}
.tag-ready{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-wait{background:#fff8e6;color:#a07020;border:1px solid #f5d97a;}
.tag-ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-ko{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.tag-ans{background:#f0f0f0;color:#555;border:1px solid #ddd;}
.member-row{display:flex;align-items:center;gap:8px;margin-bottom:7px;}
.member-inp{flex:1;padding:8px 11px;border-radius:9px;border:1.5px solid #ddd;background:#faf9f6;font-size:13px;color:#1a1a1a;outline:none;}
.member-inp:focus{border-color:var(--gold);}
.member-del{padding:5px 10px;border-radius:8px;border:1px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;font-size:13px;font-weight:700;}
.team-slot{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:11px;background:#faf9f6;border:1px solid #eee;margin-bottom:7px;flex-wrap:wrap;gap:5px;transition:all .3s;}
.team-slot.ready{background:#f0faf5;border-color:#b0e0c8;}
.slot-name{font-size:13px;font-weight:700;}
.slot-code{font-size:13px;font-family:monospace;font-weight:700;background:#f0ede6;padding:2px 9px;border-radius:6px;color:var(--dark);}
.code-tbl{width:100%;border-collapse:collapse;margin-top:.4rem;}
.code-tbl th{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.05em;padding:5px 8px;text-align:left;border-bottom:1px solid #eee;font-weight:700;}
.code-tbl td{padding:7px 8px;border-bottom:1px solid #f5f5f5;}
.code-pill{font-family:monospace;font-weight:800;font-size:15px;background:linear-gradient(135deg,#fffbe6,#fff3cc);padding:3px 11px;border-radius:7px;border:1px solid var(--gold);color:var(--dark);}
.ghdr{text-align:center;padding:.5rem 0 .3rem;}
.ghdr h1{font-size:18px;font-weight:800;color:var(--dark);}
.ghdr h1 span{color:var(--gold);}
.ghdr .prog{font-size:11px;color:#999;margin-top:1px;}
.timer-wrap{margin-bottom:.3rem;}
.timer-bg{background:#eee;border-radius:99px;height:10px;overflow:hidden;}
.timer-bar{height:10px;border-radius:99px;transition:width 1s linear,background .5s;}
.timer-bar.pulse{animation:tpulse 1s infinite;}
@keyframes tpulse{0%,100%{opacity:1;}50%{opacity:.5;}}
.timer-num{text-align:center;font-size:22px;font-weight:800;margin:.3rem 0 .5rem;transition:color .5s;}
.timer-paused{text-align:center;font-size:12px;color:#bbb;margin-bottom:.5rem;font-style:italic;}
.scores-bar{display:grid;gap:7px;margin-bottom:.7rem;}
.sc-card{background:var(--card);border-radius:12px;border:1px solid #e8e4da;padding:.5rem .7rem;text-align:center;position:relative;overflow:hidden;}
.sc-card .scn{font-size:10px;font-weight:700;margin-bottom:1px;}
.sc-card .scv{font-size:19px;font-weight:800;}
.sc-card .sc-prog{position:absolute;bottom:0;left:0;height:3px;border-radius:0 3px 3px 0;transition:width .6s ease;}
.pts-pop{position:absolute;top:2px;right:6px;font-size:12px;font-weight:800;color:#22b87a;animation:ptsfloat .9s ease forwards;pointer-events:none;}
@keyframes ptsfloat{0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(-20px);}}
.q-box{background:var(--card);border-radius:15px;border:1px solid #e8e4da;padding:1rem 1.3rem;margin-bottom:.7rem;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.q-num{font-size:10px;color:var(--gold);letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:4px;}
.q-text{font-size:14px;font-weight:700;line-height:1.65;color:var(--dark);}
.q-hidden{font-size:13px;font-weight:600;color:#ccc;font-style:italic;padding:.4rem 0;}
.proof-box{background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:13px;border:1px solid #b0e0c8;padding:.9rem 1.1rem;margin-bottom:.7rem;font-size:12px;color:#1a4a30;line-height:1.7;animation:slidein .35s ease;}
@keyframes slidein{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
.fun-box{background:linear-gradient(135deg,#fffbe6,#fff3cc);border-radius:12px;border:1px solid var(--gold);padding:.6rem 1rem;margin-bottom:.7rem;text-align:center;font-size:13px;color:#7a6000;font-weight:700;}
.teams-grid{display:grid;gap:8px;margin-bottom:.7rem;}
.t-card{background:var(--card);border-radius:14px;border:1px solid #e8e4da;padding:.8rem;border-top:4px solid #ccc;box-shadow:0 2px 6px rgba(0,0,0,.04);}
.t-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
.t-name{font-size:13px;font-weight:800;}
.t-pts{font-size:12px;color:#888;font-weight:600;}
.mode-grid{display:flex;flex-direction:column;gap:5px;}
.mode-card{padding:9px 11px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;transition:all .2s;font-size:12px;font-weight:600;}
.mode-card:hover{transform:translateY(-1px);}
.mode-card.cash-c{border-color:#f0c060;background:#fffbe6;}
.mode-card.cash-c:hover{border-color:var(--gold);}
.mode-card.sq-c{border-color:#90c0f0;background:#eef5ff;}
.mode-card.sq-c:hover{border-color:#4f8ef7;}
.mode-card.duo-c{border-color:#90dbb0;background:#edfaf3;}
.mode-card.duo-c:hover{border-color:#22b87a;}
.mode-pts{font-weight:800;font-size:12px;}
.confirm-box{background:#faf9f6;border-radius:10px;border:1.5px solid #e0ddd6;padding:9px 11px;text-align:center;}
.confirm-box p{font-size:12px;color:#444;margin-bottom:7px;font-weight:600;}
.confirm-row{display:flex;gap:7px;justify-content:center;}
.btn-conf{padding:6px 16px;border-radius:8px;border:none;background:var(--dark);color:#fff;font-size:12px;font-weight:700;cursor:pointer;}
.btn-canc{padding:6px 11px;border-radius:8px;border:1.5px solid #ccc;background:#fff;font-size:12px;cursor:pointer;color:#555;font-weight:600;}
.opt-btn{width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:12px;cursor:pointer;text-align:left;color:var(--dark);margin-bottom:4px;line-height:1.3;font-weight:600;transition:all .2s;}
.opt-btn:hover:not(:disabled){background:#f0ede6;border-color:#bbb;}
.opt-btn:disabled{cursor:default;}
.opt-btn.pending{background:#eef3ff;border-color:#4f8ef7;border-width:2px;}
.opt-btn.sel{background:#eef3ff;border-color:#4f8ef7;}
.opt-btn.correct{background:#e6f9f0;border-color:#22b87a;color:#0a4a25;animation:popin .4s ease;font-weight:700;}
.opt-btn.wrong{background:#fdecea;border-color:#e74c3c;color:#5a0a0a;animation:shakebtn .4s ease;}
@keyframes popin{0%{transform:scale(1);}50%{transform:scale(1.025);}100%{transform:scale(1);}}
@keyframes shakebtn{0%,100%{transform:translateX(0);}25%{transform:translateX(-4px);}75%{transform:translateX(4px);}}
.cash-inp{width:100%;padding:8px 10px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;font-size:13px;color:var(--dark);margin-bottom:5px;outline:none;font-weight:600;}
.cash-inp:focus{border-color:var(--gold);}
.cash-pending{background:#fffbe6;border:1.5px solid var(--gold);border-radius:10px;padding:7px 10px;font-size:13px;font-weight:600;color:var(--dark);margin-bottom:6px;}
.mode-lbl{font-size:10px;padding:2px 7px;border-radius:99px;border:1px solid #e0ddd6;color:#888;margin-bottom:5px;display:inline-block;font-weight:600;}
.host-panel{background:var(--card);border-radius:14px;border:1px solid #e8e4da;padding:.9rem;margin-top:.6rem;box-shadow:0 2px 8px rgba(0,0,0,.04);}
.host-panel h3{font-size:10px;font-weight:800;color:var(--gold);text-transform:uppercase;letter-spacing:.08em;margin-bottom:.6rem;}
.h-row{display:flex;align-items:center;gap:6px;margin-bottom:5px;padding:7px 9px;background:#faf9f6;border-radius:9px;border:1px solid #eee;flex-wrap:wrap;}
.h-mode{font-size:10px;color:#aaa;min-width:42px;text-transform:uppercase;font-weight:700;}
.h-team{font-size:11px;font-weight:800;min-width:72px;}
.h-ans{font-size:11px;color:#333;flex:1;font-style:italic;}
.h-inp{padding:4px 7px;font-size:12px;border-radius:7px;border:1px solid #ccc;background:#fff;color:var(--dark);width:120px;}
.h-correct{font-size:12px;color:#0a3a20;padding:7px 11px;background:linear-gradient(135deg,#f0faf5,#e8f5f0);border-radius:9px;border:1px solid #b0e0c8;margin-bottom:.6rem;font-weight:600;}
.h-q-preview{font-size:12px;color:#333;padding:7px 11px;background:#faf9f6;border-radius:9px;border:1px solid #eee;margin-bottom:.6rem;font-style:italic;line-height:1.4;}
.bonus-section{margin-top:.5rem;padding-top:.5rem;border-top:1px solid #eee;}
.bonus-section-title{font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:.4rem;}
.bonus-row{display:flex;align-items:center;gap:5px;margin-bottom:5px;padding:5px 9px;background:#fffbe6;border-radius:9px;border:1px solid #f0d080;flex-wrap:wrap;}
.bonus-team{font-size:11px;font-weight:800;min-width:72px;}
.bonus-btns{display:flex;gap:4px;flex-wrap:wrap;}
.bonus-btn{padding:3px 8px;border-radius:6px;border:1.5px solid var(--gold);background:#fffbe6;color:#7a5000;font-size:11px;font-weight:700;cursor:pointer;}
.bonus-btn:hover{background:#f0d080;}
.bonus-min{border-color:#f5a0a0;background:#fdecea;color:#8b1a1a;}
.bonus-min:hover{background:#fbd5d5;}
.rev-area{text-align:center;margin-top:.7rem;padding-top:.7rem;border-top:1px solid #eee;}
.rev-hint{font-size:11px;color:#aaa;margin-top:3px;}
.timer-ctrl{display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:.6rem;flex-wrap:wrap;}
.timer-ctrl span{font-size:12px;color:#666;font-weight:600;}
.host-toggle{text-align:center;margin-top:.4rem;}
.host-toggle button{font-size:11px;color:#bbb;background:none;border:none;cursor:pointer;text-decoration:underline;}
.conn{position:fixed;bottom:10px;right:10px;font-size:11px;padding:4px 11px;border-radius:99px;font-weight:700;z-index:999;transition:all .3s;}
.conn.ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.conn.off{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.final-wrap{padding:2rem 0;min-height:100vh;display:flex;align-items:center;justify-content:center;}
.final-card{background:var(--card);border-radius:22px;padding:2.2rem 1.8rem;max-width:560px;width:100%;text-align:center;box-shadow:0 8px 36px rgba(0,0,0,.1);}
.final-title{font-size:24px;font-weight:800;color:var(--dark);}
.final-title span{color:var(--gold);}
.podium{display:flex;align-items:flex-end;justify-content:center;gap:10px;margin:1.5rem 0 1.2rem;height:150px;}
.podium-col{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;}
.podium-name{font-size:11px;font-weight:700;margin-bottom:4px;max-width:85px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.podium-score{font-size:10px;color:#888;margin-bottom:3px;font-weight:600;}
.podium-medal{font-size:22px;margin-bottom:3px;}
.podium-block{border-radius:9px 9px 0 0;width:76px;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;animation:riseup .8s ease both;}
.p1{height:115px;background:linear-gradient(180deg,var(--gold-l),var(--gold));animation-delay:.1s;}
.p2{height:80px;background:linear-gradient(180deg,#c8d4e8,#8090a8);animation-delay:.3s;}
.p3{height:55px;background:linear-gradient(180deg,#e0b880,#c07830);animation-delay:.5s;}
@keyframes riseup{from{height:0;opacity:0;}to{opacity:1;}}
.f-row{display:flex;align-items:center;justify-content:space-between;padding:10px .9rem;border-radius:10px;margin-bottom:6px;background:#faf9f6;border:1px solid #eee;}
.f-rank{font-size:20px;min-width:30px;}
.f-name{font-size:13px;font-weight:700;}
.f-pts{font-size:12px;color:#888;font-weight:600;}
.celebration{margin:1rem 0 .8rem;min-height:70px;display:flex;justify-content:center;align-items:flex-end;gap:6px;flex-wrap:wrap;}
.stickman{font-size:30px;animation:dance .6s ease infinite alternate;}
.stickman:nth-child(even){animation-direction:alternate-reverse;animation-delay:.15s;}
@keyframes dance{0%{transform:translateY(0) rotate(-8deg);}100%{transform:translateY(-10px) rotate(8deg);}}
.confetti-piece{position:fixed;width:9px;height:9px;top:-10px;border-radius:2px;animation:conffll linear forwards;pointer-events:none;z-index:9999;}
@keyframes conffll{0%{transform:translateY(0) rotate(0);opacity:1;}100%{transform:translateY(110vh) rotate(720deg);opacity:0;}}
@media(max-width:680px){.teams-grid{grid-template-columns:1fr!important;}.q-text{font-size:13px;}.entry-grid{grid-template-columns:1fr;}}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn off" id="conn">Connexion...</div>
<script>
const LABELS=["A","B","C","D"];
const MEDALS=["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];
const CCOLORS=["#f7934f","#4f8ef7","#22b87a","#c9a84c","#9b59b6","#e74c3c","#f0d080"];

let role=null,myTeamIdx=null,serverState=null;
let phase="entry",pinEntry="",pinError="";
let myTeamNameInput="",myMemberInputs=[""];
let hostPanelOpen=false,cashInputVal="",numTeams=3,startFrom=1;
let prevScores=[],timerVal=60,timerDone=false,timerStarted=false;
let editingTi=-1;

const proto=location.protocol==="https:"?"wss:":"ws:";
let ws;
function connectWS(){
  ws=new WebSocket(proto+"//"+location.host);
  ws.onopen=()=>setConn(true);
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
  if(msg.type==="team-auth-ok"){role="team";myTeamIdx=msg.teamIdx;phase="team-members";render();return;}
  if(msg.type==="team-auth-fail"){pinError=msg.reason==="already-used"?"Code déjà utilisé":"Code invalide";pinEntry="";render();return;}
  if(msg.type==="timer"){
    timerVal=msg.val;timerDone=msg.done;
    updateTimerDOM();return;
  }
  if(msg.type==="waiting"){
    if(phase!=="team-members"&&phase!=="team-name")phase="waiting";
    serverState=msg;render();return;
  }
  if(msg.type==="state"){
    if(serverState&&serverState.teams)prevScores=serverState.teams.map(t=>t.score);
    serverState=msg;
    timerVal=msg.timerVal;timerDone=msg.timerDone;timerStarted=msg.timerStarted;
    if(msg.phase==="waiting"&&phase!=="team-members"&&phase!=="team-name")phase="waiting";
    if(msg.phase==="game")phase="game";
    if(msg.phase==="end")phase="end";
    render();
    if(msg.revealed&&serverState.teams)
      serverState.teams.forEach((t,i)=>{if((t.score||0)>(prevScores[i]||0))setTimeout(()=>showPts(i,(t.score||0)-(prevScores[i]||0)),200);});
    return;
  }
}

function updateTimerDOM(){
  const bar=document.getElementById("tBar"),num=document.getElementById("tNum");
  if(!bar||!num)return;
  const pct=Math.max(0,(timerVal/60)*100);
  const color=timerVal>20?"#22b87a":timerVal>10?"#f7934f":"#e74c3c";
  bar.style.width=pct+"%";bar.style.background=color;
  bar.className="timer-bar"+(timerVal<=10&&timerVal>0?" pulse":"");
  num.textContent=timerVal+"s";num.style.color=color;
  const hv=document.getElementById("hTimerVal");if(hv)hv.textContent=timerVal+"s";
}

function showPts(ti,pts){
  const card=document.querySelector(\`[data-ti="\${ti}"]\`);
  if(!card)return;
  const el=document.createElement("div");
  el.className="pts-pop";el.textContent="+"+pts;
  card.style.position="relative";card.appendChild(el);
  setTimeout(()=>el.remove(),1000);
}

function launchConfetti(){
  for(let i=0;i<200;i++)setTimeout(()=>{
    const el=document.createElement("div");
    el.className="confetti-piece";
    el.style.left=Math.random()*100+"vw";
    el.style.background=CCOLORS[Math.floor(Math.random()*CCOLORS.length)];
    const s=(7+Math.random()*8)+"px";
    el.style.width=s;el.style.height=s;
    el.style.animationDuration=(2+Math.random()*3)+"s";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),5500);
  },i*22);
}

function render(){
  const app=document.getElementById("app");if(!app)return;
  if(phase==="entry")rEntry(app);
  else if(phase==="host-pin")rPin(app,"Accès hôte","Code hôte requis",hPinPress,hPinDel);
  else if(phase==="host-setup")rHostSetup(app);
  else if(phase==="team-pin")rPin(app,"Rejoindre","Code reçu de l'hôte",tPinPress,tPinDel);
  else if(phase==="team-members")rTeamMembers(app);
  else if(phase==="team-name")rTeamName(app);
  else if(phase==="waiting")rWaiting(app);
  else if(phase==="game")rGame(app);
  else if(phase==="end")rEnd(app);
}

function rEntry(app){
  app.innerHTML=\`<div class="card">
    <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
    <p class="sub">51 questions · Sciences islamiques</p>
    <div class="entry-grid">
      <div class="entry-btn" onclick="phase='team-pin';pinEntry='';pinError='';render()">
        <div class="entry-icon">👥</div><div class="entry-label">Rejoindre</div>
        <div class="entry-sub">Saisir mon code équipe</div>
      </div>
      <div class="entry-btn" onclick="phase='host-pin';pinEntry='';pinError='';render()">
        <div class="entry-icon">🎙️</div><div class="entry-label">Hôte</div>
        <div class="entry-sub">Configurer la partie</div>
      </div>
    </div>
  </div>\`;
}

function rPin(app,title,sub,onP,onD){
  const dots=[0,1,2,3].map(i=>\`<div class="pin-dot\${i<pinEntry.length?" filled":""}">\${i<pinEntry.length?"●":""}</div>\`).join("");
  const pad=[1,2,3,4,5,6,7,8,9].map(n=>\`<button class="pin-key" onclick="\${onP.name}('\${n}')">\${n}</button>\`).join("");
  app.innerHTML=\`<div class="card">
    <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
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

function rHostSetup(app){
  app.innerHTML=\`<div class="card">
    <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Configuration</p>
    <p class="sub">Combien d'équipes participent ?</p>
    <select class="sel" onchange="numTeams=parseInt(this.value)">
      <option value="1">1 équipe</option>
      <option value="2">2 équipes</option>
      <option value="3" selected>3 équipes</option>
      <option value="4">4 équipes</option>
      <option value="5">5 équipes</option>
      <option value="6">6 équipes</option>
    </select>
    <button class="btn btn-gold" onclick="send({type:'host-setup',numTeams})">Générer les codes →</button>
  </div>\`;
}

function rTeamMembers(app){
  const rows=myMemberInputs.map((v,i)=>\`
    <div class="member-row">
      <input class="member-inp" placeholder="Pseudo membre \${i+1}" value="\${v}"
        oninput="myMemberInputs[\${i}]=this.value"/>
      \${myMemberInputs.length>1?\`<button class="member-del" onclick="myMemberInputs.splice(\${i},1);render()">✕</button>\`:""}
    </div>\`).join("");
  app.innerHTML=\`<div class="card">
    <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Membres</p>
    <p class="sub">Ajoutez les pseudos (1 à 6 membres)</p>
    \${rows}
    \${myMemberInputs.length<6?\`<button class="btn btn-outline" onclick="myMemberInputs.push('');render()" style="margin-bottom:.5rem">+ Ajouter un membre</button>\`:""}
    <button class="btn btn-gold" onclick="phase='team-name';render()">Continuer →</button>
    <button class="btn btn-outline" onclick="phase='team-pin';pinEntry='';pinError='';render()">Retour</button>
  </div>\`;
}

function rTeamName(app){
  app.innerHTML=\`<div class="card">
    <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
    <p style="font-size:14px;font-weight:700;color:#333;margin-bottom:.3rem">Nom de l'équipe</p>
    <p class="sub">Choisissez un nom pour votre équipe</p>
    <input class="inp" placeholder="Nom de l'équipe..." maxlength="20" oninput="myTeamNameInput=this.value" onkeydown="if(event.key==='Enter')confirmTeam()" autofocus/>
    <button class="btn btn-gold" onclick="confirmTeam()">Rejoindre ✓</button>
    <button class="btn btn-outline" onclick="phase='team-members';render()">Retour</button>
  </div>\`;
  setTimeout(()=>{const el=app.querySelector(".inp");if(el)el.focus();},80);
}
function confirmTeam(){
  const name=myTeamNameInput.trim();if(!name)return;
  const members=myMemberInputs.map(m=>m.trim()).filter(Boolean);
  send({type:"team-set-info",name,members});phase="waiting";render();
}

function rWaiting(app){
  const st=serverState,teams=(st&&(st.allCodes||st.teams))||[];
  const allReady=teams.length>0&&teams.every(t=>t.ready);
  const slots=teams.map(t=>\`
    <div class="team-slot\${t.ready?" ready":""}">
      <span class="slot-name" style="color:\${t.color}">\${t.name}</span>
      \${role==="host"?\`<span class="slot-code">\${t.code}</span>\`:""}
      <span class="tag \${t.ready?"tag-ready":"tag-wait"}">\${t.ready?"Prête ✓":"En attente..."}</span>
    </div>\`).join("");

  const hostSection=role==="host"?\`
    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee">
      <div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;font-weight:800;margin-bottom:.6rem">Codes à distribuer</div>
      <table class="code-tbl">
        <tr><th>Équipe</th><th>Code</th><th>Membres</th><th>Statut</th></tr>
        \${teams.map(t=>\`<tr>
          <td style="color:\${t.color};font-weight:800">\${t.name}</td>
          <td><span class="code-pill">\${t.code}</span></td>
          <td style="font-size:11px;color:#888">\${t.members&&t.members.length?t.members.join(", "):"—"}</td>
          <td>\${t.ready?'<span class="tag tag-ready">Prête ✓</span>':'<span class="tag tag-wait">En attente</span>'}</td>
        </tr>\`).join("")}
      </table>
      <div style="margin-top:.8rem">
        <label style="font-size:12px;font-weight:700;color:#555;display:block;margin-bottom:.3rem">Démarrer à la question :</label>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:.8rem">
          <input type="number" min="1" max="51" value="\${startFrom}" class="inp" style="width:80px;margin:0;text-align:center" oninput="startFrom=parseInt(this.value)||1"/>
          <span style="font-size:12px;color:#999">/ 51</span>
        </div>
        \${allReady?\`<button class="btn btn-gold" onclick="send({type:'host-start',startFrom})">🚀 Lancer la partie !</button>\`:\`<p style="font-size:12px;color:#aaa;text-align:center;margin-bottom:.6rem">En attente de toutes les équipes...</p>\`}
        <button class="btn btn-red" onclick="if(confirm('Réinitialiser ?'))send({type:'host-close-quiz'})" style="margin-top:.4rem">⏹ Clôturer le quiz</button>
      </div>
    </div>\`:\`<div style="text-align:center;margin-top:.8rem"><p style="font-size:12px;color:#aaa">En attente du lancement par l'hôte...</p></div>\`;

  app.innerHTML=\`<div class="card-wide">
    <div style="text-align:center;margin-bottom:.8rem">
      <div class="logo">Quiz <span>Coran</span></div><div class="gold-line"></div>
      <p class="sub">\${role==="host"?"Distribuez les codes aux équipes":"En attente..."}</p>
    </div>
    \${slots}\${hostSection}
  </div>\`;
}

function rGame(app){
  if(!serverState){app.innerHTML=\`<div class="card"><p>Chargement...</p></div>\`;return;}
  const st=serverState,teams=st.teams||[],q=st.question;
  const isFun=st.qid===51;
  const pct=Math.max(0,(timerVal/60)*100);
  const tcolor=timerVal>20?"#22b87a":timerVal>10?"#f7934f":"#e74c3c";
  const maxScore=Math.max(1,...teams.map(t=>t.score||0));

  const scBar=\`<div class="scores-bar" style="grid-template-columns:repeat(\${teams.length},1fr)">\`+
    teams.map((t,ti)=>\`<div class="sc-card" data-ti="\${ti}">
      <div class="scn" style="color:\${t.color}">\${t.name}</div>
      <div class="scv">\${t.score!==null&&t.score!==undefined?t.score:"•••"}</div>
      <div class="sc-prog" style="width:\${t.score?((t.score/maxScore)*100):0}%;background:\${t.color}"></div>
    </div>\`).join("")+\`</div>\`;

  // Timer display — show paused if not started
  const timerDisplay=!timerStarted
    ?\`<div class="timer-wrap"><div class="timer-bg"><div class="timer-bar" id="tBar" style="width:100%;background:#22b87a"></div></div></div>
       <div class="timer-num" id="tNum" style="color:#22b87a">60s</div>
       <div class="timer-paused">⏸ En attente d'affichage de la question...</div>\`
    :\`<div class="timer-wrap"><div class="timer-bg"><div class="timer-bar\${timerVal<=10&&timerVal>0?" pulse":""}" id="tBar" style="width:\${pct}%;background:\${tcolor}"></div></div></div>
       <div class="timer-num" id="tNum" style="color:\${tcolor}">\${timerVal}s</div>\`;

  // Question box — host always sees question, participants see hidden until shown
  const qText=(role==="host"||st.questionVisible)&&q.q
    ?\`<div class="q-text">\${q.q}</div>\`
    :\`<div class="q-hidden">⏳ Question en attente d'affichage...</div>\`;
  const qBox=\`<div class="q-box"><div class="q-num">Question \${st.current+1} · N°\${st.qid}\${isFun?" · 🎉 BONUS":""}</div>\${qText}</div>\`;

  const funBox=isFun?\`<div class="fun-box">🎉 Question bonus</div>\`:"";
  const proofBox=st.proofRevealed&&q.proof?\`<div class="proof-box"><strong>📖 Preuve :</strong> \${q.proof}</div>\`:"";

  const cols=Math.min(teams.length,3);
  const cards=\`<div class="teams-grid" style="grid-template-columns:repeat(\${cols},minmax(0,1fr))">\`+
    teams.map((t,ti)=>rTeamCard(t,ti,q,st.revealed,isFun)).join("")+\`</div>\`;

  const nextBtn=st.revealed&&role==="host"?\`<div style="text-align:center;margin-bottom:.5rem">
    <button class="btn btn-gold" onclick="send({type:'host-next'})" style="max-width:280px">\${st.current<st.total-1?"Question suivante →":"Voir les résultats 🏆"}</button>
  </div>\`:"";

  const hostHTML=role==="host"?\`
    <div class="host-toggle"><button onclick="hostPanelOpen=!hostPanelOpen;render()">\${hostPanelOpen?"▼ Masquer panneau hôte":"▲ Panneau hôte"}</button></div>
    \${hostPanelOpen?rHostPanel(teams,q,st,isFun):""}\`:""

  app.innerHTML=\`
    <div class="ghdr"><h1>Quiz <span>Coran</span></h1><div class="prog">Q\${st.current+1}/\${st.total} · N°\${st.qid}</div></div>
    \${scBar}\${timerDisplay}\${qBox}\${funBox}\${proofBox}\${cards}\${nextBtn}\${hostHTML}\`;
}

function rTeamCard(t,ti,q,revealed,isFun){
  const isMe=(role==="team"&&ti===myTeamIdx);
  let inner="";

  if(!isMe){
    // Other teams: only show minimal status
    let statusText="En cours...";
    if(t.hasAnswer){
      if(revealed){
        if(t.mode==="cash") statusText=t.validated===true?"✓ Correct":"✗ Incorrect";
        else if(t.mode==="square") statusText=t.answer===q.ans?"✓ Correct":"✗ Incorrect";
        else if(t.mode==="duo"){
          const duo=t.duoOpts||[];
          const chosen=typeof t.answer==="number"?duo[t.answer]:t.answer;
          statusText=chosen===q.opts[q.ans]?"✓ Correct":"✗ Incorrect";
        }
      } else statusText="Réponse envoyée ✓";
    } else if(t.pending) statusText="Choix du mode...";
    else if(t.mode) statusText="En train de répondre...";

    inner=\`<div style="font-size:12px;color:#aaa;padding:5px 0;text-align:center;font-style:italic">\${statusText}</div>\`;

    // Show results when revealed
    if(revealed&&t.mode&&t.hasAnswer){
      const mlbls={cash:"Cash · 5 pts",square:"Carré · 3 pts",duo:"Duo · 1 pt"};
      inner=\`<span class="mode-lbl">\${mlbls[t.mode]||t.mode}</span><br/>\`;
      if(t.mode==="square"&&t.answer!==null){
        inner+=q.opts.map((o,oi)=>{
          let cls="opt-btn";
          if(isFun)cls+=" correct";
          else{if(oi===q.ans)cls+=" correct";else if(oi===t.answer)cls+=" wrong";}
          return\`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
      }else if(t.mode==="duo"&&t.answer!==null){
        const duo=t.duoOpts||[];
        inner+=duo.map((o,oi)=>{
          let cls="opt-btn";
          if(isFun)cls+=" correct";
          else{if(o===q.opts[q.ans])cls+=" correct";else if(oi===t.answer)cls+=" wrong";}
          return\`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
      }else if(t.mode==="cash"){
        inner+=\`<div style="font-size:12px;color:#333;padding:4px 0;font-weight:600">\${t.answer?"« "+t.answer+" »":""}</div>\`;
        inner+=t.validated===true?\`<span class="tag tag-ok">✓ Correct</span>\`:\`<span class="tag tag-ko">✗ Incorrect</span>\`;
      }
    }
    return\`<div class="t-card" style="border-top-color:\${t.color}">
      <div class="t-head"><span class="t-name" style="color:\${t.color}">\${t.name}</span><span class="t-pts">\${t.score!==null&&t.score!==undefined?t.score+" pts":"•••"}</span></div>
      \${inner}</div>\`;
  }

  // My team — full interaction
  if(!t.mode&&!t.pending){
    if(isFun){
      inner=\`<div class="mode-grid"><div class="mode-card sq-c" onclick="send({type:'team-select-mode',mode:'square'})"><span>Répondre</span><span class="mode-pts" style="color:#4f8ef7">Bonus</span></div></div>\`;
    } else {
      inner=\`<div class="mode-grid">
        <div class="mode-card cash-c" onclick="send({type:'team-select-mode',mode:'cash'})"><span>Cash — libre</span><span class="mode-pts" style="color:var(--gold)">5 pts</span></div>
        <div class="mode-card sq-c" onclick="send({type:'team-select-mode',mode:'square'})"><span>Carré — 4 choix</span><span class="mode-pts" style="color:#4f8ef7">3 pts</span></div>
        <div class="mode-card duo-c" onclick="send({type:'team-select-mode',mode:'duo'})"><span>Duo — 2 choix</span><span class="mode-pts" style="color:#22b87a">1 pt</span></div>
      </div>\`;
    }
  } else if(t.pending&&!t.mode){
    const lbls={cash:"Cash — 5 pts",square:isFun?"Répondre":("Carré — 3 pts"),duo:"Duo — 1 pt"};
    inner=\`<div class="confirm-box"><p>Confirmer <strong>\${lbls[t.pending]}</strong> ?</p>
      <div class="confirm-row">
        <button class="btn-canc" onclick="send({type:'team-cancel-mode'})">Changer</button>
        <button class="btn-conf" onclick="send({type:'team-confirm-mode'})">Confirmer ✓</button>
      </div></div>\`;
  } else if(t.mode){
    const mlbls={cash:"Cash · 5 pts",square:isFun?"Bonus":("Carré · 3 pts"),duo:"Duo · 1 pt"};
    const lbl=\`<span class="mode-lbl">\${mlbls[t.mode]}</span><br/>\`;

    if(!t.hasAnswer){
      if(t.mode==="cash"){
        const hasPend=t.pendingAnswer!==null&&t.pendingAnswer!==undefined;
        if(hasPend){
          inner=lbl+\`<div class="cash-pending">« \${t.pendingAnswer} »</div>
            <div class="confirm-box"><p>Confirmer cette réponse ?</p>
              <div class="confirm-row">
                <button class="btn-canc" onclick="send({type:'team-cancel-answer'})">Modifier</button>
                <button class="btn-conf" onclick="send({type:'team-confirm-answer',cashText:'\${String(t.pendingAnswer||"").replace(/'/g,"\\\\'")}'})">Confirmer ✓</button>
              </div></div>\`;
        } else {
          inner=lbl+\`<input class="cash-inp" placeholder="Votre réponse..." oninput="cashInputVal=this.value" onkeydown="if(event.key==='Enter'&&cashInputVal.trim())send({type:'team-pending-answer',answer:cashInputVal.trim()})"/>
            <button class="btn btn-dark" style="padding:8px;font-size:12px;margin-bottom:0" onclick="if(cashInputVal.trim())send({type:'team-pending-answer',answer:cashInputVal.trim()})">Valider →</button>\`;
        }
      } else if(t.mode==="square"){
        const pend=t.pendingAnswer;
        if(pend!==null&&pend!==undefined){
          inner=lbl+q.opts.map((o,oi)=>\`<button class="opt-btn\${oi===pend?" pending":""}" disabled>\${LABELS[oi]}. \${o}</button>\`).join("")+
            \`<div class="confirm-box" style="margin-top:6px"><p>Confirmer \${LABELS[pend]}. \${q.opts[pend]} ?</p>
              <div class="confirm-row">
                <button class="btn-canc" onclick="send({type:'team-cancel-answer'})">Changer</button>
                <button class="btn-conf" onclick="send({type:'team-confirm-answer'})">Confirmer ✓</button>
              </div></div>\`;
        } else {
          inner=lbl+q.opts.map((o,oi)=>\`<button class="opt-btn" onclick="send({type:'team-pending-answer',answer:\${oi}})">\${LABELS[oi]}. \${o}</button>\`).join("");
        }
      } else if(t.mode==="duo"){
        const duo=t.duoOpts||[];
        const pend=t.pendingAnswer;
        if(pend!==null&&pend!==undefined){
          inner=lbl+duo.map((o,oi)=>\`<button class="opt-btn\${oi===pend?" pending":""}" disabled>\${LABELS[oi]}. \${o}</button>\`).join("")+
            \`<div class="confirm-box" style="margin-top:6px"><p>Confirmer \${LABELS[pend]}. \${duo[pend]} ?</p>
              <div class="confirm-row">
                <button class="btn-canc" onclick="send({type:'team-cancel-answer'})">Changer</button>
                <button class="btn-conf" onclick="send({type:'team-confirm-answer'})">Confirmer ✓</button>
              </div></div>\`;
        } else {
          inner=lbl+duo.map((o,oi)=>\`<button class="opt-btn" onclick="send({type:'team-pending-answer',answer:\${oi}})">\${LABELS[oi]}. \${o}</button>\`).join("");
        }
      }
    } else {
      // Has answered
      if(t.mode==="cash"){
        const tag=revealed?(t.validated===true?\`<span class="tag tag-ok">Correct +5 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`):\`<span class="tag tag-ans">⏳ Hôte valide...</span>\`;
        inner=lbl+\`<div style="font-size:13px;padding:5px 0;color:#333;font-weight:600">\${revealed&&t.answer?"« "+t.answer+" »":"Réponse envoyée ✓"}</div>\${tag}\`;
      } else if(t.mode==="square"){
        const btns=q.opts.map((o,oi)=>{
          let cls="opt-btn";
          if(revealed){if(isFun||oi===q.ans)cls+=" correct";else if(oi===t.answer)cls+=" wrong";}
          else if(oi===t.answer)cls+=" sel";
          return\`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
        const tag=revealed?(isFun?\`<span class="tag tag-ok">Bonus 🎉</span>\`:(t.answer===q.ans?\`<span class="tag tag-ok">Correct +3 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`)):\`<span class="tag tag-ans">Répondu ✓</span>\`;
        inner=lbl+btns+tag;
      } else if(t.mode==="duo"){
        const duo=t.duoOpts||[];
        const btns=duo.map((o,oi)=>{
          let cls="opt-btn";
          if(revealed){if(isFun||o===q.opts[q.ans])cls+=" correct";else if(oi===t.answer)cls+=" wrong";}
          else if(oi===t.answer)cls+=" sel";
          return\`<button class="\${cls}" disabled>\${LABELS[oi]}. \${o}</button>\`;
        }).join("");
        const chosen=typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer;
        const isOk=chosen===q.opts[q.ans];
        const tag=revealed?(isOk?\`<span class="tag tag-ok">Correct +1 🎯</span>\`:\`<span class="tag tag-ko">Incorrect ✗</span>\`):\`<span class="tag tag-ans">Répondu ✓</span>\`;
        inner=lbl+btns+tag;
      }
    }
  }

  return\`<div class="t-card" style="border-top-color:\${t.color}">
    <div class="t-head"><span class="t-name" style="color:\${t.color}">\${t.name}</span><span class="t-pts">\${t.score!==null&&t.score!==undefined?t.score+" pts":"•••"}</span></div>
    \${inner}</div>\`;
}

function rHostPanel(teams,q,st,isFun){
  const allAnswered=teams.every(t=>t.hasAnswer);
  const canReveal=(allAnswered||timerDone)&&!st.revealed;

  const rows=teams.map((t,ti)=>{
    if(!t.mode)return\`<div class="h-row"><span class="h-mode">—</span><span class="h-team" style="color:\${t.color}">\${t.name}</span><span style="color:#ccc;font-size:11px">Mode non choisi</span></div>\`;
    let ans=\`<span style="color:#ccc;font-size:11px">En attente...</span>\`,act="";
    if(t.hasAnswer){
      if(t.mode==="cash"){
        if(editingTi===ti){
          ans=\`<input class="h-inp" id="hed\${ti}" value="\${t.answer||""}" onkeydown="if(event.key==='Enter'){hostSaveCash(\${ti})}"/>\`;
          act=\`<button class="btn-grey-sm" onclick="hostSaveCash(\${ti})">OK</button>\`;
        } else {
          ans=\`<span class="h-ans">« \${t.answer||"..."} »</span>\`;
          if(t.validated===null||t.validated===undefined){
            act=\`<button class="btn-grey-sm" onclick="editingTi=\${ti};render()">✏️</button>
              <button class="btn-green-sm" onclick="send({type:'host-validate-cash',teamIdx:\${ti},ok:true})">✓ Valider</button>
              <button class="btn-red-sm" onclick="send({type:'host-validate-cash',teamIdx:\${ti},ok:false})">✗</button>\`;
          } else {
            act=(t.validated?\`<span class="tag tag-ok" style="font-size:10px">Validé</span>\`:\`<span class="tag tag-ko" style="font-size:10px">Invalidé</span>\`)+
              \`<button class="btn-grey-sm" onclick="send({type:'host-recheck',teamIdx:\${ti}})">Revoir</button>\`;
          }
        }
      } else if(t.mode==="square"){
        ans=\`<span class="h-ans">\${t.answer!==null&&t.answer!==undefined?LABELS[t.answer]+". "+q.opts[t.answer]:""}</span>\`;
      } else if(t.mode==="duo"){
        const duo=t.duoOpts||[];
        ans=\`<span class="h-ans">\${typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer||""}</span>\`;
      }
    } else if(t.pendingAnswer!==null&&t.pendingAnswer!==undefined){
      ans=\`<span class="h-ans" style="color:#f7934f">⏳ \${t.mode==="cash"?"« "+t.pendingAnswer+" »":LABELS[t.pendingAnswer]+". "+q.opts[t.pendingAnswer]+" (en attente confirm)"}</span>\`;
    }
    return\`<div class="h-row"><span class="h-mode">\${t.mode||"—"}</span><span class="h-team" style="color:\${t.color}">\${t.name}</span>\${ans}\${act}</div>\`;
  }).join("");

  const bonusRows=teams.map((t,ti)=>\`
    <div class="bonus-row">
      <span class="bonus-team" style="color:\${t.color}">\${t.name}</span>
      <div class="bonus-btns">
        <button class="bonus-btn bonus-min" onclick="send({type:'host-bonus',teamIdx:\${ti},pts:-1})">-1</button>
        <button class="bonus-btn" onclick="send({type:'host-bonus',teamIdx:\${ti},pts:1})">+1</button>
        <button class="bonus-btn" onclick="send({type:'host-bonus',teamIdx:\${ti},pts:2})">+2</button>
        <button class="bonus-btn" onclick="send({type:'host-bonus',teamIdx:\${ti},pts:3})">+3</button>
        <button class="bonus-btn" onclick="send({type:'host-bonus',teamIdx:\${ti},pts:5})">+5</button>
      </div>
    </div>\`).join("");

  const showQBtn=!st.questionVisible
    ?\`<button class="btn btn-dark" style="max-width:260px;padding:9px;margin-bottom:.4rem" onclick="send({type:'host-show-question'})">👁 Afficher la question</button>\`
    :\`<span class="tag tag-ready" style="display:inline-block;margin-bottom:.4rem">Question visible ✓</span>\`;

  const scToggle=\`<button class="btn-sm" onclick="send({type:'host-toggle-scores'})" style="margin-bottom:.4rem">
    \${st.scoresVisible?"🔒 Masquer scores":"👁 Afficher scores"}
  </button>\`;

  const revBtns=!st.revealed
    ?\`<button class="btn btn-gold" style="max-width:260px" \${canReveal?"":'disabled'} onclick="send({type:'host-reveal-answer'})">Révéler la bonne réponse</button>
      \${!canReveal?\`<div class="rev-hint">En attente des équipes ou fin du timer...</div>\`:""}\`
    :(!st.proofRevealed
      ?\`<button class="btn btn-gold" style="max-width:260px" onclick="send({type:'host-reveal-proof'})">📖 Révéler la preuve</button>\`
      :\`<span class="tag tag-ok">✓ Preuve révélée</span>\`);

  const fullProof=q.fullProof||q.proof;

  return\`<div class="host-panel">
    <h3>🎙️ Panneau hôte</h3>
    <div class="h-q-preview">\${q.q||"—"}</div>
    <div class="h-correct"><strong>Bonne réponse :</strong> \${q.opts&&q.ans>=0?q.opts[q.ans]:"toutes"} \${isFun?"(toutes bonnes)":""}</div>
    \${rows}
    <div class="bonus-section">
      <div class="bonus-section-title">Points bonus</div>
      \${bonusRows}
    </div>
    <div class="rev-area">
      <div style="margin-bottom:.5rem">\${scToggle}</div>
      <div class="timer-ctrl">
        <span>⏱ <span id="hTimerVal">\${timerVal}</span>s</span>
        <button class="btn-sm" onclick="send({type:'host-add-time'})">+15s</button>
        <button class="btn-sm" onclick="send({type:'host-stop-timer'})">Clôturer ⏹</button>
      </div>
      \${showQBtn}
      <div style="margin-top:.4rem">\${revBtns}</div>
      \${fullProof&&!st.proofRevealed?\`<div style="font-size:11px;color:var(--gold);margin-top:.4rem;padding:.4rem .6rem;background:#fffbe6;border-radius:8px;text-align:left;border:1px solid #f0d080"><strong>Preuve (hôte) :</strong> \${fullProof}</div>\`:""}
      <div style="margin-top:.7rem;padding-top:.6rem;border-top:1px solid #eee">
        <button class="btn btn-red" onclick="if(confirm('Clôturer et réinitialiser le quiz ?'))send({type:'host-close-quiz'})" style="max-width:260px;padding:9px">⏹ Clôturer le quiz</button>
      </div>
    </div>
  </div>\`;
}

function hostSaveCash(ti){
  const el=document.getElementById("hed"+ti);
  if(!el)return;
  send({type:"host-validate-cash",teamIdx:ti,ok:true,editedAnswer:el.value});
  editingTi=-1;render();
}

function rEnd(app){
  if(!serverState){app.innerHTML=\`<div class="card"><p>Fin</p></div>\`;return;}
  const teams=serverState.teams||[];
  const sorted=[...teams].map((t,i)=>({...t,orig:i})).sort((a,b)=>(b.score||0)-(a.score||0));
  const winner=sorted[0];
  const memberCount=winner&&winner.members&&winner.members.length?winner.members.length:1;
  const stickmen=Array.from({length:Math.max(1,memberCount)}).map((_,i)=>\`<div class="stickman" style="animation-delay:\${i*0.1}s">🕺</div>\`).join("");

  const top3=sorted.slice(0,Math.min(3,sorted.length));
  const podiumOrder=top3.length>=2?[top3[1],top3[0],top3[2]].filter(Boolean):top3;
  const podCls=top3.length>=2?["p2","p1","p3"]:["p1"];
  const podMedals=top3.length>=2?["🥈","🥇","🥉"]:["🥇"];
  const podH=top3.length>=2?[80,115,55]:[115];

  const podiumHTML=top3.length>=1?\`<div class="podium">
    \${podiumOrder.map((t,i)=>\`<div class="podium-col">
      <div class="podium-medal">\${podMedals[i]}</div>
      <div class="podium-name" style="color:\${t.color}">\${t.name}</div>
      <div class="podium-score">\${t.score||0} pts</div>
      <div class="podium-block \${podCls[i]}" style="height:\${podH[i]}px">\${t.score||0}</div>
    </div>\`).join("")}
  </div>\`:""

  const rows=sorted.map((t,rank)=>\`<div class="f-row">
    <span class="f-rank">\${MEDALS[rank]||""}</span>
    <span class="f-name" style="color:\${t.color}">\${t.name}</span>
    <span class="f-pts">\${t.score||0} pts</span>
  </div>\`).join("");

  const resetBtn=role==="host"
    ?\`<button class="btn btn-gold" style="max-width:260px;margin-top:1.2rem" onclick="send({type:'host-close-quiz'})">🔄 Nouvelle partie</button>\`
    :\`<p style="font-size:12px;color:#aaa;margin-top:1rem">En attente de l'hôte...</p>\`;

  app.innerHTML=\`<div class="final-wrap"><div class="final-card">
    <div class="final-title">Résultats <span>finaux</span></div>
    <div class="gold-line"></div>
    <div class="celebration">\${stickmen}</div>
    \${podiumHTML}\${rows}\${resetBtn}
  </div></div>\`;

  launchConfetti();
}

render();
</script>
</body>
</html>
`;
app.get("/", (req, res) => res.send(HTML));

const HOST_PIN = "2293";
const PTS = { cash: 5, square: 3, duo: 1 };
const FIXED_ORDER = [34,7,42,19,50,11,28,3,45,16,22,38,1,49,9,31,44,14,6,47,23,36,13,40,17,5,32,20,43,10,27,48,2,37,15,41,25,8,46,12,33,21,35,4,29,18,39,24,30,26,51];
const COLORS = ["#4f8ef7","#22b87a","#f7934f","#9b59b6","#e74c3c","#1abc9c"];

let game = freshGame();

function freshGame() {
  return {
    phase: "setup",
    teams: [], teamCodes: {},
    current: 0, startFrom: 0,
    qState: [],
    revealed: false, proofRevealed: false,
    questionVisible: false, scoresVisible: true,
    timerVal: 60, timerActive: false, timerDone: false, timerStarted: false
  };
}

function genCode() { return String(Math.floor(1000 + Math.random() * 9000)); }

function setupTeams(n) {
  game.teams = []; game.teamCodes = {};
  for (let i = 0; i < n; i++) {
    let code;
    do { code = genCode(); } while (game.teamCodes[code] !== undefined);
    game.teamCodes[code] = i;
    game.teams.push({ name: `Équipe ${i+1}`, color: COLORS[i % COLORS.length], code, score: 0, ready: false, members: [] });
  }
  game.phase = "waiting";
}

function startQuestion() {
  const qid = FIXED_ORDER[game.current];
  const q = QUESTIONS[qid];
  game.qState = game.teams.map(() => {
    const wrong = q.opts.filter((_, i) => i !== q.ans);
    const pick = wrong[Math.floor(Math.random() * wrong.length)];
    const duo = Math.random() > .5 ? [q.opts[q.ans], pick] : [pick, q.opts[q.ans]];
    return { mode: null, pending: null, answer: null, pendingAnswer: null, cashText: "", validated: null, duoOpts: duo };
  });
  game.revealed = false;
  game.proofRevealed = false;
  game.questionVisible = false;
  game.timerVal = 60;
  game.timerDone = false;
  game.timerStarted = false;
  // Do NOT start timer here — starts when host shows question
}

let timerInterval = null;

function startTimer() {
  stopTimer();
  game.timerActive = true;
  game.timerStarted = true;
  timerInterval = setInterval(() => {
    game.timerVal = Math.max(0, game.timerVal - 1);
    if (game.timerVal <= 0) {
      game.timerDone = true;
      game.timerActive = false;
      stopTimer();
    }
    broadcast({ type: "timer", val: game.timerVal, done: game.timerDone });
    // Auto-stop if everyone answered
    if (!game.timerDone && game.qState.every(s => s.mode && s.answer !== null)) {
      stopTimer();
      game.timerActive = false;
      broadcast({ type: "timer", val: game.timerVal, done: false });
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  game.timerActive = false;
}

function addTime(s) {
  game.timerVal += s;
  game.timerDone = false;
  if (!timerInterval) startTimer();
  broadcast({ type: "timer", val: game.timerVal, done: false });
}

function forceStopTimer() {
  stopTimer();
  game.timerVal = 0;
  game.timerDone = true;
  broadcast({ type: "timer", val: 0, done: true });
}

function doReveal() {
  stopTimer();
  game.revealed = true;
  const qid = FIXED_ORDER[game.current];
  const q = QUESTIONS[qid];
  const isFun = q.fun === true;
  game.qState.forEach((s, ti) => {
    if (isFun) return; // no points for fun question
    if (!s.mode || s.answer === null) return;
    if (s.mode === "cash") { if (s.validated === true) game.teams[ti].score += PTS.cash; }
    else if (s.mode === "square") { if (s.answer === q.ans) game.teams[ti].score += PTS.square; }
    else if (s.mode === "duo") {
      const chosen = typeof s.answer === "number" ? s.duoOpts[s.answer] : s.answer;
      if (chosen === q.opts[q.ans]) game.teams[ti].score += PTS.duo;
    }
  });
  broadcastState();
}

const clients = new Map();

function broadcast(msg) {
  const d = JSON.stringify(msg);
  wss.clients.forEach(ws => { if (ws.readyState === WebSocket.OPEN) ws.send(d); });
}

function sendTo(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
}

function buildState(forHost) {
  const qid = FIXED_ORDER[game.current];
  const q = QUESTIONS[qid];
  const isFun = q.fun === true;

  const teams = game.teams.map((t, ti) => {
    const s = game.qState[ti] || {};
    if (forHost) {
      return {
        ...t,
        mode: s.mode, pending: s.pending,
        answer: s.answer, pendingAnswer: s.pendingAnswer,
        hasAnswer: s.answer !== null,
        validated: s.validated, duoOpts: s.duoOpts
      };
    } else {
      return {
        name: t.name, color: t.color,
        score: game.scoresVisible ? t.score : null,
        ready: t.ready, code: t.code, members: t.members,
        mode: s.mode, pending: s.pending,
        hasAnswer: s.answer !== null,
        answer: game.revealed ? s.answer : null,
        validated: game.revealed ? s.validated : null,
        duoOpts: s.duoOpts
      };
    }
  });

  // Host always gets full question; participants get question only when visible
  const questionForParticipant = {
    q: game.questionVisible ? q.q : "",
    opts: q.opts, // ALWAYS send opts so teams can answer
    ans: game.revealed ? q.ans : -1,
    proof: game.proofRevealed ? q.proof : "",
    isFun
  };

  const questionForHost = {
    q: q.q,
    opts: q.opts,
    ans: game.revealed ? q.ans : -1,
    proof: game.proofRevealed ? q.proof : "",
    isFun,
    fullProof: q.proof // host always sees proof
  };

  return {
    type: "state", forHost,
    phase: game.phase,
    teams,
    current: game.current, total: FIXED_ORDER.length, qid,
    question: forHost ? questionForHost : questionForParticipant,
    questionVisible: game.questionVisible,
    revealed: game.revealed, proofRevealed: game.proofRevealed,
    scoresVisible: game.scoresVisible,
    timerVal: game.timerVal, timerDone: game.timerDone, timerStarted: game.timerStarted,
    allCodes: forHost ? game.teams.map(t => ({ name: t.name, code: t.code, color: t.color, ready: t.ready, members: t.members })) : undefined
  };
}

function broadcastState() {
  const hostData = JSON.stringify(buildState(true));
  const pubData = JSON.stringify(buildState(false));
  wss.clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) return;
    const info = clients.get(ws);
    ws.send(info && info.role === "host" ? hostData : pubData);
  });
}

function broadcastWaiting() {
  const hostPayload = { type: "waiting", phase: "waiting", allCodes: game.teams.map(t => ({ name: t.name, code: t.code, color: t.color, ready: t.ready, members: t.members })) };
  const pubPayload = { type: "waiting", phase: "waiting", teams: game.teams.map(t => ({ name: t.name, color: t.color, ready: t.ready, code: t.code })) };
  wss.clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) return;
    const info = clients.get(ws);
    sendTo(ws, info && info.role === "host" ? hostPayload : pubPayload);
  });
}

wss.on("connection", ws => {
  clients.set(ws, { role: null, teamIdx: null });

  ws.on("message", raw => {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    const info = clients.get(ws);

    switch (msg.type) {
      case "host-auth":
        if (msg.pin === HOST_PIN) {
          clients.set(ws, { role: "host", teamIdx: null });
          sendTo(ws, { type: "host-auth-ok" });
          if (game.phase === "waiting") broadcastWaiting();
          else if (game.phase === "game" || game.phase === "end") broadcastState();
        } else sendTo(ws, { type: "host-auth-fail" });
        break;

      case "host-setup":
        if (info.role !== "host") break;
        setupTeams(msg.numTeams);
        broadcastWaiting();
        break;

      case "host-start":
        if (info.role !== "host") break;
        game.phase = "game";
        game.current = Math.max(0, Math.min((msg.startFrom || 1) - 1, FIXED_ORDER.length - 1));
        startQuestion();
        broadcastState();
        break;

      case "host-show-question":
        if (info.role !== "host") break;
        game.questionVisible = true;
        startTimer(); // Timer starts NOW when question is shown
        broadcastState();
        break;

      case "host-reveal-answer":
        if (info.role !== "host") break;
        doReveal();
        break;

      case "host-reveal-proof":
        if (info.role !== "host") break;
        game.proofRevealed = true;
        broadcastState();
        break;

      case "host-next":
        if (info.role !== "host") break;
        game.current++;
        if (game.current >= FIXED_ORDER.length) {
          game.phase = "end"; stopTimer(); broadcastState();
        } else {
          startQuestion(); broadcastState();
        }
        break;

      case "host-add-time":
        if (info.role !== "host") break;
        addTime(15);
        break;

      case "host-stop-timer":
        if (info.role !== "host") break;
        forceStopTimer();
        break;

      case "host-toggle-scores":
        if (info.role !== "host") break;
        game.scoresVisible = !game.scoresVisible;
        broadcastState();
        break;

      case "host-validate-cash":
        if (info.role !== "host") break;
        if (game.qState[msg.teamIdx]) {
          game.qState[msg.teamIdx].validated = msg.ok;
          if (msg.editedAnswer) game.qState[msg.teamIdx].answer = msg.editedAnswer;
          broadcastState();
        }
        break;

      case "host-recheck":
        if (info.role !== "host") break;
        if (game.qState[msg.teamIdx]) { game.qState[msg.teamIdx].validated = null; broadcastState(); }
        break;

      case "host-bonus":
        if (info.role !== "host") break;
        if (game.teams[msg.teamIdx]) {
          game.teams[msg.teamIdx].score = Math.max(0, game.teams[msg.teamIdx].score + msg.pts);
          broadcastState();
        }
        break;

      case "host-close-quiz":
        if (info.role !== "host") break;
        stopTimer();
        game = freshGame();
        broadcast({ type: "reset" });
        break;

      case "team-auth":
        const idx = game.teamCodes[msg.code];
        if (idx !== undefined && !game.teams[idx].ready) {
          clients.set(ws, { role: "team", teamIdx: idx });
          sendTo(ws, { type: "team-auth-ok", teamIdx: idx, team: game.teams[idx] });
        } else if (idx !== undefined) {
          sendTo(ws, { type: "team-auth-fail", reason: "already-used" });
        } else {
          sendTo(ws, { type: "team-auth-fail", reason: "invalid" });
        }
        break;

      case "team-set-info":
        if (info.role !== "team") break;
        game.teams[info.teamIdx].name = msg.name.slice(0, 20);
        game.teams[info.teamIdx].members = msg.members || [];
        game.teams[info.teamIdx].ready = true;
        broadcastWaiting();
        break;

      case "team-select-mode":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        if (game.qState[info.teamIdx].mode) break;
        game.qState[info.teamIdx].pending = msg.mode;
        broadcastState();
        break;

      case "team-confirm-mode":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        const qs = game.qState[info.teamIdx];
        if (qs.pending && !qs.mode) { qs.mode = qs.pending; qs.pending = null; broadcastState(); }
        break;

      case "team-cancel-mode":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        game.qState[info.teamIdx].pending = null;
        broadcastState();
        break;

      case "team-pending-answer":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        if (game.qState[info.teamIdx].answer !== null) break;
        game.qState[info.teamIdx].pendingAnswer = msg.answer;
        broadcastState();
        break;

      case "team-confirm-answer":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        if (game.qState[info.teamIdx].answer !== null) break;
        const pa = game.qState[info.teamIdx].pendingAnswer;
        if (pa === null || pa === undefined) break;
        game.qState[info.teamIdx].answer = pa;
        if (msg.cashText) game.qState[info.teamIdx].cashText = msg.cashText;
        if (game.qState.every(s => s.mode && s.answer !== null)) stopTimer();
        broadcastState();
        break;

      case "team-cancel-answer":
        if (info.role !== "team" || !game.qState[info.teamIdx]) break;
        if (game.qState[info.teamIdx].answer !== null) break;
        game.qState[info.teamIdx].pendingAnswer = null;
        broadcastState();
        break;
    }
  });

  ws.on("close", () => clients.delete(ws));
});

const QUESTIONS = {
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
27:{q:"Quel homme, mandaté pour tuer l'oncle du Prophète ﷺ lors d'une bataille, accomplit sa mission avec un javelot avant d'embrasser l'Islam des années plus tard ?",opts:["Khabbab ibn al-Aratt","Wahshi ibn Harb","Jubayr ibn Mut'im","Ikrimah ibn Abi Jahl"],ans:1,proof:"Wahshi ibn Harb tua Hamza ibn Abd al-Muttalib à Uhud (3H) sur ordre de Hind bint Utba. Il se convertit après la conquête de La Mecque. (Sahih Bukhari)"},
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
49:{q:"Quelle est la formule arabe utilisée pour exprimer qu'Allah s'est établi sur Son Trône ?",opts:["Jalasa 'ala al-'Arsh","Istawa 'ala al-'Arsh","Fawqa 'ala al-'Arsh","Istaqarra 'ala al-'Arsh"],ans:1,proof:"Istawa 'ala al-'Arsh (استوى على العرش) — mentionnée 7 fois dans le Coran, dont Al-A'raf (7:54), Ta-Ha (20:5), Al-Furqan (25:59). Jalasa (s'asseoir), fawqa (au-dessus) et istaqarra (s'installer) sont des expressions non coraniques."},
50:{q:"Quelle personne fut la première martyre de l'Islam ?",opts:["Bilal ibn Rabah","Yasir ibn Amir","Sumayyah bint Khayyat","Khabbab ibn al-Aratt"],ans:2,proof:"Sumayyah bint Khayyat, mère d'Ammar ibn Yasir, fut tuée par Abu Jahl alors qu'elle refusait d'abjurer l'Islam. Elle est unanimement reconnue comme la première martyre de l'Islam. (Ibn Hisham, Sira)"},
51:{q:"Qui est le plus grand défenseur de la cause féminine du groupe ?",opts:["ABD","Ablaye","Abdallah ibn Kawsu","Abdoulaye"],ans:0,proof:"Question bonus — toutes les réponses sont correctes !",fun:true}
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Quiz Coran OK port " + PORT));
