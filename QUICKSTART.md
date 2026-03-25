# Q-Shaastra Quick Start Guide

## ⚡ 5-Minute Quick Start

### 1️⃣ Start the Project
```bash
cd /home/cpatwrohit/Downloads/Quantum_Shaastra_All_Files/Q-Shaastra_Docker_Production_19thMarch26
docker compose up -d
```

### 2️⃣ Verify It's Running
```bash
docker compose ps
# All 5 containers should show "Up"
```

### 3️⃣ Access the Application
```
Web App:   http://localhost:8000
Admin:     http://localhost:8000/admin/
Simulator: http://localhost:8000/simulator/
News:      http://localhost:8000/quantum-news/
```

### 4️⃣ Default Admin Login
```
Username: admin
Password: admin123
```

---

## 📋 Common Tasks

### View Logs
```bash
docker compose logs web -f          # Django app logs
docker compose logs celery_worker   # Background tasks
docker compose logs mongo           # Database logs
```

### Stop Everything
```bash
docker compose stop    # Save data
docker compose down    # Remove containers (keep volumes)
docker compose down -v # Remove everything including data ⚠️
```

### Apply Database Migrations
```bash
docker compose exec web python manage.py migrate
docker compose exec web python manage.py makemigrations
```

### Create Admin User
```bash
docker compose exec web python manage.py createsuperuser
```

### Restart Web Service
```bash
docker compose restart web
```

### View Real-time Logs
```bash
docker compose logs -f web
```

### Access Application Shell
```bash
docker compose exec web python manage.py shell
```

---

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Containers won't start | `docker compose logs` to check errors |
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |
| Database not connecting | `docker compose restart mongo redis` |
| Static files missing | `docker compose exec web python manage.py collectstatic --noinput` |
| Migrations pending | `docker compose exec web python manage.py migrate` |
| Need fresh start | `docker compose down -v && docker compose up -d` |

---

## 📊 Services Running

```
Web Service (Django)     → http://localhost:8000
Redis Cache             → localhost:6379
MongoDB                 → localhost:27017
Celery Worker           → Background tasks
Celery Beat             → Scheduled tasks
```

---

## 🔗 Full Setup Guide
See `SETUP_GUIDE.md` for comprehensive documentation

---

**Status**: ✅ All services running
**Access**: http://localhost:8000
**Admin**: http://localhost:8000/admin/
