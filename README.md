# FLEXX FILES - THE COMPLETE BUILD

**Version:** 3.9.37 (Refactor)
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
│   ├── accessibility.js
│   ├── app.js      (View & Controller)
│   ├── config.js   (Data & Links)
│   ├── constants.js
│   ├── core.js     (Logic & Storage)
│   ├── i18n.js
│   ├── observability.js
│   └── security.js
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
    "js\config.js", "js\core.js", "js\app.js",
    "js\constants.js", "js\observability.js", "js\accessibility.js", "js\security.js", "js\i18n.js"
)
foreach ($File in $Files) {
    $Path = Join-Path $ProjectName $File
    If (!(Test-Path $Path)) { New-Item -Path $Path -ItemType File -Force | Out-Null }
}

# 3. Create Placeholder Icons
New-Item -Path "$ProjectName\assets\icon-192.png" -ItemType File -Force | Out-Null
New-Item -Path "$ProjectName\assets\icon-512.png" -ItemType File -Force | Out-Null

Write-Host "✅ Flexx Files v3.9.34 Structure Created." -ForegroundColor Cyan
```

### C. Deployment

1.  **Local Testing:** Run `npx serve .` inside the folder.
2.  **Production:** Upload to GitHub Pages or Netlify.
3.  **Install:** Open on mobile browser -> "Add to Home Screen".

---

# 4. PROTOCOL PHILOSOPHY

### The 7 Pillars of Movement
1.  **Hinge:** Deadlifts (Posterior Chain)
2.  **Squat:** Knee Dominant (Quads)
3.  **Push (Vertical):** Overhead Press (Shoulders)
4.  **Push (Horizontal):** Bench Press (Chest/Triceps)
5.  **Pull:** Rows/Chins (Back/Biceps)
6.  **Carry:** Farmers Walk (Core/Grip)
7.  **Corrective:** Rotational/Anti-Rotational (Injury Prevention)

### The 4-Phase System
1.  **Warmup:** Raise body temp, prime joints (5 mins).
2.  **Lifting:** Heavy compound movements (45 mins).
3.  **Cardio:** Zone 2 cardiovascular work (5 mins).
4.  **Decompress:** Parasympathetic reset to kickstart recovery (3 mins).
