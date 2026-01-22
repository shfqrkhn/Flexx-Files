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