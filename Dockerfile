# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev libc6-compat dumb-init libatomic

# Copy manifests
# Copy only manifests first for improved layer caching
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
COPY turbo.json ./turbo.json
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

# Install all dependencies needed for compiling
RUN npm install --legacy-peer-deps

# Copy all other project files after dependencies are installed
COPY . ./

# Generate Prisma client for alpine
RUN npx prisma generate

# Execute production build
RUN npm run build

# Stage 2: Runner
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache dumb-init libatomic openssl

# Copy everything from builder to retain node_modules and binaries
COPY --from=builder /app ./

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start", "--workspace=api"]