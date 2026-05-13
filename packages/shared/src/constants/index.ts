export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const RATE_LIMITS = {
  PUBLIC_API: 100, // requests per minute
  AUTHENTICATED_API: 300,
  ADMIN_API: 1000,
  GENERATION_REQUEST: 10, // per minute
  DEPLOYMENT_REQUEST: 5, // per hour
} as const;

export const TOKEN_LIMITS = {
  FREE: 100000, // tokens per month
  STARTER: 1000000,
  PROFESSIONAL: 10000000,
  ENTERPRISE: -1, // unlimited
} as const;

export const QUOTA_LIMITS = {
  FREE: {
    maxProjects: 5,
    maxTeamSize: 1,
    maxDeploymentsPerDay: 5,
    storageGB: 1,
  },
  STARTER: {
    maxProjects: 50,
    maxTeamSize: 5,
    maxDeploymentsPerDay: 20,
    storageGB: 10,
  },
  PROFESSIONAL: {
    maxProjects: 500,
    maxTeamSize: 50,
    maxDeploymentsPerDay: 100,
    storageGB: 100,
  },
  ENTERPRISE: {
    maxProjects: -1,
    maxTeamSize: -1,
    maxDeploymentsPerDay: -1,
    storageGB: -1,
  },
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

export const AGENT_TIMEOUTS = {
  PLANNER: 30000, // 30 seconds
  UI: 45000, // 45 seconds
  BACKEND: 60000, // 60 seconds
  API: 45000,
  REFACTOR: 30000,
  DEBUG: 45000,
  SECURITY: 30000,
  TESTING: 60000,
  DEPLOYMENT: 300000, // 5 minutes
  MEMORY: 10000, // 10 seconds
  OPTIMIZATION: 60000,
} as const;

export const QUEUE_CONFIG = {
  MAX_ATTEMPTS: 3,
  BACKOFF_MULTIPLIER: 2,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 60000,
} as const;

export const STORAGE_CONFIG = {
  MAX_PROJECT_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  UPLOAD_TIMEOUT: 300000, // 5 minutes
} as const;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days
  ALGORITHM: 'HS256',
} as const;

export const DEPLOYMENT_CONFIG = {
  BUILD_TIMEOUT: 900000, // 15 minutes
  HEALTH_CHECK_TIMEOUT: 300000, // 5 minutes
  MAX_CONCURRENT_DEPLOYMENTS: 5,
  ROLLBACK_TIMEOUT: 600000, // 10 minutes
} as const;

export const FEATURE_FLAGS = {
  ENABLE_EXPERIMENTAL: false,
  ENABLE_BETA_AGENTS: false,
  ENABLE_COLLABORATION: true,
  ENABLE_ADVANCED_ANALYTICS: false,
  ENABLE_CUSTOM_DEPLOYMENT: false,
  ENABLE_MULTI_LANGUAGE: false,
} as const;

export const PROVIDERS = {
  VERCEL: {
    name: 'Vercel',
    icon: 'vercel',
    supported: true,
  },
  NETLIFY: {
    name: 'Netlify',
    icon: 'netlify',
    supported: true,
  },
  RAILWAY: {
    name: 'Railway',
    icon: 'railway',
    supported: true,
  },
  RENDER: {
    name: 'Render',
    icon: 'render',
    supported: true,
  },
  CLOUDFLARE: {
    name: 'Cloudflare Pages',
    icon: 'cloudflare',
    supported: true,
  },
} as const;

export const LOGS_CONFIG = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: 'json',
  LOG_RETENTION_DAYS: 30,
  MAX_LOG_SIZE: 10 * 1024 * 1024, // 10MB
} as const;
