/**
 * Internationalization (i18n) Module
 * Provides framework for multi-language support with locale-aware formatting
 * Currently supports English, but extensible to other languages
 */

import { Logger } from './observability.js';

// === TRANSLATIONS ===
const translations = {
    en: {
        // App title
        app: {
            name: 'Flexx Files',
            tagline: 'Offline Strength Tracker'
        },

        // Navigation
        nav: {
            train: 'TRAIN',
            logs: 'LOGS',
            gains: 'GAINS',
            system: 'SYSTEM'
        },

        // Recovery states
        recovery: {
            title: 'Ready?',
            green: 'Full Strength',
            yellow: '-10% Weight',
            red: 'Stop. Walk only.',
            firstSession: 'First Session',
            firstSessionDesc: 'Find 12-rep max weights.',
            longGap: 'Long Gap',
            longGapDesc: 'Weights -10% safety reset.',
            restRequired: 'Rest Required',
            nextWorkout: 'Next workout in: {hours} hours'
        },

        // Workout phases
        workout: {
            warmup: 'Warmup',
            lifting: 'Lifting',
            cardio: 'Cardio',
            decompress: 'Decompress',
            startLifting: 'Start Lifting',
            nextCardio: 'Next: Cardio',
            nextDecompress: 'Next: Decompress',
            saveFinish: 'Save & Finish'
        },

        // Exercise UI
        exercise: {
            last: 'Last: {weight} lbs',
            firstSession: 'First Session',
            alternatives: 'Alternatives',
            perSide: '/ side',
            completed: 'Completed',
            resting: 'RESTING',
            skip: 'SKIP',
            selection: 'Selection',
            startTimer: 'Start 5m Timer'
        },

        // History
        history: {
            title: 'History',
            noLogs: 'No logs yet.',
            viewDetails: 'View Details',
            warmup: 'WARMUP',
            lifting: 'LIFTING',
            finisher: 'FINISHER',
            noData: 'No Data',
            partial: 'Partial',
            fullSession: 'Full Session'
        },

        // Progress
        progress: {
            title: 'Progress',
            needLogs: 'Need 2+ logs.',
            errorRendering: 'Error rendering chart.'
        },

        // Settings
        settings: {
            title: 'Settings',
            protocolGuide: '📖 Protocol Guide',
            backupData: 'Backup Data',
            restoreData: 'Restore Data',
            factoryReset: 'Factory Reset',
            exportLogs: 'Export Diagnostic Logs',
            privacy: 'Privacy & Data',
            privacyDesc: 'Your data never leaves this device',
            compliance: 'Compliance',
            complianceDesc: 'WCAG 2.1 AA compliant'
        },

        // Modals
        modal: {
            confirm: 'Confirm?',
            cancel: 'Cancel',
            ok: 'OK',
            delete: 'Delete?',
            reset: 'RESET ALL?',
            finish: 'Finish?',
            saveSession: 'Save this session?',
            stop: 'Stop',
            lowRecovery: 'Low recovery. Walk only.',
            importConfirm: 'Import {count} sessions? Overwrites current data.',
            invalidFile: 'Invalid File',
            exportSuccess: 'Data exported successfully'
        },

        // Errors
        errors: {
            saveFailed: 'Failed to save workout. Please try exporting your data.',
            deleteFailed: 'Failed to delete session. Please try again.',
            importInvalid: 'Invalid file format: sessions must be an array',
            importMissing: 'Invalid file: some sessions are missing required fields',
            importParse: 'Invalid file: Please ensure this is a valid Flexx Files backup file.',
            exportFailed: 'Failed to export data. Please try again.',
            loadFailed: 'Failed to load sessions data'
        },

        // Accessibility
        a11y: {
            skipToMain: 'Skip to main content',
            mainNav: 'Main navigation',
            navigateTo: 'Navigate to {destination}',
            increaseWeight: 'Increase weight',
            decreaseWeight: 'Decrease weight',
            set: 'Set {number}',
            weightPounds: 'Weight in pounds',
            closeModal: 'Close dialog'
        },

        // Time formatting
        time: {
            daysAgo: '{days} days ago',
            hoursAgo: '{hours} hours ago',
            minutesAgo: '{minutes} minutes ago',
            justNow: 'Just now'
        }
    }

    // Additional languages can be added here:
    // es: { ... },
    // fr: { ... },
    // de: { ... }
};

// === I18N ENGINE ===
export const I18n = {
    currentLocale: 'en',
    fallbackLocale: 'en',
    translations,

    /**
     * Initialize i18n system
     */
    init() {
        // Detect user's preferred language
        const userLang = this.detectLanguage();
        this.setLocale(userLang);
        Logger.info('I18n initialized', { locale: this.currentLocale });
    },

    /**
     * Detect user's preferred language from browser settings
     */
    detectLanguage() {
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage || 'en';
        // Extract primary language code (e.g., 'en-US' -> 'en')
        const primaryLang = browserLang.split('-')[0];

        // Check if we have translations for this language
        if (primaryLang in this.translations) {
            return primaryLang;
        }

        // Fall back to English
        return this.fallbackLocale;
    },

    /**
     * Set current locale
     */
    setLocale(locale) {
        if (locale in this.translations) {
            this.currentLocale = locale;
            document.documentElement.setAttribute('lang', locale);
            Logger.info('Locale changed', { locale });
            return true;
        } else {
            Logger.warn('Locale not available', { locale });
            return false;
        }
    },

    /**
     * Get translation for key
     * @param {string} key - Translation key (e.g., 'nav.train')
     * @param {object} params - Parameters for interpolation
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLocale];

        // Traverse the translation object
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Key not found, try fallback locale
                Logger.warn('Translation missing', { key, locale: this.currentLocale });
                value = this._getFallback(key);
                break;
            }
        }

        // If value is still an object, return the key (error)
        if (typeof value === 'object') {
            Logger.error('Translation key is not a string', { key });
            return key;
        }

        // Interpolate parameters
        return this._interpolate(value || key, params);
    },

    /**
     * Get fallback translation
     */
    _getFallback(key) {
        const keys = key.split('.');
        let value = this.translations[this.fallbackLocale];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key itself if not found
            }
        }

        return value;
    },

    /**
     * Interpolate parameters into translation string
     * Example: "Hello {name}" with {name: "World"} -> "Hello World"
     */
    _interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    },

    /**
     * Get available locales
     */
    getAvailableLocales() {
        return Object.keys(this.translations);
    },

    /**
     * Check if locale is available
     */
    isLocaleAvailable(locale) {
        return locale in this.translations;
    }
};

// === DATE/TIME FORMATTING ===
export const DateFormatter = {
    /**
     * Format date according to locale
     */
    format(date, options = {}) {
        const d = new Date(date);
        const locale = I18n.currentLocale;

        const defaultOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            ...options
        };

        try {
            return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
        } catch (e) {
            Logger.warn('Date formatting failed', { error: e.message });
            // Fallback formatting
            return d.toLocaleDateString();
        }
    },

    /**
     * Format relative time (e.g., "2 hours ago")
     */
    relative(date) {
        const d = new Date(date);
        const now = Date.now();
        const diffMs = now - d.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMinutes < 1) {
            return I18n.t('time.justNow');
        } else if (diffMinutes < 60) {
            return I18n.t('time.minutesAgo', { minutes: diffMinutes });
        } else if (diffHours < 24) {
            return I18n.t('time.hoursAgo', { hours: diffHours });
        } else {
            return I18n.t('time.daysAgo', { days: diffDays });
        }
    },

    /**
     * Format time (HH:MM)
     */
    formatTime(date) {
        const d = new Date(date);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
};

// === NUMBER FORMATTING ===
export const NumberFormatter = {
    /**
     * Format number according to locale
     */
    format(number, options = {}) {
        const locale = I18n.currentLocale;

        try {
            return new Intl.NumberFormat(locale, options).format(number);
        } catch (e) {
            Logger.warn('Number formatting failed', { error: e.message });
            return number.toString();
        }
    },

    /**
     * Format weight with unit
     */
    formatWeight(weight, unit = 'lbs') {
        return `${this.format(weight, { minimumFractionDigits: 0, maximumFractionDigits: 1 })} ${unit}`;
    },

    /**
     * Format percentage
     */
    formatPercent(value) {
        return this.format(value, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 1 });
    }
};

// === TIMEZONE HANDLING ===
export const Timezone = {
    /**
     * Get user's timezone
     */
    getUserTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            Logger.warn('Could not detect timezone');
            return 'UTC';
        }
    },

    /**
     * Convert date to user's timezone
     */
    toUserTimezone(date) {
        const d = new Date(date);
        return d.toLocaleString(I18n.currentLocale, {
            timeZone: this.getUserTimezone()
        });
    }
};

// Export consolidated module
export default {
    I18n,
    DateFormatter,
    NumberFormatter,
    Timezone
};
