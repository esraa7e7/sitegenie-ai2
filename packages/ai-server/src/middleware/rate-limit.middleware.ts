import { rateLimit } from 'express-rate-limit';
// @ts-ignore
import { RedisStore } from 'rate-limit-redis';
import { Request } from 'express';
import { redis } from '../core/redis.js';
import { string } from 'zod';

const createStore = (prefix?: string) => {
  if (!redis) return undefined;
  return new RedisStore({
    // @ts-ignore
    sendCommand: (...args: string[]) => redis.call(...args),
    ...(prefix ? { prefix } : {})
  });
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore(),
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes',
    code: 429
  },
 keyGenerator: (req: any) => {
    return String(req.user?.userId || req.ip || '');
  },
});

export const aiGenerationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:ai:'),
  message: {
    status: 'error',
    message: 'AI generation limit reached for this hour',
    code: 429
  }
});
