/**
 * Comprehensive shared types for the SiteGenie AI platform
 * Foundation for all packages and services
 */
// ============================================================
// USER & AUTHENTICATION TYPES
// ============================================================
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TEAM_OWNER"] = "team_owner";
    UserRole["DEVELOPER"] = "developer";
    UserRole["VIEWER"] = "viewer";
})(UserRole || (UserRole = {}));
export var AuthProvider;
(function (AuthProvider) {
    AuthProvider["EMAIL"] = "email";
    AuthProvider["GOOGLE"] = "google";
    AuthProvider["GITHUB"] = "github";
    AuthProvider["MICROSOFT"] = "microsoft";
})(AuthProvider || (AuthProvider = {}));
// ============================================================
// PROJECT TYPES
// ============================================================
export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "draft";
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["ARCHIVED"] = "archived";
    ProjectStatus["DELETED"] = "deleted";
})(ProjectStatus || (ProjectStatus = {}));
export var ProjectType;
(function (ProjectType) {
    ProjectType["WEBSITE"] = "website";
    ProjectType["WEBAPP"] = "webapp";
    ProjectType["DASHBOARD"] = "dashboard";
    ProjectType["ECOMMERCE"] = "ecommerce";
    ProjectType["PORTFOLIO"] = "portfolio";
    ProjectType["BLOG"] = "blog";
    ProjectType["CUSTOM"] = "custom";
})(ProjectType || (ProjectType = {}));
// ============================================================
// AI AGENT TYPES
// ============================================================
export var AgentType;
(function (AgentType) {
    AgentType["PLANNER"] = "planner";
    AgentType["UI"] = "ui";
    AgentType["BACKEND"] = "backend";
    AgentType["API"] = "api";
    AgentType["REFACTOR"] = "refactor";
    AgentType["DEBUG"] = "debug";
    AgentType["SECURITY"] = "security";
    AgentType["TESTING"] = "testing";
    AgentType["DEPLOYMENT"] = "deployment";
    AgentType["MEMORY"] = "memory";
    AgentType["OPTIMIZATION"] = "optimization";
})(AgentType || (AgentType = {}));
export var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "pending";
    TaskStatus["PROCESSING"] = "processing";
    TaskStatus["COMPLETED"] = "completed";
    TaskStatus["FAILED"] = "failed";
    TaskStatus["CANCELLED"] = "cancelled";
    TaskStatus["RETRY"] = "retry";
})(TaskStatus || (TaskStatus = {}));
// ============================================================
// QUEUE & STREAMING TYPES
// ============================================================
export var QueuePriority;
(function (QueuePriority) {
    QueuePriority[QueuePriority["LOW"] = 0] = "LOW";
    QueuePriority[QueuePriority["NORMAL"] = 1] = "NORMAL";
    QueuePriority[QueuePriority["HIGH"] = 2] = "HIGH";
    QueuePriority[QueuePriority["URGENT"] = 3] = "URGENT";
})(QueuePriority || (QueuePriority = {}));
// ============================================================
// DEPLOYMENT TYPES
// ============================================================
export var DeploymentProvider;
(function (DeploymentProvider) {
    DeploymentProvider["VERCEL"] = "vercel";
    DeploymentProvider["NETLIFY"] = "netlify";
    DeploymentProvider["RAILWAY"] = "railway";
    DeploymentProvider["RENDER"] = "render";
    DeploymentProvider["CLOUDFLARE"] = "cloudflare";
    DeploymentProvider["CUSTOM"] = "custom";
})(DeploymentProvider || (DeploymentProvider = {}));
export var DeploymentStatus;
(function (DeploymentStatus) {
    DeploymentStatus["QUEUED"] = "queued";
    DeploymentStatus["BUILDING"] = "building";
    DeploymentStatus["DEPLOYING"] = "deploying";
    DeploymentStatus["SUCCESS"] = "success";
    DeploymentStatus["FAILED"] = "failed";
    DeploymentStatus["ROLLBACK"] = "rollback";
})(DeploymentStatus || (DeploymentStatus = {}));
// ============================================================
// WEBHOOK TYPES
// ============================================================
export var WebhookEvent;
(function (WebhookEvent) {
    WebhookEvent["PROJECT_CREATED"] = "project.created";
    WebhookEvent["PROJECT_UPDATED"] = "project.updated";
    WebhookEvent["PROJECT_DEPLOYED"] = "project.deployed";
    WebhookEvent["DEPLOYMENT_SUCCESS"] = "deployment.success";
    WebhookEvent["DEPLOYMENT_FAILED"] = "deployment.failed";
    WebhookEvent["GENERATION_COMPLETE"] = "generation.complete";
    WebhookEvent["GENERATION_FAILED"] = "generation.failed";
    WebhookEvent["COLLABORATION_INVITED"] = "collaboration.invited";
})(WebhookEvent || (WebhookEvent = {}));
// ============================================================
// COLLABORATION TYPES
// ============================================================
export var CollaborationRole;
(function (CollaborationRole) {
    CollaborationRole["OWNER"] = "owner";
    CollaborationRole["EDITOR"] = "editor";
    CollaborationRole["COMMENTER"] = "commenter";
    CollaborationRole["VIEWER"] = "viewer";
})(CollaborationRole || (CollaborationRole = {}));
// ============================================================
// ERROR TYPES
// ============================================================
export var ErrorCode;
(function (ErrorCode) {
    // Authentication
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    // Validation
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Resources
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["RESOURCE_EXISTS"] = "RESOURCE_EXISTS";
    ErrorCode["CONFLICT"] = "CONFLICT";
    // Server
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["TIMEOUT"] = "TIMEOUT";
    // Rate limiting
    ErrorCode["RATE_LIMITED"] = "RATE_LIMITED";
    ErrorCode["QUOTA_EXCEEDED"] = "QUOTA_EXCEEDED";
    // AI/Generation
    ErrorCode["GENERATION_FAILED"] = "GENERATION_FAILED";
    ErrorCode["INVALID_PROMPT"] = "INVALID_PROMPT";
    ErrorCode["TOKEN_LIMIT_EXCEEDED"] = "TOKEN_LIMIT_EXCEEDED";
    // Deployment
    ErrorCode["DEPLOYMENT_FAILED"] = "DEPLOYMENT_FAILED";
    ErrorCode["BUILD_FAILED"] = "BUILD_FAILED";
})(ErrorCode || (ErrorCode = {}));
