#!/bin/bash
# Entry point script for Django application in Docker
# Handles setup (NLTK, migrations, static files) then runs any command

set -e

echo "[ENTRYPOINT] Starting Quantum Shaastra Application..."

# Ensure NLTK data exists (download to user-writable location)
echo "[ENTRYPOINT] Checking NLTK data..."
python << 'EOF'
import nltk
import os
import sys

# Try standard paths first, fall back to home directory for non-root
if os.access('/usr/local/share/nltk_data', os.W_OK):
    nltk_data_path = '/usr/local/share/nltk_data'
    print(f"[NLTK] Using system path: {nltk_data_path}", file=sys.stderr)
else:
    # Non-root user - download to home directory which NLTK searches
    nltk_data_path = os.path.expanduser('~/nltk_data')
    print(f"[NLTK] System path not writable, using user path: {nltk_data_path}", file=sys.stderr)

os.makedirs(nltk_data_path, exist_ok=True)

required_downloads = ['stopwords', 'punkt', 'punkt_tab', 'averaged_perceptron_tagger']
for resource in required_downloads:
    try:
        nltk.data.find(resource)
        print(f"✓ {resource} found")
    except LookupError:
        print(f"✗ {resource} missing, downloading to {nltk_data_path}...")
        try:
            nltk.download(resource, download_dir=nltk_data_path, quiet=True)
            print(f"✓ {resource} downloaded")
        except Exception as e:
            print(f"✗ Error downloading {resource}: {e}", file=sys.stderr)
            sys.exit(1)
EOF

# Ensure media and static directories exist and are writable
echo "[ENTRYPOINT] Setting up media and static directories..."
mkdir -p /app/public/media /app/staticfiles
chmod 755 /app/public/media /app/staticfiles

# Create required subdirectories for uploads
mkdir -p /app/public/media/profile_photos

# For web/gunicorn, run migrations and collect static files
# For celery/beat, just run NLTK setup above
if [[ "$*" == *"gunicorn"* ]] || [ $# -eq 0 ]; then
    echo "[ENTRYPOINT] Running migrations and collecting static files..."
    
    # Apply database migrations
    echo "[ENTRYPOINT] Applying database migrations..."
    if python manage.py showmigrations --plan 2>/dev/null | grep -q "\[ \]"; then
        python manage.py migrate --noinput
    else
        echo "[ENTRYPOINT] No pending migrations"
    fi

    # Collect static files
    echo "[ENTRYPOINT] Collecting static files..."
    python manage.py collectstatic --noinput --clear
else
    echo "[ENTRYPOINT] Skipping migrations for non-web service: $@"
fi

# Display important configuration
echo "[ENTRYPOINT] ============================================"
echo "[ENTRYPOINT] Configuration Loaded:"
echo "[ENTRYPOINT] DEBUG=${DEBUG}"
echo "[ENTRYPOINT] Executing: $@"
echo "[ENTRYPOINT] ============================================"

# If a command was provided, run it; otherwise start Gunicorn (default)
if [ $# -gt 0 ]; then
    echo "[ENTRYPOINT] Starting application..."
    exec "$@"
else
    echo "[ENTRYPOINT] No command provided, starting Gunicorn..."
    exec gunicorn simulator.wsgi:application \
        --bind 0.0.0.0:8000 \
        --workers 1 \
        --timeout 60 \
        --access-logfile - \
        --error-logfile -
fi
