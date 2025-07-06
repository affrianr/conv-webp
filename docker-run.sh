#!/bin/bash

# Exit on error
set -e

echo "🔨 Building Docker image..."
docker-compose build

echo "🚀 Starting container..."
docker-compose up -d

echo "✅ Application is running at http://localhost:3000"
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"