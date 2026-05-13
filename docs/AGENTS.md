# Multi-Agent AI System Documentation

## Overview

The SiteGenie AI platform uses an advanced multi-agent orchestration system with 11 specialized AI agents that collaborate to generate production-ready applications from natural language prompts.

## Architecture

### The 11 Agents

1. **Planner Agent** - Analyzes requirements and creates execution plans
   - Input: User prompt
   - Output: Structured project plan
   - Expertise: Architecture, structure, requirements analysis

2. **UI Agent** - Generates UI components and layouts
   - Input: Project plan
   - Output: React components, CSS
   - Expertise: Frontend, React, Tailwind CSS

3. **Backend Agent** - Creates API routes and business logic
   - Input: Project requirements
   - Output: Express routes, database models
   - Expertise: Node.js, databases, business logic

4. **API Agent** - Designs REST APIs
   - Input: Backend requirements
   - Output: API specifications, controllers
   - Expertise: REST design, OpenAPI

5. **Refactor Agent** - Optimizes and refactors code
   - Input: Generated code
   - Output: Optimized, refactored code
   - Expertise: Performance, code quality, patterns

6. **Debug Agent** - Analyzes and fixes errors
   - Input: Build errors, runtime errors
   - Output: Fixed code, error analysis
   - Expertise: Debugging, error resolution

7. **Security Agent** - Reviews and enhances security
   - Input: Generated code
   - Output: Security-hardened code
   - Expertise: Authentication, authorization, encryption

8. **Testing Agent** - Generates tests
   - Input: Source code
   - Output: Unit tests, integration tests
   - Expertise: Testing frameworks, test coverage

9. **Deployment Agent** - Configures deployment
   - Input: Application code
   - Output: Docker files, CI/CD configs
   - Expertise: DevOps, containerization, deployment

10. **Memory Agent** - Manages context and retrieves information
    - Input: Query, context
    - Output: Relevant context information
    - Expertise: Vector search, context management

11. **Optimization Agent** - Optimizes performance and bundle size
    - Input: Complete application
    - Output: Optimized application
    - Expertise: Performance profiling, optimization

## Agent Communication Protocol

All agents communicate using a standardized JSON format:

```json
{
  "agentId": "agent_planner_abc123",
  "taskId": "task_xyz789",
  "type": "task",
  "status": "processing",
  "input": {
    "prompt": "User request",
    "context": { /* previous context */ },
    "constraints": { "priority": "high" }
  },
  "output": {
    "result": "Processing result",
    "code": { /* generated code */ },
    "suggestions": ["Suggestion 1", "Suggestion 2"],
    "metadata": { "tokensUsed": 1500, "executionTime": 2300 }
  },
  "metadata": {
    "timestamp": "2024-05-12T10:30:00Z",
    "tokensUsed": 1500,
    "executionTime": 2300
  }
}
```

## Orchestration Flow

### Generation Pipeline

```
User Prompt
    ↓
Planner Agent (Architecture)
    ↓
Memory Agent (Context Retrieval)
    ↓
UI Agent (Frontend)  ← Parallel → Backend Agent (API)
    ↓                              ↓
Refactor Agent (Code Quality)
    ↓
Debug Agent (Error Fixing)
    ↓
Security Agent (Hardening)
    ↓
Testing Agent (Coverage)
    ↓
Optimization Agent (Performance)
    ↓
Deployment Agent (Config)
    ↓
Production-Ready Application
```

## Implementation Example

### Basic Usage

```typescript
import { AIOrchestrator } from '@sitegenie/ai-core';

const orchestrator = new AIOrchestrator({
  maxRetries: 3,
  qualityThreshold: 0.8,
  timeout: 60000,
  enableStreaming: true
});

const result = await orchestrator.generateApplication(
  'project-123',
  'Create a e-commerce platform with product listings',
  (status, progress) => {
    console.log(`${status}: ${progress}%`);
  }
);
```

### Advanced Usage with Custom Configuration

```typescript
const orchestrator = new AIOrchestrator({
  maxRetries: 5,
  qualityThreshold: 0.9,
  timeout: 120000,
  enableStreaming: true
});

// Get detailed execution history
const tasks = orchestrator.getExecutionHistory();

// Check individual agent status
const status = orchestrator.getAgentStatuses();

// Reset for new generation
orchestrator.reset();
```

## Task Queue System

### BullMQ Integration

Tasks are queued in Redis using BullMQ for reliable processing:

```typescript
const queue = new Queue('generation-tasks', {
  connection: redis
});

// Add task
const job = await queue.add(
  'generate-app',
  {
    projectId: 'proj-123',
    prompt: 'Create a SaaS dashboard',
  },
  {
    priority: 1,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
);

// Process tasks
queue.process(5, async (job) => {
  const orchestrator = new AIOrchestrator();
  return orchestrator.generateApplication(
    job.data.projectId,
    job.data.prompt
  );
});
```

## Streaming Responses

### Server-Sent Events (SSE)

For real-time updates during generation:

```typescript
import { EventEmitter } from 'events';

const generateStream = (prompt: string) => {
  const emitter = new EventEmitter();
  
  orchestrator.generateApplication(prompt, (status, progress) => {
    emitter.emit('progress', {
      status,
      progress,
      timestamp: Date.now()
    });
  });
  
  return emitter;
};

// Usage in Express
app.get('/api/generate-stream', (req, res) => {
  const stream = generateStream(req.query.prompt);
  
  res.setHeader('Content-Type', 'text/event-stream');
  
  stream.on('progress', (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });
  
  stream.on('complete', (result) => {
    res.write(`data: ${JSON.stringify({type: 'complete', result})}\n\n`);
    res.end();
  });
});
```

## Error Handling & Recovery

### Retry Strategy

```typescript
async processTask(task: AgentTask, maxRetries: number = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.execute(task);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff: 1s, 2s, 4s...
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Graceful Degradation

If an agent fails, the system:
1. Retries with exponential backoff
2. Falls back to cached previous results
3. Continues with next agent if non-critical
4. Returns partial results with error details

## Performance Optimization

### Token Optimization

```typescript
// Implement prompt compression
const compressPrompt = (prompt: string) => {
  // Remove unnecessary whitespace
  // Summarize long descriptions
  // Use abbreviations
  return compressed;
};

// Calculate token usage
const estimateTokens = (text: string) => {
  return Math.ceil(text.length / 4); // Rough estimate
};
```

### Caching Strategy

```typescript
// Cache agent outputs
const cache = new Map();

const getCachedOrCompute = async (key: string, fn: () => Promise<T>) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await fn();
  cache.set(key, result);
  
  // Cache TTL
  setTimeout(() => cache.delete(key), 3600000);
  
  return result;
};
```

## Monitoring & Observability

### Metrics

```typescript
// Track agent performance
const metrics = {
  agentExecutionTime: new Histogram({
    name: 'agent_execution_time_seconds',
    help: 'Agent execution time in seconds',
    labelNames: ['agent_type']
  }),
  
  tokensUsed: new Counter({
    name: 'tokens_used_total',
    help: 'Total tokens used',
    labelNames: ['agent_type']
  }),
  
  taskSuccess: new Counter({
    name: 'tasks_completed_total',
    help: 'Completed tasks',
    labelNames: ['agent_type', 'status']
  })
};
```

### Logging

```typescript
logger.info('Agent task started', {
  agentId: agent.agentId,
  taskId: task.taskId,
  priority: task.metadata.priority
});

logger.error('Agent task failed', {
  agentId: agent.agentId,
  taskId: task.taskId,
  error: error.message
});
```

## Future Enhancements

1. **Dynamic Agent Composition** - Create custom agent combinations
2. **Reinforcement Learning** - Learn from successful generations
3. **Multi-modal Input** - Accept images, designs as input
4. **Collaborative Agents** - Agents communicate with each other directly
5. **Explainability** - Explain why agents made specific decisions
