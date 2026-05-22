export declare class VfsService {
    /**
     * Auto-Save: High-frequency save to Redis Cache
     * Every 4-5 seconds from the UI
     */
    static autoSave(projectId: string, files: Array<{
        path: string;
        content: string;
    }>): Promise<{
        status: string;
        count: number;
    } | {
        status: string;
        timestamp: number;
    }>;
    /**
     * Lazy Sync: Periodically flushes Redis Cache to Postgres
     */
    private static syncTimeouts;
    private static scheduleLazySync;
    /**
     * Sync Cache: Manually flush Redis to Database
     */
    static syncCacheToDatabase(projectId: string): Promise<{
        status: string;
        count?: undefined;
    } | {
        status: string;
        count: number;
    }>;
    /**
     * Snapshots: Permanent compressed versions
     */
    static createSnapshot(projectId: string, reason?: string): Promise<{
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        version: number;
        createdAt: Date;
        projectId: string;
        id: string;
        compressedData: Buffer;
    }>;
    /**
     * Restore: Roll back to a specific version
     */
    static restoreSnapshot(projectId: string, snapshotId: string): Promise<{
        status: string;
        version: number;
    }>;
    /**
     * Force Sync: Fallback for when Redis is missing
     */
    private static forceSyncToDatabase;
    /**
     * Compatibility method for legacy calls (e.g. from AIService)
     */
    static syncProjectFiles(projectId: string, files: any[]): Promise<{
        status: string;
        count: number;
    } | {
        status: string;
        timestamp: number;
    }>;
    /**
     * Standard VFS Getters
     */
    static getProjectFiles(projectId: string): Promise<any[]>;
    static getFile(projectId: string, path: string): Promise<{
        path: string;
        updatedAt: Date;
        projectId: string;
        id: string;
        content: string;
    } | null>;
    static deleteFile(projectId: string, path: string): Promise<{
        path: string;
        updatedAt: Date;
        projectId: string;
        id: string;
        content: string;
    }>;
}
//# sourceMappingURL=vfs.service.d.ts.map