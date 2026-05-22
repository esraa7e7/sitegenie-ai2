export declare class FileService {
    private static WORKSPACE_ROOT;
    static init(): Promise<void>;
    static getProjectPath(projectId: string): string;
    static writeProjectFile(projectId: string, filePath: string, content: string): Promise<void>;
    static readProjectFile(projectId: string, filePath: string): Promise<string>;
    static listFiles(projectId: string): Promise<string[]>;
    static deleteFile(projectId: string, filePath: string): Promise<void>;
    static syncProjectToDisk(projectId: string, files: Record<string, string>): Promise<void>;
}
//# sourceMappingURL=file.service.d.ts.map