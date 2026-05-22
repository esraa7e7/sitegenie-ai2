export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly RATE_LIMITED: 429;
    readonly INTERNAL_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const RATE_LIMITS: {
    readonly PUBLIC_API: 100;
    readonly AUTHENTICATED_API: 300;
    readonly ADMIN_API: 1000;
    readonly GENERATION_REQUEST: 10;
    readonly DEPLOYMENT_REQUEST: 5;
};
export declare const TOKEN_LIMITS: {
    readonly FREE: 100000;
    readonly STARTER: 1000000;
    readonly PROFESSIONAL: 10000000;
    readonly ENTERPRISE: -1;
};
export declare const QUOTA_LIMITS: {
    readonly FREE: {
        readonly maxProjects: 5;
        readonly maxTeamSize: 1;
        readonly maxDeploymentsPerDay: 5;
        readonly storageGB: 1;
    };
    readonly STARTER: {
        readonly maxProjects: 50;
        readonly maxTeamSize: 5;
        readonly maxDeploymentsPerDay: 20;
        readonly storageGB: 10;
    };
    readonly PROFESSIONAL: {
        readonly maxProjects: 500;
        readonly maxTeamSize: 50;
        readonly maxDeploymentsPerDay: 100;
        readonly storageGB: 100;
    };
    readonly ENTERPRISE: {
        readonly maxProjects: -1;
        readonly maxTeamSize: -1;
        readonly maxDeploymentsPerDay: -1;
        readonly storageGB: -1;
    };
};
export declare const CACHE_TTL: {
    readonly SHORT: 60;
    readonly MEDIUM: 300;
    readonly LONG: 3600;
    readonly VERY_LONG: 86400;
};
export declare const AGENT_TIMEOUTS: {
    readonly PLANNER: 30000;
    readonly UI: 45000;
    readonly BACKEND: 60000;
    readonly API: 45000;
    readonly REFACTOR: 30000;
    readonly DEBUG: 45000;
    readonly SECURITY: 30000;
    readonly TESTING: 60000;
    readonly DEPLOYMENT: 300000;
    readonly MEMORY: 10000;
    readonly OPTIMIZATION: 60000;
};
export declare const QUEUE_CONFIG: {
    readonly MAX_ATTEMPTS: 3;
    readonly BACKOFF_MULTIPLIER: 2;
    readonly INITIAL_DELAY: 1000;
    readonly MAX_DELAY: 60000;
};
export declare const STORAGE_CONFIG: {
    readonly MAX_PROJECT_SIZE: number;
    readonly MAX_FILE_SIZE: number;
    readonly UPLOAD_TIMEOUT: 300000;
};
export declare const JWT_CONFIG: {
    readonly ACCESS_TOKEN_EXPIRY: 3600;
    readonly REFRESH_TOKEN_EXPIRY: 604800;
    readonly ALGORITHM: "HS256";
};
export declare const DEPLOYMENT_CONFIG: {
    readonly BUILD_TIMEOUT: 900000;
    readonly HEALTH_CHECK_TIMEOUT: 300000;
    readonly MAX_CONCURRENT_DEPLOYMENTS: 5;
    readonly ROLLBACK_TIMEOUT: 600000;
};
export declare const FEATURE_FLAGS: {
    readonly ENABLE_EXPERIMENTAL: false;
    readonly ENABLE_BETA_AGENTS: false;
    readonly ENABLE_COLLABORATION: true;
    readonly ENABLE_ADVANCED_ANALYTICS: false;
    readonly ENABLE_CUSTOM_DEPLOYMENT: false;
    readonly ENABLE_MULTI_LANGUAGE: false;
};
export declare const PROVIDERS: {
    readonly VERCEL: {
        readonly name: "Vercel";
        readonly icon: "vercel";
        readonly supported: true;
    };
    readonly NETLIFY: {
        readonly name: "Netlify";
        readonly icon: "netlify";
        readonly supported: true;
    };
    readonly RAILWAY: {
        readonly name: "Railway";
        readonly icon: "railway";
        readonly supported: true;
    };
    readonly RENDER: {
        readonly name: "Render";
        readonly icon: "render";
        readonly supported: true;
    };
    readonly CLOUDFLARE: {
        readonly name: "Cloudflare Pages";
        readonly icon: "cloudflare";
        readonly supported: true;
    };
};
export declare const LOGS_CONFIG: {
    readonly LOG_LEVEL: string;
    readonly LOG_FORMAT: "json";
    readonly LOG_RETENTION_DAYS: 30;
    readonly MAX_LOG_SIZE: number;
};
//# sourceMappingURL=index.d.ts.map