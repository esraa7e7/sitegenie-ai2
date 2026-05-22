export declare class CommentService {
    static addComment(projectId: string, userId: string, content: string, position?: any): Promise<{
        user: {
            name: string | null;
            avatar: string | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        id: string;
        content: string;
        userId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        parentId: string | null;
    }>;
    static getProjectComments(projectId: string): Promise<({
        user: {
            name: string | null;
            avatar: string | null;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        id: string;
        content: string;
        userId: string;
        position: import("@prisma/client/runtime/library").JsonValue | null;
        parentId: string | null;
    })[]>;
}
//# sourceMappingURL=comment.service.d.ts.map