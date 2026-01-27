import { EXERCISES, WARMUP, DECOMPRESSION, CARDIO_OPTIONS, RECOVERY_CONFIG } from './config.js';
import { Storage, Calculator, Validator } from './core.js';
import { Observability, Logger, Metrics, Analytics } from './observability.js';
import { Accessibility, ScreenReader } from './accessibility.js';
import { Security, Sanitizer } from './security.js';
import { I18n, DateFormatter } from './i18n.js';
import { MAX_IMPORT_FILE_SIZE_MB, ERROR_MESSAGES, APP_VERSION, STORAGE_VERSION } from './constants.js';

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
            opts.html ? this.body.innerHTML = Sanitizer.sanitizeHTML(opts.html) : this.body.innerText = opts.text || '';
            this.actions.innerHTML = '';
            if (opts.type === 'confirm') {
                const cancel = document.createElement('button');
                cancel.className = 'btn-modal btn-ghost';
                cancel.innerText = 'Cancel';
                cancel.setAttribute('aria-label', 'Cancel and close dialog');
                cancel.onclick = () => this.close(false);
                this.actions.appendChild(cancel);
            }
            const ok = document.createElement('button');
            ok.className = opts.danger ? 'btn-modal btn-danger' : 'btn-modal btn-confirm';
            ok.innerText = opts.okText || 'OK';
            ok.setAttribute('aria-label', opts.okText ? `${opts.okText} and close dialog` : 'Confirm and close dialog');
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
        if (rem <= 0) {
            this.stop();
            Haptics.success();
            ScreenReader.announce('Rest period complete. Ready for next set.');
            return;
        }
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
            const isActive = el.dataset.view === State.view;
            el.classList.toggle('active', isActive);
            if (isActive) el.setAttribute('aria-current', 'page');
            else el.removeAttribute('aria-current');
        });

        main.innerHTML = '';
        main.className = 'fade-in';

        switch (State.view) {
            case 'today': renderToday(main); break;
            case 'history': renderHistory(main); break;
            case 'progress': renderProgress(main); break;
            case 'settings': renderSettings(main); break;
            case 'protocol': renderProtocol(main); break;
            default:
                console.warn(`Unknown view: ${State.view}`);
                renderToday(main);
        }

        // Accessibility: Move focus to main content on view change
        // This ensures screen readers announce the new content and keyboard users aren't lost
        main.focus();
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
                    <h3>You need 24-48 hours between workouts</h3>
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
            <p class="text-xs" style="margin-bottom:1rem; text-align:center; opacity:0.8">Assess yourself immediately before training.</p>
            ${check.isFirst ? `
                <div class="card" style="border-color:var(--accent)">
                    <h3>🎯 Calibration Day</h3>
                    <p class="text-xs">Find a weight where you can complete 12 reps with good form but have 2 reps left in the tank (RPE 8). Stop sets at 12.</p>
                </div>` : ''}
            ${check.warning ? `
                <div class="card" style="border-color:var(--warning)">
                    <h3>⚠️ Long Gap Detected</h3>
                    <p class="text-xs">It's been ${check.days} days. For safety, weights have been reduced 10%. Better to start light and progress quickly.</p>
                </div>` : ''}
            <button type="button" class="card" onclick="window.setRec('green')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--success)">✓ Green - Full Strength</h3>
                <p class="text-xs">7+ hours sleep, no pain. Train at scheduled weights.</p>
            </button>
            <button type="button" class="card" onclick="window.setRec('yellow')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--warning)">⚠ Yellow - Moderate Recovery</h3>
                <p class="text-xs">5–6 hours sleep, general stiffness or fatigue. Weights reduced by 10%.</p>
            </button>
            <button type="button" class="card" onclick="window.setRec('red')" style="cursor:pointer; width:100%; text-align:left; font-family:inherit; font-size:inherit; color:inherit">
                <h3 style="color:var(--error)">✕ Red - Poor Recovery</h3>
                <p class="text-xs">< 5 hours sleep, acute pain, or illness. Do Not Lift. Go for a walk only.</p>
            </button>
        </div>`;
}

function renderWarmup(c) {
    let warmupHtml = '';
    for (const w of WARMUP) {
        warmupHtml += `
            <div style="margin-bottom:1.5rem; border-bottom:1px solid #333; padding-bottom:1rem;">
                <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                    <label class="checkbox-wrapper" style="margin:0; padding:0; background:none; border:none; width:auto; cursor:pointer" for="w-${w.id}">
                        <input type="checkbox" class="big-check" id="w-${w.id}">
                        <div><div id="name-${w.id}">${w.name}</div><div class="text-xs">${w.reps}</div></div>
                    </label>
                    <a id="vid-${w.id}" href="${Sanitizer.sanitizeURL(w.video)}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none; padding-left:1rem;" aria-label="Watch video for ${w.name}">🎥</a>
                </div>
                <details><summary class="text-xs" style="opacity:0.7; cursor:pointer">Alternatives</summary>
                    <select id="alt-${w.id}" onchange="window.swapAlt('${w.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);" aria-label="Select alternative for ${w.name}">
                        <option value="">${w.name}</option>
                        ${w.alternatives.map(a => `<option value="${a}">${a}</option>`).join('')}
                    </select>
                </details>
            </div>`;
    }

    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:1rem;">
                <h1>Warmup</h1>
                <span class="text-xs" style="opacity:0.8">Circuit • No Rest</span>
            </div>
            <div class="card">
        ${warmupHtml}
        </div><button class="btn btn-primary" onclick="window.nextPhase('lifting')" aria-label="Start lifting phase">Start Lifting</button></div>`;
}

function renderLifting(c) {
    const sessions = Storage.getSessions();
    const isDeload = Calculator.isDeloadWeek(sessions);

    let exercisesHtml = '';
    for (const ex of EXERCISES) {
        // Check state first for persistence
        const activeEx = State.activeSession?.exercises?.find(e => e.id === ex.id);
        const hasAlt = activeEx?.usingAlternative;
        const name = Sanitizer.sanitizeString(hasAlt ? activeEx.altName : ex.name);
        const vid = hasAlt && ex.altLinks?.[activeEx.altName] ? ex.altLinks[activeEx.altName] : ex.video;

        const w = activeEx ? activeEx.weight : Calculator.getRecommendedWeight(ex.id, State.recovery, sessions);
        const last = Calculator.getLastCompletedExercise(ex.id, sessions);
        const lastText = last ? `Last: ${last.weight} lbs` : 'First Session';

        // Optimization: Use for loop to avoid garbage collection pressure from Array.from
        let setButtonsHtml = '';
        for (let i = 0; i < ex.sets; i++) {
            setButtonsHtml += `<button type="button" class="set-btn" id="s-${ex.id}-${i}" onclick="window.togS('${ex.id}',${i},${ex.sets})" aria-label="Set ${i+1}" aria-pressed="false">${i+1}</button>`;
        }

        exercisesHtml += `
        <div class="card" id="card-${ex.id}">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:0.25rem;">
                <div>
                    <div class="text-xs" style="color:var(--accent)">${ex.category}</div>
                    <h2 id="name-${ex.id}" style="margin-bottom:0">${name}</h2>
                    <div class="text-xs" style="opacity:0.6; margin-bottom:0.5rem">${lastText}</div>
                </div>
                <a id="vid-${ex.id}" href="${Sanitizer.sanitizeURL(vid)}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${name}">🎥</a>
            </div>
            <div class="stepper-control">
                <button class="stepper-btn" onclick="window.modW('${ex.id}', -2.5)" aria-label="Decrease weight for ${name}">−</button>
                <input type="number" class="stepper-value" id="w-${ex.id}" value="${w}" step="2.5" readonly inputmode="none" aria-label="Weight for ${name}">
                <button class="stepper-btn" onclick="window.modW('${ex.id}', 2.5)" aria-label="Increase weight for ${name}">+</button>
            </div>
            <div id="pl-${ex.id}" class="text-xs" style="text-align:center; font-family:monospace; margin:0.5rem 0 1rem 0; color:var(--text-secondary)" aria-live="polite">${Calculator.getPlateLoad(w)} / side</div>
            <div class="set-group" role="group" aria-label="Sets for ${name}">
                ${setButtonsHtml}
            </div>
            <details class="mt-4" style="margin-top:1rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                <summary class="text-xs">Alternatives</summary>
                <select id="alt-${ex.id}" onchange="window.swapAlt('${ex.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none" aria-label="Select alternative for ${ex.name}">
                    <option value="">${ex.name}</option>
                    ${ex.alternatives.map(a=>`<option value="${a}" ${hasAlt && activeEx.altName === a ? 'selected' : ''}>${a}</option>`).join('')}
                </select>
            </details>
        </div>`;
    }

    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                <h1>Lifting</h1>
                <div class="flex-row" style="gap:0.5rem">
                    ${isDeload ? `<span class="text-xs" style="border:1px solid var(--accent); color:var(--accent); padding:0.25rem 0.5rem; border-radius:0.75rem">DELOAD WEEK</span>` : ''}
                    <span class="text-xs" style="border:1px solid var(--border); padding:0.25rem 0.5rem; border-radius:0.75rem">${State.recovery.toUpperCase()}</span>
                </div>
            </div>
            <p class="text-xs" style="margin-bottom:1.5rem; text-align:center; opacity:0.8">Tempo: 3s down (eccentric) • 1s up (concentric)</p>
            ${exercisesHtml}
            <button class="btn btn-primary" onclick="window.nextPhase('cardio')" aria-label="Proceed to cardio phase">Next: Cardio</button>
        </div>`;
}

function renderCardio(c) {
    const defaultLink = CARDIO_OPTIONS[0].video;
    c.innerHTML = `
        <div class="container"><h1>Cardio</h1><div class="card">
            <div class="flex-row" style="justify-content:space-between; margin-bottom:1rem;"><h3>Selection</h3><a id="cardio-vid" href="${Sanitizer.sanitizeURL(defaultLink)}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${CARDIO_OPTIONS[0].name}">🎥</a></div>
            <select id="cardio-type" onchange="window.swapCardioLink()" style="width:100%; padding:1rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem;" aria-label="Select cardio type">${CARDIO_OPTIONS.map(o=>`<option value="${o.name}">${o.name}</option>`).join('')}</select>
            <button class="btn btn-secondary" onclick="window.startCardio()" aria-label="Start 5 minute cardio timer">Start 5m Timer</button>
            <label class="checkbox-wrapper" style="margin-top:1rem; cursor:pointer" for="cardio-done"><input type="checkbox" class="big-check" id="cardio-done"><span>Completed</span></label>
        </div><button class="btn btn-primary" onclick="window.nextPhase('decompress')" aria-label="Proceed to decompression phase">Next: Decompress</button></div>`;
}

function renderDecompress(c) {
    let decompressHtml = '';
    for (const d of DECOMPRESSION) {
        decompressHtml += `
            <div class="card">
                <div class="flex-row" style="justify-content:space-between; margin-bottom:0.5rem;">
                    <h3 id="name-${d.id}">${d.name}</h3>
                    <a id="vid-${d.id}" href="${Sanitizer.sanitizeURL(d.video)}" target="_blank" rel="noopener noreferrer" style="font-size:1.5rem; text-decoration:none" aria-label="Watch video for ${d.name}">🎥</a>
                </div>
                ${d.inputLabel ? `<input type="number" id="val-${d.id}" placeholder="${d.inputLabel}" aria-label="${d.inputLabel} for ${d.name}" style="width:100%; padding:1rem; background:var(--bg-secondary); border:none; color:white; margin-bottom:0.5rem">` : `<p class="text-xs" style="margin-bottom:0.5rem">Sit on bench. Reset CNS.</p>`}
                <label class="checkbox-wrapper" style="cursor:pointer" for="done-${d.id}"><input type="checkbox" class="big-check" id="done-${d.id}"><span>Completed</span></label>
                <details style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border)">
                    <summary class="text-xs" style="opacity:0.7; cursor:pointer">Alternatives</summary>
                    <select id="alt-${d.id}" onchange="window.swapAlt('${d.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:var(--radius-sm);" aria-label="Select alternative for ${d.name}">
                        <option value="">Default</option>
                        ${d.alternatives.map(a => `<option value="${a}">${a}</option>`).join('')}
                    </select>
                </details>
            </div>`;
    }

    c.innerHTML = `
        <div class="container"><h1>Decompress</h1>
            ${decompressHtml}
            <button class="btn btn-primary" onclick="window.finish()" aria-label="Save workout and finish session">Save & Finish</button>
        </div>`;
}

function renderHistory(c) {
    // Optimization: Create map for O(1) lookup
    const exerciseMap = new Map(EXERCISES.map(e => [e.id, e]));

    // Optimization: Iterating backwards avoids O(N) copy & reverse of entire history array
    const sessions = Storage.getSessions();
    const limit = State.historyLimit || 20;
    const s = [];
    for (let i = sessions.length - 1; i >= 0 && s.length < limit; i--) {
        s.push(sessions[i]);
    }

    c.innerHTML = `<div class="container"><h1>History</h1>${s.length===0?'<div class="card"><p>No logs yet.</p></div>':s.map(x=>`
        <div class="card">
            <div class="flex-row" style="justify-content:space-between">
                <div><h3>${Validator.formatDate(x.date)}</h3><span class="text-xs" style="border:1px solid var(--border); padding:0.125rem 0.375rem; border-radius:var(--radius-sm)">${Sanitizer.sanitizeString(x.recoveryStatus).toUpperCase()}</span></div>
                <button class="btn btn-secondary btn-delete-session" style="width:auto; padding:0.25rem 0.75rem" data-session-id="${x.id}" aria-label="Delete session from ${Validator.formatDate(x.date)}">✕</button>
            </div>
            <details style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.5rem;">
                <summary class="text-xs" style="cursor:pointer; padding:0.5rem 0; opacity:0.8">View Details</summary>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">WARMUP</div>
                <div class="text-xs" style="margin-bottom:1rem; line-height:1.4">${x.warmup ? x.warmup.map(w => w.completed ? `✓ ${Sanitizer.sanitizeString(w.altUsed || w.id)} ` : '').join('') : 'No Data'}</div>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">LIFTING</div>
                ${x.exercises.map(e => {
                     // Name Display Fix
                     const rawName = e.altName || e.name || exerciseMap.get(e.id)?.name || e.id;
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
        ${limit < sessions.length ? `<button id="load-more-btn" class="btn btn-secondary" style="width:100%; margin-top:1rem; padding:1rem">Load More (${sessions.length - limit} remaining)</button>` : ''}
        </div>`;

    const loadMoreBtn = c.querySelector('#load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', window.loadMoreHistory);
    }

}

function renderProgress(c) {
    c.innerHTML = `<div class="container"><h1>Progress</h1><div class="card"><select id="chart-ex" onchange="window.drawChart(this.value)" aria-label="Select exercise for progress chart" style="width:100%; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem; border-radius:var(--radius-sm);">${EXERCISES.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select><div id="chart-area" style="min-height:250px"></div></div></div>`;
    setTimeout(()=>window.drawChart('hinge'),100);
}

function renderSettings(c) {
    c.innerHTML = `
        <div class="container">
            <h1>Settings</h1>
            <div class="card">
                <button class="btn btn-secondary" onclick="window.viewProtocol()" aria-label="View Complete Strength Protocol guide">📖 Protocol Guide</button>
            </div>
            <div class="card">
                <button class="btn btn-secondary" id="backup-btn">Backup Data</button>
                <div style="position:relative; margin-top:0.5rem">
                    <button class="btn btn-secondary" tabindex="-1" aria-hidden="true">Restore Data</button>
                    <input type="file" onchange="window.imp(this)" aria-label="Restore Data from Backup"
                           onfocus="this.previousElementSibling.style.outline='2px solid var(--accent)';this.previousElementSibling.style.outlineOffset='2px'"
                           onblur="this.previousElementSibling.style.outline=''"
                           style="position:absolute;top:0;left:0;opacity:0;width:100%;height:100%">
                </div>
                <button class="btn btn-secondary" style="margin-top:0.5rem; color:var(--error)" onclick="window.wipe()" aria-label="Factory reset - delete all data">Factory Reset</button>
            </div>
            <div class="text-xs" style="text-align:center; margin-top:2rem; opacity:0.5">
                v${APP_VERSION} (${STORAGE_VERSION})
            </div>
        </div>`;

    const backupBtn = c.querySelector('#backup-btn');
    if (backupBtn) {
        backupBtn.addEventListener('click', () => Storage.exportData());
    }
}

function renderProtocol(c) {
    c.innerHTML = `
        <div class="container">
            <div class="flex-row" style="margin-bottom:1rem">
                <button class="btn btn-secondary" style="width:auto; padding:0.5rem 1rem" onclick="State.view='settings';render()" aria-label="Back to settings">← Back</button>
            </div>
            <h1>The Protocol</h1>
            <div class="card">
                <h3 style="color:var(--accent)">Hygiene Protocol</h3>
                <p class="text-xs" style="margin-bottom:1rem">All movements are designed to be performed standing, seated, or on a bench to ensure hygiene and minimize floor contact.</p>

                <h3 style="color:var(--accent)">Overview</h3>
                <ul class="text-xs" style="padding-left:1.2rem; line-height:1.6">
                    <li><strong>Schedule:</strong> 3 days/week (e.g., Mon/Wed/Fri)</li>
                    <li><strong>Time:</strong> 65 Minutes hard cap</li>
                    <li><strong>Spacing:</strong> 48–72 hours rest required</li>
                </ul>
            </div>

            <div class="card">
                <h3 style="color:var(--warning)">Fault Tolerance</h3>
                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:0.5rem; font-size:0.8rem; margin-top:0.5rem">
                    <div>Missed 1</div><div>Slide schedule (maintain 48h gap)</div>
                    <div>Missed 2+</div><div>Reduce weights 10%</div>
                    <div>Sick (Fever)</div><div>FULL REST. Resume 24h after fever. Reduce 20%.</div>
                    <div>Injury</div><div>Skip aggravating exercise. Do others.</div>
                </div>
            </div>

            <div class="card" style="border-color:var(--error)">
                <h3>🚨 Gym Closed?</h3>
                <p class="text-xs" style="margin-bottom:0.5rem">Emergency Bodyweight Circuit. 4 Rounds, AMRAP, 90s rest between rounds.</p>
                <ul class="text-xs" style="padding-left:1.2rem; line-height:1.6">
                    <li><strong>Push:</strong> Incline Push-ups (Hands on furniture)</li>
                    <li><strong>Legs:</strong> Bodyweight Squats (Tempo: 3s down)</li>
                    <li><strong>Pull:</strong> Inverted Rows (Table) OR Door Rows</li>
                    <li><strong>Core:</strong> Hardstyle Plank</li>
                </ul>
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

    Haptics.success(); // Tactile feedback for start
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
        const newValue = Math.max(0, currentValue + d);
        el.value = newValue;

        // Persistence: Update active session state
        const activeEx = State.activeSession?.exercises?.find(e => e.id === id);
        if (activeEx) activeEx.weight = newValue;

        // Palette: Update plate math display in real-time
        const plateEl = document.getElementById(`pl-${id}`);
        if (plateEl) {
            plateEl.textContent = `${Calculator.getPlateLoad(newValue)} / side`;
        }

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
        const isCompleted = el.classList.toggle('completed');
        el.setAttribute('aria-pressed', isCompleted);

        if(isCompleted) {
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
            vidElement.href = Sanitizer.sanitizeURL(sel && cfg.altLinks[sel] ? cfg.altLinks[sel] : cfg.video);
            vidElement.rel = 'noopener noreferrer';
            vidElement.setAttribute('aria-label', `Watch video for ${sel || cfg.name}`);
        }
        if (nameElement) {
            nameElement.textContent = sel || cfg.name;
        }

        // Persist alternative choice to state immediately
        if (State.activeSession) {
            if (State.phase === 'lifting') {
                const ex = State.activeSession.exercises.find(e => e.id === id);
                if (ex) {
                    ex.usingAlternative = !!sel;
                    ex.altName = sel;
                }
            } else if (State.phase === 'warmup') {
                const w = State.activeSession.warmup.find(e => e.id === id);
                if (w) w.altUsed = sel;
            } else if (State.phase === 'decompress') {
                const d = State.activeSession.decompress.find(e => e.id === id);
                if (d) d.altUsed = sel;
            }
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
                vidElement.href = Sanitizer.sanitizeURL(cfg.video);
                vidElement.rel = 'noopener noreferrer';
                vidElement.setAttribute('aria-label', `Watch video for ${cfg.name}`);
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

            // Initialize exercises with recommended weights for persistence
            const sessions = Storage.getSessions();
            State.activeSession.exercises = EXERCISES.map(ex => ({
                id: ex.id,
                name: ex.name,
                weight: Calculator.getRecommendedWeight(ex.id, State.recovery, sessions),
                setsCompleted: 0,
                completed: false,
                usingAlternative: false,
                skipped: false
            }));
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
        ScreenReader.announce('Error saving progress. Please try again.', 'assertive');
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

        Haptics.success(); // Tactile feedback for completion
        State.view = 'history';
        State.phase = null;
        State.recovery = null;
        render();
    } catch (e) {
        Logger.error('Failed to save session', {
            sessionId: State.activeSession?.id,
            error: e.message
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

    // Palette: Restore focus to new 'Load More' button or last item to prevent context loss
    const btn = document.getElementById('load-more-btn');
    if (btn) {
        btn.focus();
    } else {
        const summaries = document.querySelectorAll('summary');
        if (summaries.length > 0) summaries[summaries.length - 1].focus();
    }
};
window.viewProtocol = () => {
    State.view = 'protocol';
    render();
};
window.del = async (id) => { if(await Modal.show({type:'confirm',title:'Delete?',danger:true})) { Storage.deleteSession(id); render(); }};
window.wipe = async () => { if(await Modal.show({type:'confirm',title:'RESET ALL?',danger:true})) Storage.reset(); };
window.imp = (el) => {
    const file = el.files[0];
    if (!file) return;

    // Sentinel: DoS prevention - validate file size before reading
    const maxSizeBytes = MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        Modal.show({
            type: 'error',
            title: 'File Too Large',
            message: ERROR_MESSAGES.IMPORT_FILE_TOO_LARGE
        });
        el.value = ''; // Reset input
        return;
    }

    const r = new FileReader();
    r.onload = e => Storage.importData(e.target.result);
    r.readAsText(file);
};

// === SVG CHARTING ===
const ChartCache = {
    // WeakMap<sessionsArray, Map<exerciseId, dataArray>>
    _cache: new WeakMap(),

    getData(exerciseId) {
        const sessions = Storage.getSessions();
        if (!this._cache.has(sessions)) {
            // Optimization: Index ALL exercises in one pass O(N)
            // This prevents re-scanning the session history for every chart switch
            const index = new Map();

            for (let i = 0; i < sessions.length; i++) {
                const s = sessions[i];
                if (!s.exercises) continue;

                for (let j = 0; j < s.exercises.length; j++) {
                    const ex = s.exercises[j];

                    if (!index.has(ex.id)) {
                        index.set(ex.id, { data: [], minVal: Infinity, maxVal: -Infinity });
                    }

                    if (!ex.usingAlternative) {
                        const entry = index.get(ex.id);
                        const v = ex.weight;
                        entry.data.push({ d: new Date(s.date), v });
                        if (v < entry.minVal) entry.minVal = v;
                        if (v > entry.maxVal) entry.maxVal = v;
                    }
                }
            }
            this._cache.set(sessions, index);
        }

        const sessionCache = this._cache.get(sessions);

        if (!sessionCache.has(exerciseId)) {
            return { data: [], minVal: Infinity, maxVal: -Infinity };
        }

        return sessionCache.get(exerciseId);
    }
};

window.drawChart = (id) => {
    try {
        const div = document.getElementById('chart-area');
        if (!div) {
            console.error('Chart area element not found');
            return;
        }

        const { data, minVal, maxVal } = ChartCache.getData(id);

        if (data.length < 2) {
            div.innerHTML = '<p style="padding:1rem;color:var(--text-secondary)">Need 2+ logs.</p>';
            return;
        }

        const max = maxVal * 1.1;
        const min = minVal * 0.9;
        const W = div.clientWidth || 300;
        const H = Math.max(200, Math.min(300, W * 0.6));
        const P = 20;

        // Sentinel: Sanitize coordinates to prevent SVG injection
        const safeNum = (n) => {
            const num = Number(n);
            return (isFinite(num) && !isNaN(num)) ? num.toFixed(2) : '0';
        };

        const X = i => safeNum(P + (i/(data.length-1)) * (W-P*2));
        const Y = v => safeNum(H - (P + ((v-min)/(max-min)) * (H-P*2)));

        let path = `M ${X(0)} ${Y(data[0].v)}`;
        data.forEach((p,i) => path += ` L ${X(i)} ${Y(p.v)}`);
        div.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight progression chart for ${EXERCISES.find(e => e.id === id)?.name || 'exercise'}">
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

// Fix for listener leak: Global delegation for delete buttons
const mainContent = document.getElementById('main-content');
if (mainContent) {
    mainContent.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-session');
        if (deleteBtn) {
            const sessionId = deleteBtn.getAttribute('data-session-id');
            if (sessionId) window.del(sessionId);
        }
    });
}

// === INITIALIZATION ===
// Initialize all mission-critical systems
(async function initializeSystems() {
    // Mark performance start
    Metrics.mark('app-init-start');

    // 1. Initialize observability first (for logging other initializations)
    Observability.init();
    Logger.info(`🚀 Flexx Files v${APP_VERSION} - Mission-Critical Mode`);

    // 2. Initialize security system
    Security.init(Logger);
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

    // 7. Register service worker for offline capability with update detection
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            Logger.info('Service worker registered');

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker available - notify user
                        showUpdateNotification(newWorker);
                    }
                });
            });

            // Detect controller change (update applied)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!window.__reloading) {
                    window.__reloading = true;
                    window.location.reload();
                }
            });
        } catch (e) {
            Logger.warn('Service worker registration failed', { error: e.message });
        }
    }

    // Update notification handler
    function showUpdateNotification(worker) {
        Modal.show({
            title: '✨ Update Available',
            text: 'A new version of Flexx Files is ready. Reload to apply the latest improvements and fixes.',
            type: 'confirm',
            okText: 'Reload Now'
        }).then(reload => {
            if (reload) {
                worker.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }

    // 8. Track app startup
    Analytics.track('app_start', {
        version: APP_VERSION,
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
    const draftAutoSaveInterval = setInterval(() => {
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
            Logger.debug('Draft auto-saved', { id: State.activeSession.id });
        }
    }, 30000); // 30 seconds

    // 11. Clean up resources on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(draftAutoSaveInterval);
        // Flush any pending session writes
        Storage.flushPersistence();
        // Final draft save before unload
        if (State.activeSession) {
            Storage.saveDraft(State.activeSession);
        }
    });

})().catch(error => {
    console.error('Fatal initialization error:', error);
    ScreenReader.announce('Failed to initialize app. Please refresh the page.', 'assertive');
    alert('Failed to initialize app. Please refresh the page.');
});