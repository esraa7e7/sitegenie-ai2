export interface SystemMetrics {
    activeUsers: number;
    cpuUsage: number;
    memoryUsage: number;
    totalRequests: number;
    activeSandboxes: number;
    queuedTasks: number;
    uptime: number;
}
export declare class MetricsService {
    private static startTime;
    static getRealtimeMetrics(): Promise<SystemMetrics>;
    static logAIFailure(projectId: string, agent: string, error: string): Promise<void>;
}
//# sourceMappingURL=metrics.service.d.ts.map