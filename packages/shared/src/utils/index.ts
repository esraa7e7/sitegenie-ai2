import { nanoid } from 'nanoid';
import crypto from 'crypto';

/**
 * Generate a unique request ID for tracking
 */
export function generateRequestId(): string {
  return nanoid();
}

/**
 * Generate a unique task ID
 */
export function generateTaskId(): string {
  return `task_${nanoid()}`;
}

/**
 * Generate a unique project ID
 */
export function generateProjectId(): string {
  return `proj_${nanoid()}`;
}

/**
 * Generate a unique deployment ID
 */
export function generateDeploymentId(): string {
  return `dep_${nanoid()}`;
}

/**
 * Generate a unique agent ID
 */
export function generateAgentId(agentType: string): string {
  return `agent_${agentType}_${nanoid()}`;
}

/**
 * Generate a cryptographic secret
 */
export function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a value using SHA-256
 */
export function hashValue(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Compare two hashed values
 */
export function compareHash(value: string, hash: string): boolean {
  return hashValue(value) === hash;
}

/**
 * Calculate time difference in seconds
 */
export function getTimeDifferenceInSeconds(start: Date, end: Date = new Date()): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
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
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
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
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

/**
 * Batch array into chunks
 */
export function batchArray<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
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
export function sanitizeInput(input: string, maxLength: number = 5000): string {
  return input
    .substring(0, maxLength)
    .replace(/[<>\"']/g, (char) => {
      const entities: Record<string, string> = {
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
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  ...sources: T[]
): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (typeof source[key] === 'object' && typeof target[key] === 'object') {
        deepMerge(target[key] as T, source[key] as T);
      } else {
        target[key] = source[key];
      }
    }
  }

  return deepMerge(target, ...sources);
}

/**
 * Check if value is empty (null, undefined, empty string, empty array/object)
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Pick specific properties from object
 */
export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key] as Pick<T, K>[K];
    }
  });
  return result;
}

/**
 * Omit specific properties from object
 */
export function omit<T, K extends keyof T>(obj: T, keys: K[]): Partial<T> {
  const result: Partial<T> = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}
