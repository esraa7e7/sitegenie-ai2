# Development Setup Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/sitegenie-ai.git
cd sitegenie-ai
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 3. Start Services with Docker

```bash
docker-compose up -d postgres redis
```

### 4. Setup Database

```bash
npm run db:generate
npm run db:migrate
npm run db:studio  # Optional: explore database
```

### 5. Start Development Servers

```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Workers (optional)
npm run dev:workers
```

Visit:
- Frontend: http://localhost:5173
- API: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## Project Structure

```
apps/
  web/           # React + Vite frontend
  api/           # Express API server
  workers/       # Background job workers
  sandbox/       # Sandbox runtime

packages/
  shared/        # Shared types & utilities
  auth/          # Authentication module
  ai-core/       # Multi-agent AI system
  logger/        # Logging
  monitoring/    # Observability
  billing/       # Stripe integration
  storage/       # S3/cloud storage
```

## Common Commands

### Development
```bash
npm run dev              # Start all services
npm run dev:frontend    # Frontend only
npm run dev:server      # API only
npm run lint            # Run linter
npm run format          # Format code
npm run typecheck       # Type check
```

### Testing
```bash
npm run test            # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Database
```bash
npm run db:generate     # Generate Prisma client
npm run db:migrate      # Run migrations
npm run db:push         # Push schema to DB
npm run db:seed         # Seed test data
```

### Building
```bash
npm run build           # Build all packages
npm run build:frontend  # Frontend only
npm run build:server    # API only
```

## Debugging

### Browser DevTools
- Frontend: `Ctrl+Shift+I` or `Cmd+Option+I`
- Network tab to inspect API calls
- Console tab for errors

### VS Code
- Install ESLint and Prettier extensions
- Add breakpoints in code
- Run `npm run dev` to start debugging

### Logs
```bash
# View logs for specific service
docker-compose logs -f postgres
docker-compose logs -f redis

# View application logs
tail -f logs/app.log
```

## Environment Variables for Development

Edit `.env.local`:
```env
NODE_ENV=development
LOG_LEVEL=debug
VITE_API_URL=http://localhost:3000
DATABASE_URL=postgresql://sitegenie:password@localhost:5432/sitegenie
REDIS_URL=redis://localhost:6379
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port
lsof -i :3000
kill -9 <PID>
```

### Database Connection Error
```bash
# Ensure PostgreSQL is running
docker-compose ps
docker-compose up postgres

# Check connection string in .env.local
```

### Dependencies Issue
```bash
npm clean-install
npm run clean
npm install
```

### Module Not Found
```bash
npm run db:generate
npm run build:shared
```

## Git Workflow

```bash
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat: description"
git push origin feature/your-feature
# Create PR on GitHub
```

## Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Agent System](./docs/AGENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
