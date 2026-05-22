/**
 * Comprehensive shared types for the SiteGenie AI platform
 * Foundation for all packages and services
 */

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================
// USER & AUTHENTICATION TYPES
// ============================================================

export enum UserRole {
  ADMIN = 'admin',
  TEAM_OWNER = 'team_owner',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  authProvider: AuthProvider;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// ============================================================
// PROJECT TYPES
// ============================================================

export enum ProjectStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export enum ProjectType {
  WEBSITE = 'website',
  WEBAPP = 'webapp',
  DASHBOARD = 'dashboard',
  ECOMMERCE = 'ecommerce',
  PORTFOLIO = 'portfolio',
  BLOG = 'blog',
  CUSTOM = 'custom',
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  type: ProjectType;
  status: ProjectStatus;
  ownerId: string;
  teamId?: string;
  thumbnail?: string;
  initialPrompt: string;
  generatedCode: ProjectCode;
  settings: ProjectSettings;
  metadata: ProjectMetadata;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ProjectCode {
  react?: CodeFile;
  html?: CodeFile;
  css?: CodeFile;
  javascript?: CodeFile;
  typescript?: CodeFile;
  config?: Record<string, CodeFile>;
}

export interface CodeFile {
  language: string;
  content: string;
  fileName: string;
  path: string;
}

export interface ProjectSettings {
  theme: ThemeConfig;
  responsive: boolean;
  seo: SEOConfig;
  analytics: AnalyticsConfig;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  darkMode: boolean;
  customCSS?: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  googleAnalyticsId?: string;
  customMetrics?: Record<string, unknown>;
}

export interface ProjectMetadata {
  fileCount: number;
  componentCount: number;
  lineOfCode: number;
  complexity: 'low' | 'medium' | 'high';
  framework?: string;
  libraries: string[];
  tags: string[];
}

export interface ProjectVersion {
  id: string;
  projectId: string;
  version: number;
  code: ProjectCode;
  timestamp: Date;
  author: User;
  message: string;
}

// ============================================================
// AI AGENT TYPES
// ============================================================

export const AgentType = {
  PLANNER: 'planner',
  UI: 'ui',
  BACKEND: 'backend',
  API: 'api',
  REFACTOR: 'refactor',
  DEBUG: 'debug',
  SECURITY: 'security',
  TESTING: 'testing',
  DEPLOYMENT: 'deployment',
  MEMORY: 'memory',
  OPTIMIZATION: 'optimization',
} as const;

export type AgentType = typeof AgentType[keyof typeof AgentType];

export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  RETRY = 'retry',
}

export interface AgentTask {
  taskId: string;
  agentId: string;
  agentType: AgentType;
  projectId: string;
  status: TaskStatus;
  input: AgentInput;
  output?: AgentOutput;
  error?: AgentError;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  metadata: TaskMetadata;
}

export interface AgentInput {
  prompt: string;
  context: ContextWindow;
  previousResults?: Record<string, AgentOutput>;
  constraints?: Record<string, unknown>;
}

export interface AgentOutput {
  result: string;
  code?: ProjectCode;
  suggestions?: string[];
  outputFormat?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  suggestion?: string;
}

export type AgentPriority = "low" | "normal" | "high";

export interface TaskMetadata {
  tokensUsed: number;
  executionTime: number;
  retryCount: number;
  priority: AgentPriority;
  batchId?: string;
}

export interface ContextWindow {
  projectCode: ProjectCode;
  projectHistory: ProjectVersion[];
  userPreferences: Record<string, unknown>;
  previousAgentOutputs: Record<string, AgentOutput>;
  currentState: Record<string, unknown>;
}

// ============================================================
// QUEUE & STREAMING TYPES
// ============================================================

export enum QueuePriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  URGENT = 3,
}

export interface QueueJob {
  id: string;
  type: string;
  data: unknown;
  priority: QueuePriority;
  attempts: number;
  maxAttempts: number;
  status: TaskStatus;
  createdAt: Date;
  processedAt?: Date;
}

export interface StreamMessage<T = unknown> {
  type: 'start' | 'progress' | 'data' | 'error' | 'complete';
  data?: T;
  progress?: {
    current: number;
    total: number;
    message: string;
  };
  error?: ApiError;
  timestamp: string;
}

// ============================================================
// DEPLOYMENT TYPES
// ============================================================

export enum DeploymentProvider {
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
  RAILWAY = 'railway',
  RENDER = 'render',
  CLOUDFLARE = 'cloudflare',
  CUSTOM = 'custom',
}

export enum DeploymentStatus {
  QUEUED = 'queued',
  BUILDING = 'building',
  DEPLOYING = 'deploying',
  SUCCESS = 'success',
  FAILED = 'failed',
  ROLLBACK = 'rollback',
}

export interface Deployment {
  id: string;
  projectId: string;
  provider: DeploymentProvider;
  status: DeploymentStatus;
  url?: string;
  customDomain?: string;
  environment: Record<string, string>;
  logs: DeploymentLog[];
  createdAt: Date;
  completedAt?: Date;
  metadata: DeploymentMetadata;
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface DeploymentMetadata {
  buildTime: number;
  commitSHA?: string;
  branch?: string;
  version: string;
}

// ============================================================
// USAGE & SERVICE TYPES
// ============================================================

export interface UsageMetrics {
  apiRequests: number;
  storageUsed: number; // in MB
  deploymentsUsed: number;
  projectsUsed: number;
  teamMembers: number;
}

export interface UsageQuotas {
  apiRequests: number;
  maxProjects: number;
  maxTeamSize: number;
  maxDeploymentsPerDay: number;
  storageGB: number;
}

// ============================================================
// WEBHOOK TYPES
// ============================================================

export enum WebhookEvent {
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  PROJECT_DEPLOYED = 'project.deployed',
  DEPLOYMENT_SUCCESS = 'deployment.success',
  DEPLOYMENT_FAILED = 'deployment.failed',
  GENERATION_COMPLETE = 'generation.complete',
  GENERATION_FAILED = 'generation.failed',
  COLLABORATION_INVITED = 'collaboration.invited',
}

export interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret: string;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface WebhookPayload<T = unknown> {
  event: WebhookEvent;
  timestamp: string;
  data: T;
  signature: string;
}

// ============================================================
// COLLABORATION TYPES
// ============================================================

export enum CollaborationRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  COMMENTER = 'commenter',
  VIEWER = 'viewer',
}

export interface TeamMember {
  userId: string;
  email: string;
  role: CollaborationRole;
  joinedAt: Date;
  permissions: string[];
}

export interface ProjectCollaborator {
  teamMember: TeamMember;
  projectRole: CollaborationRole;
  canWrite: boolean;
  canComment: boolean;
  canShare: boolean;
}

// ============================================================
// ERROR TYPES
// ============================================================

export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Resources
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_EXISTS = 'RESOURCE_EXISTS',
  CONFLICT = 'CONFLICT',

  // Server
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',

  // AI/Generation
  GENERATION_FAILED = 'GENERATION_FAILED',
  INVALID_PROMPT = 'INVALID_PROMPT',
  TOKEN_LIMIT_EXCEEDED = 'TOKEN_LIMIT_EXCEEDED',

  // Deployment
  DEPLOYMENT_FAILED = 'DEPLOYMENT_FAILED',
  BUILD_FAILED = 'BUILD_FAILED',
}

// ============================================================
// FEATURE FLAGS
// ============================================================

export interface FeatureFlags {
  enableExperimental: boolean;
  enableBetaAgents: boolean;
  enableCollaboration: boolean;
  enableAdvancedAnalytics: boolean;
  enableCustomDeployment: boolean;
  enableMultiLanguage: boolean;
}

// ============================================================
// HEALTH CHECK TYPES
// ============================================================

export interface HealthCheckStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: ServiceHealth;
    cache: ServiceHealth;
    queue: ServiceHealth;
    storage: ServiceHealth;
    llm: ServiceHealth;
  };
  metrics: {
    uptime: number;
    requestsPerSecond: number;
    errorRate: number;
  };
}

export interface ServiceHealth {
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
  lastChecked: string;
}
