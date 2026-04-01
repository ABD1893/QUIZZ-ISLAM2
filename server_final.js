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
<title>Quiz Coran - Version Corrigée</title>
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
.q-text{font-size:16px;font-weight:700;line-height:1.6;color:var(--dark);}
.mode-card{padding:12px;border-radius:10px;border:1.5px solid #e0ddd6;background:#faf9f6;cursor:pointer;display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.mode-card:hover{border-color:var(--gold);}
.proof-box{background:#f0faf5;border:1px solid #b0e0c8;padding:1rem;border-radius:12px;margin:10px 0;font-size:13px;text-align:left;}
.conn{position:fixed;bottom:10px;right:10px;font-size:11px;padding:4px 11px;border-radius:99px;z-index:999;}
.conn.ok{background:#e6f9f0;color:#1a6641;}
.conn.off{background:#fdecea;color:#8b1a1a;}
</style>
</head>
<body>
<div class="wrap" id="app"></div>
<div class="conn off" id="conn">Connexion...</div>

<script>
let role=null, myTeamIdx=null, serverState=null;
let phase="entry", pinEntry="", pinError="";
let myTeamNameInput="", myMemberInputs=[""];
let timerVal=0;

const ws = new WebSocket((location.protocol==="https:"?"wss:":"ws:")+"//"+location.host);
ws.onopen=()=>document.getElementById("conn").className="conn ok";
ws.onmessage=(e)=>{
    const msg=JSON.parse(e.data);
    if(msg.type==="state"){ serverState=msg; render(); }
    if(msg.type==="host-auth-ok"){ role="host"; phase="setup"; render(); }
    if(msg.type==="team-auth-ok"){ role="team"; myTeamIdx=msg.teamIdx; phase="waiting"; render(); }
};

function send(obj){ ws.send(JSON.stringify(obj)); }

function render(){
    const app=document.getElementById("app");
    if(!serverState && phase==="entry"){
        app.innerHTML = \`
            <div class="card">
                <div class="logo">QUIZ<span>CORAN</span></div>
                <p>Bienvenue, choisissez votre rôle</p><br>
                <button class="btn btn-gold" onclick="send({type:'host-auth', pin:'1234'})">HÔTE (Admin)</button>
                <button class="btn btn-dark" onclick="phase='join-pin';render();">ÉQUIPE (Joueur)</button>
            </div>\`;
        return;
    }

    if(role==="host"){
        if(serverState.phase==="waiting"){
            app.innerHTML = \`
                <div class="card">
                    <h2>Configuration</h2>
                    <p>Nombre d'équipes :</p>
                    <select id="nTeams" class="btn btn-outline">
                        <option value="1">1 Équipe</option>
                        <option value="2">2 Équipes</option>
                        <option value="3" selected>3 Équipes</option>
                        <option value="4">4 Équipes</option>
                    </select>
                    <button class="btn btn-gold" onclick="send({type:'start-game', config:{numTeams:document.getElementById('nTeams').value}})">LANCER LE JEU</button>
                </div>\`;
        } else if(serverState.phase==="question"){
            const q = serverState.currentQuestion;
            app.innerHTML = \`
                <div class="card-wide">
                    <div class="q-box">
                        <div class="q-text">\${q.q}</div>
                    </div>
                    \${serverState.showQuestion ? \`
                        <div class="proof-box"><strong>Réponse correcte :</strong> \${q.opts[q.ans]}<br><br>\${q.proof}</div>
                        <button class="btn btn-dark" onclick="send({type:'next-question'})">QUESTION SUIVANTE</button>
                    \` : \`
                        <button class="btn btn-gold" onclick="send({type:'reveal-question'})">AFFICHER RÉPONSE POUR TOUS</button>
                    \`}
                </div>\`;
        }
    } else if(role==="team"){
        const team = serverState.teams[myTeamIdx];
        if(serverState.phase==="question"){
            app.innerHTML = \`
                <div class="card">
                    <h3>Équipe: \${team.name} | Score: \${team.score}</h3>
                    <hr><br>
                    \${!serverState.showQuestion ? \`
                        <p>L'hôte lit la question...</p>
                        <div class="q-box" style="filter:blur(4px); opacity:0.5;">\${serverState.currentQuestion.q}</div>
                    \` : \`
                        <div class="q-box">\${serverState.currentQuestion.q}</div>
                        \${!team.answered ? \`
                            <div class="mode-card" onclick="send({type:'select-mode', mode:'square'})"><span>Carré (4 choix)</span> <strong>3 pts</strong></div>
                            <div class="mode-card" onclick="send({type:'select-mode', mode:'duo'})"><span>Duo (2 choix)</span> <strong>1 pt</strong></div>
                            <div class="mode-card" onclick="send({type:'select-mode', mode:'cash'})"><span>Cash (Saisie directe)</span> <strong>5 pts</strong></div>
                        \` : \`<p>Réponse enregistrée. Attente des autres...</p>\`}
                    \`}
                </div>\`;
        }
    }
}
</script>
</body>
</html>\`;

// --- LOGIQUE SERVEUR ---

let state = {
    phase: "waiting", // waiting, question, result, final
    teams: [],
    currentQIdx: 0,
    showQuestion: false,
    questions: [
        {q:"Quel est le premier pilier de l'Islam ?", opts:["La prière","La Shahada","Le Jeûne","La Zakat"], ans:1, proof:"La profession de foi (Shahada) est le fondement de l'entrée en Islam."},
        {q:"Combien y a-t-il de sourates dans le Coran ?", opts:["110","114","120","112"], ans:1, proof:"Le Coran est composé de 114 chapitres appelés Sourates."},
        // Ajoutez vos autres questions ici
    ]
};

wss.on("connection", (ws) => {
    ws.on("message", (data) => {
        const msg = JSON.parse(data);
        
        if(msg.type === "host-auth" && msg.pin === "1234") {
            ws.send(JSON.stringify({type: "host-auth-ok"}));
            broadcastState();
        }

        if(msg.type === "start-game") {
            state.phase = "question";
            state.teams = Array.from({length: msg.config.numTeams}, (_, i) => ({
                name: "Équipe " + (i+1),
                score: 0,
                answered: false
            }));
            state.currentQIdx = 0;
            state.showQuestion = false;
            broadcastState();
        }

        if(msg.type === "reveal-question") {
            state.showQuestion = true;
            broadcastState();
        }

        if(msg.type === "next-question") {
            state.currentQIdx++;
            state.showQuestion = false;
            state.teams.forEach(t => t.answered = false);
            broadcastState();
        }
        
        if(msg.type === "select-mode") {
            // Logique de réponse simplifiée pour l'exemple
            const t = state.teams.find((_, i) => i === msg.teamIdx); // Simulation simplifiée
            broadcastState();
        }
    });

    ws.send(JSON.stringify({type: "state", ...state, currentQuestion: state.questions[state.currentQIdx]}));
});

function broadcastState() {
    const payload = JSON.stringify({
        type: "state", 
        ...state, 
        currentQuestion: state.questions[state.currentQIdx]
    });
    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) client.send(payload);
    });
}

app.get("/", (req, res) => res.send(HTML));
server.listen(3000, () => console.log("Serveur prêt sur http://localhost:3000"));
