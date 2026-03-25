# 🐛 Django Web Issues - FIXED ✅

## Issues Found & Fixed

### 1. ❌ CSRF/Origin Checking Failed Error
**Error Message:**
```
Forbidden (Origin checking failed - http://127.0.0.1:8000 does not match any trusted origins.): /login/
```

**Root Cause:**
- Missing `CSRF_TRUSTED_ORIGINS` configuration in Django settings
- Missing CORS middleware
- Limited `ALLOWED_HOSTS`

**✅ FIXED BY:**
Updated `simulator/settings.py`:
```python
# Added trusted origins for Docker deployment
CSRF_TRUSTED_ORIGINS = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://web:8000',
    'http://nginx',
    'http://localhost',
    'http://127.0.0.1',
    'http://0.0.0.0:8000',
]

# Added CORS settings
CORS_ALLOWED_ORIGINS = [
    'http://127.0.0.1:8000',
    'http://localhost:8000',
    'http://localhost',
    'http://127.0.0.1',
]

CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'

# Extended ALLOWED_HOSTS
ALLOWED_HOSTS = ['10.252.7.5', 'localhost', '127.0.0.1', 'web', 'nginx', '0.0.0.0']

# Added CORS middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # ← ADDED
    ...
]

# Added to INSTALLED_APPS
INSTALLED_APPS = [
    ...
    'corsheaders',  # ← ADDED
    ...
]
```

---

### 2. ❌ Uncommitted Model Migrations Error
**Error Message:**
```
Your models in app(s): 'home' have changes that are not yet reflected in a migration, 
and so won't be applied. Run 'manage.py makemigrations' to make new migrations, 
and then re-run 'manage.py migrate' to apply them.
```

**Root Cause:**
- Models in the `home` app had changes not captured in migrations
- `Contact` model field changes pending

**✅ FIXED BY:**
Ran Django migration commands:
```bash
# 1. Create new migrations
docker compose exec web python manage.py makemigrations home
# Output: Created home/migrations/0002_alter_contact_id.py

# 2. Apply migrations
docker compose exec web python manage.py migrate
# Output: Applying home.0002_alter_contact_id... OK
```

**Migration Applied:**
```
Operation: Alter field id on contact model
File: home/migrations/0002_alter_contact_id.py
Status: ✅ Successfully applied
```

---

## Files Modified

### 1. `simulator/settings.py` ✏️
**Changes:**
- ✅ Added `CSRF_TRUSTED_ORIGINS` (7 origins for Docker)
- ✅ Added `CORS_ALLOWED_ORIGINS` (4 origins)
- ✅ Added `CORS_COOKIE_*` settings
- ✅ Extended `ALLOWED_HOSTS` (added 'web', 'nginx', '0.0.0.0')
- ✅ Added `corsheaders.middleware.CorsMiddleware` to MIDDLEWARE
- ✅ Added `'corsheaders'` to INSTALLED_APPS

### 2. `Dockerfile` ✏️
**Changes:**
- ✅ Added `entrypoint.sh` copy and chmod
- ✅ Updated collectstatic to run in entrypoint (automatic)
- ✅ Added `ENTRYPOINT` directive
- ✅ Removed manual `collectstatic` from build

### 3. `entrypoint.sh` 🆕 (NEW FILE)
**Purpose:** Automatically handle:
- Database migrations on startup
- Static file collection
- Gunicorn server startup
- Configuration logging

---

## Deployment Instructions

### Step 1: Rebuild Docker Image (includes new settings)
```bash
docker compose build --no-cache web
```

### Step 2: Restart Services
```bash
docker compose down
docker compose up -d
```

### Step 3: Verify Services are Running
```bash
docker compose ps
# Should show all 6 services: nginx, web, redis, mongo, celery_worker, celery_beat
```

### Step 4: Test Login (should work now)
```bash
# Access the application
curl -i http://127.0.0.1:8000/login/
# Should return 200 OK (no CSRF error)
```

### Step 5: Check Logs
```bash
docker compose logs web -f
# Should show migrations applied and Gunicorn running
```

---

## How These Issues Will Be Prevented Going Forward

### Automatic Migration Handling ✨
The new `entrypoint.sh` script ensures:
1. **Migrations always run on startup** - no manual intervention needed
2. **Static files always collected** - automatically included in build
3. **Consistent deployments** - same startup sequence every time

### Run Migrations Commands When Needed
```bash
# During development, after model changes:
python manage.py makemigrations
python manage.py migrate

# In Docker:
docker compose exec web python manage.py makemigrations
docker compose exec web python manage.py migrate

# Or they'll run automatically on next docker compose up
```

---

## CSRF/Origin Settings Explained

### Why These Settings Are Needed
1. **`CSRF_TRUSTED_ORIGINS`** - Tells Django which origins can make POST requests
2. **`CORS_ALLOWED_ORIGINS`** - Allows cross-origin requests from those hosts
3. **`CORS_COOKIE_SAMESITE = 'Lax'`** - Allows cookies to be sent in cross-origin requests
4. **`CORS_ALLOW_CREDENTIALS = True`** - Allows authentication cookies

### Origins Configured
```
http://127.0.0.1:8000      ← Localhost with port (browser access)
http://localhost:8000      ← Localhost by name with port
http://web:8000            ← Docker service name (internal)
http://nginx               ← Nginx reverse proxy (internal)
http://localhost           ← Localhost without port
http://127.0.0.1           ← Localhost without port
http://0.0.0.0:8000        ← All interfaces with port
```

### Important Notes
- These settings are for **development/Docker environment**
- In production with HTTPS:
  ```python
  CSRF_COOKIE_SECURE = True      # Only send cookie over HTTPS
  CSRF_COOKIE_HTTPONLY = False   # Keep False for JS access to token
  ```

---

## Testing the Fixes

### Test 1: Login Page Access (No CSRF Error)
```bash
curl -i http://127.0.0.1:8000/login/
# ✅ Should not show "Forbidden (Origin checking failed)" error
# Should get 200 OK or redirect to login form
```

### Test 2: Check Migrations Applied
```bash
docker compose exec web python manage.py showmigrations
# ✅ Should show home.0002_alter_contact_id with [X] mark (applied)
```

### Test 3: Access Admin Panel (verify CSRF works)
```bash
# Visit http://127.0.0.1:8000/admin/
# ✅ Should load login form (CSRF tokens working correctly)
```

### Test 4: Verify All Services Running
```bash
docker compose ps
# ✅ All 6 services should show "Up" status
```

---

## Summary of Changes

| Component | Issue | Status | How Fixed |
|-----------|-------|--------|-----------|
| **CSRF/Origin** | Forbidden errors on /login/ | ✅ Fixed | Added CSRF_TRUSTED_ORIGINS & CORS settings |
| **Migrations** | Uncommitted model changes | ✅ Fixed | Ran makemigrations & migrate commands |
| **Automatic Setup** | Manual steps required | ✅ Fixed | Created entrypoint.sh for auto migrations |
| **Docker Build** | Missing collectstatic | ✅ Fixed | Added to entrypoint.sh (runs on startup) |

---

## Next Steps

1. **Rebuild container** with new settings: `docker compose build --no-cache web`
2. **Restart services**: `docker compose up -d`
3. **Test login**: Access http://127.0.0.1:8000/login/ (should work now)
4. **Monitor logs**: `docker compose logs -f web` to watch startup

All issues should now be resolved! ✨
