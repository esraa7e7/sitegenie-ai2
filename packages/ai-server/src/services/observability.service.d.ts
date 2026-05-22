export declare class ObservabilityService {
    private static posthog;
    static init(): void;
    static trackEvent(userId: string, event: string, properties?: Record<string, any>): void;
    static logError(error: any, context?: Record<string, any>): void;
    static shutdown(): Promise<void>;
}
//# sourceMappingURL=observability.service.d.ts.map