/**
 * Generate a unique request ID for tracking
 */
export declare function generateRequestId(size?: number): string;
/**
 * Generate a unique task ID
 */
export declare function generateTaskId(size?: number): string;
/**
 * Generate a unique project ID
 */
export declare function generateProjectId(size?: number): string;
/**
 * Generate a unique deployment ID
 */
export declare function generateDeploymentId(size?: number): string;
/**
 * Generate a unique agent ID
 */
export declare function generateAgentId(agentType: string, size?: number): string;
/**
 * Generate a cryptographic secret
 */
export declare function generateSecret(length?: number): string;
/**
 * Hash a value using SHA-256
 */
export declare function hashValue(value: string): string;
/**
 * Compare two hashed values
 */
export declare function compareHash(value: string, hash: string): boolean;
/**
 * Calculate time difference in seconds
 */
export declare function getTimeDifferenceInSeconds(start: Date, end?: Date): number;
/**
 * Format bytes to human-readable string
 */
export declare function formatBytes(bytes: number): string;
/**
 * Delay execution for specified milliseconds
 */
export declare function delay(ms: number): Promise<void>;
/**
 * Retry a function with exponential backoff
 */
export declare function retryWithBackoff<T>(fn: () => Promise<T>, maxAttempts?: number, initialDelayMs?: number): Promise<T>;
/**
 * Parse error message from various error types
 */
export declare function getErrorMessage(error: unknown): string;
/**
 * Batch array into chunks
 */
export declare function batchArray<T>(array: T[], batchSize: number): T[][];
/**
 * Debounce a function
 */
export declare function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delayMs: number): (...args: Parameters<T>) => void;
/**
 * Sanitize user input to prevent XSS
 */
export declare function sanitizeInput(input: string, maxLength?: number): string;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Validate URL format
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Deep merge objects
 */
export declare function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: T[]): T;
/**
 * Check if value is empty (null, undefined, empty string, empty array/object)
 */
export declare function isEmpty(value: unknown): boolean;
/**
 * Pick specific properties from object
 */
export declare function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * Omit specific properties from object
 */
export declare function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
//# sourceMappingURL=index.d.ts.map