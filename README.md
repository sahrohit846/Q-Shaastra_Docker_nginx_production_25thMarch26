# Q-Shaastra Project - Complete Documentation Index

## 📖 Documentation Overview

This project contains comprehensive documentation for running and developing the Q-Shaastra Quantum Research Platform. Below is a guide to help you find what you need.

---

## 🚀 Getting Started (Choose Your Path)

### ⚡ I Want to Start RIGHT NOW
👉 Read: **[QUICKSTART.md](QUICKSTART.md)**
- 5-minute quick start
- Essential commands only
- For experienced developers

### 📚 I Want Complete Instructions
👉 Read: **[SETUP_GUIDE.md](SETUP_GUIDE.md)**
- Full step-by-step setup
- Prerequisites and installation
- Detailed configuration
- Comprehensive troubleshooting
- 30-40 minutes to complete

### 👨‍💻 I Want to Develop New Features
👉 Read: **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**
- Project structure explained
- How to add new apps and models
- API development
- Database management
- Code conventions and best practices
- Testing guidelines

### 🚀 I Want to Deploy to Production
👉 Read: **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)**
- Pre-deployment checks
- Step-by-step deployment
- Post-deployment verification
- Backup and recovery
- Scaling strategies
- Monitoring and maintenance

---

## 📋 Quick Reference by Task

### Starting the Project

**First Time?**
```bash
docker compose build
docker compose up -d
docker compose logs web -f
```

**Subsequent Times?**
```bash
docker compose up -d
docker compose logs web -f
```

**Just Want to Know Status?**
```bash
docker compose ps
```

[Details →](QUICKSTART.md)

---

### Database Operations

**Create Migrations**
```bash
docker compose exec web python manage.py makemigrations
```

**Apply Migrations**
```bash
docker compose exec web python manage.py migrate
```

**Create Admin User**
```bash
docker compose exec web python manage.py createsuperuser
```

**Access Database**
```bash
docker compose exec mongo mongosh      # MongoDB
docker compose exec redis redis-cli    # Redis
```

[More Info →](SETUP_GUIDE.md#managing-services)

---

### Viewing Logs

**Web Service**
```bash
docker compose logs web -f
```

**Background Tasks**
```bash
docker compose logs celery_worker -f
```

**All Services**
```bash
docker compose logs -f
```

**Last 50 Lines**
```bash
docker compose logs --tail=50 web
```

[Details →](SETUP_GUIDE.md#view-logs)

---

### Stopping and Restarting

**Stop (Keep Data)**
```bash
docker compose stop
```

**Stop & Remove Containers (Keep Data)**
```bash
docker compose down
```

**Remove Everything (⚠️ Deletes Data)**
```bash
docker compose down -v
```

**Restart Service**
```bash
docker compose restart web
```

[More Commands →](QUICKSTART.md#📋-common-tasks)

---

## 🏗️ Project Structure

```
Q-Shaastra/
├── simulator/              # Django project container
├── home/                   # User management app
├── quantum_research/       # Research module
├── static/                 # CSS, JS, Images
├── templates/              # HTML templates
├── config/                 # Configuration files
├── docker-compose.yml      # Docker services definition
├── Dockerfile              # Docker image builder
└── Documentation Files (👇)
    ├── SETUP_GUIDE.md      # Complete setup instructions
    ├── QUICKSTART.md       # Quick reference
    ├── DEVELOPER_GUIDE.md  # Development instructions
    ├── DEPLOYMENT_CHECKLIST.md # Production deployment
    └── README.md           # This file
```

[Full Structure →](DEVELOPER_GUIDE.md#-project-structure)

---

## 🔧 System Architecture

```
┌─────────────┐
│   Browser   │
│ :8000       │
└──────┬──────┘
       │
┌──────▼──────────────────────────────┐
│        Docker Network               │
├─────────────────────────────────────┤
│                                      │
│  ┌────────────┐   ┌──────────────┐ │
│  │   Django   │   │  Redis       │ │
│  │ Gunicorn   │   │  Broker      │ │
│  │  :8000     │   │  :6379       │ │
│  └────────────┘   └──────────────┘ │
│                                      │
│  ┌────────────┐   ┌──────────────┐ │
│  │  MongoDB   │   │  Celery      │ │
│  │ Database   │   │  Workers     │ │
│  │  :27017    │   │              │ │
│  └────────────┘   └──────────────┘ │
│                                      │
│  ┌──────────────────────────────┐  │
│  │  Celery Beat                 │  │
│  │  (Scheduled Tasks)           │  │
│  └──────────────────────────────┘  │
│                                      │
└─────────────────────────────────────┘
```

---

## 📊 Key Services

| Service | Port | Purpose |
|---------|------|---------|
| Web (Django/Gunicorn) | 8000 | Main application |
| Redis | 6379 | Cache & message broker |
| MongoDB | 27017 | NoSQL database |
| Celery Worker | - | Async tasks |
| Celery Beat | - | Scheduled tasks |

---

## ✅ Verification Checklist

After starting the project, verify everything works:

```bash
# 1. Check all containers running
docker compose ps

# 2. Test web service
curl http://localhost:8000  # Should return HTML

# 3. Check admin panel
curl http://localhost:8000/admin/

# 4. View logs for errors
docker compose logs web | grep -i error

# 5. Check no critical errors
docker compose logs celery_worker | tail -20

# 6. Verify database
docker compose exec mongo mongosh
```

✅ **All green?** You're ready to go!

❌ **Issues?** Check [Troubleshooting →](SETUP_GUIDE.md#-troubleshooting)

---

## 🎯 Common Use Cases

### I need to...

**...add a new Django app**
1. Create app: `docker compose exec web python manage.py startapp myapp`
2. Add to INSTALLED_APPS in settings.py
3. Create models, views, templates
4. See: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#adding-new-django-app)

**...add a database model**
1. Edit models.py
2. Run: `docker compose exec web python manage.py makemigrations`
3. Run: `docker compose exec web python manage.py migrate`
4. See: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#creating-database-models)

**...create a background task**
1. Define in quantum_research/tasks.py using @shared_task
2. Schedule in simulator/celery.py (optional)
3. Call with .delay() in views
4. See: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md#background-tasks-with-celery)

**...deploy to production**
1. Follow [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. Review pre-deployment checklist
3. Follow deployment steps
4. Run post-deployment tests

**...debug an issue**
1. Check logs: `docker compose logs <service>`
2. Access shell: `docker compose exec web python manage.py shell`
3. See [SETUP_GUIDE.md#troubleshooting](SETUP_GUIDE.md#-troubleshooting)
4. See [DEVELOPER_GUIDE.md#debugging](DEVELOPER_GUIDE.md#-debugging)

**...run tests**
```bash
docker compose exec web python manage.py test
docker compose exec web python manage.py test home  # Specific app
```
See: [DEVELOPER_GUIDE.md#testing](DEVELOPER_GUIDE.md#-testing)

---

## 🔗 External Links

- **Django Docs**: https://docs.djangoproject.com/
- **Docker Docs**: https://docs.docker.com/
- **Celery Docs**: https://docs.celeryproject.org/
- **MongoDB Docs**: https://docs.mongodb.com/
- **Redis Docs**: https://redis.io/documentation

---

## 📱 Web Application URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home | http://localhost:8000/ | Landing page |
| Simulator | http://localhost:8000/simulator/ | Quantum simulator |
| Dashboard | http://localhost:8000/dashboard/ | User dashboard |
| Quantum News | http://localhost:8000/quantum-news/ | Research news |
| Admin | http://localhost:8000/admin/ | Django admin |
| Profile | http://localhost:8000/profile/ | User profile |
| API Docs | http://localhost:8000/api/ | API documentation |

---

## 🔐 Security Notes

### For Development
✅ Current `.env` settings are for development only
```
DEBUG=True
DJANGO_SECRET_KEY=freely visible
```

### Before Production
⚠️ **MUST UPDATE:**
```
DEBUG=False
DJANGO_SECRET_KEY=new secure key
ALLOWED_HOSTS_Q=your-domain.com
```

See: [DEPLOYMENT_CHECKLIST.md#security-checks](DEPLOYMENT_CHECKLIST.md#security-checks)

---

## 📞 Support & Issues

**For questions about:**

- **Setup & Installation**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Development**: See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **Deployment**: See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Quick Reference**: See [QUICKSTART.md](QUICKSTART.md)
- **Troubleshooting**: See [SETUP_GUIDE.md#troubleshooting](SETUP_GUIDE.md#-troubleshooting)

**Common Issues:**
- [Port already in use](SETUP_GUIDE.md#issue-2-port-already-in-use)
- [Database connection errors](SETUP_GUIDE.md#issue-3-database-connection-issues)
- [Migrations not applied](SETUP_GUIDE.md#issue-4-migrations-not-applied)
- [Static files not loading](SETUP_GUIDE.md#issue-5-static-files-not-loading)
- [Build failures](SETUP_GUIDE.md#issue-8-build-failures)

---

## 🎓 Learning Path

### Completely New to Project?
```
1. Read: README.md (you are here)
2. Read: QUICKSTART.md (5 min)
3. Start project: docker compose up -d
4. Access: http://localhost:8000
5. Read: SETUP_GUIDE.md (full understanding)
6. Explore codebase when comfortable
```

### Want to Develop?
```
1. Complete "Completely New to Project" above
2. Read: DEVELOPER_GUIDE.md
3. Follow examples in that guide
4. Look at existing code for patterns
5. Start coding!
```

### Ready to Deploy?
```
1. Complete development
2. Read: DEPLOYMENT_CHECKLIST.md
3. Follow all pre-deployment checks
4. Execute deployment steps
5. Run post-deployment tests
```

---

## 📈 Next Steps

### Immediate (Today)
- [ ] Read QUICKSTART.md
- [ ] Start the project: `docker compose up -d`
- [ ] Access http://localhost:8000
- [ ] Check admin panel: http://localhost:8000/admin/

### Short Term (This Week)
- [ ] Read SETUP_GUIDE.md completely
- [ ] Read DEVELOPER_GUIDE.md
- [ ] Understand project structure
- [ ] Run tests: `docker compose exec web python manage.py test`

### Medium Term (This Month)
- [ ] Make first code change
- [ ] Create custom app
- [ ] Add new model
- [ ] Create API endpoint

### Before Production
- [ ] Read DEPLOYMENT_CHECKLIST.md
- [ ] Complete all security checks
- [ ] Test thoroughly
- [ ] Deploy following checklist

---

## 💡 Tips & Tricks

```bash
# Quick status check
docker compose ps

# See what's happening in real-time
docker compose logs -f web

# Direct database access
docker compose exec mongo mongosh

# Run Python commands quickly
docker compose exec web python -c "print('test')"

# Access Django interactive shell
docker compose exec web python manage.py shell

# Run specific tests
docker compose exec web python manage.py test home.tests.UserTest

# Clear all Redis cache
docker compose exec redis redis-cli FLUSHALL

# View resource usage
docker stats

# Rebuild after code changes
docker compose build --no-cache
```

---

## 📅 Document History

| Document | Purpose | Audience | Read Time |
|----------|---------|----------|-----------|
| README.md (this file) | Overview & navigation | Everyone | 5 min |
| QUICKSTART.md | Fast start guide | Experienced devs | 2 min |
| SETUP_GUIDE.md | Complete instructions | Everyone | 30 min |
| DEVELOPER_GUIDE.md | Development reference | Developers | 20 min |
| DEPLOYMENT_CHECKLIST.md | Production deployment | DevOps/Producers | 25 min |

---

## 🎉 You're All Set!

Your Q-Shaastra project is ready to run!

**Start here:**
```bash
docker compose up -d
```

**Access the app:**
```
http://localhost:8000
```

**Need help?**
- Quick start: [QUICKSTART.md](QUICKSTART.md)
- Full setup: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Development: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- Production: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

---

**Project**: Q-Shaastra Quantum Research Platform  
**Version**: 1.0 - Production Ready  
**Last Updated**: March 19, 2026  
**Documentation Version**: 1.0

