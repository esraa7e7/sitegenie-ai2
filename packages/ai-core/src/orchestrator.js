/**
 * AgentOrchestrator - Master orchestrator for multi-agent system
 * Coordinates the multi-agent pipeline with context, memory, validation, and deployment readiness.
 */
import { nanoid } from 'nanoid';
import { ContextMemory } from './memory.js';
import { PlannerAgent, UIAgent, BackendAgent, APIAgent, RefactorAgent, DebugAgent, SecurityAgent, TestingAgent, DeploymentAgent, MemoryAgent, OptimizationAgent, } from './agents/SpecializedAgents.js';
export class AgentOrchestrator {
    constructor(config = {}) {
        Object.defineProperty(this, "plannerAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "uiAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "backendAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "apiAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "refactorAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "debugAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "securityAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "testingAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "deploymentAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memoryAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "optimizationAgent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memoryIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "contextWindow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "executionHistory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.config = {
            maxRetries: config.maxRetries ?? 3,
            timeout: config.timeout ?? 60000,
            enableStreaming: config.enableStreaming ?? true,
        };
        this.plannerAgent = new PlannerAgent();
        this.uiAgent = new UIAgent();
        this.backendAgent = new BackendAgent();
        this.apiAgent = new APIAgent();
        this.refactorAgent = new RefactorAgent();
        this.debugAgent = new DebugAgent();
        this.securityAgent = new SecurityAgent();
        this.testingAgent = new TestingAgent();
        this.deploymentAgent = new DeploymentAgent();
        this.memoryAgent = new MemoryAgent();
        this.optimizationAgent = new OptimizationAgent();
        this.memoryIndex = new ContextMemory();
        this.contextWindow = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }
    flattenProjectCode(projectCode) {
        const files = {};
        if (!projectCode)
            return files;
        if (projectCode.react)
            files[projectCode.react.path] = projectCode.react.content;
        if (projectCode.typescript)
            files[projectCode.typescript.path] = projectCode.typescript.content;
        if (projectCode.javascript)
            files[projectCode.javascript.path] = projectCode.javascript.content;
        if (projectCode.html)
            files[projectCode.html.path] = projectCode.html.content;
        if (projectCode.css)
            files[projectCode.css.path] = projectCode.css.content;
        if (projectCode.config) {
            Object.entries(projectCode.config).forEach(([path, file]) => {
                const codeFile = file;
                files[path] = codeFile.content;
            });
        }
        return files;
    }
    mergeProjectCode(...sources) {
        return sources.reduce((acc, source) => {
            if (!source)
                return acc;
            if (source.react)
                acc.react = source.react;
            if (source.typescript)
                acc.typescript = source.typescript;
            if (source.javascript)
                acc.javascript = source.javascript;
            if (source.html)
                acc.html = source.html;
            if (source.css)
                acc.css = source.css;
            if (source.config) {
                acc.config = {
                    ...(acc.config || {}),
                    ...source.config,
                };
            }
            return acc;
        }, {});
    }
    buildProject(projectId, prompt, generatedCode) {
        return {
            id: projectId,
            name: `SiteGenie Project ${projectId.slice(-6)}`,
            description: `Generated website from prompt: ${prompt}`,
            type: 'website',
            status: 'ACTIVE',
            ownerId: 'system',
            initialPrompt: prompt,
            generatedCode,
            settings: {
                theme: {
                    primaryColor: '#5b21b6',
                    secondaryColor: '#ec4899',
                    accentColor: '#38bdf8',
                    fontFamily: 'Inter, sans-serif',
                    darkMode: true,
                },
                responsive: true,
                seo: {
                    title: `SiteGenie - ${projectId.slice(-6)}`,
                    description: 'Auto-generated website powered by AI.',
                    keywords: ['AI', 'website generator', 'SiteGenie'],
                    ogImage: '',
                },
                analytics: {
                    enabled: false,
                },
            },
            metadata: {
                fileCount: 0,
                componentCount: 0,
                lineOfCode: 0,
                complexity: 'medium',
                libraries: [],
                tags: [],
                version: '1.0.0',
                createdAt: new Date(),
                updatedAt: new Date(),
                lastModifiedBy: 'sitegenie-orchestrator',
            },
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
    buildContext(prompt) {
        return {
            ...this.contextWindow,
            currentState: {
                ...this.contextWindow.currentState,
                prompt,
                lastUpdated: new Date().toISOString(),
            },
        };
    }
    async executeAgent(agent, projectId, prompt, stage, inputOverrides = {}) {
        const input = {
            prompt,
            context: this.buildContext(prompt),
            previousResults: this.contextWindow.previousAgentOutputs,
            constraints: {
                projectId,
                maxDepth: 3,
                ...(inputOverrides.constraints || {}),
            },
            ...inputOverrides,
        };
        const task = agent.createTask(projectId, input);
        const result = await agent.processTask(task, this.config.maxRetries);
        this.executionHistory.push(result);
        if (result.output) {
            // Ensure result.output is not null or undefined before accessing properties
            if (result.output.result !== undefined && result.output.result !== null) {
                this.contextWindow.previousAgentOutputs[agent.agentType] = result.output;
                this.contextWindow.currentState = {
                    ...this.contextWindow.currentState,
                    lastAgent: agent.agentType,
                    lastResult: result.output.result,
                };
            }
        }
        if (result.status === 'failed') {
            throw new Error(`${stage} failed: ${result.error?.message || 'unknown error'}`);
        }
        return result;
    }
    async generateApplication(projectId, prompt, onProgress) {
        this.executionHistory = [];
        this.contextWindow = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
        const planResult = await this.executeAgent(this.plannerAgent, projectId, prompt, 'Planning application architecture');
        onProgress?.('PLANNING: Planning application architecture...');
        const memoryResult = await this.executeAgent(this.memoryAgent, projectId, prompt, 'Reviewing project memory and context');
        onProgress?.('MEMORY: Reviewing project memory and context...');
        const uiResult = await this.executeAgent(this.uiAgent, projectId, prompt, 'Generating responsive UI components');
        onProgress?.('DESIGN: Generating responsive UI components...');
        const backendResult = await this.executeAgent(this.backendAgent, projectId, prompt, 'Building backend endpoints and services');
        onProgress?.('BUILD: Building backend endpoints and services...');
        const apiResult = await this.executeAgent(this.apiAgent, projectId, prompt, 'Creating API surface and integration contracts');
        onProgress?.('BUILD: Creating API surface and integration contracts...');
        const refactorResult = await this.executeAgent(this.refactorAgent, projectId, prompt, 'Refactoring generated application for maintainability');
        onProgress?.('OPTIMIZE: Refactoring generated application...');
        const [securityResult, testingResult] = await Promise.all([
            this.executeAgent(this.securityAgent, projectId, prompt, 'Performing automated security review'),
            this.executeAgent(this.testingAgent, projectId, prompt, 'Generating automated test coverage'),
        ]);
        onProgress?.('REVIEW: Running security and test validation...');
        const optimizationResult = await this.executeAgent(this.optimizationAgent, projectId, prompt, 'Applying performance and structure optimizations', {
            previousResults: {
                ...this.contextWindow.previousAgentOutputs,
                security: securityResult.output,
                testing: testingResult.output,
            },
        });
        onProgress?.('OPTIMIZE: Applying performance and structure optimizations...');
        const deploymentResult = await this.executeAgent(this.deploymentAgent, projectId, prompt, 'Preparing deployment manifest and CI/CD flow');
        onProgress?.('DEPLOY: Preparing deployment manifest and CI/CD flow...');
        const generatedCode = this.mergeProjectCode(uiResult.output?.code, backendResult.output?.code, apiResult.output?.code, refactorResult.output?.code, securityResult.output?.code, testingResult.output?.code, optimizationResult.output?.code);
        const project = this.buildProject(projectId, prompt, generatedCode);
        const files = this.flattenProjectCode(generatedCode);
        return {
            project,
            tasks: this.executionHistory,
            files,
            summary: planResult.output?.result,
            confidenceScore: 92,
        };
    }
    async solve(prompt, onProgress) {
        const projectId = `project_${nanoid(8)}`;
        return this.generateApplication(projectId, prompt, onProgress);
    }
    getExecutionHistory() {
        return this.executionHistory;
    }
    getAgentStatuses() {
        return {
            planner: this.plannerAgent.getStatus(),
            ui: this.uiAgent.getStatus(),
            backend: this.backendAgent.getStatus(),
            api: this.apiAgent.getStatus(),
            refactor: this.refactorAgent.getStatus(),
            debug: this.debugAgent.getStatus(),
            security: this.securityAgent.getStatus(),
            testing: this.testingAgent.getStatus(),
            deployment: this.deploymentAgent.getStatus(),
            memory: this.memoryAgent.getStatus(),
            optimization: this.optimizationAgent.getStatus(),
        };
    }
    reset() {
        this.executionHistory = [];
        this.contextWindow = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }
}
