export declare class MarketplaceService {
    static listItems(query: {
        type?: string;
        search?: string;
    }): Promise<({
        creator: {
            name: string;
            rating: number;
        };
    } & {
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        version: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        name: string;
        id: string;
        description: string;
        previewUrl: string | null;
        iconUrl: string | null;
        creatorId: string;
        price: number;
        installCount: number;
        rating: number;
    })[]>;
    static getItem(id: string): Promise<{
        reviews: ({
            user: {
                name: string | null;
                avatar: string | null;
            };
        } & {
            createdAt: Date;
            id: string;
            comment: string | null;
            userId: string;
            rating: number;
            itemId: string;
        })[];
        creator: {
            website: string | null;
            createdAt: Date;
            name: string;
            id: string;
            userId: string;
            rating: number;
            bio: string | null;
        };
    } & {
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        version: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        name: string;
        id: string;
        description: string;
        previewUrl: string | null;
        iconUrl: string | null;
        creatorId: string;
        price: number;
        installCount: number;
        rating: number;
    }>;
    static installPlugin(projectId: string, itemId: string): Promise<{
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: string;
        itemId: string;
    }>;
    static getInstalledPlugins(projectId: string): Promise<({
        item: {
            creator: {
                name: string;
            };
        } & {
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            version: string;
            createdAt: Date;
            updatedAt: Date;
            type: string;
            name: string;
            id: string;
            description: string;
            previewUrl: string | null;
            iconUrl: string | null;
            creatorId: string;
            price: number;
            installCount: number;
            rating: number;
        };
    } & {
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        config: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        status: string;
        itemId: string;
    })[]>;
}
//# sourceMappingURL=marketplace.service.d.ts.map