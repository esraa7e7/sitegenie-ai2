export declare class AIService {
    private static orchestrator;
    static generateCode(projectId: string, prompt: string, onProgress?: (status: string) => void): Promise<{
        explanation: string;
        design: string | undefined;
        files: string[];
        confidenceScore: number;
    }>;
    static chat(prompt: string, context?: string): Promise<{
        response: string;
        timestamp: string;
    }>;
    static selfHeal(projectId: string, errorLog: string): Promise<{
        explanation: string;
        design: string | undefined;
        files: string[];
        confidenceScore: number;
    }>;
}
//# sourceMappingURL=ai.service.d.ts.map