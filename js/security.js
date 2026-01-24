/**
 * Security Module
 * Provides input sanitization, XSS protection, CSP support, and data validation
 * Zero external dependencies - all validation is local
 */

import { Logger } from './observability.js';
import { RECOVERY_STATES } from './constants.js';

// === INPUT SANITIZATION ===
export const Sanitizer = {
    /**
     * Sanitize HTML to prevent XSS attacks
     * Allows only safe tags and attributes
     */
    sanitizeHTML(html) {
        // Create a temporary element
        const temp = document.createElement('div');
        temp.textContent = html; // This automatically escapes HTML
        return temp.innerHTML;
    },

    /**
     * Sanitize string input - remove dangerous characters
     */
    sanitizeString(str) {
        if (typeof str !== 'string') return '';

        return str
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },

    /**
     * Sanitize number input
     */
    sanitizeNumber(num, min = -Infinity, max = Infinity) {
        const parsed = parseFloat(num);
        if (isNaN(parsed)) return 0;
        return Math.max(min, Math.min(max, parsed));
    },

    /**
     * Sanitize JSON data to prevent code injection
     */
    sanitizeJSON(data) {
        try {
            // Parse and re-stringify to remove functions and undefined values
            const parsed = JSON.parse(JSON.stringify(data));
            return parsed;
        } catch (e) {
            Logger.warn('Failed to sanitize JSON', { error: e.message });
            return null;
        }
    },

    /**
     * Sanitize file name for downloads
     */
    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9._-]/gi, '_').substring(0, 255);
    },

    /**
     * Validate URL is safe (no javascript: protocol)
     * Defense-in-depth: pre-validate before URL parsing to prevent encoding bypasses
     */
    sanitizeURL(url) {
        try {
            // Type check
            if (typeof url !== 'string' || !url) {
                Logger.warn('Invalid URL type', { url: typeof url });
                return '#';
            }

            // Normalize whitespace and control characters that could hide protocol
            const normalized = url.trim().replace(/[\x00-\x1F\x7F]/g, '');

            // Pre-validation: block dangerous protocols before URL parsing
            // This prevents encoding bypasses like java%09script: or data:
            const protocolMatch = normalized.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/) || ['', ''];
            const protocol = protocolMatch[1].toLowerCase();

            const dangerousProtocols = ['javascript', 'data', 'vbscript', 'file', 'about'];
            if (dangerousProtocols.includes(protocol)) {
                Logger.warn('Dangerous URL protocol blocked', { url: normalized.substring(0, 50), protocol });
                return '#';
            }

            // Parse and validate structure
            const parsed = new URL(normalized);

            // Only allow http, https protocols (double-check after parsing)
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                Logger.warn('Unsafe URL protocol detected', { url: normalized.substring(0, 50), protocol: parsed.protocol });
                return '#';
            }

            // Return normalized URL to prevent any residual encoding issues
            return parsed.href;
        } catch (e) {
            Logger.warn('Invalid URL format', { error: e.message });
            return '#';
        }
    }
};

// === DATA VALIDATION ===
export const Validator = {
    /**
     * Validate session data structure
     */
    validateSession(session) {
        const required = ['id', 'date', 'recoveryStatus', 'exercises'];
        const missing = required.filter(field => !(field in session));

        if (missing.length > 0) {
            Logger.error('Invalid session: missing fields', { missing });
            return { valid: false, errors: [`Missing fields: ${missing.join(', ')}`] };
        }

        // Validate ID format (UUID)
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.id)) {
            Logger.error('Invalid session: bad ID format', { id: session.id });
            return { valid: false, errors: ['Invalid session ID format'] };
        }

        // Validate date
        if (isNaN(new Date(session.date).getTime())) {
            Logger.error('Invalid session: bad date', { date: session.date });
            return { valid: false, errors: ['Invalid date format'] };
        }

        // Validate recovery status
        if (!Object.values(RECOVERY_STATES).includes(session.recoveryStatus)) {
            Logger.error('Invalid session: bad recovery status', { status: session.recoveryStatus });
            return { valid: false, errors: ['Invalid recovery status'] };
        }

        // Validate exercises array
        if (!Array.isArray(session.exercises)) {
            Logger.error('Invalid session: exercises not an array');
            return { valid: false, errors: ['Exercises must be an array'] };
        }

        // Validate each exercise in the array
        for (const [index, exercise] of session.exercises.entries()) {
            const result = this.validateExercise(exercise);
            if (!result.valid) {
                Logger.error('Invalid session: invalid exercise', { index, errors: result.errors });
                return {
                    valid: false,
                    errors: [`Exercise ${index + 1}: ${result.errors.join(', ')}`]
                };
            }
        }

        // Validate optional warmup field
        if (session.warmup) {
            if (!Array.isArray(session.warmup)) {
                return { valid: false, errors: ['Warmup must be an array'] };
            }
            // Check elements are objects with id and completed
            for (const [i, w] of session.warmup.entries()) {
                if (typeof w !== 'object' || !w || typeof w.id !== 'string' || typeof w.completed !== 'boolean') {
                    return { valid: false, errors: [`Warmup item ${i} invalid`] };
                }
                // Optional altUsed must be string if present
                if (w.altUsed !== undefined && w.altUsed !== null && typeof w.altUsed !== 'string') {
                    return { valid: false, errors: [`Warmup item ${i} altUsed must be string`] };
                }
            }
        }

        // Validate optional cardio field
        if (session.cardio) {
            if (typeof session.cardio !== 'object') {
                return { valid: false, errors: ['Cardio must be an object'] };
            }
            if (typeof session.cardio.type !== 'string' || typeof session.cardio.completed !== 'boolean') {
                return { valid: false, errors: ['Cardio object invalid'] };
            }
        }

        // Validate optional decompress field
        if (session.decompress) {
            // Can be array or object (legacy)
            if (Array.isArray(session.decompress)) {
                for (const [i, d] of session.decompress.entries()) {
                    if (typeof d !== 'object' || !d || typeof d.id !== 'string' || typeof d.completed !== 'boolean') {
                        return { valid: false, errors: [`Decompress item ${i} invalid`] };
                    }
                }
            } else if (typeof session.decompress === 'object') {
                if (typeof session.decompress.completed !== 'boolean') {
                    return { valid: false, errors: ['Decompress object invalid'] };
                }
            } else {
                return { valid: false, errors: ['Decompress must be array or object'] };
            }
        }

        return { valid: true, errors: [] };
    },

    /**
     * Validate exercise data
     */
    validateExercise(exercise) {
        const required = ['id', 'name', 'weight'];
        const missing = required.filter(field => !(field in exercise));

        if (missing.length > 0) {
            return { valid: false, errors: [`Missing fields: ${missing.join(', ')}`] };
        }

        // Validate weight is a reasonable number
        if (typeof exercise.weight !== 'number' || exercise.weight < 0 || exercise.weight > 2000) {
            return { valid: false, errors: ['Weight must be between 0 and 2000 lbs'] };
        }

        // Validate optional fields if present
        if (exercise.setsCompleted !== undefined && (typeof exercise.setsCompleted !== 'number' || exercise.setsCompleted < 0)) {
            return { valid: false, errors: ['setsCompleted must be a positive number'] };
        }
        if (exercise.completed !== undefined && typeof exercise.completed !== 'boolean') {
            return { valid: false, errors: ['completed must be boolean'] };
        }
        if (exercise.usingAlternative !== undefined && typeof exercise.usingAlternative !== 'boolean') {
            return { valid: false, errors: ['usingAlternative must be boolean'] };
        }
        if (exercise.altName !== undefined && exercise.altName !== null && typeof exercise.altName !== 'string') {
            return { valid: false, errors: ['altName must be string'] };
        }
        if (exercise.skipped !== undefined && typeof exercise.skipped !== 'boolean') {
            return { valid: false, errors: ['skipped must be boolean'] };
        }

        return { valid: true, errors: [] };
    },

    /**
     * Validate import data structure
     */
    validateImportData(data) {
        if (!data || typeof data !== 'object') {
            return { valid: false, errors: ['Invalid data format'] };
        }

        // Check for required fields
        const sessions = Array.isArray(data) ? data : data.sessions;

        if (!Array.isArray(sessions)) {
            return { valid: false, errors: ['Data must contain a sessions array'] };
        }

        // Validate each session
        const errors = [];
        sessions.forEach((session, index) => {
            const result = this.validateSession(session);
            if (!result.valid) {
                errors.push(`Session ${index + 1}: ${result.errors.join(', ')}`);
            }
        });

        if (errors.length > 0) {
            return { valid: false, errors };
        }

        return { valid: true, errors: [], sessionCount: sessions.length };
    }
};

// === CONTENT SECURITY POLICY ===
export const CSP = {
    /**
     * Generate CSP meta tag content
     */
    getPolicy() {
        return [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for dynamic styles
            "img-src 'self' data: blob:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ');
    },

    /**
     * Check if CSP is enabled
     */
    isEnabled() {
        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        return !!meta;
    }
};

// === RATE LIMITING ===
export const RateLimiter = {
    attempts: new Map(),

    /**
     * Check if action is rate limited
     * @param {string} action - Action identifier
     * @param {number} maxAttempts - Maximum attempts allowed
     * @param {number} windowMs - Time window in milliseconds
     */
    check(action, maxAttempts = 5, windowMs = 60000) {
        const now = Date.now();
        const history = this.attempts.get(action) || [];

        // Filter attempts within time window
        const recentAttempts = history.filter(time => now - time < windowMs);

        if (recentAttempts.length >= maxAttempts) {
            Logger.warn('Rate limit exceeded', { action, attempts: recentAttempts.length });
            return false;
        }

        // Add current attempt
        recentAttempts.push(now);
        this.attempts.set(action, recentAttempts);

        return true;
    },

    /**
     * Reset rate limit for action
     */
    reset(action) {
        this.attempts.delete(action);
    }
};

// === INTEGRITY CHECKER ===
export const IntegrityChecker = {
    /**
     * Generate hash of data for integrity verification
     */
    async generateHash(data) {
        const str = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(str);

        if ('crypto' in window && 'subtle' in window.crypto) {
            try {
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            } catch (e) {
                Logger.warn('Web Crypto API not available, using fallback hash');
                return this.simpleHash(str);
            }
        } else {
            return this.simpleHash(str);
        }
    },

    /**
     * Simple hash function fallback (not cryptographically secure)
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },

    /**
     * Verify data integrity
     */
    async verify(data, expectedHash) {
        const actualHash = await this.generateHash(data);
        return actualHash === expectedHash;
    }
};

// === AUDIT LOG ===
export const AuditLog = {
    logs: [],
    maxLogs: 100,

    /**
     * Log security-relevant events
     */
    log(event, details = {}) {
        const entry = {
            event,
            details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 50)
        };

        this.logs.push(entry);

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        Logger.info(`Security audit: ${event}`, details);

        // Persist critical security events
        if (this.isCritical(event)) {
            this.persist(entry);
        }
    },

    isCritical(event) {
        const criticalEvents = [
            'failed_validation',
            'xss_attempt',
            'rate_limit_exceeded',
            'integrity_check_failed'
        ];
        return criticalEvents.includes(event);
    },

    persist(entry) {
        try {
            const audits = JSON.parse(localStorage.getItem('flexx_audit_log') || '[]');
            audits.push(entry);

            // Keep only last 50 critical events
            if (audits.length > 50) {
                audits.shift();
            }

            localStorage.setItem('flexx_audit_log', JSON.stringify(audits));
        } catch (e) {
            Logger.error('Failed to persist audit log', { error: e.message });
        }
    },

    getLogs() {
        return [...this.logs];
    },

    getPersistedLogs() {
        try {
            return JSON.parse(localStorage.getItem('flexx_audit_log') || '[]');
        } catch (e) {
            return [];
        }
    },

    clear() {
        this.logs = [];
        localStorage.removeItem('flexx_audit_log');
    }
};

// === INITIALIZE SECURITY SYSTEM ===
export const Security = {
    init() {
        // Log initialization
        AuditLog.log('security_init', { version: '3.9' });
        Logger.info('Security system initialized');
    },

    Sanitizer,
    Validator,
    CSP,
    RateLimiter,
    IntegrityChecker,
    AuditLog
};

export default Security;
