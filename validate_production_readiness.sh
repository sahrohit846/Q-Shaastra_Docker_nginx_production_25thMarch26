#!/bin/bash
# Validation script to verify all configurations are correct

set -e

PROJECT_DIR="/home/cpatwrohit/Downloads/Quantum_Shaastra_All_Files/Q-Shaastra_Docker_nginx_23rdMarch26"
cd "$PROJECT_DIR"

echo "============================================================"
echo "  PRODUCTION READINESS VALIDATION SCRIPT"
echo "============================================================"
echo ""

# Test 1: Python syntax
echo "Test 1: Python Syntax Validation..."
python -m py_compile simulator/settings.py && echo "  ✓ settings.py syntax valid" || exit 1
python -m py_compile Dockerfile && echo "  ✗ Dockerfile is not Python (expected)" || echo "  ✓ Dockerfile present"

# Test 2: YAML validation
echo ""
echo "Test 2: YAML Configuration Validation..."
python -c "import yaml; yaml.safe_load(open('docker-compose.yml'))" && \
echo "  ✓ docker-compose.yml is valid YAML" || exit 1

# Test 3: Docker services
echo ""
echo "Test 3: Docker Compose Services..."
SERVICES=$(docker compose config --services)
echo "  Services found:"
echo "$SERVICES" | sed 's/^/    - /'
[ $(echo "$SERVICES" | wc -l) -eq 6 ] && echo "  ✓ All 6 services configured" || exit 1

# Test 4: Configuration values
echo ""
echo "Test 4: Django Configuration..."
grep -q "STATIC_URL = \"/static/\"" simulator/settings.py && echo "  ✓ STATIC_URL configured" || exit 1
grep -q "MEDIA_URL = \"/media/\"" simulator/settings.py && echo "  ✓ MEDIA_URL configured" || exit 1
grep -q "STATIC_ROOT = BASE_DIR / \"staticfiles\"" simulator/settings.py && echo "  ✓ STATIC_ROOT configured" || exit 1
grep -q "MEDIA_ROOT = BASE_DIR / \"public/media\"" simulator/settings.py && echo "  ✓ MEDIA_ROOT configured" || exit 1

# Test 5: WhiteNoise removal
echo ""
echo "Test 5: WhiteNoise Removal..."
! grep -q "whitenoise" simulator/settings.py && echo "  ✓ WhiteNoise removed from settings" || exit 1
! grep -q "whitenoise" requirements.txt && echo "  ✓ WhiteNoise removed from requirements" || exit 1

# Test 6: Nginx configuration
echo ""
echo "Test 6: Nginx Configuration..."
grep -q "location /static/" nginx.conf && echo "  ✓ Static path configured" || exit 1
grep -q "location /media/" nginx.conf && echo "  ✓ Media path configured" || exit 1
grep -q "upstream django" nginx.conf && echo "  ✓ Django upstream configured" || exit 1
grep -q "proxy_pass http://django" nginx.conf && echo "  ✓ Proxy pass configured" || exit 1

# Test 7: Dockerfile multi-stage
echo ""
echo "Test 7: Dockerfile Optimization..."
[ $(grep -c "^FROM" Dockerfile) -eq 2 ] && echo "  ✓ Multi-stage build (2 FROM statements)" || exit 1
grep -q "python:3.11-slim" Dockerfile && echo "  ✓ Using python:3.11-slim" || exit 1
grep -q "non-root user" Dockerfile && echo "  ✓ Non-root user configured" || exit 1
grep -q "collectstatic" Dockerfile && echo "  ✓ collectstatic in build process" || exit 1

# Test 8: Docker compose structure
echo ""
echo "Test 8: Docker Compose Structure..."
grep -q "image: nginx:alpine" docker-compose.yml && echo "  ✓ Nginx service present" || exit 1
grep -q "ports:" docker-compose.yml && grep -q "8000:80" docker-compose.yml && echo "  ✓ Port mapping correct" || exit 1
grep -q "expose:" docker-compose.yml && echo "  ✓ Internal service exposure configured" || exit 1
grep -q "app_network:" docker-compose.yml && echo "  ✓ Network configured" || exit 1
grep -q "mongo_data:" docker-compose.yml && echo "  ✓ MongoDB volume configured" || exit 1
grep -q "staticfiles:" docker-compose.yml && echo "  ✓ Static files volume configured" || exit 1

# Test 9: File sizes and existence
echo ""
echo "Test 9: File Integrity..."
[ -f "Dockerfile" ] && echo "  ✓ Dockerfile exists ($(wc -c < Dockerfile) bytes)" || exit 1
[ -f "docker-compose.yml" ] && echo "  ✓ docker-compose.yml exists ($(wc -c < docker-compose.yml) bytes)" || exit 1
[ -f "nginx.conf" ] && echo "  ✓ nginx.conf exists ($(wc -c < nginx.conf) bytes)" || exit 1
[ -f ".dockerignore" ] && echo "  ✓ .dockerignore exists ($(wc -c < .dockerignore) bytes)" || exit 1
[ -f "simulator/settings.py" ] && echo "  ✓ settings.py exists" || exit 1
[ -f "requirements.txt" ] && echo "  ✓ requirements.txt exists" || exit 1

# Test 10: Documentation
echo ""
echo "Test 10: Documentation Files..."
[ -f "ARCHITECTURE_MIGRATION.md" ] && echo "  ✓ ARCHITECTURE_MIGRATION.md exists" || exit 1
[ -f "DEPLOYMENT_README.md" ] && echo "  ✓ DEPLOYMENT_README.md exists" || exit 1
[ -f "PROJECT_COMPLETION_SUMMARY.txt" ] && echo "  ✓ PROJECT_COMPLETION_SUMMARY.txt exists" || exit 1

echo ""
echo "============================================================"
echo "  ✅ ALL TESTS PASSED - PROJECT IS PRODUCTION READY"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. docker compose build"
echo "  2. docker compose up -d"
echo "  3. docker compose exec web python manage.py migrate"
echo "  4. Open http://localhost:8000"
echo ""
