# Multi-stage build: optimize for production
FROM python:3.11-slim as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install system dependencies (minimal for builder)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip --no-cache-dir && \
    sed -i '/djongo/d' requirements.txt && \
    pip install -r requirements.txt --no-cache-dir && \
    pip install djongo==1.3.7 --no-deps --no-cache-dir

# Final stage: slim image with only runtime dependencies
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/venv/bin:$PATH"

# Set the working directory
WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Set Python environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Copy project files
COPY . /app/

# Ensure entrypoint script has execute permissions and verify
RUN chmod +x /app/entrypoint.sh && test -x /app/entrypoint.sh || (echo "ERROR: entrypoint.sh not executable" && exit 1)

# Create media and static directories with proper permissions BEFORE changing user
RUN mkdir -p /app/public/media /app/staticfiles && \
    chmod 755 /app/public && \
    chmod 755 /app/public/media && \
    chmod 755 /app/staticfiles

# Create non-root user for security
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port 8000 (for Gunicorn, Nginx will proxy)
EXPOSE 8000

# Use entrypoint script for automatic migrations and startup
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command (can be overridden by docker-compose)
CMD ["gunicorn", "simulator.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--timeout", "60"]
