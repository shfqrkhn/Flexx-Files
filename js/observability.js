/**
 * Observability Module
 * Provides structured logging, performance monitoring, error tracking, and analytics
 * All data is stored locally - zero external tracking
 */

// === LOG LEVELS ===
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    CRITICAL: 4
};

// === PERFORMANCE METRICS ===
const Metrics = {
    marks: new Map(),
    measures: [],

    mark(name) {
        this.marks.set(name, performance.now());
    },

    measure(name, startMark) {
        const start = this.marks.get(startMark);
        if (!start) {
            console.warn(`No mark found for: ${startMark}`);
            return null;
        }
        const duration = performance.now() - start;
        const measure = { name, duration, timestamp: Date.now() };
        this.measures.push(measure);

        // Keep only last 100 measures to prevent memory bloat
        if (this.measures.length > 100) {
            this.measures.shift();
        }

        return duration;
    },

    getMeasures() {
        return [...this.measures];
    },

    getAverageDuration(name) {
        const filtered = this.measures.filter(m => m.name === name);
        if (filtered.length === 0) return 0;
        const sum = filtered.reduce((acc, m) => acc + m.duration, 0);
        return sum / filtered.length;
    },

    clear() {
        this.marks.clear();
        this.measures = [];
    }
};

// === STRUCTURED LOGGER ===
const Logger = {
    level: LOG_LEVELS.INFO,
    logs: [],
    maxLogs: 500,

    setLevel(level) {
        this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    },

    _log(level, message, context = {}) {
        if (LOG_LEVELS[level] < this.level) return;

        const logEntry = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
            url: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 50) // Truncated for privacy
        };

        // Add to in-memory log buffer
        this.logs.push(logEntry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Console output with styling
        const styles = {
            DEBUG: 'color: #888',
            INFO: 'color: #0af',
            WARN: 'color: #fa0',
            ERROR: 'color: #f33',
            CRITICAL: 'color: #fff; background: #f00; padding: 2px 5px'
        };

        console.log(
            `%c[${level}] ${message}`,
            styles[level] || '',
            context
        );

        // Persist critical errors
        if (level === 'ERROR' || level === 'CRITICAL') {
            this._persistError(logEntry);
        }
    },

    _persistError(logEntry) {
        try {
            // SECURITY: Strip stack traces before persisting to localStorage (Sentinel)
            // Clone entry to avoid modifying the in-memory log
            const safeEntry = JSON.parse(JSON.stringify(logEntry));
            if (safeEntry.context && safeEntry.context.stack) {
                delete safeEntry.context.stack;
            }

            const errors = JSON.parse(localStorage.getItem('flexx_errors') || '[]');
            errors.push(safeEntry);
            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.shift();
            }
            localStorage.setItem('flexx_errors', JSON.stringify(errors));
        } catch (e) {
            console.error('Failed to persist error:', e);
        }
    },

    debug(message, context) { this._log('DEBUG', message, context); },
    info(message, context) { this._log('INFO', message, context); },
    warn(message, context) { this._log('WARN', message, context); },
    error(message, context) { this._log('ERROR', message, context); },
    critical(message, context) { this._log('CRITICAL', message, context); },

    getLogs() {
        return [...this.logs];
    },

    getErrors() {
        try {
            return JSON.parse(localStorage.getItem('flexx_errors') || '[]');
        } catch (e) {
            return [];
        }
    },

    clearErrors() {
        localStorage.removeItem('flexx_errors');
    },

    exportLogs() {
        const data = {
            logs: this.getLogs(),
            errors: this.getErrors(),
            metrics: Metrics.getMeasures(),
            exportDate: new Date().toISOString(),
            appVersion: '3.9'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `flexx-logs-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    }
};

// === ERROR TRACKING ===
const ErrorTracker = {
    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            Logger.error('Uncaught error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            Logger.error('Unhandled promise rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });

        Logger.info('Error tracking initialized');
    }
};

// === ANALYTICS (PRIVACY-PRESERVING, LOCAL ONLY) ===
const Analytics = {
    events: [],
    maxEvents: 1000,

    track(eventName, properties = {}) {
        const event = {
            name: eventName,
            properties,
            timestamp: Date.now()
        };

        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }

        Logger.debug(`Analytics: ${eventName}`, properties);
    },

    getEvents() {
        return [...this.events];
    },

    getEventCount(eventName) {
        return this.events.filter(e => e.name === eventName).length;
    },

    getEventsSince(timestamp) {
        return this.events.filter(e => e.timestamp >= timestamp);
    },

    clear() {
        this.events = [];
    }
};

// === PERFORMANCE OBSERVER ===
const PerformanceMonitor = {
    init() {
        // Monitor long tasks (> 50ms)
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            Logger.warn('Long task detected', {
                                name: entry.name,
                                duration: entry.duration.toFixed(2) + 'ms',
                                startTime: entry.startTime.toFixed(2) + 'ms'
                            });
                        }
                    }
                });
                observer.observe({ entryTypes: ['measure', 'navigation'] });
                Logger.info('Performance monitoring initialized');
            } catch (e) {
                Logger.warn('Performance observer not supported', { error: e.message });
            }
        }
    },

    logMemoryUsage() {
        if ('memory' in performance) {
            const mem = performance.memory;
            Logger.info('Memory usage', {
                used: (mem.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
                total: (mem.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
                limit: (mem.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB'
            });
        }
    }
};

// === BATTERY MONITOR (SUSTAINABILITY) ===
const BatteryMonitor = {
    batteryLevel: 1.0,
    isCharging: true,

    async init() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                this.batteryLevel = battery.level;
                this.isCharging = battery.charging;

                battery.addEventListener('levelchange', () => {
                    this.batteryLevel = battery.level;
                    Logger.info('Battery level changed', { level: (battery.level * 100).toFixed(0) + '%' });
                });

                battery.addEventListener('chargingchange', () => {
                    this.isCharging = battery.charging;
                    Logger.info('Charging status changed', { charging: battery.charging });
                });

                Logger.info('Battery monitoring initialized', {
                    level: (battery.level * 100).toFixed(0) + '%',
                    charging: battery.charging
                });
            } catch (e) {
                Logger.warn('Battery monitoring not available', { error: e.message });
            }
        }
    },

    shouldReduceAnimations() {
        // Reduce animations if battery is low and not charging
        return this.batteryLevel < 0.2 && !this.isCharging;
    },

    shouldReduceFrequency() {
        // Reduce update frequency if battery is low
        return this.batteryLevel < 0.15 && !this.isCharging;
    }
};

// === INITIALIZE ALL SYSTEMS ===
export const Observability = {
    init() {
        ErrorTracker.init();
        PerformanceMonitor.init();
        BatteryMonitor.init();
        Logger.info('Observability system initialized', { version: '3.9' });
    },

    Logger,
    Metrics,
    Analytics,
    BatteryMonitor,
    PerformanceMonitor
};

// Export individual modules for direct access
export { Logger, Metrics, Analytics, ErrorTracker, PerformanceMonitor, BatteryMonitor };
