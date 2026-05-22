import { prisma } from '../core/database.js';
import { Redis } from '@upstash/redis';
import { compress, decompress } from '../utils/compression.js';
import { NotFoundError } from '../core/errors.js';
// Initialize Upstash Redis client
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;
export class VfsService {
    /**
     * Auto-Save: High-frequency save to Redis Cache
     * Every 4-5 seconds from the UI
     */
    static async autoSave(projectId, files) {
        if (!redis) {
            console.warn('Redis unavailable, falling back to synchronous DB write for auto-save.');
            return this.forceSyncToDatabase(projectId, files);
        }
        const key = `vfs:live:${projectId}`;
        // Store as JSON for rapid retrieval and minimal overhead
        await redis.set(key, JSON.stringify(files), { ex: 3600 * 24 }); // 24h TTL
        // We don't wait for DB sync here to keep it fast
        this.scheduleLazySync(projectId);
        return { status: 'cached', timestamp: Date.now() };
    }
    static scheduleLazySync(projectId) {
        if (this.syncTimeouts.has(projectId))
            return;
        const timeout = setTimeout(async () => {
            try {
                await this.syncCacheToDatabase(projectId);
            }
            finally {
                this.syncTimeouts.delete(projectId);
            }
        }, 10000); // Sync every 10 seconds if active
        this.syncTimeouts.set(projectId, timeout);
    }
    /**
     * Sync Cache: Manually flush Redis to Database
     */
    static async syncCacheToDatabase(projectId) {
        if (!redis)
            return { status: 'skipped_no_redis' };
        const key = `vfs:live:${projectId}`;
        const cachedFiles = await redis.get(key);
        if (!cachedFiles || cachedFiles.length === 0)
            return { status: 'nothing_to_sync' };
        console.log(`[VFS] Syncing live cache to DB for project ${projectId}...`);
        const operations = cachedFiles.map(file => prisma.file.upsert({
            where: { projectId_path: { projectId, path: file.path } },
            update: { content: file.content },
            create: { projectId, path: file.path, content: file.content },
        }));
        await prisma.$transaction(operations);
        return { status: 'synced', count: cachedFiles.length };
    }
    /**
     * Snapshots: Permanent compressed versions
     */
    static async createSnapshot(projectId, reason = 'Manual Save') {
        // 1. Ensure latest state is in DB
        await this.syncCacheToDatabase(projectId);
        // 2. Fetch all files from DB
        const files = await prisma.file.findMany({ where: { projectId } });
        if (files.length === 0)
            throw new NotFoundError('No files found to snapshot.');
        // 3. Compress and store
        const compressed = compress(files);
        const lastSnapshot = await prisma.snapshot.findFirst({
            where: { projectId },
            orderBy: { version: 'desc' }
        });
        const snapshot = await prisma.snapshot.create({
            data: {
                projectId,
                version: (lastSnapshot?.version || 0) + 1,
                compressedData: compressed,
                metadata: { reason, timestamp: new Date() }
            }
        });
        return snapshot;
    }
    /**
     * Restore: Roll back to a specific version
     */
    static async restoreSnapshot(projectId, snapshotId) {
        const snapshot = await prisma.snapshot.findUnique({ where: { id: snapshotId } });
        if (!snapshot || snapshot.projectId !== projectId) {
            throw new NotFoundError('Snapshot not found in your project.');
        }
        const files = JSON.parse(decompress(snapshot.compressedData));
        await prisma.$transaction([
            prisma.file.deleteMany({ where: { projectId } }),
            ...files.map(f => prisma.file.create({
                data: { projectId, path: f.path, content: f.content }
            }))
        ]);
        // Very important: Update live cache so the UI sees the restoration immediately
        if (redis) {
            await redis.set(`vfs:live:${projectId}`, JSON.stringify(files), { ex: 86400 });
        }
        return { status: 'restored', version: snapshot.version };
    }
    /**
     * Force Sync: Fallback for when Redis is missing
     */
    static async forceSyncToDatabase(projectId, files) {
        const operations = files.map(file => prisma.file.upsert({
            where: { projectId_path: { projectId, path: file.path } },
            update: { content: file.content },
            create: { projectId, path: file.path, content: file.content },
        }));
        await prisma.$transaction(operations);
        return { status: 'synced_fallback', count: files.length };
    }
    /**
     * Compatibility method for legacy calls (e.g. from AIService)
     */
    static async syncProjectFiles(projectId, files) {
        return this.autoSave(projectId, files);
    }
    /**
     * Standard VFS Getters
     */
    static async getProjectFiles(projectId) {
        if (redis) {
            const key = `vfs:live:${projectId}`;
            const cached = await redis.get(key);
            if (cached)
                return cached;
        }
        return prisma.file.findMany({
            where: { projectId },
            orderBy: { path: 'asc' }
        });
    }
    static async getFile(projectId, path) {
        return prisma.file.findUnique({
            where: { projectId_path: { projectId, path } }
        });
    }
    static async deleteFile(projectId, path) {
        if (redis) {
            const key = `vfs:live:${projectId}`;
            const cached = await redis.get(key);
            if (cached) {
                const filtered = cached.filter(f => f.path !== path);
                await redis.set(key, JSON.stringify(filtered), { ex: 86400 });
            }
        }
        return prisma.file.delete({
            where: { projectId_path: { projectId, path } }
        });
    }
}
/**
 * Lazy Sync: Periodically flushes Redis Cache to Postgres
 */
Object.defineProperty(VfsService, "syncTimeouts", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Map()
});
