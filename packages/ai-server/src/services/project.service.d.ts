export declare class ProjectService {
    private projectRepo;
    constructor();
    getAllProjects(tenantId: string): Promise<{
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        status: string;
        description: string | null;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        tenantId: string;
        userId: string | null;
        teamId: string | null;
        deletedAt: Date | null;
    }[]>;
    getProjectDetails(tenantId: string, projectId: string): Promise<{
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        status: string;
        description: string | null;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        tenantId: string;
        userId: string | null;
        teamId: string | null;
        deletedAt: Date | null;
    }>;
    createProject(tenantId: string, name: string, description?: string): Promise<{
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        status: string;
        description: string | null;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        tenantId: string;
        userId: string | null;
        teamId: string | null;
        deletedAt: Date | null;
    }>;
    deleteProject(tenantId: string, projectId: string): Promise<{
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        status: string;
        description: string | null;
        files: import("@prisma/client/runtime/library").JsonValue | null;
        tenantId: string;
        userId: string | null;
        teamId: string | null;
        deletedAt: Date | null;
    }>;
    updateProjectFile(projectId: string, filePath: string, content: string): Promise<void>;
    getProjectFiles(projectId: string): Promise<any[]>;
    readFile(projectId: string, filePath: string): Promise<string>;
}
//# sourceMappingURL=project.service.d.ts.map