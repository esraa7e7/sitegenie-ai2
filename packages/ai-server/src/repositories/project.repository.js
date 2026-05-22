import { BaseRepository } from './base.repository.js';
export class ProjectRepository extends BaseRepository {
    constructor() {
        super('project');
    }
    async findByTenantAndId(tenantId, id) {
        return this.model.findFirst({
            where: { id, tenantId, deletedAt: null },
        });
    }
    async findAll(tenantId) {
        return this.model.findMany({
            where: { tenantId, deletedAt: null },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async create(data) {
        return this.model.create({ data });
    }
    async softDelete(id) {
        return this.model.update({
            where: { id },
            data: { deletedAt: new Date(), status: 'DELETED' },
        });
    }
}
