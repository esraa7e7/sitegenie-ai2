export type AgentRole = 'ORCHESTRATOR' | 'PLANNER' | 'UI' | 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'SEO' | 'REFACTOR' | 'TESTING' | 'DEPLOYMENT' | 'QA' | 'OPTIMIZER' | 'DESIGNER' | 'SUPERVISOR' | 'BUILDER' | 'CRITIC' | 'MEMORY';
export type AgentStatus = 'idle' | 'thinking' | 'writing' | 'verifying' | 'completed' | 'error';
export interface AgentLog {
    id: string;
    role: AgentRole;
    message: string;
    timestamp: number;
    type: 'info' | 'success' | 'warning' | 'error';
}
export interface WorkspaceFile {
    path: string;
    content: string;
    language: string;
}
export interface ExecutionState {
    logs: AgentLog[];
    files: Record<string, string>;
    activeStep: number;
    isExecuting: boolean;
}
export interface Task {
    id: string;
    role: AgentRole;
    description: string;
    dependencies?: string[];
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    result?: any;
}
export interface AgentRequest {
    prompt: string;
    context?: string;
    files?: Record<string, string>;
}
export interface AgentResponse {
    content: string;
    files?: Record<string, string>;
    suggestions?: string[];
    error?: string;
    metadata?: any;
}
export interface IAgent {
    role: AgentRole;
    process(request: AgentRequest): Promise<AgentResponse>;
}
//# sourceMappingURL=types.d.ts.map