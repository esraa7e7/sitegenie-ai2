import { nanoid } from 'nanoid';
import crypto from 'crypto';
/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(size = 21) {
    return nanoid(size);
}
/**
 * Generate a unique task ID
 */
export function generateTaskId(size = 21) {
    return `task_${nanoid(size)}`;
}
/**
 * Generate a unique project ID
 */
export function generateProjectId(size = 21) {
    return `proj_${nanoid(size)}`;
}
/**
 * Generate a unique deployment ID
 */
export function generateDeploymentId(size = 21) {
    return `dep_${nanoid(size)}`;
}
/**
 * Generate a unique agent ID
 */
export function generateAgentId(agentType, size = 21) {
    return `agent_${agentType}_${nanoid(size)}`;
}
/**
 * Generate a cryptographic secret
 */
export function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}
/**
 * Hash a value using SHA-256
 */
export function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}
/**
 * Compare two hashed values
 */
export function compareHash(value, hash) {
    return hashValue(value) === hash;
}
/**
 * Calculate time difference in seconds
 */
export function getTimeDifferenceInSeconds(start, end = new Date()) {
    return Math.floor((end.getTime() - start.getTime()) / 1000);
}
/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}
/**
 * Delay execution for specified milliseconds
 */
export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff(fn, maxAttempts = 3, initialDelayMs = 1000) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt < maxAttempts) {
                const delayMs = initialDelayMs * Math.pow(2, attempt - 1);
                await delay(delayMs);
            }
        }
    }
    throw lastError || new Error('Max retry attempts exceeded');
}
/**
 * Parse error message from various error types
 */
export function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
        return String(error.message);
    }
    return 'An unknown error occurred';
}
/**
 * Batch array into chunks
 */
export function batchArray(array, batchSize) {
    const batches = [];
    for (let i = 0; i < array.length; i += batchSize) {
        batches.push(array.slice(i, i + batchSize));
    }
    return batches;
}
/**
 * Debounce a function
 */
export function debounce(fn, delayMs) {
    let timeoutId = null;
    return (...args) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delayMs);
    };
}
/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input, maxLength = 5000) {
    return input
        .substring(0, maxLength)
        .replace(/[<>\"']/g, (char) => {
        const entities = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
        };
        return entities[char] || char;
    });
}
/**
 * Validate email format
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
}
/**
 * Validate URL format
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Deep merge objects
 */
export function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (typeof target === 'object' && typeof source === 'object') {
        for (const key in source) {
            if (typeof source[key] === 'object' && typeof target[key] === 'object') {
                deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
    }
    return deepMerge(target, ...sources);
}
/**
 * Check if value is empty (null, undefined, empty string, empty array/object)
 */
export function isEmpty(value) {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Pick specific properties from object
 */
export function pick(obj, keys) {
    const result = {}; // Initialize with a type assertion
    keys.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = obj[key];
        }
    });
    return result;
}
/**
 * Omit specific properties from object
 */
export function omit(obj, keys) {
    const result = {};
    for (const key of Object.keys(obj)) {
        if (!keys.includes(key)) {
            result[key] = obj[key];
        }
    }
    return result;
}
