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
<title>Quiz Coran - Version Finale Corrigée</title>
<style>
:root{--gold:#c9a84c;--gold-light:#f0d080;--dark:#1a1a2e;--card:#ffffff;--bg:#f5f3ee;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);min-height:100vh;overflow-x:hidden;}
.wrap{position:relative;z-index:1;padding:1rem;max-width:1200px;margin:0 auto;}
.card{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:2rem;max-width:480px;margin:2rem auto;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.07);}
.card-wide{background:var(--card);border-radius:20px;border:1px solid #e8e4da;padding:1.5rem;max-width:740px;margin:1.5rem auto;box-shadow:0 4px 24px rgba(0,0,0,.07);}
.logo{font-size:26px;font-weight:800;color:var(--dark);margin-bottom:.2rem;}
.logo span{color:var(--gold);}
.btn{width:100%;padding:13px;border-radius:12px;border:none;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;margin-bottom:8px;display:block;}
.btn-dark{background:var(--dark);color:#fff;}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-light));color:#1a1a00;}
.btn-outline{background:#fff;border:1.5px solid #ddd;color:#555;}
.q-box{background:var(--card);border-radius:15px;border:1px solid #e8e4da;padding:1rem 1.3rem;margin-bottom:.7rem;text-align:center;}
.q-text{font-size:15px;font-weight:700;line-height:1.6;color:var(--dark);}
.proof-box{background:#f0faf5;border:1px solid #b0e0c8;padding:1rem;border-radius:12px;margin:10px 0;font-size:13px;text-align:left;color:#1a4a30;}
.mode-card{padding:12px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;transition:0.2s;}
.mode-card:hover{border-color:var(--gold);background:#fffbe6;}
.conn{position:fixed;bottom:10px;right:10px;font-size:11px;padding:4px 11px;border-radius:99px;z-index:999;}
.conn.ok{background:#e6f9f0;color:#1a6641;border:1px solid #5ecb9a;}
.conn.off{background:#fdecea;color:#8b1a1a;border:1px solid #f5a0a0;}
.inp-sel{width:100%;padding:10px;border-radius:10px;border:1.5px solid #ddd;margin-bottom:15px;}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn off" id="conn">Connexion...</div>

<script>
let role=null, myTeamIdx=null, serverState=null;

const ws = new WebSocket((location.protocol==="https:"?"wss:":"ws:")+"//"+location.host);
ws.onopen=()=>document.getElementById("conn").className="conn ok";
ws.onmessage=(e)=>{
    const msg=JSON.parse(e.data);
    if(msg.type==="state"){ serverState=msg; render(); }
    if(msg.type==="host-auth-ok"){ role="host"; render(); }
    if(msg.type==="team-auth-ok"){ role="team"; myTeamIdx=msg.teamIdx; render(); }
};

function send(obj){ ws.send(JSON.stringify(obj)); }

function render(){
    const app=document.getElementById("app");
    if(!serverState) return;

    if(role===null){
        app.innerHTML = \`
            <div class="card">
                <div class="logo">QUIZ<span>CORAN</span></div>
                <p>Choisissez votre accès</p><br>
                <button class="btn btn-gold" onclick="send({type:'host-auth', pin:'1234'})">ACCÈS HÔTE</button>
                <button class="btn btn-dark" onclick="role='team';render();">ÉQUIPE PARTICIPANTE</button>
            </div>\`;
        return;
    }

    if(role==="host"){
        if(serverState.phase==="waiting"){
            app.innerHTML = \`
                <div class="card">
                    <h2>Configuration</h2><br>
                    <p>Nombre d'équipes :</p>
                    <select id="nTeams" class="inp-sel">
                        <option value="1">1 Équipe</option>
                        <option value="2">2 Équipes</option>
                        <option value="3" selected>3 Équipes</option>
                        <option value="4">4 Équipes</option>
                    </select>
                    <button class="btn btn-gold" onclick="send({type:'start-game', numTeams:parseInt(document.getElementById('nTeams').value)})">DÉMARRER</button>
                </div>\`;
        } else {
            const q = serverState.questions[serverState.currentQIdx];
            app.innerHTML = \`
                <div class="card-wide">
                    <div style="color:var(--gold); font-weight:800; font-size:12px;">QUESTION \${serverState.currentQIdx + 1}</div>
                    <div class="q-box"><div class="q-text">\${q.q}</div></div>
                    \${serverState.showQuestionToPlayers ? \`
                        <div class="proof-box"><strong>Réponse :</strong> \${q.opts[q.ans]}<br><br><strong>Preuve :</strong> \${q.proof}</div>
                        <button class="btn btn-dark" onclick="send({type:'next-question'})">QUESTION SUIVANTE</button>
                    \` : \`
                        <button class="btn btn-gold" onclick="send({type:'reveal-to-players'})">AFFICHER LA QUESTION AUX JOUEURS</button>
                    \`}
                </div>\`;
        }
    } 
    
    else if(role==="team"){
        if(myTeamIdx === null){
            let btns = "";
            serverState.teams.forEach((t, i) => { btns += \`<button class="btn btn-outline" onclick="send({type:'select-team', idx:\${i}})">\${t.name}</button>\`; });
            app.innerHTML = \`<div class="card"><h2>Choisissez votre équipe</h2><br>\${btns}</div>\`;
        } else {
            const myTeam = serverState.teams[myTeamIdx];
            if(serverState.phase==="waiting"){
                app.innerHTML = \`<div class="card"><h2>Prêt !</h2><p>Attente du lancement...</p></div>\`;
            } else {
                const q = serverState.questions[serverState.currentQIdx];
                app.innerHTML = \`
                    <div class="card">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:10px;">
                            <span>\${myTeam.name}</span><span>Score: \${myTeam.score}</span>
                        </div>
                        \${!serverState.showQuestionToPlayers ? \`
                            <div class="q-box" style="filter:blur(5px); opacity:0.3;">\${q.q}</div>
                            <p>L'hôte lit la question...</p>
                        \` : \`
                            <div class="q-box"><div class="q-text">\${q.q}</div></div>
                            \${!myTeam.answered ? \`
                                <div class="mode-card" onclick="send({type:'answer', teamIdx:\${myTeamIdx}, mode:'cash'})"><span>Cash</span><strong>5 pts</strong></div>
                                <div class="mode-card" onclick="send({type:'answer', teamIdx:\${myTeamIdx}, mode:'square'})"><span>Carré</span><strong>3 pts</strong></div>
                                <div class="mode-card" onclick="send({type:'answer', teamIdx:\${myTeamIdx}, mode:'duo'})"><span>Duo</span><strong>1 pt</strong></div>
                            \` : \`<p>Réponse envoyée !</p>\`}
                        \`}
                    </div>\`;
            }
        }
    }
}
</script>
</body>
</html>\`;

// --- LOGIQUE SERVEUR ---

let state = {
    phase: "waiting",
    currentQIdx: 0,
    showQuestionToPlayers: false,
    teams: [],
    questions: [
        {q:"Quelle est la première sourate du Coran ?", opts:["Al-Baqarah","Al-Fatiha","An-Nas","Al-Ikhlas"], ans:1, proof:"Al-Fatiha est l'ouverture du Livre."},
        {q:"Combien de sourates y a-t-il dans le Coran ?", opts:["110","112","114","120"], ans:2, proof:"Le Coran contient 114 sourates."},
        // J'ai réduit ici pour l'exemple, mais remettez vos 50 questions ici
    ]
};

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const msg = JSON.parse(data);
        if(msg.type === "host-auth") ws.send(JSON.stringify({type:"host-auth-ok"}));
        if(msg.type === "select-team") ws.send(JSON.stringify({type:"team-auth-ok", teamIdx: msg.idx}));
        
        if(msg.type === "start-game"){
            state.phase = "playing";
            state.teams = Array.from({length: msg.numTeams}, (_, i) => ({ name: "Équipe "+(i+1), score: 0, answered: false }));
            broadcastState();
        }

        if(msg.type === "reveal-to-players") {
            state.showQuestionToPlayers = true;
            broadcastState();
        }

        if(msg.type === "answer") {
            state.teams[msg.teamIdx].answered = true;
            const pts = msg.mode === "cash" ? 5 : (msg.mode === "square" ? 3 : 1);
            state.teams[msg.teamIdx].score += pts;
            broadcastState();
        }

        if(msg.type === "next-question") {
            state.currentQIdx++;
            state.showQuestionToPlayers = false;
            state.teams.forEach(t => t.answered = false);
            broadcastState();
        }
    });
    ws.send(JSON.stringify({type:"state", ...state}));
});

function broadcastState() {
    wss.clients.forEach(c => { if(c.readyState === WebSocket.OPEN) c.send(JSON.stringify({type:"state", ...state})); });
}

app.get("/", (req, res) => res.send(HTML));
server.listen(3000, () => console.log("Serveur lancé sur le port 3000"));
