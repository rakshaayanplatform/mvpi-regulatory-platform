FROM python:3.11-slim

WORKDIR /app

# Install system dependencies in a single layer to reduce image size
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libmagic1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better Docker layer caching
COPY requirements.txt .

# Install Python dependencies with optimized flags
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8000

# Run application
CMD ["gunicorn", "media_service.wsgi:application", "--bind", "0.0.0.0:8000"] 