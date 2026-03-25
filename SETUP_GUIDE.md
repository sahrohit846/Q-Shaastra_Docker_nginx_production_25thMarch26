# Q-Shaastra: Quantum Research Platform - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Overview](#project-overview)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Running the Project](#running-the-project)
6. [Accessing the Application](#accessing-the-application)
7. [Managing Services](#managing-services)
8. [Troubleshooting](#troubleshooting)
9. [Development Workflow](#development-workflow)

---

## 🔧 Prerequisites

Before running this project, ensure you have installed:

### Required Software
- **Docker**: Version 20.10+ ([Install Docker](https://docs.docker.com/install/))
- **Docker Compose**: Version 2.0+ (usually comes with Docker Desktop)
- **Git**: For version control
- **Python 3.11+**: Optional (only if running without Docker)

### Verify Installation
```bash
docker --version
docker compose --version
git --version
```

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 5GB
- **OS**: Linux, macOS, or Windows with WSL2

---

## 📦 Project Overview

**Q-Shaastra** is a comprehensive quantum computing research platform with:

### Key Components
```
├── Django Web Application (simulator/)
│   ├── Quantum Circuit Simulator
│   ├── Dashboard & Analytics
│   └── User Management
│
├── Research Module (quantum_research/)
│   ├── ArXiv Paper Integration
│   ├── Quantum News Aggregation
│   └── Research Data Management
│
├── Home Module (home/)
│   ├── User Authentication
│   ├── Profile Management
│   └── Admin Dashboard
│
└── Services
    ├── Redis (Caching & Message Broker)
    ├── MongoDB (NoSQL Database)
    ├── Celery (Async Task Queue)
    └── Celery Beat (Scheduled Tasks)
```

### Microservices Architecture
- **Web Service**: Django + Gunicorn on port 8000
- **Redis**: In-memory cache and Celery broker
- **MongoDB**: Document database on port 27017
- **Celery Worker**: Async task processing
- **Celery Beat**: Scheduled task scheduler

---

## 📥 Installation Steps

### Step 1: Clone/Download the Project
```bash
# Navigate to your workspace
cd ~/Downloads/Quantum_Shaastra_All_Files

# If cloning from Git
git clone <repository-url>
cd Q-Shaastra_Docker_Production_19thMarch26

# If already downloaded, just navigate to the directory
cd Q-Shaastra_Docker_Production_19thMarch26
```

### Step 2: Verify Project Structure
```bash
ls -la
# Should show:
# - docker-compose.yml
# - Dockerfile
# - requirements.txt
# - .env
# - manage.py
# - simulator/, quantum_research/, home/ (Django apps)
```

### Step 3: Check Docker Daemon
```bash
# Ensure Docker daemon is running
docker ps

# Should list running containers (if any)
```

### Step 4: Review Environment Configuration
```bash
cat .env
# Review configuration variables:
# - DJANGO_SECRET_KEY
# - MongoDB URI
# - Redis URL
# - API Keys (Discord, News API, Murf, etc.)
```

---

## ⚙️ Configuration

### Step 1: Environment Variables (.env)

The `.env` file is already configured but review/update as needed:

```env
# Django Configuration
DJANGO_SECRET_KEY=django-insecure-n%9805w%*p9kz6z8pdlf&5x5wydsmfq44bcn=5$@z4yez6jv7c
DEBUG=True

# Database Configuration
MONGO_URI=mongodb://mongo:27017
MONGO_DB_NAME=quantum_shaastra_prod

# Cache & Celery
REDIS_URL=redis://redis:6379/0
REDIS_CACHE_URL=redis://redis:6379/2

# External APIs
DISCORD_BOT_TOKEN=your_discord_token_here
QUANTUM_NEWS_API_KEY=your_api_key_here
MURF_API_KEY_P=your_api_key_here
PEXELS_API_KEY=your_api_key_here

# Email Configuration
EMAIL_HOST_USER_Q=your_email@gmail.com
EMAIL_HOST_PASSWORD_Q=your_app_password
```

### Step 2: Update Critical Secrets (Production)
For **production deployment**, update:
```bash
nano .env  # or use your preferred editor

# Update:
DEBUG=False
DJANGO_SECRET_KEY=<generate-new-secure-key>
ALLOWED_HOSTS_Q=<your-domain>
```

### Step 3: Build Configuration
Review `docker-compose.yml`:
```bash
cat docker-compose.yml
# Services defined:
# - web (Django + Gunicorn)
# - redis (Cache broker)
# - mongo (Database)
# - celery_worker (Async tasks)
# - celery_beat (Scheduled tasks)
```

---

## 🚀 Running the Project

### Method 1: Complete Automated Start (Recommended)

```bash
# Step 1: Navigate to project directory
cd /home/cpatwrohit/Downloads/Quantum_Shaastra_All_Files/Q-Shaastra_Docker_Production_19thMarch26

# Step 2: Build Docker images (first time only, or when requirements change)
docker compose build

# Step 3: Start all services in detached mode
docker compose up -d

# Step 4: Verify all services are running
docker compose ps

# Expected output:
# NAME                      SERVICE         STATUS              PORTS
# ...web-1                  web             Up 2 minutes        0.0.0.0:8000->8000/tcp
# ...redis-1                redis           Up 2 minutes        6379/tcp
# ...mongo-1                mongo           Up 2 minutes        27017/tcp
# ...celery_worker-1        celery_worker   Up 2 minutes
# ...celery_beat-1          celery_beat     Up 2 minutes

# Step 5: View logs to confirm successful startup
docker compose logs web -f

# Should see: "Listening at: http://0.0.0.0:8000"
```

### Method 2: Interactive Start (For Development)

```bash
# Start services with visible logs
docker compose up

# In another terminal, run commands as needed
# Press Ctrl+C to stop (gracefully stops all services)
```

### Method 3: Step-by-Step Manual Start

```bash
# Pull latest images
docker compose pull

# Create containers without starting
docker compose create

# Start services one by one
docker compose start redis
docker compose start mongo
sleep 3  # Wait for databases
docker compose start web
docker compose start celery_worker
docker compose start celery_beat

# Verify
docker compose ps
```

---

## 🌐 Accessing the Application

### Web Application
```
URL: http://localhost:8000
```

### Available Pages
- **Home**: `http://localhost:8000/`
- **Simulator**: `http://localhost:8000/simulator/`
- **Dashboard**: `http://localhost:8000/dashboard/`
- **Quantum News**: `http://localhost:8000/quantum-news/`
- **Admin Panel**: `http://localhost:8000/admin/`
- **User Profile**: `http://localhost:8000/profile/`

### Admin Credentials
```
Username: admin
Password: admin123
```
*(Create new admin user if needed - see troubleshooting)*

### Database Access (Optional)

**MongoDB Connection**
```bash
# Connect to MongoDB inside container
docker compose exec mongo mongosh

# Inside mongosh:
> use quantum_shaastra_prod
> db.collections()
```

**Redis CLI**
```bash
docker compose exec redis redis-cli

# Inside redis-cli:
> KEYS *
> GET key_name
> FLUSHALL  # Clear all data (for development)
```

---

## 🛠️ Managing Services

### View Logs

```bash
# All services
docker compose logs

# Specific service (with follow flag)
docker compose logs web -f
docker compose logs celery_worker -f
docker compose logs mongo
docker compose logs redis

# Last N lines
docker compose logs --tail=50 web

# Since a specific time
docker compose logs --since 2026-03-19 web
```

### Execute Commands Inside Containers

```bash
# Run Django management commands
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
docker compose exec web python manage.py shell

# Run shell in any service
docker compose exec web bash
docker compose exec mongo bash

# Collect static files
docker compose exec web python manage.py collectstatic --noinput
```

### Stop Services

```bash
# Stop all services (preserve data)
docker compose stop

# Stop specific service
docker compose stop web

# Stop and remove containers (preserve volumes/data)
docker compose down

# Stop and remove everything including volumes
docker compose down -v  # WARNING: Deletes all data!
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart web

# Rebuild and restart
docker compose up -d --build
```

### Scale Services

```bash
# Scale celery workers to 3 instances
docker compose up -d --scale celery_worker=3

# View scaled services
docker compose ps
```

---

## 🐛 Troubleshooting

### Issue 1: Docker Daemon Not Running

**Error**: `Cannot connect to Docker daemon`

**Solution**:
```bash
# Start Docker daemon
sudo systemctl start docker

# For Docker Desktop
# Open Docker Desktop application
```

### Issue 2: Port Already in Use

**Error**: `Error response from daemon: Ports are not available`

**Solutions**:
```bash
# Find process using port 8000
lsof -i :8000
# Kill the process
kill -9 <PID>

# Or change port in docker-compose.yml
# Change "8000:8000" to "8001:8000"
```

### Issue 3: Database Connection Issues

**Error**: `Connection refused to MongoDB/Redis`

**Solution**:
```bash
# Check if services are running
docker compose ps

# Restart database services
docker compose restart mongo redis

# Wait 5-10 seconds for databases to respond
sleep 10

# Restart web service
docker compose restart web

# Check logs
docker compose logs mongo
docker compose logs redis
```

### Issue 4: Migrations Not Applied

**Error**: `Your models in app(s): 'home' have changes that are not yet reflected`

**Solution**:
```bash
# Create new migration files
docker compose exec web python manage.py makemigrations

# Apply migrations
docker compose exec web python manage.py migrate

# If specific app
docker compose exec web python manage.py makemigrations home
docker compose exec web python manage.py migrate home
```

### Issue 5: Static Files Not Loading

**Error**: CSS/JS files not loading (404 errors)

**Solution**:
```bash
# Collect static files
docker compose exec web python manage.py collectstatic --noinput --clear

# Restart web service
docker compose restart web
```

### Issue 6: Memory/Resource Issues

**Error**: Container constantly restarting, OOM kill

**Solution**:
```bash
# Check resource usage
docker stats

# Limit resources in docker-compose.yml
# Add to service:
# deploy:
#   resources:
#     limits:
#       cpus: '2'
#       memory: 2G

# Restart with new limits
docker compose down
docker compose up -d
```

### Issue 7: Permission Denied Errors

**Error**: `Permission denied while trying to connect to Docker daemon`

**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply new group membership
newgrp docker

# Verify
docker ps
```

### Issue 8: Build Failures

**Error**: Build fails when running `docker compose build`

**Solution**:
```bash
# Clean build cache
docker compose build --no-cache

# Or rebuild entire stack
docker system prune -a
docker compose build --no-cache
```

---

## 💻 Development Workflow

### Local Development (Without Docker)

```bash
# Step 1: Create virtual environment
python3.11 -m venv myenv

# Step 2: Activate environment
source myenv/bin/activate  # Linux/Mac
# or
myenv\Scripts\activate     # Windows

# Step 3: Install dependencies
pip install -r requirements.txt

# Step 4: Run development server
python manage.py runserver 0.0.0.0:8000
```

### Testing

```bash
# Run all tests
docker compose exec web python manage.py test

# Run specific app tests
docker compose exec web python manage.py test home

# Run with coverage
docker compose exec web coverage run --source='.' manage.py test
docker compose exec web coverage report
```

### Making Code Changes

```bash
# Code changes are automatically reflected (hot reload)
# If it's not working, restart the service:
docker compose restart web

# For static files
docker compose exec web python manage.py collectstatic --noinput

# For model changes
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate
```

### Monitoring & Debugging

```bash
# Real-time logs
docker compose logs -f web

# Enter Python shell in Django
docker compose exec web python manage.py shell

# Access database shell
docker compose exec mongo mongosh
docker compose exec redis redis-cli
```

### Clean Up & Start Fresh

```bash
# Remove all containers and volumes (WARNING: deletes all data)
docker compose down -v

# Rebuild from scratch
docker compose build --no-cache
docker compose up -d

# Fresh migrations
docker compose exec web python manage.py migrate zero
docker compose exec web python manage.py migrate
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser)                         │
│                   http://localhost:8000                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                   Docker Network                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │   Web Service    │    │  Redis Cache     │              │
│  │ Django + Gunicorn    │                   │              │
│  │   Port 8000      │    │  Port 6379       │              │
│  └────────┬─────────┘    └────────┬─────────┘              │
│           │                       │                        │
│           └───────────────────────┼─────────────┐          │
│                                   │             │          │
│  ┌──────────────────┐    ┌──────────────────┐ │          │
│  │  MongoDB DB      │    │ Celery Worker    │ │          │
│  │                  │    │ (Async Tasks)    │ │          │
│  │  Port 27017      │    │                  │ │          │
│  └──────────────────┘    └──────────────────┘ │          │
│                                                 │          │
│  ┌──────────────────────────────────────────┐ │          │
│  │   Celery Beat (Scheduled Tasks)          │─┘          │
│  └──────────────────────────────────────────┘            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 📝 Useful Commands Quick Reference

```bash
# Startup
docker compose up -d
docker compose logs web -f

# Check status
docker compose ps
docker compose stats

# Database migrations
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate

# Create admin user
docker compose exec web python manage.py createsuperuser

# View logs
docker compose logs web -f
docker compose logs celery_worker -f

# Stop all
docker compose stop

# Rebuild
docker compose build --no-cache

# Full cleanup (removes all data)
docker compose down -v

# Scale celery workers
docker compose up -d --scale celery_worker=3
```

---

## 🔗 Useful Resources

- **Django Documentation**: https://docs.djangoproject.com/
- **Docker Documentation**: https://docs.docker.com/
- **Celery Documentation**: https://docs.celeryproject.org/
- **MongoDB Documentation**: https://docs.mongodb.com/

---

## ✅ Verification Checklist

After starting the project, verify:

- [ ] All containers are running: `docker compose ps`
- [ ] Web service is accessible: `http://localhost:8000`
- [ ] Admin panel works: `http://localhost:8000/admin/`
- [ ] Database connections are healthy: `docker compose logs mongo`
- [ ] Redis is working: `docker compose logs redis`
- [ ] Celery workers are processing tasks: `docker compose logs celery_worker`
- [ ] Static files are served correctly
- [ ] No errors in web service logs: `docker compose logs web`

---

## 📞 Support & Issues

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review container logs: `docker compose logs <service>`
3. Check `.env` configuration
4. Consult Django and Docker documentation

---

**Last Updated**: March 19, 2026
**Project**: Q-Shaastra Quantum Research Platform
**Docker Setup**: Production-Ready Configuration
