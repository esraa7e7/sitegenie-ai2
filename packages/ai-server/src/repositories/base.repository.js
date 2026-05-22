import { prisma } from '../core/database.js';
export class BaseRepository {
    constructor(modelName) {
        Object.defineProperty(this, "model", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.model = prisma[modelName];
    }
    async findById(id) {
        return this.model.findUnique({
            where: { id, deletedAt: null },
        });
    }
    async findAll(tenantId) {
        return this.model.findMany({
            where: { tenantId, deletedAt: null },
        });
    }
    async create(data) {
        return this.model.create({ data });
    }
    async update(id, data) {
        return this.model.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        return this.model.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
