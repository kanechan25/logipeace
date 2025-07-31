#!/bin/bash

set -e 

echo "🚀 Starting Bookmark Backend Deployment..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

if ! command -v docker-compose > /dev/null 2>&1; then
    print_error "Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

print_status "Docker and Docker Compose are available ✅"

print_status "Stopping existing containers..."
docker-compose down --remove-orphans 2>/dev/null || true


print_status "Building Docker image..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    print_success "Docker image built successfully!"
else
    print_error "Failed to build Docker image"
    exit 1
fi

print_status "Starting services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    print_success "Services started successfully!"
else
    print_error "Failed to start services"
    exit 1
fi

print_status "Waiting for service to be healthy..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose ps | grep -q "Up (healthy)"; then
        print_success "Service is healthy!"
        break
    fi
    
    if [ $attempt -eq $((max_attempts - 1)) ]; then
        print_warning "Service health check timeout. Service might still be starting..."
        break
    fi
    
    sleep 2
    attempt=$((attempt + 1))
    echo -n "."
done

echo ""

print_status "Container status:"
docker-compose ps

print_status "Recent logs:"
docker-compose logs --tail=20 bookmark-backend

echo ""
print_success "🎉 Deployment completed!"
echo ""
echo "📊 Service Information:"
echo "  • Backend API: http://localhost:3001"
echo "  • Test API: http://localhost:3001/api/v1/bookmarks?page=1&limit=20"
echo "  • API Documentation: http://localhost:3001/api/docs"
echo "  • Container name: bookmark-be"
echo ""
echo "🔧 Useful commands:"
echo "  • View logs: docker-compose logs -f bookmark-backend"
echo "  • Stop services: docker-compose down"
echo "  • Restart services: docker-compose restart"
echo "  • View container status: docker-compose ps"
echo ""

# Test the API endpoint
print_status "Testing API endpoint..."
sleep 3

if curl -f -s http://localhost:3001 > /dev/null; then
    print_success "✅ API is responding!"
    echo "  • Test: curl http://localhost:3001"
    echo "  • Swagger: http://localhost:3001/api/docs"
else
    print_warning "⚠️  API might still be starting up. Please check logs if issues persist."
    echo "  • Check logs: docker-compose logs bookmark-backend"
fi

echo ""
print_success "Deployment script completed! 🚀"