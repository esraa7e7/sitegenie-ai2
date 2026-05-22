export declare const initTracing: (serviceName?: string) => import("@opentelemetry/api").Tracer;
export declare const getTracer: (serviceName?: string) => import("@opentelemetry/api").Tracer;
export declare const runInSpan: <T>(name: string, fn: () => Promise<T>, attributes?: Record<string, unknown>) => Promise<T>;
export declare const logger: {
    info: (message: string, meta?: Record<string, unknown>) => void;
    warn: (message: string, meta?: Record<string, unknown>) => void;
    error: (message: string, meta?: Record<string, unknown>) => void;
    debug: (message: string, meta?: Record<string, unknown>) => void;
};
//# sourceMappingURL=index.d.ts.map