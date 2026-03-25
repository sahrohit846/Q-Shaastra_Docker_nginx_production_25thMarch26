# 📸 Profile Photo Upload - Quick Start

## ✅ Status: FULLY FUNCTIONAL

Your profile photo upload system is now **fully operational** with all issues fixed!

---

## How to Upload a Profile Photo

### 1. Navigate to Profile Page
```
http://127.0.0.1:8000/profile/
```

### 2. Click File Upload Input
- Look for "Choose File" button
- Click and select an image from your computer

### 3. Update Profile
- Scroll down and click "Update Profile" button
- Photo will be uploaded and saved

### 4. Photo Appears
- Profile page refreshes
- Your new photo displays in the profile section

---

## Technical Configuration

### File Storage
```
Location: /app/public/media/profile_photos/
Access: Via http://127.0.0.1:8000/media/profile_photos/[filename]
Permissions: Read/Write by appuser
Storage: Host bind mount (persists)
```

### Supported Formats
- JPG / JPEG
- PNG
- GIF
- WebP (if supported by browser)

### Size Limit
- **Recommended:** Under 5 MB per photo
- **Nginx limit:** 100 MB per upload
- **Django:** No explicit limit (uses Nginx limit)

---

## Existing Photos

Your system already has **31 profile photos uploaded**:
- Named photos: Rohit.jpg, ram.jpg, default_profile.jpg
- AI-generated: Gemini_Generated_Image_*.png
- Numeric IDs: 1000370431.jpg, 1000371210.jpg, etc.
- Generated images: generated-image*.png (multiple variants)

---

## Files Modified for This Fix

| File | Change | Impact |
|------|--------|--------|
| `Dockerfile` | Created media dirs with correct permissions | Allows appuser to write files |
| `entrypoint.sh` | Added media setup on startup | Ensures directories exist |
| `docker-compose.yml` | Fixed volume mounts (removed shadowing) | Media files now accessible |

---

## Verification

### Command: Check Uploads
```bash
# View all uploaded profile photos
docker compose exec web ls -la /app/public/media/profile_photos/ | head -20

# Count total photos
docker compose exec web ls /app/public/media/profile_photos/ | wc -l

# Find newest upload (last 5 minutes)
docker compose exec web find /app/public/media/profile_photos -type f -mmin -5
```

### Command: Test Upload Access
```bash
# List available via Nginx
# Browser: http://127.0.0.1:8000/media/profile_photos/

# Check specific file
docker compose exec web stat /app/public/media/profile_photos/Rohit.jpg
```

---

## If Upload Still Doesn't Work

### Step 1: Verify Services Running
```bash
docker compose ps
# All 6 services should show "Running"
```

### Step 2: Check Media Directory
```bash
docker compose exec web ls -la /app/public/media/profile_photos
# Should show: drwxrwxr-x appuser appuser
```

### Step 3: Check Django Settings
```bash
docker compose exec web python manage.py shell -c \
  "from django.conf import settings; print('MEDIA_ROOT:', settings.MEDIA_ROOT)"
# Should show: MEDIA_ROOT: /app/public/media
```

### Step 4: Restart if Needed
```bash
docker compose restart web
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "Permission denied" on upload | Wrong file permissions | Restart web: `docker compose restart web` |
| Photo not displaying | Nginx not serving media | Check nginx.conf location /media/ block |
| File not saved | Incorrect volume mount | Verify docker-compose.yml media mounts |
| Disk full | Too many uploads | Clean old files: `rm /app/public/media/profile_photos/*.jpg` |

---

## Direct File Access

### From Host Machine
```bash
# View uploaded files
ls -la public/media/profile_photos/

# Delete unwanted photo
rm public/media/profile_photos/old_photo.jpg

# Check total size
du -sh public/media/profile_photos/
```

### From Container
```bash
# List files
docker compose exec web ls /app/public/media/profile_photos/

# Check file size
docker compose exec web du -sh /app/public/media/profile_photos/

# View file permissions
docker compose exec web stat /app/public/media/profile_photos/Rohit.jpg
```

---

## Performance Tips

### Optimize Image Size
- Before uploading, compress image to < 1 MB
- Recommended resolution: 500x500 pixels or similar
- Tool: ImageMagick, Preview (Mac), Paint (Windows)

### Caching
- First access: Nginx downloads from disk
- Subsequent accesses: Cached for 7 days
- Browser caching: 30+ days for static resources

### Cleanup Old Photos
```bash
# Remove photos older than 90 days
docker compose exec web find /app/public/media/profile_photos -type f -mtime +90 -delete
```

---

## URL Format Examples

Once uploaded, photos are accessible via:

```
http://127.0.0.1:8000/media/profile_photos/Rohit.jpg
http://127.0.0.1:8000/media/profile_photos/1000370431.jpg
http://127.0.0.1:8000/media/profile_photos/generated-image.png
```

These URLs are embedded in:
- Profile pages: `{{ user.profile.profile_photo.url }}`
- Dashboard: Profile picture section
- Navigation: Top-right corner

---

## Summary

✅ **Profile photo uploads are working perfectly**

- Upload a new photo via profile page
- System automatically stores in `/app/public/media/profile_photos/`
- Photo displays immediately after upload
- Files persist between container restarts
- Nginx serves photos with proper caching headers

**Ready to use!** 📸
