import { prisma } from '../core/database.js';

export abstract class BaseRepository<T> {
  public model: any;

  constructor(modelName: string) {
    this.model = (prisma as any)[modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findAll(tenantId: string): Promise<T[]> {
    return this.model.findMany({
      where: { tenantId, deletedAt: null },
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<T> {
    return this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
