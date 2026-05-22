export function generateAgentId(agentType: string, size: number = 21): string {
  return `agent_${agentType}_${Math.random().toString(36).substring(2, 2 + size)}`;
}

export function generateTaskId(size: number = 21): string {
  return `task_${Math.random().toString(36).substring(2, 2 + size)}`;
}

export function getTimeDifferenceInSeconds(start: Date, end: Date = new Date()): number {
  return Math.floor((end.getTime() - start.getTime()) / 1000);
}