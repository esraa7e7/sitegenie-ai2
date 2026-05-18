FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install -g turbo
RUN npm install --legacy-peer-deps
# Inject dummy environment variables
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache dumb-init libatomic
COPY --from=builder /app ./
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "start", "--workspace=api"]