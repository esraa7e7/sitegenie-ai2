# Production Deployment Guide

## Deployment Architecture

The SiteGenie AI platform supports multi-cloud deployment:

1. **Kubernetes (GKE, EKS, AKS)** - Recommended for production
2. **Docker Compose** - Local development & small deployments
3. **Serverless** - Vercel, Netlify for frontend
4. **Container Registries** - Docker Hub, GitHub Container Registry, ECR

## Prerequisites

- Kubernetes cluster (1.28+)
- kubectl configured
- Helm 3.12+
- Cloud provider CLI (gcloud, aws, azure)
- Docker registry credentials

## Deployment Steps

### 1. Build and Push Docker Images

```bash
# Build images
docker build -f infrastructure/docker/Dockerfile.api -t sitegenie/api:v1.0.0 .
docker build -f infrastructure/docker/Dockerfile.web -t sitegenie/web:v1.0.0 .
docker build -f infrastructure/docker/Dockerfile.workers -t sitegenie/workers:v1.0.0 .

# Push to registry
docker push sitegenie/api:v1.0.0
docker push sitegenie/web:v1.0.0
docker push sitegenie/workers:v1.0.0
```

### 2. Configure Secrets

```bash
kubectl create namespace sitegenie

# Create secrets
kubectl create secret generic sitegenie-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=redis-url="redis://..." \
  --from-literal=jwt-secret="your-secret" \
  -n sitegenie
```

### 3. Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f infrastructure/kubernetes/manifests/base.yaml

# Verify deployment
kubectl get pods -n sitegenie
kubectl get svc -n sitegenie

# Check logs
kubectl logs -f deployment/sitegenie-api -n sitegenie
```

### 4. Configure Ingress

```bash
# Install NGINX Ingress Controller
helm install nginx-ingress ingress-nginx/ingress-nginx \
  -n ingress-nginx --create-namespace

# Apply ingress configuration
kubectl apply -f infrastructure/kubernetes/manifests/ingress.yaml
```

### 5. Setup SSL/TLS

```bash
# Install cert-manager
helm install cert-manager jetstack/cert-manager \
  -n cert-manager --create-namespace \
  --set installCRDs=true

# Create certificate
kubectl apply -f infrastructure/kubernetes/manifests/certificate.yaml
```

### 6. Database Migration

```bash
# Port forward to database
kubectl port-forward svc/sitegenie-db 5432:5432 -n sitegenie

# Run migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

## Monitoring & Health Checks

### Health Endpoint
```bash
curl http://your-domain/health
```

### Metrics
- Prometheus metrics at `/metrics`
- Grafana dashboard available at `/grafana`

### Logs
```bash
# View all logs
kubectl logs -f deployment/sitegenie-api -n sitegenie --all-containers=true

# Filter by label
kubectl logs -f -l app=sitegenie-api -n sitegenie
```

## Scaling

### Horizontal Scaling (Auto-scaling)
```bash
# Update HPA min/max replicas
kubectl patch hpa sitegenie-api-hpa -n sitegenie \
  -p '{"spec":{"minReplicas":5,"maxReplicas":20}}'
```

### Manual Scaling
```bash
kubectl scale deployment sitegenie-api --replicas=5 -n sitegenie
```

## Backup & Recovery

### Database Backup
```bash
# Create backup
kubectl exec -it deployment/sitegenie-db -n sitegenie \
  -- pg_dump -U sitegenie sitegenie > backup.sql

# Restore backup
kubectl exec -i deployment/sitegenie-db -n sitegenie \
  -- psql -U sitegenie sitegenie < backup.sql
```

### Disaster Recovery
```bash
# Automatic backups configured in CloudSQL/RDS
# Restore from snapshot in cloud provider console
```

## Troubleshooting

### Pod Not Starting
```bash
kubectl describe pod <pod-name> -n sitegenie
kubectl logs <pod-name> -n sitegenie
```

### Connection Issues
```bash
# Check service connectivity
kubectl run -it --rm debug --image=alpine:latest --restart=Never -- sh
# Inside pod: wget http://sitegenie-api:3000/health
```

### High CPU/Memory
```bash
kubectl top pods -n sitegenie
kubectl top nodes

# Update resource limits
kubectl set resources deployment sitegenie-api \
  -n sitegenie \
  --limits=cpu=1,memory=512Mi \
  --requests=cpu=500m,memory=256Mi
```

## Rollback

```bash
# Check rollout history
kubectl rollout history deployment/sitegenie-api -n sitegenie

# Rollback to previous version
kubectl rollout undo deployment/sitegenie-api -n sitegenie

# Rollback to specific revision
kubectl rollout undo deployment/sitegenie-api -n sitegenie --to-revision=2
```

## Security Best Practices

1. Use network policies to restrict traffic
2. Enable RBAC for access control
3. Use secrets for sensitive data
4. Regular security scans
5. Monitor for unauthorized access
6. Keep Kubernetes updated
7. Use container scanning

## CI/CD Integration

Deployments are automated via GitHub Actions:
- Build on every commit
- Test coverage required
- Security scanning
- Automatic deployment to staging
- Manual promotion to production

See `.github/workflows` for details.

## Cost Optimization

- Use node auto-scaling
- Configure resource requests/limits
- Use spot instances for non-critical workloads
- Monitor and optimize resource usage
- Clean up unused resources regularly
