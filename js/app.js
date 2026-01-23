import { EXERCISES, WARMUP, DECOMPRESSION, CARDIO_OPTIONS, RECOVERY_CONFIG } from './config.js';
import { Storage, Calculator, Validator } from './core.js';

// === MODAL SYSTEM ===
const Modal = {
    el: document.getElementById('modal-layer'),
    title: document.getElementById('modal-title'),
    body: document.getElementById('modal-body'),
    actions: document.getElementById('modal-actions'),
    resolve: null,
    show(opts) {
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.title.innerText = opts.title || 'Notice';
            opts.html ? this.body.innerHTML = opts.html : this.body.innerText = opts.text || '';
            this.actions.innerHTML = '';
            if (opts.type === 'confirm') {
                const cancel = document.createElement('button');
                cancel.className = 'btn-modal btn-ghost';
                cancel.innerText = 'Cancel';
                cancel.onclick = () => this.close(false);
                this.actions.appendChild(cancel);
            }
            const ok = document.createElement('button');
            ok.className = opts.danger ? 'btn-modal btn-danger' : 'btn-modal btn-confirm';
            ok.innerText = opts.okText || 'OK';
            ok.onclick = () => this.close(true);
            this.actions.appendChild(ok);
            this.el.classList.add('active');
        });
    },
    close(res) {
        this.el.classList.remove('active');
        if (this.resolve) this.resolve(res);
    }
};

// === STATE & TOOLS ===
const State = { view: 'today', phase: null, recovery: null, activeSession: null };
const Haptics = {
    success: () => navigator.vibrate?.([10, 30, 10]),
    light: () => navigator.vibrate?.(10),
    heavy: () => navigator.vibrate?.(50)
};

const Timer = {
    interval: null, endTime: null,
    start(sec = 90) {
        if (this.interval) clearInterval(this.interval);
        this.endTime = Date.now() + (sec * 1000);
        document.getElementById('timer-dock').classList.add('active');
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    },
    tick() {
        const rem = Math.ceil((this.endTime - Date.now()) / 1000);
        if (rem <= 0) { this.stop(); Haptics.success(); return; }
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        document.getElementById('timer-val').textContent = `${m}:${s.toString().padStart(2,'0')}`;
    },
    stop() {
        if (this.interval) clearInterval(this.interval);
        document.getElementById('timer-dock').classList.remove('active');
    }
};

// === RENDER ROUTER ===
function render() {
    const main = document.getElementById('main-content');
    // Update active tab state
    document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === State.view));
    
    main.innerHTML = ''; main.className = 'fade-in';

    switch (State.view) {
        case 'today': renderToday(main); break;
        case 'history': renderHistory(main); break;
        case 'progress': renderProgress(main); break;
        case 'settings': renderSettings(main); break;
    }
}

// === VIEWS ===
function renderToday(c) {
    if (!State.recovery) renderRecovery(c);
    else if (State.phase === 'warmup') renderWarmup(c);
    else if (State.phase === 'lifting') renderLifting(c);
    else if (State.phase === 'cardio') renderCardio(c);
    else renderDecompress(c);
}

function renderRecovery(c) {
    const check = Validator.canStartWorkout();
    if (!check.valid) {
        c.innerHTML = `<div class="container"><h1>⏸️ Rest Required</h1><div class="card"><p>Next workout in: ${check.hours} hours</p></div></div>`;
        return;
    }
    c.innerHTML = `
        <div class="container">
            <h1>Ready?</h1>
            ${check.isFirst ? `<div class="card" style="border-color:var(--accent)"><h3>🎯 First Session</h3><p class="text-xs">Find 12-rep max weights.</p></div>` : ''}
            ${check.warning ? `<div class="card" style="border-color:var(--warning)"><h3>⚠️ Long Gap</h3><p class="text-xs">Weights -10% safety reset.</p></div>` : ''}
            <div class="card" onclick="window.setRec('green')"><h3 style="color:var(--success)">Green</h3><p class="text-xs">Full Strength</p></div>
            <div class="card" onclick="window.setRec('yellow')"><h3 style="color:var(--warning)">Yellow</h3><p class="text-xs">-10% Weight</p></div>
            <div class="card" onclick="window.setRec('red')"><h3 style="color:var(--error)">Red</h3><p class="text-xs">Stop. Walk only.</p></div>
        </div>`;
}

function renderWarmup(c) {
    c.innerHTML = `
        <div class="container"><h1>Warmup</h1><div class="card">
        ${WARMUP.map(w => `
            <div style="margin-bottom:1.5rem; border-bottom:1px solid #333; padding-bottom:1rem;">
                <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                    <div class="checkbox-wrapper" style="margin:0; padding:0; background:none; border:none; width:auto;">
                        <input type="checkbox" class="big-check" id="w-${w.id}">
                        <div><div id="name-${w.id}">${w.name}</div><div class="text-xs">${w.reps}</div></div>
                    </div>
                    <a id="vid-${w.id}" href="${w.video}" target="_blank" style="font-size:1.5rem; text-decoration:none; padding-left:1rem;">🎥</a>
                </div>
                <details><summary class="text-xs" style="opacity:0.7; cursor:pointer">Alternatives</summary>
                    <select id="alt-${w.id}" onchange="window.swapAlt('${w.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);">
                        <option value="">${w.name}</option>
                        ${w.alternatives.map(a => `<option value="${a}">${a}</option>`).join('')}
                    </select>
                </details>
            </div>`).join('')}
        </div><button class="btn btn-primary" onclick="window.nextPhase('lifting')">Start Lifting</button></div>`;
}

function renderLifting(c) {
    const sessions = Storage.getSessions();
    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:1rem;">
                <h1>Lifting</h1>
                <span class="text-xs" style="border:1px solid var(--border); padding:0.25rem 0.5rem; border-radius:0.75rem">${State.recovery.toUpperCase()}</span>
            </div>
            ${EXERCISES.map(ex => {
                const w = Calculator.getRecommendedWeight(ex.id, State.recovery);
                const last = Calculator.getLastCompletedExercise(ex.id, sessions);
                const lastText = last ? `Last: ${last.weight} lbs` : 'First Session';
                return `
                <div class="card" id="card-${ex.id}">
                    <div class="flex-row" style="justify-content:space-between; margin-bottom:0.25rem;">
                        <div>
                            <div class="text-xs" style="color:var(--accent)">${ex.category}</div>
                            <h2 id="name-${ex.id}" style="margin-bottom:0">${ex.name}</h2>
                            <div class="text-xs" style="opacity:0.6; margin-bottom:0.5rem">${lastText}</div>
                        </div>
                        <a id="vid-${ex.id}" href="${ex.video}" target="_blank" style="font-size:1.5rem; text-decoration:none">🎥</a>
                    </div>
                    <div class="stepper-control">
                        <button class="stepper-btn" onclick="window.modW('${ex.id}', -2.5)">−</button>
                        <input type="number" class="stepper-value" id="w-${ex.id}" value="${w}" step="2.5" readonly inputmode="none">
                        <button class="stepper-btn" onclick="window.modW('${ex.id}', 2.5)">+</button>
                    </div>
                    <div class="text-xs" style="text-align:center; font-family:monospace; margin:0.5rem 0 1rem 0; color:var(--text-secondary)">${Calculator.getPlateLoad(w)} / side</div>
                    <div class="set-group">
                        ${Array.from({length:ex.sets},(_,i)=>`<div class="set-btn" id="s-${ex.id}-${i}" onclick="window.togS('${ex.id}',${i},${ex.sets})">${i+1}</div>`).join('')}
                    </div>
                    <details class="mt-4" style="margin-top:1rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                        <summary class="text-xs">Alternatives</summary>
                        <select id="alt-${ex.id}" onchange="window.swapAlt('${ex.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none">
                            <option value="">${ex.name}</option>
                            ${ex.alternatives.map(a=>`<option value="${a}">${a}</option>`).join('')}
                        </select>
                    </details>
                </div>`;
            }).join('')}
            <button class="btn btn-primary" onclick="window.nextPhase('cardio')">Next: Cardio</button>
        </div>`;
}

function renderCardio(c) {
    const defaultLink = CARDIO_OPTIONS[0].video;
    c.innerHTML = `
        <div class="container"><h1>Cardio</h1><div class="card">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:1rem;"><h3>Selection</h3><a id="cardio-vid" href="${defaultLink}" target="_blank" style="font-size:1.5rem; text-decoration:none">🎥</a></div>
            <select id="cardio-type" onchange="window.swapCardioLink()" style="width:100%; padding:1rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem;">${CARDIO_OPTIONS.map(o=>`<option value="${o.name}">${o.name}</option>`).join('')}</select>
            <button class="btn btn-secondary" onclick="window.startCardio()">Start 5m Timer</button>
            <div class="checkbox-wrapper" style="margin-top:1rem"><input type="checkbox" class="big-check" id="cardio-done"><span>Completed</span></div>
        </div><button class="btn btn-primary" onclick="window.nextPhase('decompress')">Next: Decompress</button></div>`;
}

function renderDecompress(c) {
    c.innerHTML = `
        <div class="container"><h1>Decompress</h1>
            ${DECOMPRESSION.map(d => `
                <div class="card">
                    <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                        <h3 id="name-${d.id}">${d.name}</h3>
                        <a id="vid-${d.id}" href="${d.video}" target="_blank" style="font-size:1.5rem; text-decoration:none">🎥</a>
                    </div>
                    ${d.inputLabel ? `<input type="number" id="val-${d.id}" placeholder="${d.inputLabel}" style="width:100%; padding:1rem; background:var(--bg-secondary); border:none; color:white; margin-bottom:0.5rem">` : `<p class="text-xs" style="margin-bottom:0.5rem">Sit on bench. Reset CNS.</p>`}
                    <div class="checkbox-wrapper"><input type="checkbox" class="big-check" id="done-${d.id}"><span>Completed</span></div>
                    <details style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                        <summary class="text-xs" style="opacity:0.7; cursor:pointer">Alternatives</summary>
                        <select id="alt-${d.id}" onchange="window.swapAlt('${d.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);">
                            <option value="">Default</option>
                            ${d.alternatives.map(a => `<option value="${a}">${a}</option>`).join('')}
                        </select>
                    </details>
                </div>`).join('')}
            <button class="btn btn-primary" onclick="window.finish()">Save & Finish</button>
        </div>`;
}

function renderHistory(c) {
    const s = Storage.getSessions().reverse();
    c.innerHTML = `<div class="container"><h1>History</h1>${s.length===0?'<div class="card"><p>No logs yet.</p></div>':s.map(x=>`
        <div class="card">
            <div class="flex-row" style="justify-content:space-between">
                <div><h3>${Validator.formatDate(x.date)}</h3><span class="text-xs" style="border:1px solid var(--border); padding:0.125rem 0.375rem; border-radius:var(--radius-sm)">${x.recoveryStatus.toUpperCase()}</span></div>
                <button class="btn btn-secondary" style="width:auto; padding:0.25rem 0.75rem" onclick="window.del('${x.id}')">✕</button>
            </div>
            <details style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.5rem;">
                <summary class="text-xs" style="cursor:pointer; padding:0.5rem 0; opacity:0.8">View Details</summary>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">WARMUP</div>
                <div class="text-xs" style="margin-bottom:1rem; line-height:1.4">${x.warmup ? x.warmup.map(w => w.completed ? `✓ ${w.altUsed || w.id} ` : '').join('') : 'No Data'}</div>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">LIFTING</div>
                ${x.exercises.map(e => {
                     // Name Display Fix
                     const displayName = e.altName || e.name || EXERCISES.find(cfg=>cfg.id===e.id)?.name || e.id;
                     return `<div class="flex-row" style="justify-content:space-between; font-size:0.85rem; margin-bottom:0.25rem; ${e.skipped ? 'opacity:0.5; text-decoration:line-through' : ''}"><span>${displayName}</span><span>${e.weight} lbs</span></div>`
                }).join('')}
                <div class="text-xs" style="margin:1rem 0 0.5rem 0; color:var(--accent)">FINISHER</div>
                <div class="text-xs">
                    Cardio: ${x.cardio?.type || 'N/A'}<br>
                    Decompress: ${Array.isArray(x.decompress) ? (x.decompress.every(d=>d.completed) ? 'Full Session' : 'Partial') : (x.decompress?.completed ? 'Completed' : 'Skipped')}
                </div>
            </details>
        </div>`).join('')}</div>`;
}

function renderProgress(c) {
    c.innerHTML = `<div class="container"><h1>Progress</h1><div class="card"><select id="chart-ex" onchange="window.drawChart(this.value)" style="width:100%; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem; border-radius:var(--radius-sm);">${EXERCISES.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select><div id="chart-area" style="min-height:250px"></div></div></div>`;
    setTimeout(()=>window.drawChart('hinge'),100);
}

function renderSettings(c) {
    c.innerHTML = `
        <div class="container">
            <h1>Settings</h1>
            <div class="card">
                <button class="btn btn-secondary" onclick="Storage.exportData()">Backup Data</button>
                <div style="position:relative; margin-top:0.5rem"><button class="btn btn-secondary">Restore Data</button><input type="file" onchange="window.imp(this)" style="position:absolute;top:0;left:0;opacity:0;width:100%;height:100%"></div>
                <button class="btn btn-secondary" style="margin-top:0.5rem; color:var(--error)" onclick="window.wipe()">Factory Reset</button>
            </div>
            <h3 style="margin-top:2rem">Debug Tools</h3>
            <div class="card">
                <button class="btn btn-secondary btn-debug" onclick="window.debugPopulate()">Populate Dummy Data</button>
                <button class="btn btn-secondary btn-debug" style="margin-top:0.5rem" onclick="window.debugUnlock()">Unlock Rest Timer</button>
            </div>
        </div>`;
}

// === HANDLERS ===
window.setRec = async (r) => {
    if (r === 'red') return Modal.show({ title: 'Stop', text: 'Low recovery. Walk only.', danger: true });
    State.recovery = r;
    State.activeSession = { id: crypto.randomUUID(), date: new Date().toISOString(), recoveryStatus: r, exercises: [] };
    State.phase = 'warmup';
    render();
};
window.modW = (id, d) => {
    const el = document.getElementById(`w-${id}`);
    el.value = Math.max(0, parseFloat(el.value) + d);
    Haptics.light();
};
window.togS = (ex, i, max) => {
    const el = document.getElementById(`s-${ex}-${i}`);
    if(el.classList.toggle('completed')) { Haptics.success(); if(i < max-1) Timer.start(); }
};
window.swapAlt = (id) => {
    const sel = document.getElementById(`alt-${id}`).value;
    const cfg = EXERCISES.find(e => e.id === id) || WARMUP.find(w => w.id === id) || DECOMPRESSION.find(d => d.id === id);
    if (!cfg) return;
    document.getElementById(`vid-${id}`).href = sel && cfg.altLinks[sel] ? cfg.altLinks[sel] : cfg.video;
    document.getElementById(`name-${id}`).innerHTML = sel || cfg.name;
};
window.swapCardioLink = () => {
    const selName = document.getElementById('cardio-type').value;
    const cfg = CARDIO_OPTIONS.find(o => o.name === selName);
    if (cfg) document.getElementById('cardio-vid').href = cfg.video;
};
window.nextPhase = (p) => {
    if(p === 'lifting') State.activeSession.warmup = WARMUP.map(w => ({ id: w.id, completed: document.getElementById(`w-${w.id}`).checked, altUsed: document.getElementById(`alt-${w.id}`).value }));
    if(p === 'cardio') State.activeSession.exercises = EXERCISES.map(ex => {
        const w = parseFloat(document.getElementById(`w-${ex.id}`).value) || 0;
        const sets = document.querySelectorAll(`#card-${ex.id} .set-btn.completed`).length;
        const alt = document.getElementById(`alt-${ex.id}`).value;
        return { id: ex.id, name: ex.name, weight: w, setsCompleted: sets, completed: sets===ex.sets, usingAlternative: !!alt, altName: alt };
    });
    if(p === 'decompress') State.activeSession.cardio = { type: document.getElementById('cardio-type').value, completed: document.getElementById('cardio-done').checked };
    State.phase = p;
    render();
};
window.finish = async () => {
    if(!await Modal.show({ type: 'confirm', title: 'Finish?', text: 'Save this session?' })) return;
    State.activeSession.decompress = DECOMPRESSION.map(d => ({ id: d.id, val: document.getElementById(`val-${d.id}`)?.value || null, completed: document.getElementById(`done-${d.id}`).checked, altUsed: document.getElementById(`alt-${d.id}`).value }));
    Storage.saveSession(State.activeSession);
    State.view = 'history'; State.phase = null; State.recovery = null;
    render();
};
window.skipTimer = () => { Haptics.heavy(); Timer.stop(); };
window.startCardio = () => Timer.start(300);
window.del = async (id) => { if(await Modal.show({type:'confirm',title:'Delete?',danger:true})) { Storage.deleteSession(id); render(); }};
window.wipe = async () => { if(await Modal.show({type:'confirm',title:'RESET ALL?',danger:true})) Storage.reset(); };
window.imp = (el) => { const r = new FileReader(); r.onload = e => Storage.importData(e.target.result); if(el.files[0]) r.readAsText(el.files[0]); };
window.debugPopulate = () => { if(confirm('Generate dummy data?')) Storage.generateDummyData(); };
window.debugUnlock = () => { if(confirm('Force unlock rest timer?')) Storage.unlockRest(); };

// === SVG CHARTING ===
window.drawChart = (id) => {
    const s = Storage.getSessions().filter(x=>x.exercises.find(e=>e.id===id && !e.usingAlternative));
    const div = document.getElementById('chart-area');
    if(s.length < 2) return div.innerHTML = '<p style="padding:1rem;color:#666">Need 2+ logs.</p>';
    const data = s.map(x=>({d:new Date(x.date), v:x.exercises.find(e=>e.id===id).weight}));
    const max = Math.max(...data.map(d=>d.v)) * 1.1;
    const min = Math.min(...data.map(d=>d.v)) * 0.9;
    const W = div.clientWidth || 300;
    const H = Math.max(200, Math.min(300, W * 0.6));
    const P = 20;
    const X = i => P + (i/(data.length-1)) * (W-P*2);
    const Y = v => H - (P + ((v-min)/(max-min)) * (H-P*2));
    let path = `M ${X(0)} ${Y(data[0].v)}`;
    data.forEach((p,i) => path += ` L ${X(i)} ${Y(p.v)}`);
    div.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
        <path d="${path}" fill="none" stroke="var(--accent)" stroke-width="3"/>
        ${data.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.v)}" r="4" fill="var(--bg-secondary)" stroke="var(--accent)" stroke-width="2"/>`).join('')}
    </svg><div class="flex-row" style="justify-content:space-between; margin-top:0.25rem; font-size:var(--font-xs); color:var(--text-secondary)"><span>${Validator.formatDate(data[0].d)}</span><span>${Validator.formatDate(data[data.length-1].d)}</span></div>`;
};

// === GLOBAL EVENT LISTENERS ===
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-item');
        State.view = target.dataset.view;
        render();
    });
});

render();