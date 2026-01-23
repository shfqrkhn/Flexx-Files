import { EXERCISES, WARMUP, DECOMPRESSION, CARDIO_OPTIONS, RECOVERY_CONFIG } from './config.js';
import { Storage, Calculator, Validator } from './core.js';
import { Observability, Logger, Metrics, Analytics } from './observability.js';
import { Accessibility, ScreenReader } from './accessibility.js';
import { Security, Sanitizer } from './security.js';
import { I18n, DateFormatter } from './i18n.js';

// === MODAL SYSTEM ===
const Modal = {
    el: document.getElementById('modal-layer'),
    title: document.getElementById('modal-title'),
    body: document.getElementById('modal-body'),
    actions: document.getElementById('modal-actions'),
    resolve: null,
    show(opts) {
        return new Promise((resolve) => {
            // Null checks for modal elements
            if (!this.el || !this.title || !this.body || !this.actions) {
                console.error('Modal elements not found in DOM');
                // Fallback to native alert/confirm
                if (opts.type === 'confirm') {
                    resolve(confirm(opts.text || opts.title || 'Confirm?'));
                } else {
                    alert(opts.text || opts.title || 'Notice');
                    resolve(true);
                }
                return;
            }

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
        if (!this.el) {
            console.error('Modal element not found');
            if (this.resolve) this.resolve(res);
            return;
        }
        this.el.classList.remove('active');
        if (this.resolve) this.resolve(res);
    }
};

// === STATE & TOOLS ===
const State = { view: 'today', phase: null, recovery: null, activeSession: null, historyLimit: 20 };
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
        const timerDock = document.getElementById('timer-dock');
        if (!timerDock) {
            console.error('Timer dock element not found');
            return;
        }
        timerDock.classList.add('active');
        this.tick();
        this.interval = setInterval(() => this.tick(), 1000);
    },
    tick() {
        const rem = Math.ceil((this.endTime - Date.now()) / 1000);
        if (rem <= 0) { this.stop(); Haptics.success(); return; }
        const m = Math.floor(rem / 60);
        const s = rem % 60;
        const timerVal = document.getElementById('timer-val');
        if (!timerVal) {
            console.error('Timer value element not found');
            return;
        }
        timerVal.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    },
    stop() {
        if (this.interval) clearInterval(this.interval);
        const timerDock = document.getElementById('timer-dock');
        if (!timerDock) {
            console.error('Timer dock element not found');
            return;
        }
        timerDock.classList.remove('active');
    }
};

// === RENDER ROUTER ===
function render() {
    try {
        const main = document.getElementById('main-content');
        if (!main) {
            console.error('Main content element not found');
            return;
        }

        // Update active tab state
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.toggle('active', el.dataset.view === State.view);
        });

        main.innerHTML = '';
        main.className = 'fade-in';

        switch (State.view) {
            case 'today': renderToday(main); break;
            case 'history': renderHistory(main); break;
            case 'progress': renderProgress(main); break;
            case 'settings': renderSettings(main); break;
            default:
                console.warn(`Unknown view: ${State.view}`);
                renderToday(main);
        }
    } catch (e) {
        console.error('Render error:', e);
        // Try to show error to user
        const main = document.getElementById('main-content');
        if (main) {
            main.innerHTML = `
                <div class="container">
                    <div class="card" style="border-color:var(--error)">
                        <h3>⚠️ Something went wrong</h3>
                        <p class="text-xs">Please refresh the page. If the problem persists, try exporting your data and clearing the app cache.</p>
                    </div>
                </div>`;
        }
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
        const nextDate = check.nextAvailable ? Validator.formatDate(check.nextAvailable) : '';
        c.innerHTML = `
            <div class="container">
                <h1>⏸️ Rest Required</h1>
                <div class="card">
                    <h3>You need 48 hours between workouts</h3>
                    <p style="margin-top:1rem; color:var(--text-secondary)">
                        <strong style="color:var(--accent)">${check.hours} hours</strong> remaining
                    </p>
                    ${nextDate ? `<p class="text-xs" style="margin-top:0.5rem">Next available: ${nextDate}</p>` : ''}
                    <p class="text-xs" style="margin-top:1rem; opacity:0.7">Rest is when your muscles grow stronger. Come back when you're fully recovered.</p>
                </div>
            </div>`;
        return;
    }
    c.innerHTML = `
        <div class="container">
            <h1>How do you feel?</h1>
            <p class="text-xs" style="margin-bottom:1rem; text-align:center; opacity:0.8">Your recovery state adjusts recommended weights</p>
            ${check.isFirst ? `
                <div class="card" style="border-color:var(--accent)">
                    <h3>🎯 First Session</h3>
                    <p class="text-xs">Start conservative. Pick weights you can lift for 12 reps with good form. The app will auto-progress from here.</p>
                </div>` : ''}
            ${check.warning ? `
                <div class="card" style="border-color:var(--warning)">
                    <h3>⚠️ Long Gap Detected</h3>
                    <p class="text-xs">It's been ${check.days} days. For safety, weights have been reduced 10%. Better to start light and progress quickly.</p>
                </div>` : ''}
            <div class="card" onclick="window.setRec('green')" style="cursor:pointer" tabindex="0" role="button" aria-label="Select green recovery status">
                <h3 style="color:var(--success)">✓ Green - Full Strength</h3>
                <p class="text-xs">Well rested, feeling strong. Use full recommended weights with normal progression (+5 lbs on success).</p>
            </div>
            <div class="card" onclick="window.setRec('yellow')" style="cursor:pointer" tabindex="0" role="button" aria-label="Select yellow recovery status">
                <h3 style="color:var(--warning)">⚠ Yellow - Moderate Recovery</h3>
                <p class="text-xs">Tired, sore, or stressed. Use 90% of recommended weights. Still effective training, just lower intensity.</p>
            </div>
            <div class="card" onclick="window.setRec('red')" style="cursor:pointer" tabindex="0" role="button" aria-label="Select red recovery status">
                <h3 style="color:var(--error)">✕ Red - Poor Recovery</h3>
                <p class="text-xs">Sick, injured, or exhausted. Skip strength training. Take a walk instead. Come back when you feel better.</p>
            </div>
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
                const w = Calculator.getRecommendedWeight(ex.id, State.recovery, sessions);
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
    const allSessions = Storage.getSessions().slice().reverse();
    const limit = State.historyLimit || 20;
    const s = allSessions.slice(0, limit);

    c.innerHTML = `<div class="container"><h1>History</h1>${s.length===0?'<div class="card"><p>No logs yet.</p></div>':s.map(x=>`
        <div class="card">
            <div class="flex-row" style="justify-content:space-between">
                <div><h3>${Validator.formatDate(x.date)}</h3><span class="text-xs" style="border:1px solid var(--border); padding:0.125rem 0.375rem; border-radius:var(--radius-sm)">${Sanitizer.sanitizeString(x.recoveryStatus).toUpperCase()}</span></div>
                <button class="btn btn-secondary" style="width:auto; padding:0.25rem 0.75rem" onclick="window.del('${x.id.replace(/['"\\]/g, '')}')">✕</button>
            </div>
            <details style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.5rem;">
                <summary class="text-xs" style="cursor:pointer; padding:0.5rem 0; opacity:0.8">View Details</summary>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">WARMUP</div>
                <div class="text-xs" style="margin-bottom:1rem; line-height:1.4">${x.warmup ? x.warmup.map(w => w.completed ? `✓ ${Sanitizer.sanitizeString(w.altUsed || w.id)} ` : '').join('') : 'No Data'}</div>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">LIFTING</div>
                ${x.exercises.map(e => {
                     // Name Display Fix
                     const rawName = e.altName || e.name || EXERCISES.find(cfg=>cfg.id===e.id)?.name || e.id;
                     const displayName = Sanitizer.sanitizeString(rawName);
                     return `<div class="flex-row" style="justify-content:space-between; font-size:0.85rem; margin-bottom:0.25rem; ${e.skipped ? 'opacity:0.5; text-decoration:line-through' : ''}"><span>${displayName}</span><span>${e.weight} lbs</span></div>`
                }).join('')}
                <div class="text-xs" style="margin:1rem 0 0.5rem 0; color:var(--accent)">FINISHER</div>
                <div class="text-xs">
                    Cardio: ${Sanitizer.sanitizeString(x.cardio?.type || 'N/A')}<br>
                    Decompress: ${Array.isArray(x.decompress) ? (x.decompress.every(d=>d.completed) ? 'Full Session' : 'Partial') : (x.decompress?.completed ? 'Completed' : 'Skipped')}
                </div>
            </details>
        </div>`).join('')}
        ${limit < allSessions.length ? `<button id="load-more-btn" class="btn btn-secondary" style="width:100%; margin-top:1rem; padding:1rem">Load More (${allSessions.length - limit} remaining)</button>` : ''}
        </div>`;

    const loadMoreBtn = c.querySelector('#load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', window.loadMoreHistory);
    }
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
        </div>`;
}

// === HANDLERS ===
window.setRec = async (r) => {
    Metrics.mark('recovery-select-start');

    if (r === 'red') {
        Logger.info('Red recovery selected - workout skipped', { recovery: r });
        Analytics.track('recovery_selected', { status: 'red', action: 'skipped' });
        ScreenReader.announce('Red recovery status selected. Rest day recommended.');
        return Modal.show({
            title: 'Take a Rest Day',
            text: 'Your body needs recovery. Strength training in this state increases injury risk and reduces effectiveness.\n\nRecommendation: Take a 20-30 minute walk instead. Light movement aids recovery without adding stress. Come back when you feel better.',
            danger: true
        });
    }

    State.recovery = r;
    State.activeSession = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        recoveryStatus: r,
        exercises: []
    };
    State.phase = 'warmup';

    Logger.info('Workout started', { recovery: r, sessionId: State.activeSession.id });
    Analytics.track('recovery_selected', { status: r });
    ScreenReader.announce(`${r === 'green' ? 'Full strength' : 'Reduced weight'} recovery selected. Starting warmup.`);

    Metrics.measure('recovery-select', 'recovery-select-start');
    render();
};
window.modW = (id, d) => {
    try {
        const el = document.getElementById(`w-${id}`);
        if (!el) {
            console.error(`Weight input not found: w-${id}`);
            return;
        }
        const currentValue = parseFloat(el.value) || 0;
        el.value = Math.max(0, currentValue + d);
        Haptics.light();
    } catch (e) {
        console.error('Error modifying weight:', e);
    }
};

window.togS = (ex, i, max) => {
    try {
        const el = document.getElementById(`s-${ex}-${i}`);
        if (!el) {
            console.error(`Set button not found: s-${ex}-${i}`);
            return;
        }
        if(el.classList.toggle('completed')) {
            Haptics.success();
            // Auto-start rest timer if not the last set
            if(i < max-1) Timer.start();
        }
    } catch (e) {
        console.error('Error toggling set:', e);
    }
};

window.swapAlt = (id) => {
    try {
        const selElement = document.getElementById(`alt-${id}`);
        if (!selElement) {
            console.error(`Alternative selector not found: alt-${id}`);
            return;
        }
        const sel = selElement.value;
        const cfg = EXERCISES.find(e => e.id === id) || WARMUP.find(w => w.id === id) || DECOMPRESSION.find(d => d.id === id);
        if (!cfg) {
            console.error(`Exercise config not found: ${id}`);
            return;
        }
        const vidElement = document.getElementById(`vid-${id}`);
        const nameElement = document.getElementById(`name-${id}`);

        if (vidElement) {
            vidElement.href = sel && cfg.altLinks[sel] ? cfg.altLinks[sel] : cfg.video;
        }
        if (nameElement) {
            nameElement.innerHTML = sel || cfg.name;
        }
    } catch (e) {
        console.error('Error swapping alternative:', e);
    }
};

window.swapCardioLink = () => {
    try {
        const cardioTypeElement = document.getElementById('cardio-type');
        if (!cardioTypeElement) {
            console.error('Cardio type selector not found');
            return;
        }
        const selName = cardioTypeElement.value;
        const cfg = CARDIO_OPTIONS.find(o => o.name === selName);
        if (cfg) {
            const vidElement = document.getElementById('cardio-vid');
            if (vidElement) {
                vidElement.href = cfg.video;
            }
        }
    } catch (e) {
        console.error('Error swapping cardio link:', e);
    }
};

window.nextPhase = (p) => {
    try {
        if(p === 'lifting') {
            State.activeSession.warmup = WARMUP.map(w => {
                const checkElement = document.getElementById(`w-${w.id}`);
                const altElement = document.getElementById(`alt-${w.id}`);
                return {
                    id: w.id,
                    completed: checkElement ? checkElement.checked : false,
                    altUsed: altElement ? altElement.value : ''
                };
            });
        }

        if(p === 'cardio') {
            State.activeSession.exercises = EXERCISES.map(ex => {
                const weightElement = document.getElementById(`w-${ex.id}`);
                const w = weightElement ? (parseFloat(weightElement.value) || 0) : 0;
                const sets = document.querySelectorAll(`#card-${ex.id} .set-btn.completed`).length;
                const altElement = document.getElementById(`alt-${ex.id}`);
                const alt = altElement ? altElement.value : '';
                return {
                    id: ex.id,
                    name: ex.name,
                    weight: w,
                    setsCompleted: sets,
                    completed: sets === ex.sets,
                    usingAlternative: !!alt,
                    altName: alt
                };
            });
        }

        if(p === 'decompress') {
            const cardioTypeElement = document.getElementById('cardio-type');
            const cardioDoneElement = document.getElementById('cardio-done');
            State.activeSession.cardio = {
                type: cardioTypeElement ? cardioTypeElement.value : 'Unknown',
                completed: cardioDoneElement ? cardioDoneElement.checked : false
            };
        }

        State.phase = p;
        Logger.info('Phase transition', { from: State.phase, to: p });
        Analytics.track('phase_transition', { phase: p });

        const phaseNames = {
            warmup: 'Warmup',
            lifting: 'Lifting',
            cardio: 'Cardio',
            decompress: 'Decompression'
        };
        ScreenReader.announce(`Starting ${phaseNames[p] || p} phase`);

        render();
    } catch (e) {
        Logger.error('Error transitioning phase', { phase: p, error: e.message });
        console.error('Error transitioning phase:', e);
        alert('Error saving progress. Please try again.');
    }
};
window.finish = async () => {
    try {
        if(!await Modal.show({ type: 'confirm', title: 'Finish?', text: 'Save this session?' })) return;

        State.activeSession.decompress = DECOMPRESSION.map(d => {
            const valElement = document.getElementById(`val-${d.id}`);
            const doneElement = document.getElementById(`done-${d.id}`);
            const altElement = document.getElementById(`alt-${d.id}`);
            return {
                id: d.id,
                val: valElement?.value || null,
                completed: doneElement ? doneElement.checked : false,
                altUsed: altElement ? altElement.value : ''
            };
        });

        Metrics.mark('session-save-start');
        const savedSession = Storage.saveSession(State.activeSession);

        Logger.info('Session completed', {
            sessionId: savedSession.id,
            sessionNumber: savedSession.sessionNumber,
            totalVolume: savedSession.totalVolume,
            recovery: savedSession.recoveryStatus
        });

        Analytics.track('session_completed', {
            sessionNumber: savedSession.sessionNumber,
            weekNumber: savedSession.weekNumber,
            recovery: savedSession.recoveryStatus,
            exercises: savedSession.exercises.length
        });

        const saveTime = Metrics.measure('session-save', 'session-save-start');
        Logger.debug('Session save performance', { duration: `${saveTime?.toFixed(2)}ms` });

        ScreenReader.announce(`Workout completed successfully. Session ${savedSession.sessionNumber} saved.`, 'assertive');

        State.view = 'history';
        State.phase = null;
        State.recovery = null;
        render();
    } catch (e) {
        Logger.error('Failed to save session', {
            sessionId: State.activeSession?.id,
            error: e.message,
            stack: e.stack
        });
        console.error('Error finishing session:', e);
        ScreenReader.announce('Failed to save workout. Please try exporting your data.', 'assertive');
        alert('Failed to save session. Your data may not be saved. Please try exporting as backup.');
    }
};
window.skipTimer = () => { Haptics.heavy(); Timer.stop(); };
window.startCardio = () => Timer.start(300);
window.loadMoreHistory = () => {
    State.historyLimit = (State.historyLimit || 20) + 20;
    render();
};
window.del = async (id) => { if(await Modal.show({type:'confirm',title:'Delete?',danger:true})) { Storage.deleteSession(id); render(); }};
window.wipe = async () => { if(await Modal.show({type:'confirm',title:'RESET ALL?',danger:true})) Storage.reset(); };
window.imp = (el) => { const r = new FileReader(); r.onload = e => Storage.importData(e.target.result); if(el.files[0]) r.readAsText(el.files[0]); };

// === SVG CHARTING ===
window.drawChart = (id) => {
    try {
        const div = document.getElementById('chart-area');
        if (!div) {
            console.error('Chart area element not found');
            return;
        }

        const s = Storage.getSessions().filter(x=>x.exercises.find(e=>e.id===id && !e.usingAlternative));
        if(s.length < 2) {
            div.innerHTML = '<p style="padding:1rem;color:#666">Need 2+ logs.</p>';
            return;
        }

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
    } catch (e) {
        console.error('Error drawing chart:', e);
        const div = document.getElementById('chart-area');
        if (div) {
            div.innerHTML = '<p style="padding:1rem;color:var(--error)">Error rendering chart.</p>';
        }
    }
};

// === GLOBAL EVENT LISTENERS ===
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-item');
        if (target.dataset.view === 'history' && State.view !== 'history') {
            State.historyLimit = 20;
        }
        State.view = target.dataset.view;
        render();
    });
});

// === INITIALIZATION ===
// Initialize all mission-critical systems
(async function initializeSystems() {
    // Mark performance start
    Metrics.mark('app-init-start');

    // 1. Initialize observability first (for logging other initializations)
    Observability.init();
    Logger.info('🚀 Flexx Files v3.9 - Mission-Critical Mode');

    // 2. Initialize security system
    Security.init();
    Logger.info('Security system active');

    // 3. Initialize accessibility system
    Accessibility.init();
    Logger.info('Accessibility system active (WCAG 2.1 AA)');

    // 4. Initialize internationalization
    I18n.init();
    Logger.info('i18n system active', { locale: I18n.currentLocale });

    // 5. Run database migrations
    Storage.runMigrations();
    Logger.info('Database migrations complete');

    // 6. Check for draft recovery
    const draft = Storage.loadDraft();
    if (draft) {
        const restore = await Modal.show({
            type: 'confirm',
            title: 'Recover Session?',
            text: `Found unsaved session from ${DateFormatter.relative(draft.date)}. Restore it?`
        });
        if (restore) {
            State.activeSession = draft;
            State.recovery = draft.recoveryStatus;
            State.phase = 'lifting'; // Resume at lifting phase
            Logger.info('Draft session restored', { id: draft.id });
            ScreenReader.announce('Previous session recovered successfully');
        } else {
            Storage.clearDraft();
            Logger.info('Draft session discarded');
        }
    }

    // 7. Register service worker for offline capability
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
            Logger.info('Service worker registered');
        } catch (e) {
            Logger.warn('Service worker registration failed', { error: e.message });
        }
    }

    // 8. Track app startup
    Analytics.track('app_start', {
        version: '3.9',
        platform: navigator.platform,
        online: navigator.onLine
    });

    // Measure initialization time
    const initTime = Metrics.measure('app-init', 'app-init-start');
    Logger.info('App initialized', {
        duration: `${initTime?.toFixed(2)}ms`,
        sessions: Storage.getSessions().length
    });

    // 9. Render the app
    render();

    // 10. Auto-save drafts every 30 seconds if session is active
    setInterval(() => {
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Logger.debug('Draft auto-saved', { id: State.activeSession.id });
        }
    }, 30000); // 30 seconds

})().catch(error => {
    console.error('Fatal initialization error:', error);
    alert('Failed to initialize app. Please refresh the page.');
});