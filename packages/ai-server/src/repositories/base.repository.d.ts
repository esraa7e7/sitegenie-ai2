export declare abstract class BaseRepository<T> {
    model: any;
    constructor(modelName: string);
    findById(id: string): Promise<T | null>;
    findAll(tenantId: string): Promise<T[]>;
    create(data: any): Promise<T>;
    update(id: string, data: any): Promise<T>;
    softDelete(id: string): Promise<T>;
}
//# sourceMappingURL=base.repository.d.ts.map