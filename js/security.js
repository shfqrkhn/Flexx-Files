/**
 * Security Module
 * Provides input sanitization, XSS protection, CSP support, and data validation
 * Zero external dependencies - all validation is local
 */

import { Logger } from './observability.js';

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
     */
    sanitizeURL(url) {
        try {
            const parsed = new URL(url);
            // Only allow http, https protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                Logger.warn('Unsafe URL protocol detected', { url, protocol: parsed.protocol });
                return '#';
            }
            return url;
        } catch (e) {
            Logger.warn('Invalid URL', { url });
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

        // Validate exercises array
        if (!Array.isArray(session.exercises)) {
            Logger.error('Invalid session: exercises not an array');
            return { valid: false, errors: ['Exercises must be an array'] };
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
            "script-src 'self'",
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

// === SECURE STORAGE ===
export const SecureStorage = {
    /**
     * Encrypt data before storing (basic XOR cipher for demonstration)
     * For production, use Web Crypto API with proper key management
     */
    encrypt(data, key = 'flexx-secure-key') {
        const str = JSON.stringify(data);
        let encrypted = '';

        for (let i = 0; i < str.length; i++) {
            encrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }

        return btoa(encrypted); // Base64 encode
    },

    /**
     * Decrypt data from storage
     */
    decrypt(encrypted, key = 'flexx-secure-key') {
        try {
            const decoded = atob(encrypted);
            let decrypted = '';

            for (let i = 0; i < decoded.length; i++) {
                decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }

            return JSON.parse(decrypted);
        } catch (e) {
            Logger.error('Failed to decrypt data', { error: e.message });
            return null;
        }
    },

    /**
     * Securely store data in localStorage
     */
    setItem(key, value, encrypt = false) {
        try {
            const data = encrypt ? this.encrypt(value) : JSON.stringify(value);
            localStorage.setItem(key, data);
            Logger.debug('Secure storage: item saved', { key, encrypted: encrypt });
            return true;
        } catch (e) {
            Logger.error('Failed to save to secure storage', { key, error: e.message });
            return false;
        }
    },

    /**
     * Securely retrieve data from localStorage
     */
    getItem(key, encrypted = false) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;

            return encrypted ? this.decrypt(data) : JSON.parse(data);
        } catch (e) {
            Logger.error('Failed to read from secure storage', { key, error: e.message });
            return null;
        }
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
    SecureStorage,
    RateLimiter,
    IntegrityChecker,
    AuditLog
};

export default Security;
