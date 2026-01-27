import { EXERCISES } from './config.js';
import * as CONST from './constants.js';
import { Validator as SecurityValidator, Sanitizer } from './security.js';

export const Storage = {
    KEYS: {
        SESSIONS: `${CONST.STORAGE_PREFIX}sessions_v3`,
        PREFS: `${CONST.STORAGE_PREFIX}prefs`,
        MIGRATION_VERSION: `${CONST.STORAGE_PREFIX}migration_version`,
        BACKUP: `${CONST.STORAGE_PREFIX}backup_snapshot`,
        DRAFT: `${CONST.STORAGE_PREFIX}draft_session`
    },

    // Performance Optimization: Cache parsed sessions to avoid repeated JSON.parse()
    _sessionCache: null,
    _pendingWrite: null,
    _isCorrupted: false,

    /**
     * ATOMIC TRANSACTION SYSTEM
     * Provides rollback capability for safe data operations
     */
    Transaction: {
        inProgress: false,
        snapshot: null,

        begin() {
            if (this.inProgress) {
                console.warn('Transaction already in progress');
                return false;
            }

            try {
                // Create snapshot of current data
                // Sentinel: Use reference copy for performance (O(1)).
                // Rationale: usage patterns in saveSession guarantee that the sessions array
                // and its contained objects are effectively immutable during the transaction.
                // We trust the application not to mutate cache objects in-place.
                this.snapshot = Storage.getSessions();
                this.inProgress = true;
                console.log('Transaction started', { sessionCount: this.snapshot.length });
                return true;
            } catch (e) {
                console.error('Failed to begin transaction:', e);
                return false;
            }
        },

        commit() {
            if (!this.inProgress) {
                console.warn('No transaction in progress');
                return false;
            }

            try {
                // Transaction successful, clear snapshot
                this.snapshot = null;
                this.inProgress = false;
                console.log('Transaction committed');
                return true;
            } catch (e) {
                console.error('Failed to commit transaction:', e);
                this.rollback();
                return false;
            }
        },

        rollback() {
            if (!this.inProgress || !this.snapshot) {
                console.warn('No transaction to rollback');
                return false;
            }

            try {
                // Restore from snapshot
                localStorage.setItem(Storage.KEYS.SESSIONS, JSON.stringify(this.snapshot));
                Storage._sessionCache = null; // Invalidate cache
                this.snapshot = null;
                this.inProgress = false;
                console.log('Transaction rolled back');
                return true;
            } catch (e) {
                console.error('CRITICAL: Failed to rollback transaction:', e);
                return false;
            }
        }
    },

    /**
     * Save draft session for recovery
     */
    saveDraft(session) {
        try {
            localStorage.setItem(this.KEYS.DRAFT, JSON.stringify(session));
            console.log('Draft saved', { sessionId: session.id });
            return true;
        } catch (e) {
            console.error('Failed to save draft:', e);
            return false;
        }
    },

    /**
     * Load draft session
     */
    loadDraft() {
        try {
            const draft = localStorage.getItem(this.KEYS.DRAFT);
            return draft ? JSON.parse(draft) : null;
        } catch (e) {
            console.error('Failed to load draft:', e);
            return null;
        }
    },

    /**
     * Clear draft session
     */
    clearDraft() {
        try {
            localStorage.removeItem(this.KEYS.DRAFT);
            console.log('Draft cleared');
            return true;
        } catch (e) {
            console.error('Failed to clear draft:', e);
            return false;
        }
    },

    /**
     * Schema Migration System
     * Handles safe transitions between storage versions
     */
    getCurrentMigrationVersion() {
        return localStorage.getItem(this.KEYS.MIGRATION_VERSION) || 'v3';
    },

    setMigrationVersion(version) {
        localStorage.setItem(this.KEYS.MIGRATION_VERSION, version);
    },

    runMigrations() {
        const currentVersion = this.getCurrentMigrationVersion();
        console.log(`Current migration version: ${currentVersion}`);

        // If we're already on the latest version, no migration needed
        if (currentVersion === CONST.STORAGE_VERSION) {
            return;
        }

        try {
            // Run migrations in sequence
            if (currentVersion === 'v3' && CONST.STORAGE_VERSION === 'v4') {
                this.migrateV3toV4();
            }
            // Add more migration paths here as needed
            // if (currentVersion === 'v4' && CONST.STORAGE_VERSION === 'v5') {
            //     this.migrateV4toV5();
            // }

            // Update migration version after successful migration
            this.setMigrationVersion(CONST.STORAGE_VERSION);
            console.log(`Successfully migrated to ${CONST.STORAGE_VERSION}`);
        } catch (e) {
            console.error('Migration failed:', e);
            alert('Data migration failed. Your data is safe but may need manual export/import.');
        }
    },

    /**
     * Example migration: v3 to v4
     * Currently a no-op since we're still on v3
     * This demonstrates the pattern for future migrations
     */
    migrateV3toV4() {
        console.log('Running v3 -> v4 migration');
        const sessions = this.getSessions();

        // Example migration logic:
        // Add new fields, rename fields, transform data, etc.
        const migratedSessions = sessions.map(session => {
            // Future: Add any new required fields
            // if (!session.newField) {
            //     session.newField = defaultValue;
            // }
            return session;
        });

        localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(migratedSessions));
        console.log(`Migrated ${migratedSessions.length} sessions`);
    },

    getSessions() {
        if (this._sessionCache) return this._sessionCache;
        try {
            const data = localStorage.getItem(this.KEYS.SESSIONS);
            if (!data) return [];
            const sessions = JSON.parse(data);
            // Validate it's an array
            this._sessionCache = Array.isArray(sessions) ? sessions : [];
            return this._sessionCache;
        } catch (e) {
            console.error('Failed to load sessions:', e);
            // Sentinel: Flag corruption to prevent overwriting raw data later
            this._isCorrupted = true;
            // Return empty array so UI can still render partial state (e.g. empty history)
            // but saving will be blocked.
            return [];
        }
    },

    saveSession(session) {
        // Ensure data is loaded to detect corruption state
        this.getSessions();

        // Sentinel: Prevent data loss if storage is corrupted
        if (this._isCorrupted) {
            const msg = 'Storage is corrupted. Cannot save to prevent data loss. Please export data immediately.';
            console.error(msg);
            alert(msg);
            throw new Error(msg);
        }

        // Start atomic transaction
        if (!this.Transaction.begin()) {
            console.error('Could not start transaction for saveSession');
            throw new Error('Transaction failed to start');
        }

        try {
            // SECURITY: Validate session structure before saving
            const validation = SecurityValidator.validateSession(session);
            if (!validation.valid) {
                const errorMsg = `Invalid session data: ${validation.errors.join(', ')}`;
                console.error(errorMsg, { sessionId: session?.id });
                throw new Error(errorMsg);
            }

            const sessions = this.getSessions();

            // IDEMPOTENCY CHECK: Prevent duplicate saves of the same session
            // If a session with this ID already exists, update it instead of creating a duplicate
            const existingIndex = sessions.findIndex(s => s.id === session.id);
            if (existingIndex !== -1) {
                console.warn(`Session ${session.id} already exists. Updating instead of creating duplicate.`);
                // Update existing session
                session.sessionNumber = sessions[existingIndex].sessionNumber;
                session.weekNumber = sessions[existingIndex].weekNumber;
            } else {
                // New session: assign numbers
                session.sessionNumber = sessions.length + 1;
                session.weekNumber = Math.ceil(session.sessionNumber / 3);
            }

            session.totalVolume = session.exercises.reduce((sum, ex) => {
                if (ex.skipped || ex.usingAlternative) return sum;
                // Look up the exercise config to get the prescribed reps
                const cfg = EXERCISES.find(e => e.id === ex.id);
                const reps = cfg ? cfg.reps : 0;
                return sum + (ex.weight * ex.setsCompleted * reps);
            }, 0);

            // Sentinel: Enforce strict schema validation before persistence
            const cleanSession = Sanitizer.scrubSession(session);
            if (!cleanSession) {
                throw new Error('Session scrubbing failed');
            }

            // Create a new array instance to ensure cache invalidation for consumers
            // relying on array identity (like Calculator's WeakMap)
            let newSessions;
            if (existingIndex !== -1) {
                // Update existing session
                newSessions = [...sessions];
                newSessions[existingIndex] = cleanSession;
            } else {
                // Add new session
                newSessions = [...sessions, cleanSession];
            }

            // Update cache and storage with the new array
            this._sessionCache = newSessions;

            // Optimization: Non-blocking I/O
            // Defer strict persistence to allow UI thread to unblock immediately
            this.schedulePersistence();

            // Clear draft after successful save (optimistic)
            this.clearDraft();

            console.log('Session saved successfully (async scheduled)', { id: session.id, number: session.sessionNumber });
            return session;
        } catch (e) {
            console.error('Failed to save session:', e);
            // Rollback transaction on error
            this.Transaction.rollback();
            alert('Failed to save workout. Please try exporting your data.');
            throw e; // Re-throw so caller knows it failed
        }
    },

    deleteSession(id) {
        try {
            const sessions = this.getSessions();
            const index = sessions.findIndex(s => s.id === id);

            if (index === -1) {
                console.warn(`Session ${id} not found`);
                return false;
            }

            // Optimization: Create new array via splice to avoid O(N) filter callbacks
            const newSessions = [...sessions];
            newSessions.splice(index, 1);

            this._sessionCache = newSessions; // Update cache
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(newSessions));
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

            // Use Security Validator
            const validation = SecurityValidator.validateImportData(data);
            if (!validation.valid) {
                // SECURITY: Never expose validation details to user
                console.error('Import validation failed', { errors: validation.errors });
                alert(CONST.ERROR_MESSAGES.IMPORT_PARSE_ERROR);
                return;
            }

            const sessions = Array.isArray(data) ? data : data.sessions;

            // Sentinel: Scrub sessions to prevent schema pollution
            const cleanSessions = sessions.map(s => Sanitizer.scrubSession(s)).filter(s => s !== null);

            if (confirm(`Import ${cleanSessions.length} sessions? This will overwrite your current data.\n\nRecommendation: Export your current data first as backup.`)) {
                localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(cleanSessions));
                this._sessionCache = null;
                window.location.reload();
            }
        } catch (e) {
            console.error('Import error:', e);
            alert(CONST.ERROR_MESSAGES.IMPORT_PARSE_ERROR);
        }
    },

    schedulePersistence() {
        if (this._pendingWrite) {
            clearTimeout(this._pendingWrite);
        }
        // Defer to next tick to allow UI update
        this._pendingWrite = setTimeout(() => {
            this.flushPersistence();
        }, 0);
    },

    flushPersistence() {
        if (this._pendingWrite) {
            clearTimeout(this._pendingWrite);
            this._pendingWrite = null;
        }

        if (!this._sessionCache) return;
        try {
            localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(this._sessionCache));

            // Commit transaction if in progress
            if (this.Transaction.inProgress) {
                this.Transaction.commit();
            }
        } catch (e) {
            console.error('Persistence failed:', e);
            if (this.Transaction.inProgress) {
                this.Transaction.rollback();
            }
        }
        this._pendingWrite = null;
    },

    reset() {
        // Sentinel: Only clear Flexx Files data, preserving other apps on same origin
        const prefix = CONST.STORAGE_PREFIX || 'flexx_';
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            keys.push(localStorage.key(i));
        }

        keys.forEach(key => {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
            }
        });

        this._sessionCache = null;
        window.location.reload();
    },

};

export const Calculator = {
    // Optimization: Cache expensive lookups keyed by sessions array instance
    _cache: new WeakMap(),
    _lastSessions: null,
    _lastLookup: null,

    _ensureCache(sessions) {
        if (this._cache.has(sessions)) return this._cache.get(sessions);

        // Optimization: Check for incremental update (Append)
        // Detect if this session array is a direct append to the last processed array
        if (this._lastSessions && this._lastLookup &&
            sessions.length === this._lastSessions.length + 1 &&
            sessions[0] === this._lastSessions[0] &&
            sessions[this._lastSessions.length - 1] === this._lastSessions[this._lastSessions.length - 1]) {

            const newLookup = new Map();
            // Shallow clone entries, reuse 'recent' arrays (copy-on-write)
            for (const [key, val] of this._lastLookup) {
                newLookup.set(key, {
                    last: val.last,
                    lastCompleted: val.lastCompleted,
                    recent: val.recent
                });
            }

            // Process only the new session (at the end)
            const session = sessions[sessions.length - 1];
            for (const ex of session.exercises) {
                if (ex.skipped || ex.usingAlternative) continue;

                if (!newLookup.has(ex.id)) {
                    newLookup.set(ex.id, { last: null, lastCompleted: null, recent: [] });
                }
                const entry = newLookup.get(ex.id);

                // Copy-on-write for 'recent' if shared
                const lastEntry = this._lastLookup.get(ex.id);
                if (lastEntry && entry.recent === lastEntry.recent) {
                    entry.recent = [...entry.recent];
                }

                // Add to recent history
                // Since 'recent' is ordered [newest, ..., oldest], we unshift.
                entry.recent.unshift(ex);
                if (entry.recent.length > CONST.STALL_DETECTION_SESSIONS) {
                    entry.recent.pop();
                }

                // Update last (this is the newest)
                entry.last = ex;

                // Update lastCompleted
                if (ex.completed) {
                    entry.lastCompleted = ex;
                }
            }

            this._cache.set(sessions, newLookup);
            this._lastSessions = sessions;
            this._lastLookup = newLookup;
            return newLookup;
        }

        // Optimization: Iterate backwards and stop early once we found data for all current exercises.
        // NOTE: This assumes we primarily care about exercises in the current configuration (EXERCISES).
        // If the user has history for exercises no longer in EXERCISES, or if they haven't performed
        // one of the current exercises, we will scan the full history (falling back to O(N)).
        // This is acceptable as the app UI is driven by EXERCISES.
        const lookup = new Map(); // Map<exerciseId, { last: SessionExercise, lastCompleted: SessionExercise, recent: SessionExercise[] }>

        const requiredIds = new Set(EXERCISES.map(e => e.id));
        const fullyResolved = new Set();

        for (let i = sessions.length - 1; i >= 0; i--) {
            // Stop if we have found everything we need
            if (fullyResolved.size === requiredIds.size) {
                break;
            }

            const session = sessions[i];
            for (const ex of session.exercises) {
                if (ex.skipped || ex.usingAlternative) continue;

                if (!lookup.has(ex.id)) {
                    lookup.set(ex.id, { last: null, lastCompleted: null, recent: [] });
                }
                const entry = lookup.get(ex.id);

                // Add to recent history if we haven't hit the limit yet
                if (entry.recent.length < CONST.STALL_DETECTION_SESSIONS) {
                    entry.recent.push(ex);
                }

                // Since iterating backwards, the first valid entry found is the latest
                if (!entry.last) {
                    entry.last = ex;
                }

                if (ex.completed && !entry.lastCompleted) {
                    entry.lastCompleted = ex;
                }

                // Check if this exercise is fully resolved (we have lastCompleted AND enough recent history)
                // Note: We need lastCompleted to calculate progression.
                // We need recent to detect stalls.
                // If we have both, we can stop searching for this exercise.
                if (requiredIds.has(ex.id) && !fullyResolved.has(ex.id)) {
                    // We are resolved if:
                    // 1. We have found a completed entry (so we know the last successful weight)
                    // 2. We have filled the recent buffer (so we can detect stalls)
                    // Note: If the user has NEVER completed the exercise, we will scan full history.
                    // This is expected and necessary to find the last completion (which doesn't exist).
                    if (entry.lastCompleted && entry.recent.length >= CONST.STALL_DETECTION_SESSIONS) {
                        fullyResolved.add(ex.id);
                    }
                }
            }
        }

        this._cache.set(sessions, lookup);
        this._lastSessions = sessions;
        this._lastLookup = lookup;
        return lookup;
    },

    getRecommendedWeight(exerciseId, recoveryStatus, sessions) {
        if (!sessions) sessions = Storage.getSessions();
        if (sessions.length === 0) return 0;

        const base = this.getBaseRecommendation(exerciseId, sessions);
        const factor = recoveryStatus === CONST.RECOVERY_STATES.YELLOW ?
            CONST.YELLOW_RECOVERY_MULTIPLIER : 1.0;
        let w = base * factor;
        return parseFloat((Math.round(w / CONST.STEPPER_INCREMENT_LBS) * CONST.STEPPER_INCREMENT_LBS).toFixed(1));
    },

    isDeloadWeek(sessions) {
        if (!sessions) sessions = Storage.getSessions();
        const week = Math.ceil((sessions.length + 1) / CONST.SESSIONS_PER_WEEK);
        return (week > 0 && week % CONST.DELOAD_WEEK_INTERVAL === 0);
    },

    getBaseRecommendation(exerciseId, sessions) {
        // Deload every N weeks
        if (this.isDeloadWeek(sessions)) {
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
        const cache = this._ensureCache(sessions);
        const entry = cache.get(exerciseId);

        // If we don't have enough history, it's not a stall
        if (!entry || entry.recent.length < CONST.STALL_DETECTION_SESSIONS) return false;

        const recent = entry.recent;
        // Stall detected if all recent attempts failed at same weight
        return recent.every(e => !e.completed && e.weight === recent[0].weight);
    },

    getLastExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions);
        const entry = cache.get(exerciseId);
        return entry ? entry.last : null;
    },

    getLastCompletedExercise(exerciseId, sessions) {
        const cache = this._ensureCache(sessions);
        const entry = cache.get(exerciseId);
        return entry ? entry.lastCompleted : null;
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