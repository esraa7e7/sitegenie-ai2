import { Redis } from 'ioredis';
const REDIS_URL = process.env.REDIS_URL;
export const redis = REDIS_URL
    ? new Redis(REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy(times) {
            const delay = Math.min(times * 100, 5000);
            return delay;
        },
        ...(REDIS_URL.startsWith('rediss://') ? { tls: { rejectUnauthorized: false } } : {})
    })
    : null;
if (redis) {
    redis.on('connect', () => console.log('🟢 Redis connected successfully'));
    redis.on('error', (err) => {
        // Only log once every few minutes to avoid flooding
        console.error('❌ Redis connection error:', err.message);
    });
}
else {
    console.warn('⚠️ REDIS_URL not provided. Redis-based features (BullMQ, Cache) will be disabled or degraded.');
}
export default redis;
