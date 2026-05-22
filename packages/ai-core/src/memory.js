export class ContextMemory {
    constructor() {
        Object.defineProperty(this, "memory", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.memory = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }
    updateProjectCode(code) {
        this.memory.projectCode = { ...this.memory.projectCode, ...code };
    }
    addProjectHistory(version) {
        this.memory.projectHistory.push(version);
    }
    updateUserPreferences(preferences) {
        this.memory.userPreferences = { ...this.memory.userPreferences, ...preferences };
    }
    updatePreviousAgentOutput(agentType, output) {
        this.memory.previousAgentOutputs[agentType] = output;
    }
    updateCurrentState(state) {
        this.memory.currentState = { ...this.memory.currentState, ...state };
    }
    getMemory() {
        return this.memory;
    }
    resetMemory() {
        this.memory = {
            projectCode: {},
            projectHistory: [],
            userPreferences: {},
            previousAgentOutputs: {},
            currentState: {},
        };
    }
}
