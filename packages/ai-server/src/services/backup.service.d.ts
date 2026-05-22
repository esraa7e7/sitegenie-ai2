export declare class BackupService {
    private static BACKUP_ROOT;
    static init(): Promise<void>;
    static createSnapshot(projectId: string): Promise<string>;
    static restoreSnapshot(projectId: string, snapshotId: string): Promise<void>;
    static getSnapshots(projectId: string): Promise<string[]>;
}
//# sourceMappingURL=backup.service.d.ts.map