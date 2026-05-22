import { BaseRepository } from './base.repository.js';
import type { Project } from '@prisma/client';

export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('project');
  }

  async findByTenantAndId(tenantId: string, id: string): Promise<Project | null> {
    return this.model.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findAll(tenantId: string): Promise<Project[]> {
    return this.model.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(data: any): Promise<Project> {
    return this.model.create({ data });
  }

  async softDelete(id: string): Promise<Project> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'DELETED' },
    });
  }
}
