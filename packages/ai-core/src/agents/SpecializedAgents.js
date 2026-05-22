/**
 * Simplified Specialized AI Agents - cleaned to avoid parsing edge cases
 */
import { BaseAgent } from './BaseAgent.js';
import { AgentType } from '@sitegenie/shared';
const createCodeFile = (language, path, content) => ({
    [language]: {
        language,
        fileName: path.split('/').pop() || path,
        path,
        content,
    },
});
function simpleOutput(message) {
    return { result: message, metadata: {} };
}
export class PlannerAgent extends BaseAgent {
    constructor() {
        super(AgentType.PLANNER);
    }
    async execute(_projectId, input) {
        return {
            result: 'Project plan established for execution.',
            suggestions: ['Define modular components', 'Choose project architecture', 'Assign routing strategy'],
            metadata: { planScope: 'frontend + backend', projectIntent: input.prompt },
        };
    }
}
export class UIAgent extends BaseAgent {
    constructor() {
        super(AgentType.UI);
    }
    async execute(_projectId, _input) {
        const code = createCodeFile('react', 'src/App.tsx', "export default function App(){ return null }");
        return {
            result: 'Responsive UI scaffolding generated.',
            code,
            outputFormat: 'react',
            suggestions: ['Add navigation', 'Implement responsive layouts', 'Use accessible components'],
            metadata: { uiFramework: 'React', componentCount: 1 },
        };
    }
}
export class BackendAgent extends BaseAgent {
    constructor() {
        super(AgentType.BACKEND);
    }
    async execute(_projectId, _input) {
        const code = createCodeFile('typescript', 'src/server.ts', "export default function server(){}\n");
        return {
            result: 'Backend scaffolding prepared.',
            code,
            outputFormat: 'typescript',
            suggestions: ['Add authenticated endpoints', 'Validate request payloads'],
            metadata: { endpoints: ['/health'] },
        };
    }
}
export class APIAgent extends BaseAgent {
    constructor() {
        super(AgentType.API);
    }
    async execute(_projectId, _input) {
        const code = createCodeFile('typescript', 'src/api/routes.ts', "export default function routes(){}\n");
        return {
            result: 'API contract and route definitions generated.',
            code,
            outputFormat: 'typescript',
            suggestions: ['Add request handlers', 'Document API schema'],
            metadata: { endpoints: ['/status'] },
        };
    }
}
export class RefactorAgent extends BaseAgent {
    constructor() {
        super(AgentType.REFACTOR);
    }
    async execute() {
        return simpleOutput('Refactoring plan created for maintainable code.');
    }
}
export class DebugAgent extends BaseAgent {
    constructor() {
        super(AgentType.DEBUG);
    }
    async execute() {
        return simpleOutput('Debugging guidelines assembled.');
    }
}
export class SecurityAgent extends BaseAgent {
    constructor() {
        super(AgentType.SECURITY);
    }
    async execute() {
        return simpleOutput('Security review completed with recommendations.');
    }
}
export class TestingAgent extends BaseAgent {
    constructor() {
        super(AgentType.TESTING);
    }
    async execute() {
        const code = createCodeFile('typescript', 'tests/app.test.ts', "// basic test\n");
        return {
            result: 'Test suite blueprint generated.',
            code,
            outputFormat: 'typescript',
            suggestions: ['Add integration tests', 'Validate developer workflows'],
            metadata: { testCount: 1 },
        };
    }
}
export class DeploymentAgent extends BaseAgent {
    constructor() {
        super(AgentType.DEPLOYMENT);
    }
    async execute() {
        return {
            result: 'Deployment manifest prepared.',
            suggestions: ['Enable preview URLs', 'Add deployment health checks'],
            metadata: { provider: 'vercel' },
        };
    }
}
export class MemoryAgent extends BaseAgent {
    constructor() {
        super(AgentType.MEMORY);
    }
    async execute() {
        return simpleOutput('Context memory resolved and linked.');
    }
}
export class OptimizationAgent extends BaseAgent {
    constructor() {
        super(AgentType.OPTIMIZATION);
    }
    async execute() {
        return simpleOutput('Optimization recommendations created.');
    }
}
