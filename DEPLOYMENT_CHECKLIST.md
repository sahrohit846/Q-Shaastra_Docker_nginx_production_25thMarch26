# Q-Shaastra Deployment Checklist

## Pre-Deployment ✅

### Environment Setup
- [ ] Docker installed and running
- [ ] Docker Compose installed (v2.0+)
- [ ] Project cloned/downloaded
- [ ] `.env` file reviewed and updated
- [ ] All required API keys obtained:
  - [ ] Discord Bot Token
  - [ ] News API Key
  - [ ] Murf API Key
  - [ ] Pexels API Key

### Configuration Review
- [ ] `DEBUG=False` in production `.env`
- [ ] `DJANGO_SECRET_KEY` updated with new secure key
- [ ] `ALLOWED_HOSTS_Q` set to your domain
- [ ] Database credentials verified
- [ ] Email settings configured
- [ ] Redis and MongoDB URIs validated

### Security Checks
- [ ] No hardcoded passwords in code
- [ ] `.env` file not committed to git
- [ ] `.gitignore` properly configured
- [ ] Django CSRF settings correct
- [ ] CORS settings appropriate for domain
- [ ] HTTPS enabled (production)

---

## Deployment Steps 🚀

### Step 1: Build Phase
```bash
# Pull latest code
git pull origin main

# Build Docker images
docker compose build --no-cache

# Verify build successful
docker images | grep q-shaastra
```

### Step 2: Pre-flight Checks
```bash
# Check Docker daemon
docker ps

# Verify compose file
docker compose config

# Check .env file permissions
ls -la .env
```

### Step 3: Database Preparation
```bash
# Backup existing data (if upgrading)
# Run migrations on new environment
docker compose run --rm web python manage.py migrate

# Create admin user if first deploy
docker compose run --rm web python manage.py createsuperuser
```

### Step 4: Static Files
```bash
# Collect static files
docker compose run --rm web python manage.py collectstatic --noinput --clear

# Verify static files collected
ls -la staticfiles/ | head -20
```

### Step 5: Deploy
```bash
# Stop old containers (if redeploying)
docker compose down

# Start new containers
docker compose up -d

# Wait for services to stabilize
sleep 10

# Verify all services running
docker compose ps
```

### Step 6: Post-Deployment Verification
```bash
# Check all services are UP
docker compose ps | grep "Up"

# Verify web service is responsive
curl http://localhost:8000/

# Check logs for errors
docker compose logs web | grep -i error

# Test admin panel
curl http://localhost:8000/admin/

# Check static files serving
curl http://localhost:8000/static/Simulator.css
```

---

## Post-Deployment Tests ✓

### Application Functionality
- [ ] Homepage loads: `curl http://localhost:8000/`
- [ ] Admin panel accessible: `http://localhost:8000/admin/`
- [ ] Can login with admin credentials
- [ ] Simulator page loads: `http://localhost:8000/simulator/`
- [ ] Quantum News page loads: `http://localhost:8000/quantum-news/`
- [ ] Static files load (CSS, JS, images)
- [ ] Database operations working (create/read)

### Background Tasks
- [ ] Celery worker is running: `docker compose ps | grep celery_worker`
- [ ] Celery beat is running: `docker compose ps | grep celery_beat`
- [ ] Tasks executing without errors: `docker compose logs celery_worker | tail -50`

### Database & Cache
- [ ] MongoDB responding: `docker compose exec mongo ping localhost`
- [ ] Redis available: `docker compose exec redis redis-cli ping`
- [ ] Data persisting: `docker compose exec mongo mongosh`

### Logs Monitoring
```bash
# No critical errors in web service
docker compose logs web | grep -i "error\|critical"

# No connection errors
docker compose logs web | grep -i "refused\|timeout"

# Migrations applied successfully
docker compose logs web | grep -i "migration"
```

---

## Monitoring & Maintenance 📊

### Daily Checks
```bash
# All services running
docker compose ps

# No high resource usage
docker stats

# No errors in recent logs
docker compose logs --since 1h web
```

### Weekly Tasks
- [ ] Review application logs
- [ ] Check database size
- [ ] Monitor Redis memory usage
- [ ] Verify backups created
- [ ] Check for security updates

### Monthly Tasks
- [ ] Update Docker images
- [ ] Review and rotate API keys
- [ ] Backup MongoDB data
- [ ] Performance analysis
- [ ] Security audit

---

## Backup & Recovery 💾

### Backup Database
```bash
# MongoDB backup
docker compose exec mongo mongodump --out /backup/mongo_$(date +%Y%m%d)

# SQLite backup (if used)
docker compose exec web cp db.sqlite3 /backup/db_$(date +%Y%m%d).sqlite3
```

### Backup Configuration
```bash
# Backup .env file
cp .env /backup/.env.$(date +%Y%m%d)

# Backup docker-compose.yml
cp docker-compose.yml /backup/docker-compose.yml.$(date +%Y%m%d)
```

### Restore from Backup
```bash
# Stop all services
docker compose stop

# Restore database
docker compose exec mongo mongorestore /backup/mongo_backup

# Restart services
docker compose up -d
```

---

## Rollback Plan 🔄

If deployment fails:

```bash
# Stop current deployment
docker compose down

# Restore previous version
git checkout previous_commit
docker compose build --no-cache

# Restore database from backup
docker compose exec mongo mongorestore /backup/previous_backup

# Start previous version
docker compose up -d

# Verify
docker compose ps
docker compose logs web
```

---

## Scaling Strategy 📈

### Add More Celery Workers
```bash
docker compose up -d --scale celery_worker=3
```

### Load Balancing
```bash
# Already configured with multiple gunicorn workers (3)
# Add Nginx reverse proxy for better load balancing if needed
```

### Resource Limits
Update `docker-compose.yml`:
```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

---

## Troubleshooting During Deployment 🐛

| Error | Cause | Solution |
|-------|-------|----------|
| Build fails | Dependency issue | `docker compose build --no-cache` |
| Containers won't start | Port in use | Change port or kill process |
| Database connection error | Service not ready | Wait 5-10s, restart mongo |
| Admin login fails | Migrations not applied | `docker compose exec web python manage.py migrate` |
| Static files 404 | Not collected | `docker compose exec web python manage.py collectstatic` |
| Celery tasks failing | Redis not accessible | `docker compose restart redis celery_worker` |

---

## Performance Optimization 🚀

### Before Going Live
- [ ] Enable caching: Redis configured
- [ ] Database indexing: MongoDB optimized
- [ ] Static file compression: Gzip enabled
- [ ] Gunicorn workers: Set to CPU count
- [ ] Celery workers: Scaled for load
- [ ] CDN: Static files served via CDN
- [ ] Monitoring: Logging and alerting setup

### Recommended Settings for Production
```yaml
# docker-compose.yml
web:
  command: gunicorn simulator.wsgi:application --bind 0.0.0.0:8000 --workers 4 --worker-class sync --worker-connections 100

deploy:
  resources:
    limits:
      cpus: '4'
      memory: 4G
```

---

## Documentation & Support

- **Setup Guide**: See `SETUP_GUIDE.md`
- **Quick Start**: See `QUICKSTART.md`
- **Django Docs**: https://docs.djangoproject.com/
- **Docker Docs**: https://docs.docker.com/
- **Celery Docs**: https://docs.celeryproject.org/

---

## Sign-off Checklist

- [ ] All deployment steps completed
- [ ] All tests passed
- [ ] No errors in logs
- [ ] Admin can access dashboard
- [ ] Users can access application
- [ ] Background tasks running
- [ ] Database backups created
- [ ] Team notified of deployment
- [ ] Monitor alerts configured
- [ ] Documentation updated

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Status**: ✅ Ready for Production
**Next Review**: _______________

