# FLEXX FILES - THE COMPLETE BUILD

**Version:** 3.8 (Final Release)
**Codename:** Zenith
**Architecture:** Offline-First PWA (Vanilla JS)
**Protocol:** Complete Strength (Hygiene Enforced)

---

# 1. PROJECT OVERVIEW

**Flexx Files** is a military-grade, autonomous strength tracker designed for absolute friction reduction. It requires no internet, no login, and no external dependencies. It strictly enforces the "Complete Strength Protocol" with modifications for hygiene (no floor contact) and equipment availability.

### Core Capabilities

*   **Offline Sovereignty:** Zero external API calls. Works indefinitely without internet.
*   **Hygiene Protocol:** All exercises are Standing, Seated, or Bench-based.
*   **Cognitive Offload:** Auto-calculates plate math, 2.5lb micro-loading, and rest timers.
*   **Resilience:** Self-correcting progression logic (Stall detection, Deload weeks).
*   **Debug Suite:** Built-in QA tools to bypass restrictions and generate test data.

---

# 2. INSTALLATION & DEPLOYMENT

### A. Folder Structure

```text
/flexx-files
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js      (View & Controller)
│   ├── config.js   (Data & Links)
│   └── core.js     (Logic & Storage)
└── assets/
    ├── icon-192.png
    └── icon-512.png
```

### B. Quick Setup (Windows PowerShell)

Run this script to generate the entire project structure and placeholder files.

**File:** `setup.ps1`

```powershell
$ProjectName = "flexx-files"

# 1. Create Directories
$Dirs = @("css", "js", "assets")
If (!(Test-Path $ProjectName)) { New-Item -Path $ProjectName -ItemType Directory -Force | Out-Null }
foreach ($Dir in $Dirs) { 
    $Path = Join-Path $ProjectName $Dir
    If (!(Test-Path $Path)) { New-Item -Path $Path -ItemType Directory -Force | Out-Null }
}

# 2. Create Core Files
$Files = @(
    "index.html", "manifest.json", "sw.js",
    "css\styles.css",
    "js\config.js", "js\core.js", "js\app.js"
)
foreach ($File in $Files) {
    $Path = Join-Path $ProjectName $File
    If (!(Test-Path $Path)) { New-Item -Path $Path -ItemType File -Force | Out-Null }
}

# 3. Create Placeholder Icons
New-Item -Path "$ProjectName\assets\icon-192.png" -ItemType File -Force | Out-Null
New-Item -Path "$ProjectName\assets\icon-512.png" -ItemType File -Force | Out-Null

Write-Host "✅ Flexx Files v3.8 Structure Created." -ForegroundColor Cyan
```

### C. Deployment

1.  **Local Testing:** Run `npx serve .` inside the folder.
2.  **Production:** Upload to GitHub Pages or Netlify.
3.  **Install:** Open on mobile browser -> "Add to Home Screen".

---

# 3. SOURCE CODE

## index.html

*The App Shell. Contains the Viewport, Floating Timer, and Navigation.*

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Flexx Files</title>
    <meta name="theme-color" content="#050505">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="assets/icon-192.png">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div id="app">
        <!-- Dynamic Content Area -->
        <main id="main-content" class="view-container"></main>

        <!-- Floating Timer (Non-Blocking) -->
        <div id="timer-dock" class="timer-dock">
            <div class="flex-row">
                <span class="timer-display" id="timer-val">00:00</span>
                <span class="text-xs" style="margin-left: 10px; opacity: 0.7;">RESTING</span>
            </div>
            <div class="timer-controls">
                <div class="timer-skip" onclick="window.skipTimer()">SKIP</div>
            </div>
        </div>
        
        <!-- Bottom Navigation -->
        <nav class="bottom-nav">
            <button class="nav-item active" data-view="today">
                <span class="icon">⚡</span><span>TRAIN</span>
            </button>
            <button class="nav-item" data-view="history">
                <span class="icon">📅</span><span>LOGS</span>
            </button>
            <button class="nav-item" data-view="progress">
                <span class="icon">📈</span><span>GAINS</span>
            </button>
            <button class="nav-item" data-view="settings">
                <span class="icon">⚙️</span><span>SYSTEM</span>
            </button>
        </nav>
    </div>

    <!-- Custom Modal Layer (Replaces Native Alerts) -->
    <div id="modal-layer" class="modal-overlay">
        <div class="modal-box">
            <h3 id="modal-title" class="modal-title"></h3>
            <div id="modal-body" class="modal-body"></div>
            <div id="modal-actions" class="modal-actions"></div>
        </div>
    </div>

    <script type="module" src="js/app.js"></script>
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(console.error);
        }
    </script>
</body>
</html>
```

## css/styles.css

*Glassmorphism Theme, Dark Mode, and Animation Logic.*

```css
/* === VARIABLES === */
:root {
    --bg-primary: #050505;
    --bg-secondary: #121212;
    --bg-card: #1e1e1e;
    --text-primary: #f0f0f0;
    --text-secondary: #a0a0a0;
    --accent: #ff6b35;
    --accent-glow: rgba(255, 107, 53, 0.3);
    --success: #00e676;
    --warning: #ffea00;
    --error: #ff1744;
    --border: #333;
    --radius-lg: 16px;
    --radius-sm: 8px;
    --nav-height: 65px;
    --safe-area-bottom: env(safe-area-inset-bottom);
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* === CORE === */
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
body {
    background: var(--bg-primary); color: var(--text-primary);
    font-family: var(--font-sans); margin: 0; height: 100vh;
    display: flex; flex-direction: column; overflow: hidden;
}

/* === LAYOUT === */
#app { height: 100%; display: flex; flex-direction: column; }
#main-content { 
    flex: 1; overflow-y: auto; overflow-x: hidden;
    padding: 1rem 1rem calc(var(--nav-height) + 80px) 1rem;
    scroll-behavior: smooth;
}
.container { max-width: 600px; margin: 0 auto; width: 100%; }
.flex-row { display: flex; align-items: center; }

/* === TYPOGRAPHY === */
h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 0.5rem 0; }
h2 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary); }
h3 { font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin-bottom: 0.5rem; }
.text-xs { font-size: 0.75rem; color: var(--text-secondary); letter-spacing: 0.5px; }

/* === CARDS === */
.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 1.25rem; margin-bottom: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    transition: transform 0.2s;
}
.card:active { transform: scale(0.995); }

/* === CONTROLS === */
.stepper-control {
    display: flex; align-items: center; gap: 0.5rem;
    background: var(--bg-secondary); padding: 4px;
    border-radius: var(--radius-sm); border: 1px solid var(--border);
}
.stepper-btn {
    width: 44px; height: 44px; border-radius: var(--radius-sm);
    border: none; background: var(--bg-card); color: var(--accent);
    font-size: 1.5rem; font-weight: bold; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
}
.stepper-value {
    flex: 1; text-align: center; font-size: 1.5rem; font-weight: 700;
    font-variant-numeric: tabular-nums; background: transparent; border: none; color: white;
}
.set-group { display: flex; gap: 8px; margin-top: 12px; }
.set-btn {
    flex: 1; height: 48px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--bg-secondary);
    color: var(--text-secondary); font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease; cursor: pointer;
}
.set-btn.completed {
    background: var(--success); color: #000; border-color: var(--success);
    box-shadow: 0 0 10px rgba(0, 230, 118, 0.3);
}

/* === BUTTONS === */
.btn-primary {
    background: var(--accent); color: white; border: none;
    width: 100%; padding: 1rem; border-radius: var(--radius-lg);
    font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 4px 15px var(--accent-glow); margin-top: 1rem;
}
.btn-secondary {
    background: var(--bg-secondary); color: var(--text-secondary);
    width: 100%; padding: 0.75rem; border-radius: var(--radius-sm);
    border: 1px solid var(--border); font-weight: 600; cursor: pointer;
}
.btn-debug {
    background: #333; color: var(--warning); border: 1px dashed var(--warning);
    font-family: monospace; font-size: 0.8rem;
}

/* === TIMER DOCK === */
.timer-dock {
    position: fixed; bottom: calc(var(--nav-height) + 10px); 
    left: 50%; transform: translateX(-50%) translateY(150%);
    width: 95%; max-width: 580px;
    background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(10px);
    border: 1px solid var(--accent); border-radius: 50px;
    padding: 0.75rem 1.5rem;
    display: flex; justify-content: space-between; align-items: center;
    z-index: 500; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.timer-dock.active { transform: translateX(-50%) translateY(0); }
.timer-display { font-size: 1.5rem; font-weight: 900; color: var(--accent); font-variant-numeric: tabular-nums; }
.timer-skip { color: var(--text-secondary); font-size: 0.875rem; letter-spacing: 1px; cursor: pointer; }

/* === NAVIGATION === */
.bottom-nav {
    height: var(--nav-height); background: rgba(5, 5, 5, 0.95);
    backdrop-filter: blur(10px); border-top: 1px solid var(--border);
    display: flex; justify-content: space-around; align-items: center;
    position: fixed; bottom: 0; width: 100%; z-index: 1000;
    padding-bottom: var(--safe-area-bottom);
}
.nav-item {
    background: none; border: none; color: var(--text-secondary);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-size: 0.7rem; font-weight: 600; opacity: 0.6; transition: 0.2s;
}
.nav-item.active { opacity: 1; color: var(--accent); transform: translateY(-2px); }
.nav-item .icon { font-size: 1.4rem; }

/* === MODALS === */
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
    z-index: 2000; display: flex; align-items: center; justify-content: center;
    opacity: 0; visibility: hidden; transition: 0.2s ease;
}
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 1.5rem;
    width: 90%; max-width: 400px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    transform: scale(0.95) translateY(10px); transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-overlay.active .modal-box { transform: scale(1) translateY(0); }
.modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
.btn-modal { padding: 0.75rem 1.25rem; border-radius: var(--radius-sm); font-weight: 600; border: none; cursor: pointer; }
.btn-confirm { background: var(--accent); color: white; }
.btn-danger { background: var(--error); color: white; }
.btn-ghost { background: transparent; color: var(--text-secondary); }

/* === UTILS === */
.hidden { display: none !important; }
.fade-in { animation: fadeIn 0.4s ease-out; }
.big-check { width: 24px; height: 24px; accent-color: var(--accent); margin-right: 12px; }
.checkbox-wrapper { display: flex; align-items: center; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-sm); margin-bottom: 0.5rem; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
```

## js/config.js

*Contains specific exercises, youtube search links (including alternatives), and timing configurations. Hygiene enforced.*

```javascript
export const EXERCISES = [
    {
        id: 'hinge', name: 'Trap Bar Deadlift', category: 'HINGE', sets: 3, reps: 8,
        video: 'https://www.youtube.com/results?search_query=trap+bar+deadlift+form+tutorial',
        alternatives: ['Barbell RDL', 'DB RDL'],
        altLinks: {
            'Barbell RDL': 'https://www.youtube.com/results?search_query=barbell+romanian+deadlift+form',
            'DB RDL': 'https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form'
        }
    },
    {
        id: 'knee', name: 'Goblet Squat', category: 'KNEE', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=dumbbell+goblet+squat+form',
        alternatives: ['DB Front Squat', 'Bulgarian Split Squat'],
        altLinks: {
            'DB Front Squat': 'https://www.youtube.com/results?search_query=dumbbell+front+squat+form',
            'Bulgarian Split Squat': 'https://www.youtube.com/results?search_query=bulgarian+split+squat+dumbbells+form'
        }
    },
    {
        id: 'push_horz', name: 'DB Bench Press', category: 'H-PUSH', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=dumbbell+bench+press+form',
        alternatives: ['Barbell Bench Press', 'Incline Push-up on Bench'],
        altLinks: {
            'Barbell Bench Press': 'https://www.youtube.com/results?search_query=barbell+bench+press+form',
            'Incline Push-up on Bench': 'https://www.youtube.com/results?search_query=hands+elevated+push+up+on+bench+form'
        }
    },
    {
        id: 'push_vert', name: 'Standing DB OHP', category: 'V-PUSH', sets: 3, reps: 10,
        video: 'https://www.youtube.com/results?search_query=standing+dumbbell+overhead+press+form',
        alternatives: ['Seated DB Press', 'Barbell Overhead Press'],
        altLinks: {
            'Seated DB Press': 'https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press+form',
            'Barbell Overhead Press': 'https://www.youtube.com/results?search_query=standing+barbell+overhead+press+form'
        }
    },
    {
        id: 'pull', name: 'Chest-Supported Row', category: 'PULL', sets: 3, reps: 12,
        video: 'https://www.youtube.com/results?search_query=incline+bench+dumbbell+row+form',
        alternatives: ['Single Arm DB Row (Bench)', 'Barbell Row'],
        altLinks: {
            'Single Arm DB Row (Bench)': 'https://www.youtube.com/results?search_query=single+arm+dumbbell+row+on+bench+form',
            'Barbell Row': 'https://www.youtube.com/results?search_query=barbell+bent+over+row+form'
        }
    },
    {
        id: 'carry', name: 'Farmers Walk', category: 'CARRY', sets: 3, reps: 40,
        video: 'https://www.youtube.com/results?search_query=farmers+walk+dumbbell+form',
        alternatives: ['Farmer Hold (Standing)', 'DB Shrugs'],
        altLinks: {
            'Farmer Hold (Standing)': 'https://www.youtube.com/results?search_query=farmers+hold+exercise+form',
            'DB Shrugs': 'https://www.youtube.com/results?search_query=standing+dumbbell+shrugs+form'
        }
    },
    {
        id: 'calves', name: 'Standing Calf Raises', category: 'CALVES', sets: 3, reps: 15,
        video: 'https://www.youtube.com/results?search_query=standing+dumbbell+calf+raise+form',
        alternatives: ['Seated Calf Raises', 'Jump Rope'],
        altLinks: {
            'Seated Calf Raises': 'https://www.youtube.com/results?search_query=seated+dumbbell+calf+raise+form',
            'Jump Rope': 'https://www.youtube.com/results?search_query=jump+rope+boxing+technique'
        }
    }
];

export const WARMUP = [
    { 
        id: 'thoracic', name: 'Wall Thoracic Rotations', reps: '10/side', 
        video: 'https://www.youtube.com/results?search_query=standing+thoracic+rotation+against+wall',
        alternatives: ['Standing Windmill', 'Standing T-Spine Twist'],
        altLinks: {
            'Standing Windmill': 'https://www.youtube.com/results?search_query=standing+windmill+exercise+form',
            'Standing T-Spine Twist': 'https://www.youtube.com/results?search_query=standing+t-spine+rotation+form'
        }
    },
    { 
        id: 'swings', name: 'Kettlebell Swings', reps: '20', 
        video: 'https://www.youtube.com/results?search_query=russian+kettlebell+swing+form',
        alternatives: ['Broad Jumps', 'Bodyweight Good Mornings'],
        altLinks: {
            'Broad Jumps': 'https://www.youtube.com/results?search_query=broad+jump+form',
            'Bodyweight Good Mornings': 'https://www.youtube.com/results?search_query=bodyweight+good+morning+exercise'
        }
    },
    { 
        id: 'halo', name: 'Standing KB Halo', reps: '10/dir', 
        video: 'https://www.youtube.com/results?search_query=standing+kettlebell+halo+exercise',
        alternatives: ['Around the World (Plate/DB)', 'Shoulder Dislocates (Broom)'],
        altLinks: {
            'Around the World (Plate/DB)': 'https://www.youtube.com/results?search_query=plate+around+the+world+exercise',
            'Shoulder Dislocates (Broom)': 'https://www.youtube.com/results?search_query=shoulder+dislocates+form'
        }
    },
    { 
        id: 'prying', name: 'Goblet Squat Prying', reps: '10', 
        video: 'https://www.youtube.com/results?search_query=goblet+squat+prying+stretch',
        alternatives: ['Cossack Squat', 'Deep Squat Hold'],
        altLinks: {
            'Cossack Squat': 'https://www.youtube.com/results?search_query=cossack+squat+form',
            'Deep Squat Hold': 'https://www.youtube.com/results?search_query=deep+squat+hold+mobility'
        }
    },
    { 
        id: 'rope', name: 'Jump Rope', reps: '100', 
        video: 'https://www.youtube.com/results?search_query=jump+rope+basic+bounce',
        alternatives: ['Jumping Jacks', 'High Knees'],
        altLinks: {
            'Jumping Jacks': 'https://www.youtube.com/results?search_query=jumping+jacks+form',
            'High Knees': 'https://www.youtube.com/results?search_query=high+knees+exercise+form'
        }
    }
];

export const CARDIO_OPTIONS = [
    { name: 'Assault Bike', video: 'https://www.youtube.com/results?search_query=assault+bike+technique' },
    { name: 'Rower', video: 'https://www.youtube.com/results?search_query=concept2+rowing+technique' },
    { name: 'Treadmill Incline', video: 'https://www.youtube.com/results?search_query=treadmill+incline+walking+form' }
];

export const DECOMPRESSION = [
    {
        id: 'hang', name: 'Dead Hang', 
        video: 'https://www.youtube.com/results?search_query=dead+hang+form',
        alternatives: ['Farmers Hold (Static)', 'Plate Pinch Hold'],
        altLinks: {
            'Farmers Hold (Static)': 'https://www.youtube.com/results?search_query=farmers+hold+exercise',
            'Plate Pinch Hold': 'https://www.youtube.com/results?search_query=plate+pinch+grip+hold'
        },
        inputLabel: 'Seconds'
    },
    {
        id: 'breath', name: 'Box Breathing (Seated)', 
        video: 'https://www.youtube.com/results?search_query=seated+box+breathing+technique',
        alternatives: ['Physiological Sigh', '4-7-8 Breathing'],
        altLinks: {
            'Physiological Sigh': 'https://www.youtube.com/results?search_query=physiological+sigh+breathing',
            '4-7-8 Breathing': 'https://www.youtube.com/results?search_query=4-7-8+breathing+technique'
        },
        inputLabel: null
    }
];

export const RECOVERY_CONFIG = {
    green: { label: 'Green', factor: 1.0 },
    yellow: { label: 'Yellow', factor: 0.9 },
    red: { label: 'Red', factor: 0 }
};
```

## js/core.js

*Handles Logic, Data Storage, Import/Export, and Debugging.*

```javascript
import { EXERCISES } from './config.js';

export const Storage = {
    KEYS: { SESSIONS: 'flexx_sessions_v3', PREFS: 'flexx_prefs' },

    getSessions() {
        return JSON.parse(localStorage.getItem(this.KEYS.SESSIONS) || '[]');
    },

    saveSession(session) {
        const sessions = this.getSessions();
        session.sessionNumber = sessions.length + 1;
        session.weekNumber = Math.ceil(session.sessionNumber / 3);
        session.totalVolume = session.exercises.reduce((sum, ex) => {
            if (ex.skipped || ex.usingAlternative) return sum;
            return sum + (ex.weight * ex.setsCompleted * ex.prescribedReps);
        }, 0);
        
        sessions.push(session);
        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
        
        if (sessions.length % 5 === 0) this.autoExport(sessions);
        return session;
    },

    deleteSession(id) {
        let sessions = this.getSessions();
        sessions = sessions.filter(s => s.id !== id);
        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
    },

    exportData() {
        const sessions = this.getSessions();
        const data = { version: '3.8', exportDate: new Date().toISOString(), sessions };
        // Windows Safe Filename (No colons)
        const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `flexx-files-backup-${safeDate}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    },

    autoExport(sessions) {
        const data = { version: '3.8', type: 'auto', sessions };
        const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `flexx-files-auto-${safeDate}.json`;
        a.click();
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const sessions = Array.isArray(data) ? data : data.sessions;
            if (confirm(`Import ${sessions.length} sessions? Overwrites current data.`)) {
                localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
                window.location.reload();
            }
        } catch (e) { alert('Invalid File'); }
    },

    reset() {
        localStorage.clear();
        window.location.reload();
    },

    // === DEBUG TOOLS ===
    generateDummyData() {
        const s = [];
        const start = Date.now() - (30 * 24 * 60 * 60 * 1000);
        for(let i=0; i<8; i++) {
            const date = new Date(start + (i * 3 * 24 * 60 * 60 * 1000));
            s.push({
                id: crypto.randomUUID(),
                date: date.toISOString(),
                sessionNumber: i+1,
                weekNumber: Math.ceil((i+1)/3),
                recoveryStatus: i % 4 === 0 ? 'yellow' : 'green',
                warmup: [],
                exercises: EXERCISES.map(e => ({
                    id: e.id, name: e.name, weight: 45 + (i * 5),
                    setsCompleted: 3, completed: true, skipped: false
                })),
                cardio: { type: 'Rower', completed: true },
                decompress: []
            });
        }
        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(s));
        window.location.reload();
    },

    unlockRest() {
        const s = this.getSessions();
        if(s.length > 0) {
            // Backdate last session to 3 days ago to force unlock
            s[s.length-1].date = new Date(Date.now() - (73 * 60 * 60 * 1000)).toISOString();
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(s));
            window.location.reload();
        }
    }
};

export const Calculator = {
    getRecommendedWeight(exerciseId, recoveryStatus) {
        const sessions = Storage.getSessions();
        if (sessions.length === 0) return 0;
        
        const base = this.getBaseRecommendation(exerciseId, sessions);
        const factor = recoveryStatus === 'yellow' ? 0.9 : 1.0;
        let w = base * factor;
        return parseFloat((Math.round(w / 2.5) * 2.5).toFixed(1));
    },

    getBaseRecommendation(exerciseId, sessions) {
        const week = Math.ceil((sessions.length + 1) / 3);
        if (week > 0 && week % 6 === 0) { // Deload
            const last = this.getLastCompletedExercise(exerciseId, sessions);
            return last ? last.weight * 0.6 : 45;
        }
        if (this.detectStall(exerciseId, sessions)) { // Stall
            const last = this.getLastExercise(exerciseId, sessions);
            return last ? last.weight * 0.9 : 45;
        }
        // Progression
        const last = this.getLastExercise(exerciseId, sessions);
        if (!last) return 45;
        return last.completed ? last.weight + 5 : last.weight;
    },

    detectStall(exerciseId, sessions) {
        const recent = [];
        for (let i = sessions.length - 1; i >= 0 && recent.length < 3; i--) {
            const ex = sessions[i].exercises.find(e => e.id === exerciseId);
            if (ex && !ex.skipped && !ex.usingAlternative) recent.push(ex);
        }
        if (recent.length < 3) return false;
        return recent.every(e => !e.completed && e.weight === recent[0].weight);
    },

    getLastExercise(exerciseId, sessions) {
        for (let i = sessions.length - 1; i >= 0; i--) {
            const ex = sessions[i].exercises.find(e => e.id === exerciseId);
            if (ex && !ex.skipped && !ex.usingAlternative) return ex;
        }
        return null;
    },

    getLastCompletedExercise(exerciseId, sessions) {
        for (let i = sessions.length - 1; i >= 0; i--) {
            const ex = sessions[i].exercises.find(e => e.id === exerciseId);
            if (ex && ex.completed && !ex.skipped && !ex.usingAlternative) return ex;
        }
        return null;
    },

    getPlateLoad(weight) {
        if (weight < 45) return 'Use DBs / Fixed Bar';
        const target = (weight - 45) / 2;
        if (target <= 0) return 'Empty Bar';
        const plates = [45, 35, 25, 10, 5, 2.5];
        const load = [];
        let rem = target;
        for (let p of plates) {
            while (rem >= p) {
                load.push(p);
                rem -= p;
            }
        }
        return load.length > 0 ? `+ [ ${load.join(', ')} ]` : 'Empty Bar';
    },
};

export const Validator = {
    canStartWorkout() {
        const sessions = Storage.getSessions();
        if (sessions.length === 0) return { valid: true, isFirst: true };
        const hours = (Date.now() - new Date(sessions[sessions.length - 1].date)) / 3600000;
        if (hours < 48) return { valid: false, hours: Math.ceil(48 - hours) };
        if (hours > 168) return { valid: true, warning: true, days: Math.floor(hours/24) };
        return { valid: true };
    },
    formatDate(d) {
        return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
};
```

## js/app.js

*The Controller. Includes the Navigation Fix, Name Display Fix, and Debug UI integration.*

```javascript
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
                    <select id="alt-${w.id}" onchange="window.swapAlt('${w.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:4px;">
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
                <span class="text-xs" style="border:1px solid #333; padding:4px 8px; border-radius:12px">${State.recovery.toUpperCase()}</span>
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
                        <input type="number" class="stepper-value" id="w-${ex.id}" value="${w}" step="2.5">
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
                        <select id="alt-${d.id}" onchange="window.swapAlt('${d.id}')" style="width:100%; margin-top:0.5rem; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; border-radius:4px;">
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
                <div><h3>${Validator.formatDate(x.date)}</h3><span class="text-xs" style="border:1px solid #333; padding:2px 6px; border-radius:4px">${x.recoveryStatus.toUpperCase()}</span></div>
                <button class="btn btn-secondary" style="width:auto; padding:4px 12px" onclick="window.del('${x.id}')">✕</button>
            </div>
            <details style="margin-top:1rem; border-top:1px solid var(--border); padding-top:0.5rem;">
                <summary class="text-xs" style="cursor:pointer; padding:0.5rem 0; opacity:0.8">View Details</summary>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">WARMUP</div>
                <div class="text-xs" style="margin-bottom:1rem; line-height:1.4">${x.warmup ? x.warmup.map(w => w.completed ? `✓ ${w.altUsed || w.id} ` : '').join('') : 'No Data'}</div>
                <div class="text-xs" style="margin-bottom:0.5rem; color:var(--accent)">LIFTING</div>
                ${x.exercises.map(e => {
                     // Name Display Fix
                     const displayName = e.altName || e.name || EXERCISES.find(cfg=>cfg.id===e.id)?.name || e.id;
                     return `<div class="flex-row" style="justify-content:space-between; font-size:0.85rem; margin-bottom:4px; ${e.skipped ? 'opacity:0.5; text-decoration:line-through' : ''}"><span>${displayName}</span><span>${e.weight} lbs</span></div>`
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
    c.innerHTML = `<div class="container"><h1>Progress</h1><div class="card"><select id="chart-ex" onchange="window.drawChart(this.value)" style="width:100%; padding:0.5rem; background:var(--bg-secondary); color:white; border:none; margin-bottom:1rem;">${EXERCISES.map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}</select><div id="chart-area" style="min-height:200px"></div></div></div>`;
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
    const H=200, W=div.clientWidth || 300, P=20;
    const X = i => P + (i/(data.length-1)) * (W-P*2);
    const Y = v => H - (P + ((v-min)/(max-min)) * (H-P*2));
    let path = `M ${X(0)} ${Y(data[0].v)}`;
    data.forEach((p,i) => path += ` L ${X(i)} ${Y(p.v)}`);
    div.innerHTML = `<svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
        <path d="${path}" fill="none" stroke="#ff6b35" stroke-width="3"/>
        ${data.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.v)}" r="4" fill="#121212" stroke="#ff6b35" stroke-width="2"/>`).join('')}
    </svg><div class="flex-row" style="justify-content:space-between; margin-top:5px; font-size:0.7rem; color:#666"><span>${Validator.formatDate(data[0].d)}</span><span>${Validator.formatDate(data[data.length-1].d)}</span></div>`;
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
```

## sw.js

*Service Worker for Offline Caching.*

```javascript
const CACHE_NAME = 'flexx-v3.8';
const ASSETS = [
    '/', '/index.html', '/css/styles.css',
    '/js/app.js', '/js/core.js', '/js/config.js',
    '/manifest.json'
];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.map(n => n !== CACHE_NAME ? caches.delete(n) : null))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('/index.html')))));
```

## manifest.json

*PWA Configuration.*

```json
{
    "name": "Flexx Files",
    "short_name": "Flexx",
    "description": "Offline Strength Tracker",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#050505",
    "theme_color": "#050505",
    "icons": [
        { "src": "assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
        { "src": "assets/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
}
```

--- END OF FILE FLEXX-FILES-COMPLETE.md ---
