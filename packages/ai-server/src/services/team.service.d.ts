export declare class TeamService {
    static createTeam(tenantId: string, userId: string, name: string): Promise<{
        members: {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            role: string;
            userId: string;
            teamId: string;
        }[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        tenantId: string;
    }>;
    static getTeams(tenantId: string, userId: string): Promise<({
        _count: {
            projects: number;
        };
        members: ({
            user: {
                email: string;
                name: string | null;
                avatar: string | null;
            };
        } & {
            createdAt: Date;
            updatedAt: Date;
            id: string;
            role: string;
            userId: string;
            teamId: string;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        name: string;
        id: string;
        tenantId: string;
    })[]>;
    static inviteMember(teamId: string, inviterId: string, email: string, role?: string): Promise<{
        email: string;
        createdAt: Date;
        id: string;
        status: string;
        role: string;
        teamId: string;
        token: string;
        expiresAt: Date;
    }>;
    static getTeamProjects(teamId: string, userId: string): Promise<{
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
}
//# sourceMappingURL=team.service.d.ts.map