import { WorkspaceFile, AgentLog } from './types.js';

export class ContextMemory {
  private history: string[] = [];
  private files: Record<string, string> = {};
  private logs: AgentLog[] = [];

  updateFiles(newFiles: Record<string, string>) {
    this.files = { ...this.files, ...newFiles };
  }

  addLog(log: AgentLog) {
    this.logs.push(log);
  }

  addHistory(entry: string) {
    this.history.push(entry);
  }

  getFiles() {
    return this.files;
  }

  getLogs() {
    return this.logs;
  }

  getFullContext() {
    return `
      System Context:
      - Execution History: ${this.history.join('\n')}
      - Files in Workspace: ${Object.keys(this.files).join(', ')}
      - Recent Activity: ${this.logs.slice(-5).map(l => l.message).join(' | ')}
    `.trim();
  }
}
