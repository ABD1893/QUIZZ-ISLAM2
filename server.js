const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Quiz Coran</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,-apple-system,sans-serif;background:#f5f4f0;color:#1a1a1a;min-height:100vh;}
.wrap{padding:1rem;max-width:1200px;margin:0 auto;}
.card{background:#fff;border-radius:16px;border:1px solid #e5e3dd;padding:2rem;max-width:460px;margin:2.5rem auto;text-align:center;}
.card h1{font-size:22px;font-weight:700;margin-bottom:.3rem;}
.card h2{font-size:17px;font-weight:700;margin-bottom:.3rem;}
.card p{font-size:13px;color:#888;margin-bottom:1.4rem;line-height:1.5;}
.card-wide{background:#fff;border-radius:16px;border:1px solid #e5e3dd;padding:1.5rem;max-width:700px;margin:2rem auto;}
.card-wide h2{font-size:17px;font-weight:700;margin-bottom:1rem;text-align:center;}
.btn-primary{width:100%;padding:12px;border-radius:10px;border:none;background:#1a1a1a;color:#fff;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:10px;transition:background .15s;}
.btn-primary:hover{background:#333;}
.btn-primary:disabled{opacity:.4;cursor:default;}
.btn-secondary{width:100%;padding:11px;border-radius:10px;border:1px solid #d0cdc6;background:#fff;color:#1a1a1a;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s;margin-bottom:8px;}
.btn-secondary:hover{background:#f0ede6;}
.btn-sm{padding:7px 14px;border-radius:8px;border:1px solid #d0cdc6;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#1a1a1a;}
.btn-sm:hover{background:#f0ede6;}
.btn-sm:disabled{opacity:.4;cursor:default;}
.btn-green{padding:10px 24px;border-radius:10px;border:none;background:#1a6641;color:#fff;font-size:13px;font-weight:700;cursor:pointer;}
.btn-green:hover{background:#145535;}
.btn-green:disabled{opacity:.4;cursor:default;}
.entry-btns{display:flex;flex-direction:column;gap:10px;margin-top:.5rem;}
.entry-btn{padding:14px;border-radius:12px;border:1px solid #e0ddd6;background:#faf9f6;font-size:14px;font-weight:600;cursor:pointer;text-align:center;transition:background .15s;}
.entry-btn:hover{background:#f0ede6;}
.entry-btn .sub{font-size:11px;color:#aaa;font-weight:400;display:block;margin-top:2px;}
.pin-dots{display:flex;justify-content:center;gap:10px;margin-bottom:1rem;}
.pin-dot{width:40px;height:40px;border-radius:10px;border:1px solid #e0ddd6;background:#faf9f6;display:flex;align-items:center;justify-content:center;font-size:22px;}
.pin-dot.filled{border-color:#888;background:#f0ede6;}
.pin-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:200px;margin:0 auto 1rem;}
.pin-key{padding:12px;border-radius:10px;border:1px solid #e0ddd6;background:#faf9f6;font-size:17px;cursor:pointer;color:#1a1a1a;}
.pin-key:hover{background:#f0ede6;}
.pin-error{font-size:12px;color:#c0392b;height:16px;margin-bottom:.5rem;}
.inp{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:1rem;outline:none;text-align:center;}
.inp:focus{border-color:#888;}
.sel{width:100%;padding:10px 12px;border-radius:10px;border:1px solid #ddd;background:#faf9f6;font-size:14px;color:#1a1a1a;margin-bottom:1.2rem;}
.tag{font-size:11px;padding:3px 9px;border-radius:99px;display:inline-block;}
.tag-ready{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-wait{background:#fff8e6;color:#a07020;border:1px solid #f5d97a;}
.tag-ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.tag-ko{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.tag-ans{background:#f0f0f0;color:#444;border:1px solid #ddd;}
.team-slot{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;border-radius:10px;background:#faf9f6;border:1px solid #eee;margin-bottom:8px;flex-wrap:wrap;gap:6px;}
.slot-name{font-size:13px;font-weight:700;}
.slot-code{font-size:12px;font-family:monospace;background:#f0ede6;padding:2px 8px;border-radius:6px;}
.code-tbl{width:100%;border-collapse:collapse;margin-top:.5rem;}
.code-tbl th{font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;padding:5px 8px;text-align:left;border-bottom:1px solid #eee;}
.code-tbl td{padding:7px 8px;font-size:13px;border-bottom:1px solid #f5f5f5;}
.code-pill{font-family:monospace;font-weight:700;font-size:15px;background:#f0ede6;padding:3px 12px;border-radius:6px;}
.game-header{text-align:center;margin-bottom:.7rem;}
.game-header h1{font-size:19px;font-weight:700;}
.game-header .prog{font-size:12px;color:#888;margin-top:2px;}
.timer-wrap{background:#eee;border-radius:99px;height:8px;margin-bottom:.5rem;overflow:hidden;}
.timer-bar{height:8px;border-radius:99px;transition:width 1s linear,background .5s;}
.timer-num{text-align:center;font-size:14px;font-weight:700;margin-bottom:.7rem;}
.scores-bar{display:grid;gap:8px;margin-bottom:.8rem;}
.sc-card{background:#fff;border-radius:12px;border:1px solid #e5e3dd;padding:.5rem .8rem;text-align:center;}
.sc-card .scn{font-size:11px;font-weight:700;margin-bottom:1px;}
.sc-card .scv{font-size:19px;font-weight:700;}
.q-box{background:#fff;border-radius:14px;border:1px solid #e5e3dd;padding:1.1rem 1.4rem;margin-bottom:.8rem;text-align:center;}
.q-num{font-size:10px;color:#aaa;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px;}
.q-text{font-size:14px;font-weight:700;line-height:1.6;}
.proof-box{background:#f0faf5;border-radius:12px;border:1px solid #b0e0c8;padding:.9rem 1.1rem;margin-bottom:.8rem;font-size:12px;color:#1a4a30;line-height:1.6;}
.teams-grid{display:grid;gap:8px;margin-bottom:.8rem;}
.t-card{background:#fff;border-radius:13px;border:1px solid #e5e3dd;padding:.8rem;border-top:3px solid #ccc;}
.t-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.t-name{font-size:13px;font-weight:700;}
.t-score{font-size:12px;color:#888;}
.mode-btn{width:100%;padding:9px 10px;border-radius:10px;border:1px solid #e0ddd6;background:#faf9f6;font-size:12px;cursor:pointer;text-align:left;color:#1a1a1a;margin-bottom:5px;}
.mode-btn:hover{background:#f0ede6;}
.mode-btn .pts{float:right;font-weight:700;}
.mode-lbl{font-size:10px;padding:2px 7px;border-radius:99px;border:1px solid #e0ddd6;color:#888;margin-bottom:6px;display:inline-block;}
.mode-confirm{background:#faf9f6;border-radius:10px;border:1px solid #eee;padding:9px 11px;text-align:center;}
.mode-confirm p{font-size:12px;color:#444;margin-bottom:7px;}
.confirm-row{display:flex;gap:7px;justify-content:center;}
.btn-conf{padding:6px 16px;border-radius:8px;border:none;background:#1a1a1a;color:#fff;font-size:12px;font-weight:700;cursor:pointer;}
.btn-canc{padding:6px 12px;border-radius:8px;border:1px solid #ccc;background:#fff;font-size:12px;cursor:pointer;color:#555;}
.opt-btn{width:100%;padding:7px 10px;border-radius:10px;border:1px solid #e0ddd6;background:#faf9f6;font-size:12px;cursor:pointer;text-align:left;color:#1a1a1a;margin-bottom:4px;line-height:1.3;}
.opt-btn:hover:not(:disabled){background:#f0ede6;}
.opt-btn:disabled{cursor:default;opacity:.6;}
.opt-btn.sel{background:#eef3ff;border-color:#b0c4f7;opacity:1;}
.opt-btn.correct{background:#e6f9f0;border-color:#5ecb9a;color:#1a6641;opacity:1;font-weight:700;}
.opt-btn.wrong{background:#fdecea;border-color:#f5a0a0;color:#8b1a1a;opacity:1;}
.cash-inp{width:100%;padding:8px 10px;border-radius:10px;border:1px solid #e0ddd6;background:#faf9f6;font-size:13px;color:#1a1a1a;margin-bottom:5px;outline:none;}
.cash-inp:focus{border-color:#888;}
.cash-sub{width:100%;padding:7px;border-radius:10px;border:none;background:#1a1a1a;font-size:12px;cursor:pointer;color:#fff;font-weight:700;}
.host-panel{background:#fff;border-radius:13px;border:1px solid #e5e3dd;padding:.9rem;margin-top:.7rem;}
.host-panel h3{font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.05em;margin-bottom:.7rem;}
.h-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;padding:8px 10px;background:#faf9f6;border-radius:9px;border:1px solid #eee;flex-wrap:wrap;}
.h-mode{font-size:10px;color:#aaa;min-width:44px;text-transform:uppercase;}
.h-team{font-size:12px;font-weight:700;min-width:75px;}
.h-ans{font-size:12px;color:#333;flex:1;font-style:italic;}
.h-inp{padding:4px 7px;font-size:12px;border-radius:7px;border:1px solid #ccc;background:#fff;color:#1a1a1a;width:130px;}
.h-edit{padding:4px 8px;font-size:11px;border-radius:7px;border:1px solid #d0cdc6;background:#fff;cursor:pointer;color:#333;margin-left:3px;}
.h-val{padding:4px 8px;font-size:11px;border-radius:7px;border:1px solid #5ecb9a;background:#e6f9f0;color:#1a6641;cursor:pointer;margin-left:3px;}
.h-inv{padding:4px 8px;font-size:11px;border-radius:7px;border:1px solid #f5a0a0;background:#fdecea;color:#8b1a1a;cursor:pointer;margin-left:3px;}
.h-correct{font-size:12px;color:#1a4a30;padding:7px 10px;background:#f0faf5;border-radius:8px;border:1px solid #b0e0c8;margin-bottom:.7rem;}
.rev-area{text-align:center;margin-top:.8rem;padding-top:.8rem;border-top:1px solid #eee;}
.rev-hint{font-size:11px;color:#aaa;margin-top:4px;}
.timer-ctrl{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:.6rem;}
.timer-ctrl span{font-size:12px;color:#666;}
.host-toggle{text-align:center;margin-top:.4rem;}
.host-toggle button{font-size:11px;color:#bbb;background:none;border:none;cursor:pointer;text-decoration:underline;}
.final-card{background:#fff;border-radius:14px;border:1px solid #e5e3dd;padding:2rem;max-width:480px;margin:2rem auto;text-align:center;}
.final-card h2{font-size:20px;font-weight:700;margin-bottom:1.5rem;}
.f-row{display:flex;align-items:center;justify-content:space-between;padding:12px 1rem;border-radius:10px;margin-bottom:7px;background:#faf9f6;border:1px solid #eee;}
.f-rank{font-size:22px;min-width:34px;}
.f-name{font-size:15px;font-weight:700;}
.f-pts{font-size:13px;color:#666;}
.conn-status{position:fixed;bottom:10px;right:10px;font-size:11px;padding:4px 10px;border-radius:99px;background:#f0faf5;color:#1a6641;border:1px solid #5ecb9a;}
.conn-status.off{background:#fdecea;color:#8b1a1a;border-color:#f5a0a0;}
@media(max-width:680px){.teams-grid{grid-template-columns:1fr!important;}.q-text{font-size:13px;}}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn-status" id="connStatus">Connexion...</div>

<script>
const LABELS = ["A","B","C","D"];
const MEDALS = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣"];

// ══════════════════════════════════════
// CLIENT STATE
// ══════════════════════════════════════
let role = null;        // "host" | "team" | null
let myTeamIdx = null;
let myTeamInfo = null;
let serverState = null;
let phase = "entry";    // entry | host-pin | host-setup | team-pin | team-name | waiting | game | end
let pinEntry = "";
let pinError = "";
let teamNameInput = "";
let editingTi = -1;
let hostPanelOpen = false;
let cashInputVal = "";
let numTeams = 3;
let myTeamNameInput = "";

// ══════════════════════════════════════
// WEBSOCKET
// ══════════════════════════════════════
const proto = location.protocol === "https:" ? "wss:" : "ws:";
const ws = new WebSocket(\`\${proto}//\${location.host}\`);

ws.onopen = () => {
  document.getElementById("connStatus").textContent = "Connecté";
  document.getElementById("connStatus").classList.remove("off");
};
ws.onclose = () => {
  document.getElementById("connStatus").textContent = "Déconnecté — rechargez";
  document.getElementById("connStatus").classList.add("off");
};
ws.onerror = () => {
  document.getElementById("connStatus").textContent = "Erreur réseau";
  document.getElementById("connStatus").classList.add("off");
};

ws.onmessage = (evt) => {
  const msg = JSON.parse(evt.data);

  if (msg.type === "reset") { location.reload(); return; }

  if (msg.type === "host-auth-ok") { role = "host"; phase = "host-setup"; render(); return; }
  if (msg.type === "host-auth-fail") { pinError = "Code incorrect"; pinEntry = ""; render(); return; }

  if (msg.type === "team-auth-ok") {
    role = "team"; myTeamIdx = msg.teamIdx; myTeamInfo = msg.team;
    phase = "team-name"; render(); return;
  }
  if (msg.type === "team-auth-fail") {
    pinError = msg.reason === "already-used" ? "Code déjà utilisé" : "Code invalide";
    pinEntry = ""; render(); return;
  }

  if (msg.type === "timer") {
    updateTimerDisplay(msg.val, msg.done); return;
  }

  if (msg.type === "state") {
    serverState = msg;
    // Sync phase
    if (msg.phase === "waiting" && phase !== "team-name") phase = "waiting";
    if (msg.phase === "game") phase = "game";
    if (msg.phase === "end") phase = "end";
    render();
  }
};

function send(obj) { if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj)); }

// ══════════════════════════════════════
// TIMER DISPLAY (live update without full re-render)
// ══════════════════════════════════════
function updateTimerDisplay(val, done) {
  const bar = document.getElementById("timerBar");
  const num = document.getElementById("timerNum");
  if (!bar || !num) return;
  const pct = Math.max(0, (val / 45) * 100);
  const color = val > 20 ? "#22b87a" : val > 10 ? "#f7934f" : "#e74c3c";
  bar.style.width = pct + "%";
  bar.style.background = color;
  num.textContent = val + "s";
  num.style.color = color;
  // Also update host state display
  const tspan = document.getElementById("hostTimerVal");
  if (tspan) tspan.textContent = val + "s";
}

// ══════════════════════════════════════
// ACTIONS
// ══════════════════════════════════════
// HOST
function hostPinPress(d) {
  if (pinEntry.length >= 4) return;
  pinEntry += d;
  if (pinEntry.length === 4) { send({ type:"host-auth", pin: pinEntry }); pinEntry = ""; }
  render();
}
function hostPinDel() { if (pinEntry.length > 0) { pinEntry = pinEntry.slice(0,-1); render(); } }

function hostCreateGame() { send({ type:"host-setup", numTeams }); }
function hostStart() { send({ type:"host-start" }); }
function hostReveal() { send({ type:"host-reveal" }); }
function hostNext() { send({ type:"host-next" }); editingTi = -1; }
function hostAddTime() { send({ type:"host-add-time" }); }
function hostValidate(ti, ok, edited) { send({ type:"host-validate-cash", teamIdx:ti, ok, editedAnswer: edited||null }); }
function hostRecheck(ti) { send({ type:"host-recheck", teamIdx:ti }); }
function hostReset() { if(confirm("Recommencer une nouvelle partie ?")) send({ type:"host-reset" }); }

// TEAM
function teamPinPress(d) {
  if (pinEntry.length >= 4) return;
  pinEntry += d;
  if (pinEntry.length === 4) { send({ type:"team-auth", code: pinEntry }); }
  render();
}
function teamPinDel() { if (pinEntry.length > 0) { pinEntry = pinEntry.slice(0,-1); render(); } }

function confirmTeamName() {
  const name = myTeamNameInput.trim();
  if (!name) return;
  send({ type:"team-set-name", name });
  phase = "waiting";
  render();
}

function teamSelectMode(m) { send({ type:"team-select-mode", mode:m }); }
function teamConfirmMode() { send({ type:"team-confirm-mode" }); }
function teamCancelMode() { send({ type:"team-cancel-mode" }); }
function teamChooseOpt(oi) { send({ type:"team-answer", answer:oi }); }
function teamSubmitCash() {
  const v = cashInputVal.trim();
  if (!v) return;
  send({ type:"team-answer", answer:v, cashText:v });
}

// ══════════════════════════════════════
// RENDER
// ══════════════════════════════════════
function render() {
  const app = document.getElementById("app");
  if (phase === "entry") renderEntry(app);
  else if (phase === "host-pin") renderPin(app, "Accès hôte", "Entrez votre code hôte", hostPinPress, hostPinDel);
  else if (phase === "host-setup") renderHostSetup(app);
  else if (phase === "team-pin") renderPin(app, "Rejoindre une équipe", "Saisissez le code reçu de l'hôte", teamPinPress, teamPinDel);
  else if (phase === "team-name") renderTeamName(app);
  else if (phase === "waiting") renderWaiting(app);
  else if (phase === "game") renderGame(app);
  else if (phase === "end") renderEnd(app);
}

function renderEntry(app) {
  app.innerHTML = \`
    <div class="card">
      <h1>Quiz Coran</h1>
      <p>50 questions · Islam & Sciences islamiques</p>
      <div class="entry-btns">
        <div class="entry-btn" onclick="phase='team-pin';pinEntry='';pinError='';render()">
          Rejoindre une équipe
          <span class="sub">Saisir le code reçu de l'hôte</span>
        </div>
        <div class="entry-btn" onclick="phase='host-pin';pinEntry='';pinError='';render()">
          Je suis l'hôte
          <span class="sub">Configurer et lancer la partie</span>
        </div>
      </div>
    </div>\`;
}

function renderPin(app, title, subtitle, onPress, onDel) {
  const dots = [0,1,2,3].map(i=>\`<div class="pin-dot\${i<pinEntry.length?' filled':''}">\${i<pinEntry.length?'●':''}</div>\`).join("");
  const pad = [1,2,3,4,5,6,7,8,9].map(n=>\`<button class="pin-key" onclick="(\${onPress.name})('\${n}')">\${n}</button>\`).join("");
  app.innerHTML = \`
    <div class="card">
      <h2>\${title}</h2><p>\${subtitle}</p>
      <div class="pin-dots">\${dots}</div>
      <div class="pin-pad">\${pad}<button class="pin-key" onclick="\${onDel.name}()">⌫</button><button class="pin-key" onclick="\${onPress.name}('0')">0</button><div></div></div>
      <div class="pin-error">\${pinError}</div>
      <button class="btn-secondary" onclick="phase='entry';pinEntry='';pinError='';render()">Retour</button>
    </div>\`;
}

function renderHostSetup(app) {
  app.innerHTML = \`
    <div class="card">
      <h2>Configuration hôte</h2>
      <p>Définissez le nombre d'équipes et créez la partie.</p>
      <label style="font-size:13px;font-weight:600;color:#444;display:block;text-align:left;margin-bottom:.4rem">Nombre d'équipes</label>
      <select class="sel" onchange="numTeams=parseInt(this.value)">
        <option value="2">2 équipes</option>
        <option value="3" selected>3 équipes</option>
        <option value="4">4 équipes</option>
        <option value="5">5 équipes</option>
        <option value="6">6 équipes</option>
      </select>
      <button class="btn-primary" onclick="hostCreateGame()">Créer la partie</button>
    </div>\`;
}

function renderTeamName(app) {
  app.innerHTML = \`
    <div class="card">
      <h2>Bienvenue !</h2>
      <p>Choisissez le nom de votre équipe</p>
      <input class="inp" placeholder="Nom de l'équipe..." maxlength="20"
        oninput="myTeamNameInput=this.value"
        onkeydown="if(event.key==='Enter')confirmTeamName()" autofocus/>
      <button class="btn-primary" onclick="confirmTeamName()">Confirmer</button>
    </div>\`;
  setTimeout(()=>{ const el=app.querySelector('.inp'); if(el)el.focus(); },80);
}

function renderWaiting(app) {
  if (!serverState) {
    app.innerHTML=\`<div class="card"><h2>En attente...</h2><p>Connexion au serveur en cours...</p></div>\`; return;
  }
  const teams = serverState.teams || [];
  const slots = teams.map((t,i)=>\`
    <div class="team-slot">
      <span class="slot-name" style="color:\${t.color}">\${t.name}</span>
      <span class="slot-code">\${t.code}</span>
      <span class="tag \${t.ready?'tag-ready':'tag-wait'}">\${t.ready?'Prête':'En attente'}</span>
    </div>\`).join("");
  const allReady = teams.length > 0 && teams.every(t=>t.ready);

  const hostSection = role === "host" ? \`
    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #eee">
      <div style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:.04em;margin-bottom:.6rem">Codes des équipes</div>
      <table class="code-tbl">
        <tr><th>Équipe</th><th>Code</th><th>Statut</th></tr>
        \${teams.map(t=>\`<tr>
          <td style="color:\${t.color};font-weight:700">\${t.name}</td>
          <td><span class="code-pill">\${t.code}</span></td>
          <td>\${t.ready?'<span class="tag tag-ready">Prête</span>':'<span class="tag tag-wait">En attente</span>'}</td>
        </tr>\`).join("")}
      </table>
      <div style="text-align:center;margin-top:1rem">
        \${allReady
          ? \`<button class="btn-green" onclick="hostStart()">Lancer la partie !</button>\`
          : \`<div style="font-size:12px;color:#aaa;margin-top:.5rem">En attente de toutes les équipes...</div>\`}
        <div style="margin-top:.8rem"><button class="btn-sm" onclick="hostReset()">Réinitialiser</button></div>
      </div>
    </div>\` : "";

  const joinBtn = role !== "host" ? \`<div style="text-align:center;margin-top:.8rem">
    <button class="btn-sm" onclick="phase='team-pin';pinEntry='';pinError='';render()">Changer de code</button>
  </div>\` : "";

  app.innerHTML = \`
    <div class="card-wide">
      <h2>Salle d'attente</h2>
      <p style="text-align:center;font-size:13px;color:#888;margin-bottom:1rem">
        \${role==="host" ? "Distribuez les codes. Les équipes rejoignent via leur écran." : "En attente du lancement par l'hôte..."}
      </p>
      \${slots}
      \${joinBtn}
      \${hostSection}
    </div>\`;
}

function renderGame(app) {
  if (!serverState) { app.innerHTML=\`<div class="card"><h2>Chargement...</h2></div>\`; return; }
  const st = serverState;
  const teams = st.teams || [];
  const q = st.question;
  const timerPct = Math.max(0,(st.timerVal/45)*100);
  const timerColor = st.timerVal>20?"#22b87a":st.timerVal>10?"#f7934f":"#e74c3c";

  const scBar = \`<div class="scores-bar" style="grid-template-columns:repeat(\${teams.length},1fr)">\` +
    teams.map(t=>\`<div class="sc-card"><div class="scn" style="color:\${t.color}">\${t.name}</div><div class="scv">\${t.score}</div></div>\`).join("") + \`</div>\`;

  const proofBox = st.revealed ? \`<div class="proof-box"><strong>Preuve :</strong> \${q.proof}</div>\` : "";
  const nextBtn = st.revealed && role==="host" ? \`<div style="text-align:center;margin-bottom:.5rem"><button class="btn-green" onclick="hostNext()">\${st.current<st.total-1?'Question suivante →':'Voir les résultats'}</button></div>\` : "";

  const cols = Math.min(teams.length, 3);
  const cards = \`<div class="teams-grid" style="grid-template-columns:repeat(\${cols},minmax(0,1fr))">\` +
    teams.map((t,ti)=>renderTeamCard(t,ti,q,st.revealed,role==="host")).join("") + \`</div>\`;

  const hostPanelHTML = role==="host" ? \`
    <div class="host-toggle"><button onclick="hostPanelOpen=!hostPanelOpen;render()">\${hostPanelOpen?'Masquer panneau hôte':'Panneau hôte ▲'}</button></div>
    \${hostPanelOpen ? renderHostPanel(teams, q, st) : ""}\` : "";

  app.innerHTML = \`
    <div class="game-header"><h1>Quiz Coran</h1><div class="prog">Q\${st.current+1}/\${st.total} · N°\${st.qid}</div></div>
    \${scBar}
    <div class="timer-wrap"><div class="timer-bar" id="timerBar" style="width:\${timerPct}%;background:\${timerColor}"></div></div>
    <div class="timer-num" id="timerNum" style="color:\${timerColor}">\${st.timerVal}s</div>
    <div class="q-box"><div class="q-num">Question \${st.current+1}</div><div class="q-text">\${q.q}</div></div>
    \${proofBox}
    \${cards}
    \${nextBtn}
    \${hostPanelHTML}\`;
}

function renderTeamCard(t, ti, q, revealed, isHost) {
  const s = t; // team object has mode, pending, hasAnswer, answer, validated, duoOpts
  const isMyTeam = (role === "team" && ti === myTeamIdx);
  let inner = "";

  if (!s.mode && !s.pending) {
    if (isMyTeam) {
      inner = \`<div>
        <button class="mode-btn" onclick="teamSelectMode('cash')">Cash — réponse libre <span class="pts" style="color:#c0392b">5 pts</span></button>
        <button class="mode-btn" onclick="teamSelectMode('square')">Carré — 4 choix <span class="pts" style="color:#2980b9">3 pts</span></button>
        <button class="mode-btn" onclick="teamSelectMode('duo')">Duo — 2 choix <span class="pts" style="color:#27ae60">1 pt</span></button>
      </div>\`;
    } else {
      inner = \`<div style="font-size:12px;color:#bbb;padding:6px 0">Choix du mode...</div>\`;
    }
  } else if (s.pending && !s.mode) {
    const lbls = {cash:"Cash — 5 pts", square:"Carré — 3 pts", duo:"Duo — 1 pt"};
    if (isMyTeam) {
      inner = \`<div class="mode-confirm">
        <p>Confirmer <strong>\${lbls[s.pending]}</strong> ?</p>
        <div class="confirm-row">
          <button class="btn-canc" onclick="teamCancelMode()">Changer</button>
          <button class="btn-conf" onclick="teamConfirmMode()">Confirmer</button>
        </div>
      </div>\`;
    } else {
      inner = \`<div style="font-size:12px;color:#bbb;padding:6px 0">En cours de choix...</div>\`;
    }
  } else if (s.mode) {
    const modeLbls = {cash:"Cash · 5 pts", square:"Carré · 3 pts", duo:"Duo · 1 pt"};
    const lbl = \`<span class="mode-lbl">\${modeLbls[s.mode]}</span><br/>\`;

    if (!s.hasAnswer) {
      if (isMyTeam) {
        if (s.mode === "cash") {
          inner = lbl + \`<input class="cash-inp" placeholder="Votre réponse..." oninput="cashInputVal=this.value" onkeydown="if(event.key==='Enter')teamSubmitCash()"/>
            <button class="cash-sub" onclick="teamSubmitCash()">Valider</button>\`;
        } else if (s.mode === "square") {
          inner = lbl + q.opts.map((opt,oi)=>\`<button class="opt-btn" onclick="teamChooseOpt(\${oi})">\${LABELS[oi]}. \${opt}</button>\`).join("");
        } else if (s.mode === "duo") {
          const duo = s.duoOpts || [q.opts[q.ans], q.opts[(q.ans+1)%q.opts.length]];
          inner = lbl + duo.map((opt,oi)=>\`<button class="opt-btn" onclick="teamChooseOpt(\${oi})">\${LABELS[oi]}. \${opt}</button>\`).join("");
        }
      } else {
        inner = lbl + \`<div style="font-size:12px;color:#bbb;padding:6px 0">En train de répondre...</div>\`;
      }
    } else {
      // Has answered
      if (s.mode === "cash") {
        const tag = revealed ? (s.validated===true?\`<span class="tag tag-ok">Correct +5</span>\`:\`<span class="tag tag-ko">Incorrect</span>\`) : \`<span class="tag tag-wait">En attente hôte...</span>\`;
        inner = lbl + \`<div style="font-size:13px;padding:6px 0;color:#333">\${revealed&&s.answer?'« '+s.answer+' »':'Réponse envoyée...'}</div>\${tag}\`;
      } else if (s.mode === "square") {
        const btns = q.opts.map((opt,oi)=>{
          let cls="opt-btn";
          if(revealed){if(oi===q.ans)cls+=" correct";else if(s.answer!==null&&oi===s.answer)cls+=" wrong";}
          else if(s.answer!==null&&oi===s.answer)cls+=" sel";
          return \`<button class="\${cls}" disabled>\${LABELS[oi]}. \${opt}</button>\`;
        }).join("");
        const tag = revealed?(s.answer===q.ans?\`<span class="tag tag-ok">Correct +3</span>\`:\`<span class="tag tag-ko">Incorrect</span>\`):\`<span class="tag tag-ans">Répondu</span>\`;
        inner = lbl+btns+tag;
      } else if (s.mode === "duo") {
        const duo = s.duoOpts || [];
        const btns = duo.map((opt,oi)=>{
          let cls="opt-btn";
          if(revealed){if(opt===q.opts[q.ans])cls+=" correct";else if(s.answer!==null&&oi===s.answer)cls+=" wrong";}
          else if(s.answer!==null&&oi===s.answer)cls+=" sel";
          return \`<button class="\${cls}" disabled>\${LABELS[oi]}. \${opt}</button>\`;
        }).join("");
        const chosen = typeof s.answer==="number"&&duo[s.answer]?duo[s.answer]:s.answer;
        const isOk = chosen===q.opts[q.ans];
        const tag = revealed?(isOk?\`<span class="tag tag-ok">Correct +1</span>\`:\`<span class="tag tag-ko">Incorrect</span>\`):\`<span class="tag tag-ans">Répondu</span>\`;
        inner = lbl+btns+tag;
      }
    }
  }

  return \`<div class="t-card" style="border-top-color:\${t.color}">
    <div class="t-head"><span class="t-name" style="color:\${t.color}">\${t.name}</span><span class="t-score">\${t.score} pts</span></div>
    \${inner}
  </div>\`;
}

function renderHostPanel(teams, q, st) {
  const allAnswered = teams.every(t=>t.hasAnswer);
  const allCashOk = teams.every(t=>t.mode!=="cash"||(t.validated!==null&&t.validated!==undefined));
  const canReveal = (allAnswered||st.timerDone) && allCashOk && !st.revealed;

  const rows = teams.map((t,ti)=>{
    if (!t.mode) return \`<div class="h-row"><span class="h-mode">—</span><span class="h-team" style="color:\${t.color}">\${t.name}</span><span style="color:#bbb;font-size:12px">Choix du mode...</span></div>\`;
    let ans=\`<span style="color:#bbb;font-size:12px">En attente...</span>\`, act="";
    if (t.hasAnswer) {
      if (t.mode==="cash") {
        if (editingTi===ti) {
          ans=\`<input class="h-inp" id="hed\${ti}" value="\${t.answer||''}" onkeydown="if(event.key==='Enter'){hostValidate(\${ti},true,document.getElementById('hed\${ti}').value);editingTi=-1;render()}"/>\`;
          act=\`<button class="h-edit" onclick="hostValidate(\${ti},true,document.getElementById('hed\${ti}').value);editingTi=-1;render()">OK</button>\`;
        } else {
          ans=\`<span class="h-ans">« \${t.answer||'...'} »</span>\`;
          if (t.validated===null||t.validated===undefined) {
            act=\`<button class="h-edit" onclick="editingTi=\${ti};render()">Modifier</button>
              <button class="h-val" onclick="hostValidate(\${ti},true)">Valider</button>
              <button class="h-inv" onclick="hostValidate(\${ti},false)">Invalider</button>\`;
          } else {
            act=(t.validated?\`<span class="tag tag-ok" style="font-size:10px">Validé</span>\`:\`<span class="tag tag-ko" style="font-size:10px">Invalidé</span>\`)+
              \`<button class="h-edit" onclick="hostRecheck(\${ti})">Revoir</button>\`;
          }
        }
      } else if (t.mode==="square") {
        ans=\`<span class="h-ans">\${t.answer!==null?LABELS[t.answer]+'. '+q.opts[t.answer]:''}</span>\`;
      } else if (t.mode==="duo") {
        const duo=t.duoOpts||[];
        ans=\`<span class="h-ans">\${typeof t.answer==="number"&&duo[t.answer]?duo[t.answer]:t.answer||''}</span>\`;
      }
    }
    return \`<div class="h-row"><span class="h-mode">\${t.mode||'—'}</span><span class="h-team" style="color:\${t.color}">\${t.name}</span>\${ans}\${act}</div>\`;
  }).join("");

  const revBtn = !st.revealed ? \`<div class="rev-area">
    <div class="timer-ctrl">
      <span>Timer : <span id="hostTimerVal">\${st.timerVal}</span>s</span>
      <button class="btn-sm" onclick="hostAddTime()">+15s</button>
    </div>
    <button class="btn-green" \${canReveal?'':'disabled'} onclick="hostReveal()">Révéler les réponses + preuve</button>
    \${!canReveal?\`<div class="rev-hint">\${!allAnswered&&!st.timerDone?'En attente des équipes / fin du timer...':!allCashOk?'Validez les réponses cash d\'abord':''}</div>\`:''}
  </div>\` : \`<div class="rev-area"><span class="tag tag-ok">Réponses révélées</span></div>\`;

  return \`<div class="host-panel">
    <h3>Panneau hôte</h3>
    <div class="h-correct"><strong>Bonne réponse :</strong> \${q.opts[q.ans]}</div>
    \${rows}\${revBtn}
  </div>\`;
}

function renderEnd(app) {
  if (!serverState) { app.innerHTML=\`<div class="card"><h2>Fin de partie</h2></div>\`; return; }
  const teams = serverState.teams || [];
  const sorted = [...teams].map((t,i)=>({...t,origIdx:i})).sort((a,b)=>b.score-a.score);
  const rows = sorted.map((t,rank)=>\`
    <div class="f-row">
      <span class="f-rank">\${MEDALS[rank]||''}</span>
      <span class="f-name" style="color:\${t.color}">\${t.name}</span>
      <span class="f-pts">\${t.score} pts</span>
    </div>\`).join("");
  const resetBtn = role==="host" ? \`<button class="btn-primary" style="margin-top:1.5rem" onclick="hostReset()">Nouvelle partie</button>\` : \`<p style="margin-top:1rem;font-size:13px;color:#888">En attente de l'hôte...</p>\`;
  app.innerHTML = \`<div style="padding:2rem 0"><div class="final-card">
    <h2>Résultats finaux</h2>\${rows}\${resetBtn}
  </div></div>\`;
}

render();
</script>
</body>
</html>
`);
});

// ═══════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════
const HOST_PIN = "2293";
const PTS = { cash: 5, square: 3, duo: 1 };
const FIXED_ORDER = [34,7,42,19,50,11,28,3,45,16,22,38,1,49,9,31,44,14,6,47,23,36,13,40,17,5,32,20,43,10,27,48,2,37,15,41,25,8,46,12,33,21,35,4,29,18,39,24,30,26];

let game = createFreshGame();

function createFreshGame() {
  return {
    phase: "waiting",      // waiting | game | end
    numTeams: 3,
    teams: [],             // [{name, color, code, score}]
    teamCodes: {},         // code -> teamIdx
    current: 0,
    questionState: [],     // per team: {mode, pending, answer, cashText, validated, duoOpts}
    revealed: false,
    timerVal: 45,
    timerActive: false,
    timerDone: false,
  };
}

const COLORS = ["#4f8ef7","#22b87a","#f7934f","#9b59b6","#e74c3c","#1abc9c"];

function genCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function setupTeams(n) {
  game.teams = [];
  game.teamCodes = {};
  for (let i = 0; i < n; i++) {
    let code;
    do { code = genCode(); } while (game.teamCodes[code] !== undefined);
    game.teamCodes[code] = i;
    game.teams.push({ name: `Équipe ${i+1}`, color: COLORS[i % COLORS.length], code, score: 0, ready: false });
  }
}

function startQuestion() {
  game.questionState = game.teams.map((t, ti) => {
    const q = FIXED_ORDER[game.current];
    const wrongOpts = QUESTIONS[q].opts.filter((_,i) => i !== QUESTIONS[q].ans);
    const pick = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
    const duo = Math.random() > 0.5
      ? [QUESTIONS[q].opts[QUESTIONS[q].ans], pick]
      : [pick, QUESTIONS[q].opts[QUESTIONS[q].ans]];
    return { mode: null, pending: null, answer: null, cashText: "", validated: null, duoOpts: duo };
  });
  game.revealed = false;
  game.timerVal = 45;
  game.timerDone = false;
  startTimer();
}

// ─── TIMER ───
let timerInterval = null;

function startTimer() {
  stopTimer();
  game.timerActive = true;
  timerInterval = setInterval(() => {
    game.timerVal--;
    if (game.timerVal <= 0) {
      game.timerVal = 0;
      game.timerDone = true;
      game.timerActive = false;
      stopTimer();
    }
    broadcast({ type: "timer", val: game.timerVal, done: game.timerDone });
    // auto-stop if all answered
    const all = game.questionState.every(s => s.mode && s.answer !== null);
    if (all) { stopTimer(); game.timerActive = false; broadcast({ type: "timer", val: game.timerVal, done: false }); }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  game.timerActive = false;
}

function addTime(secs) {
  game.timerVal += secs;
  game.timerDone = false;
  if (!timerInterval) startTimer();
  broadcast({ type: "timer", val: game.timerVal, done: false });
}

// ─── REVEAL ───
function doReveal() {
  stopTimer();
  game.revealed = true;
  const qid = FIXED_ORDER[game.current];
  const q = QUESTIONS[qid];
  game.questionState.forEach((s, ti) => {
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

// ─── BROADCAST ───
const clients = new Map(); // ws -> { role: "host"|"team", teamIdx: number|null }

function broadcast(msg) {
  const data = JSON.stringify(msg);
  wss.clients.forEach(ws => { if (ws.readyState === WebSocket.OPEN) ws.send(data); });
}

function broadcastState() {
  const qid = FIXED_ORDER[game.current];
  const q = QUESTIONS[qid];

  // Build per-team public view (hide answers until revealed)
  const teamsPublic = game.teams.map((t, ti) => {
    const s = game.questionState[ti] || {};
    return {
      name: t.name,
      color: t.color,
      score: t.score,
      mode: s.mode,
      pending: s.pending,
      hasAnswer: s.answer !== null,
      answer: game.revealed ? s.answer : null,
      validated: game.revealed ? s.validated : null,
      duoOpts: s.duoOpts,
    };
  });

  // Host gets full data
  const hostMsg = JSON.stringify({
    type: "state",
    role: "host",
    phase: game.phase,
    teams: game.teams.map((t,ti) => {
      const s = game.questionState[ti] || {};
      return { ...t, mode: s.mode, answer: s.answer, validated: s.validated, duoOpts: s.duoOpts };
    }),
    current: game.current,
    total: FIXED_ORDER.length,
    qid,
    question: q,
    revealed: game.revealed,
    timerVal: game.timerVal,
    timerDone: game.timerDone,
  });

  // Participants get limited data
  const pubMsg = JSON.stringify({
    type: "state",
    role: "participant",
    phase: game.phase,
    teams: teamsPublic,
    current: game.current,
    total: FIXED_ORDER.length,
    qid,
    question: { q: q.q, opts: q.opts, ans: game.revealed ? q.ans : -1, proof: game.revealed ? q.proof : "" },
    revealed: game.revealed,
    timerVal: game.timerVal,
    timerDone: game.timerDone,
  });

  wss.clients.forEach(ws => {
    if (ws.readyState !== WebSocket.OPEN) return;
    const info = clients.get(ws);
    if (info && info.role === "host") ws.send(hostMsg);
    else ws.send(pubMsg);
  });
}

// ═══════════════════════════════════════════
// WEBSOCKET MESSAGES
// ═══════════════════════════════════════════
wss.on("connection", ws => {
  clients.set(ws, { role: null, teamIdx: null });

  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    const info = clients.get(ws);

    switch (msg.type) {

      // ── AUTH ──
      case "host-auth":
        if (msg.pin === HOST_PIN) {
          clients.set(ws, { role: "host", teamIdx: null });
          ws.send(JSON.stringify({ type: "host-auth-ok" }));
          broadcastState();
        } else {
          ws.send(JSON.stringify({ type: "host-auth-fail" }));
        }
        break;

      case "team-auth":
        const idx = game.teamCodes[msg.code];
        if (idx !== undefined && !game.teams[idx].ready) {
          game.teams[idx].ready = true;
          clients.set(ws, { role: "team", teamIdx: idx });
          ws.send(JSON.stringify({ type: "team-auth-ok", teamIdx: idx, team: game.teams[idx] }));
          broadcastState();
        } else if (idx !== undefined && game.teams[idx].ready) {
          ws.send(JSON.stringify({ type: "team-auth-fail", reason: "already-used" }));
        } else {
          ws.send(JSON.stringify({ type: "team-auth-fail", reason: "invalid" }));
        }
        break;

      // ── HOST ACTIONS ──
      case "host-setup":
        if (info.role !== "host") break;
        setupTeams(msg.numTeams);
        game.phase = "waiting";
        broadcastState();
        break;

      case "host-start":
        if (info.role !== "host") break;
        game.phase = "game";
        game.current = 0;
        startQuestion();
        broadcastState();
        break;

      case "host-reveal":
        if (info.role !== "host") break;
        doReveal();
        break;

      case "host-next":
        if (info.role !== "host") break;
        game.current++;
        if (game.current >= FIXED_ORDER.length) { game.phase = "end"; stopTimer(); broadcastState(); }
        else { startQuestion(); broadcastState(); }
        break;

      case "host-add-time":
        if (info.role !== "host") break;
        addTime(15);
        break;

      case "host-validate-cash":
        if (info.role !== "host") break;
        if (game.questionState[msg.teamIdx]) {
          game.questionState[msg.teamIdx].validated = msg.ok;
          if (msg.editedAnswer) game.questionState[msg.teamIdx].answer = msg.editedAnswer;
          broadcastState();
        }
        break;

      case "host-recheck":
        if (info.role !== "host") break;
        if (game.questionState[msg.teamIdx]) { game.questionState[msg.teamIdx].validated = null; broadcastState(); }
        break;

      case "host-reset":
        if (info.role !== "host") break;
        stopTimer();
        game = createFreshGame();
        broadcast({ type: "reset" });
        break;

      // ── TEAM ACTIONS ──
      case "team-set-name":
        if (info.role !== "team") break;
        game.teams[info.teamIdx].name = msg.name.slice(0,20);
        broadcastState();
        break;

      case "team-select-mode":
        if (info.role !== "team") break;
        if (!game.questionState[info.teamIdx]) break;
        if (game.questionState[info.teamIdx].mode) break;
        game.questionState[info.teamIdx].pending = msg.mode;
        broadcastState();
        break;

      case "team-confirm-mode":
        if (info.role !== "team") break;
        if (!game.questionState[info.teamIdx]) break;
        const qs = game.questionState[info.teamIdx];
        if (qs.pending && !qs.mode) { qs.mode = qs.pending; qs.pending = null; broadcastState(); }
        break;

      case "team-cancel-mode":
        if (info.role !== "team") break;
        if (game.questionState[info.teamIdx]) { game.questionState[info.teamIdx].pending = null; broadcastState(); }
        break;

      case "team-answer":
        if (info.role !== "team") break;
        if (!game.questionState[info.teamIdx]) break;
        if (game.questionState[info.teamIdx].answer !== null) break;
        game.questionState[info.teamIdx].answer = msg.answer;
        if (msg.cashText) game.questionState[info.teamIdx].cashText = msg.cashText;
        const allDone = game.questionState.every(s => s.mode && s.answer !== null);
        if (allDone) { stopTimer(); }
        broadcastState();
        break;
    }
  });

  ws.on("close", () => { clients.delete(ws); });
});

// ═══════════════════════════════════════════
// QUESTIONS DATA
// ═══════════════════════════════════════════
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
24:{q:"Dans quelle sourate Allah dit « Allah ne change pas l'état d'un peuple tant que celui-ci ne change pas ce qui est en lui-même » ?",opts:["Al-Baqara (2)","Ar-Ra'd (13)","Al-Anfal (8)","An-Nahl (16)"],ans:1,proof:"Sourate Ar-Ra'd (13:11) : « En vérité, Allah ne modifie point l'état d'un peuple tant que les individus qui le composent ne modifient pas ce qui est en eux-mêmes. »"},
25:{q:"Dans quelle sourate Allah dit « Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah » ?",opts:["Al-Baqara (2)","Az-Zumar (39)","An-Nisa (4)","Al-Imran (3)"],ans:1,proof:"Sourate Az-Zumar (39:53) : « Dis : Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Car Allah pardonne tous les péchés. »"},
26:{q:"Dans quel lieu le Prophète ﷺ et Abu Bakr se sont-ils cachés pendant trois jours lors de la Hijra ?",opts:["La grotte de Hira","La grotte de Thawr","La vallée de Mina","Le mont Uhud"],ans:1,proof:"Coran At-Tawba (9:40) : « ...quand ils étaient deux dans la grotte, quand il dit à son compagnon : Ne t'afflige pas, Allah est avec nous. » — La grotte de Thawr, au sud de La Mecque."},
27:{q:"Quel homme tua Hamza (r.a.) à Uhud avant de se convertir à l'Islam ?",opts:["Khabbab ibn al-Aratt","Wahshi ibn Harb","Jubayr ibn Mut'im","Ikrimah ibn Abi Jahl"],ans:1,proof:"Wahshi ibn Harb, lanceur de javelot mandaté par Hind bint Utba, tua Hamza ibn Abd al-Muttalib lors de la bataille d'Uhud (3H). Il se convertit plus tard à l'Islam. (Sahih Bukhari)"},
28:{q:"Quelle épouse du Prophète ﷺ était surnommée « Umm al-Masakin » (la mère des pauvres) pour sa grande générosité ?",opts:["Sawda bint Zam'a","Zaynab bint Khuzayma","Hafsa bint Umar","Umm Salama"],ans:1,proof:"Zaynab bint Khuzayma al-Hilaliya, connue pour sa générosité envers les pauvres. Elle mourut peu après son mariage avec le Prophète ﷺ."},
29:{q:"Quel fut le premier prophète à utiliser le qalam (la plume pour écrire) ?",opts:["Ibrahim (as)","Idris (as)","Adam (as)","Nuh (as)"],ans:1,proof:"Selon de nombreux savants dont Ibn Kathir, Idris (Hénoch) est le premier à avoir écrit avec la plume. Le Coran jure par le qalam dans Al-Qalam (68:1)."},
30:{q:"Quel prophète le Prophète Muhammad ﷺ a-t-il rencontré au 5ème ciel lors du Mi'raj ?",opts:["Issa (as)","Musa (as)","Harun (as)","Ibrahim (as)"],ans:2,proof:"Selon les hadiths authentiques (Bukhari & Muslim) : 1er ciel = Adam, 2ème = Yahya & Issa, 3ème = Yusuf, 4ème = Idris, 5ème = Harun, 6ème = Musa, 7ème = Ibrahim."},
31:{q:"Quel prophète a eu 99 femmes, souhaité un fils cavalier combattant pour chacune, mais oublié de dire « Inch'Allah » ?",opts:["Dawud (as)","Sulayman (as)","Yusuf (as)","Ibrahim (as)"],ans:1,proof:"Hadith Bukhari (3424) : Sulayman dit « Cette nuit je passerai par 99 femmes... » Il oublia de dire Inch'Allah — aucune n'enfanta sauf une, qui donna naissance à un enfant incomplet."},
32:{q:"Quel compagnon est surnommé « le détenteur du secret du Prophète ﷺ concernant les hypocrites » ?",opts:["Hudhayfa ibn al-Yaman","Abu Hurayra","Abdullah ibn Masoud","Salman al-Farisi"],ans:0,proof:"Hudhayfa ibn al-Yaman fut le seul compagnon à qui le Prophète ﷺ confia les noms des hypocrites de Médine. (Sahih Muslim)"},
33:{q:"Quel compagnon a tué son propre père lors de la bataille de Badr ?",opts:["Ali ibn Abi Talib","Abu Ubayda ibn al-Jarrah","Sa'd ibn Abi Waqqas","Az-Zubayr ibn al-Awwam"],ans:1,proof:"Abu Ubayda ibn al-Jarrah tua son père Jarrah ibn Abdullah lors de Badr. Suite à cela, Allah révéla Al-Mujadila (58:22)."},
34:{q:"Quel compagnon fut le premier à réciter le Coran publiquement à La Mecque malgré les persécutions des Quraysh ?",opts:["Bilal ibn Rabah","Abdullah ibn Masoud","Ammar ibn Yasir","Khabbab ibn al-Aratt"],ans:1,proof:"Abdullah ibn Masoud fut le premier à réciter le Coran à voix haute à la Kaaba devant les Quraysh, récitant Ar-Rahman (55). Il fut frappé mais continua. (Ibn Hisham, Sira)"},
35:{q:"Quel compagnon ansari fut désigné par le Prophète ﷺ comme « le meilleur réciteur du Coran » parmi les Ansar ?",opts:["Sa'd ibn Mu'adh","Ubayy ibn Ka'b","Muadh ibn Jabal","Zayd ibn Thabit"],ans:1,proof:"Le Prophète ﷺ dit : « Le meilleur réciteur du Coran parmi ma communauté est Ubayy ibn Ka'b. » (Tirmidhi, Hassan Sahih)."},
36:{q:"Quel compagnon refusa de quitter La Mecque pour rester auprès de sa mère polythéiste malgré les persécutions ?",opts:["Abu Hurayra","Ammar ibn Yasir","Sa'd ibn Abi Waqqas","Mus'ab ibn Umayr"],ans:2,proof:"Sa'd ibn Abi Waqqas refusa de quitter l'Islam malgré la grève de la faim de sa mère. Allah révéla Luqman (31:15)."},
37:{q:"Quel compagnon portait l'étendard lors de la conquête de La Mecque, avant que le Prophète ﷺ ne le lui retire en raison de ses paroles ?",opts:["Ali ibn Abi Talib","Umar ibn al-Khattab","Sa'd ibn Ubada","Az-Zubayr ibn al-Awwam"],ans:2,proof:"Sa'd ibn Ubada portait l'étendard des Ansar à la conquête de La Mecque (8H). Après avoir dit « Aujourd'hui est le jour de la bataille », le Prophète ﷺ lui retira l'étendard. (Ibn Hisham)"},
38:{q:"Quel compagnon a proposé de creuser la tranchée lors de la bataille du Fossé (Al-Khandaq) ?",opts:["Umar ibn al-Khattab","Salman al-Farisi","Ali ibn Abi Talib","Hudhayfa ibn al-Yaman"],ans:1,proof:"Salman al-Farisi proposa la stratégie de creuser une tranchée autour de Médine — tactique militaire connue en Perse mais inconnue des Arabes. (Ibn Hisham, Tabaqat Ibn Sa'd)"},
39:{q:"Quel compagnon est connu pour avoir lavé le corps du Prophète ﷺ après sa mort ?",opts:["Umar ibn al-Khattab","Abu Bakr as-Siddiq","Ali ibn Abi Talib","Uthman ibn Affan"],ans:2,proof:"Ali ibn Abi Talib lava le corps du Prophète ﷺ, assisté de al-Abbas, al-Fadl et Usama ibn Zayd. (Sahih Bukhari, Kitab al-Jana'iz)"},
40:{q:"Quel compagnon fut le dernier des 10 promis au Paradis (Al-Ashara al-Mubashshara) à mourir ?",opts:["Ali ibn Abi Talib","Az-Zubayr ibn al-Awwam","Sa'd ibn Abi Waqqas","Talha ibn Ubaydillah"],ans:2,proof:"Sa'd ibn Abi Waqqas mourut en l'an 55H à Al-Aqiq, près de Médine. Il fut le dernier des dix Compagnons promis au Paradis. (Ibn Abd al-Barr, Al-Isti'ab)"},
41:{q:"Selon quel madhab la consommation de viande de chameau annule-t-elle les ablutions ?",opts:["Maliki","Shafi'i","Hanbali","Hanafi"],ans:2,proof:"Seul le madhab Hanbali considère que manger de la viande de chameau annule le wudu, basé sur le hadith de Jabir ibn Samura (Muslim 360)."},
42:{q:"Selon quel madhab le simple fait de toucher une femme non-mahram annule-t-il les ablutions sans condition ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Selon le madhab Shafi'i : tout contact peau à peau entre un homme et une femme non-mahram annule le wudu, basé sur Al-Ma'idah (5:6)."},
43:{q:"Selon quel madhab la basmala fait-elle partie intégrante de la Fatiha et est-elle obligatoire à réciter à voix haute ?",opts:["Hanafi","Maliki","Shafi'i","Hanbali"],ans:2,proof:"Le madhab Shafi'i considère la basmala comme un verset de la Fatiha. Elle est donc obligatoire (fard) dans la prière et se récite à voix haute en prière jahriyya."},
44:{q:"Selon quel madhab la zakat est-elle obligatoire sur les bijoux en or portés par les femmes ?",opts:["Shafi'i","Maliki","Hanbali","Hanafi"],ans:3,proof:"Le madhab Hanafi impose la zakat sur les bijoux en or et en argent, même portés et utilisés. Les trois autres madhabs exemptent généralement les bijoux portés."},
45:{q:"Quel est le premier des 4 imams des madhabs à avoir enseigné l'un des autres imams ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:0,proof:"Imam Malik (93-179H) a directement enseigné Imam Shafi'i (150-204H), qui lui-même a enseigné Imam Ahmad (164-241H). Abu Hanifa (80-150H) est le plus ancien mais n'a pas enseigné les autres."},
46:{q:"Qui est le plus âgé des 4 imams des madhabs ?",opts:["Imam Malik","Imam Abu Hanifa","Imam Shafi'i","Imam Ahmad"],ans:1,proof:"Imam Abu Hanifa est né en 80H (699 CE), Imam Malik en 93H, Imam Shafi'i en 150H et Imam Ahmad en 164H. Abu Hanifa est donc le doyen des quatre."},
47:{q:"Qui a écrit Riyad as-Salihin (Les Jardins des Vertueux) ?",opts:["Ibn Taymiyya","Ibn Hajar al-Asqalani","Imam An-Nawawi","Ibn Qudama"],ans:2,proof:"Riyad as-Salihin a été compilé par l'Imam Yahya ibn Sharaf An-Nawawi (631-676H), grand savant shafi'i de Syrie."},
48:{q:"Qui a écrit Majmu' al-Fatawa ?",opts:["Ibn Hajar al-Asqalani","Ibn Taymiyya","Ibn al-Qayyim","As-Suyuti"],ans:1,proof:"Majmu' al-Fatawa est le recueil des fatwas et écrits de Shaykh al-Islam Ibn Taymiyya (661-728H), compilé par son élève Ibn Qasim en 37 volumes."},
49:{q:"Quelle est la formule arabe utilisée pour exprimer qu'Allah s'est établi sur Son Trône ?",opts:["Allahu Akbar","Istawa 'ala al-'Arsh","Subhanahu wa Ta'ala","Fa'alun lima yurid"],ans:1,proof:"Istawa 'ala al-'Arsh (استوى على العرش) — mentionnée 7 fois dans le Coran, dont Al-A'raf (7:54), Ta-Ha (20:5), Al-Furqan (25:59)."},
50:{q:"Quelle personne fut la première martyre de l'Islam ?",opts:["Bilal ibn Rabah","Yasir ibn Amir","Sumayyah bint Khayyat","Khabbab ibn al-Aratt"],ans:2,proof:"Sumayyah bint Khayyat, mère d'Ammar ibn Yasir, fut tuée par Abu Jahl alors qu'elle refusait d'abjurer l'Islam. Elle est unanimement reconnue comme la première martyre de l'Islam. (Ibn Hisham, Sira)"}
};

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Quiz Coran en ligne sur le port ${PORT}`));
