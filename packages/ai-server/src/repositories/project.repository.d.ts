import { BaseRepository } from './base.repository.js';
import { Project } from '@prisma/client';
export declare class ProjectRepository extends BaseRepository<Project> {
    constructor();
    findByTenantAndId(tenantId: string, id: string): Promise<Project | null>;
    findAll(tenantId: string): Promise<Project[]>;
    create(data: any): Promise<Project>;
    softDelete(id: string): Promise<Project>;
}
//# sourceMappingURL=project.repository.d.ts.map