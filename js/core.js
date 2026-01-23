import { EXERCISES } from './config.js';
import * as CONST from './constants.js';

export const Storage = {
    KEYS: { SESSIONS: 'flexx_sessions_v3', PREFS: 'flexx_prefs' },

    getSessions() {
        try {
            const data = localStorage.getItem(this.KEYS.SESSIONS);
            if (!data) return [];
            const sessions = JSON.parse(data);
            // Validate it's an array
            return Array.isArray(sessions) ? sessions : [];
        } catch (e) {
            console.error('Failed to load sessions:', e);
            // Return empty array if corrupted, don't lose everything
            return [];
        }
    },

    saveSession(session) {
        try {
            const sessions = this.getSessions();
            session.sessionNumber = sessions.length + 1;
            session.weekNumber = Math.ceil(session.sessionNumber / 3);
            session.totalVolume = session.exercises.reduce((sum, ex) => {
                if (ex.skipped || ex.usingAlternative) return sum;
                // Look up the exercise config to get the prescribed reps
                const cfg = EXERCISES.find(e => e.id === ex.id);
                const reps = cfg ? cfg.reps : 0;
                return sum + (ex.weight * ex.setsCompleted * reps);
            }, 0);

            sessions.push(session);
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));

            // Auto-export every N sessions as backup
            if (sessions.length % CONST.AUTO_EXPORT_INTERVAL === 0) this.autoExport(sessions);
            return session;
        } catch (e) {
            console.error('Failed to save session:', e);
            alert('Failed to save workout. Please try exporting your data.');
            throw e; // Re-throw so caller knows it failed
        }
    },

    deleteSession(id) {
        try {
            let sessions = this.getSessions();
            const beforeCount = sessions.length;
            sessions = sessions.filter(s => s.id !== id);

            if (sessions.length === beforeCount) {
                console.warn(`Session ${id} not found`);
                return false;
            }

            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
            return true;
        } catch (e) {
            console.error('Failed to delete session:', e);
            alert('Failed to delete session. Please try again.');
            return false;
        }
    },

    exportData() {
        try {
            const sessions = this.getSessions();
            const data = {
                version: CONST.APP_VERSION,
                exportDate: new Date().toISOString(),
                sessions
            };
            // Windows Safe Filename (No colons)
            const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `flexx-files-backup-${safeDate}.json`;
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (e) {
            console.error('Export error:', e);
            alert(CONST.ERROR_MESSAGES.EXPORT_FAILED);
        }
    },

    autoExport(sessions) {
        try {
            const data = {
                version: CONST.APP_VERSION,
                type: 'auto',
                sessions
            };
            const safeDate = new Date().toISOString().replace(/:/g, '-').split('.')[0];
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `flexx-files-auto-${safeDate}.json`;
            a.click();
        } catch (e) {
            console.error('Auto-export error:', e);
            // Don't alert for auto-export failures, just log
        }
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const sessions = Array.isArray(data) ? data : data.sessions;

            // Validate data structure
            if (!Array.isArray(sessions)) {
                alert('Invalid file format: sessions must be an array');
                return;
            }

            // Validate each session has required fields
            const invalidSessions = sessions.filter(s =>
                !s.id || !s.date || !s.exercises || !Array.isArray(s.exercises)
            );

            if (invalidSessions.length > 0) {
                alert(`Invalid file: ${invalidSessions.length} sessions are missing required fields (id, date, exercises)`);
                return;
            }

            if (confirm(`Import ${sessions.length} sessions? This will overwrite your current data.\n\nRecommendation: Export your current data first as backup.`)) {
                localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
                window.location.reload();
            }
        } catch (e) {
            console.error('Import error:', e);
            alert(`Invalid file: ${e.message}\n\nPlease ensure this is a valid Flexx Files backup file.`);
        }
    },

    reset() {
        localStorage.clear();
        window.location.reload();
    },

    // === DEBUG TOOLS (only available in development) ===
    // To enable: Add ?debug=true to URL or set localStorage.debug = 'true'
    isDebugMode() {
        return localStorage.getItem('debug') === 'true' ||
               new URLSearchParams(window.location.search).get('debug') === 'true' ||
               window.location.hostname === 'localhost';
    },

    generateDummyData() {
        if (!this.isDebugMode()) {
            console.warn('Debug tools disabled in production');
            return;
        }
        const s = [];
        const start = Date.now() - (CONST.DUMMY_DATA_DAYS_BACK * 24 * 60 * 60 * 1000);

        for(let i=0; i<CONST.DUMMY_DATA_SESSIONS; i++) {
            const date = new Date(start + (i * CONST.SESSIONS_PER_WEEK * 24 * 60 * 60 * 1000));
            s.push({
                id: crypto.randomUUID(),
                date: date.toISOString(),
                sessionNumber: i+1,
                weekNumber: Math.ceil((i+1) / CONST.SESSIONS_PER_WEEK),
                recoveryStatus: i % 4 === 0 ? CONST.RECOVERY_STATES.YELLOW : CONST.RECOVERY_STATES.GREEN,
                warmup: [],
                exercises: EXERCISES.map(e => ({
                    id: e.id,
                    name: e.name,
                    weight: CONST.OLYMPIC_BAR_WEIGHT_LBS + (i * CONST.WEIGHT_INCREMENT_LBS),
                    setsCompleted: 3,
                    completed: true,
                    skipped: false
                })),
                cardio: { type: 'Rower', completed: true },
                decompress: []
            });
        }
        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(s));
        window.location.reload();
    },

    unlockRest() {
        if (!this.isDebugMode()) {
            console.warn('Debug tools disabled in production');
            return;
        }
        const s = this.getSessions();
        if(s.length > 0) {
            // Backdate last session to bypass rest requirement
            s[s.length-1].date = new Date(Date.now() - (CONST.DEBUG_REST_UNLOCK_HOURS * 60 * 60 * 1000)).toISOString();
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(s));
            window.location.reload();
        } else {
            console.warn('No sessions to unlock');
        }
    }
};

export const Calculator = {
    getRecommendedWeight(exerciseId, recoveryStatus) {
        const sessions = Storage.getSessions();
        if (sessions.length === 0) return 0;

        const base = this.getBaseRecommendation(exerciseId, sessions);
        const factor = recoveryStatus === CONST.RECOVERY_STATES.YELLOW ?
            CONST.YELLOW_RECOVERY_MULTIPLIER : 1.0;
        let w = base * factor;
        return parseFloat((Math.round(w / CONST.STEPPER_INCREMENT_LBS) * CONST.STEPPER_INCREMENT_LBS).toFixed(1));
    },

    getBaseRecommendation(exerciseId, sessions) {
        const week = Math.ceil((sessions.length + 1) / CONST.SESSIONS_PER_WEEK);

        // Deload every N weeks
        if (week > 0 && week % CONST.DELOAD_WEEK_INTERVAL === 0) {
            const last = this.getLastCompletedExercise(exerciseId, sessions);
            return last ? last.weight * CONST.DELOAD_PERCENTAGE : CONST.OLYMPIC_BAR_WEIGHT_LBS;
        }

        // Stall detection: reduce weight if failing repeatedly
        if (this.detectStall(exerciseId, sessions)) {
            const last = this.getLastExercise(exerciseId, sessions);
            return last ? last.weight * CONST.STALL_DELOAD_PERCENTAGE : CONST.OLYMPIC_BAR_WEIGHT_LBS;
        }

        // Normal progression: add weight on success
        const last = this.getLastExercise(exerciseId, sessions);
        if (!last) return CONST.OLYMPIC_BAR_WEIGHT_LBS;
        return last.completed ? last.weight + CONST.WEIGHT_INCREMENT_LBS : last.weight;
    },

    detectStall(exerciseId, sessions) {
        const recent = [];
        for (let i = sessions.length - 1; i >= 0 && recent.length < CONST.STALL_DETECTION_SESSIONS; i--) {
            const ex = sessions[i].exercises.find(e => e.id === exerciseId);
            if (ex && !ex.skipped && !ex.usingAlternative) recent.push(ex);
        }
        if (recent.length < CONST.STALL_DETECTION_SESSIONS) return false;
        // Stall detected if all recent attempts failed at same weight
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
        // Calculate plates needed for each side of barbell
        if (weight < CONST.OLYMPIC_BAR_WEIGHT_LBS) return 'Use DBs / Fixed Bar';
        const target = (weight - CONST.OLYMPIC_BAR_WEIGHT_LBS) / 2; // Each side gets half
        if (target <= 0) return 'Empty Bar';

        const load = [];
        let rem = target;

        // Greedy algorithm: use largest plates first
        for (let p of CONST.AVAILABLE_PLATES) {
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

        const lastSession = sessions[sessions.length - 1];
        if (!lastSession || !lastSession.date) {
            console.warn('Last session missing date');
            return { valid: true, warning: true };
        }

        const hours = (Date.now() - new Date(lastSession.date)) / 3600000;

        // Require minimum rest period
        if (hours < CONST.REST_PERIOD_HOURS) {
            return {
                valid: false,
                hours: Math.ceil(CONST.REST_PERIOD_HOURS - hours),
                nextAvailable: new Date(Date.now() + ((CONST.REST_PERIOD_HOURS - hours) * 3600000))
            };
        }

        // Warn if it's been more than a week
        if (hours > CONST.WEEK_WARNING_HOURS) {
            return {
                valid: true,
                warning: true,
                days: Math.floor(hours / 24),
                message: 'Long gap since last workout'
            };
        }

        return { valid: true };
    },

    formatDate(d) {
        try {
            return new Date(d).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.error('Date formatting error:', e);
            return 'Invalid Date';
        }
    }
};