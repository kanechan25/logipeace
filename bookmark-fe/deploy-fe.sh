#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

IMAGE_NAME="bookmark-frontend"
CONTAINER_NAME="bookmark-fe"
PORT="3000"

print_step() {
    echo -e "${BLUE}==== $1 ====${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_docker() {
    print_step "Checking Docker"
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

check_docker_compose() {
    print_step "Checking Docker Compose"
    if command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
    else
        print_error "Docker Compose is not available"
        exit 1
    fi
    print_success "Docker Compose is available: $DOCKER_COMPOSE_CMD"
}

cleanup() {
    print_step "Cleaning up existing containers and images"
    

    if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_warning "Stopping existing container: $CONTAINER_NAME"
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
    fi
    

    if docker images -q $IMAGE_NAME >/dev/null 2>&1; then
        print_warning "Removing existing image: $IMAGE_NAME"
        docker rmi $IMAGE_NAME || true
    fi
    
    print_success "Cleanup completed"
}

build_image() {
    print_step "Building Docker image"
    

    $DOCKER_COMPOSE_CMD build --no-cache
    
    print_success "Docker image built successfully"
}

deploy() {
    print_step "Deploying application"
    

    $DOCKER_COMPOSE_CMD up -d
    
    print_success "Application deployed successfully"
}

check_health() {
    print_step "Checking application health"
    

    echo "Waiting for application to start..."
    sleep 10
    

    if docker ps --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        print_success "Container is running"
    else
        print_error "Container failed to start"
        print_warning "Checking logs..."
        docker logs $CONTAINER_NAME
        exit 1
    fi
    

    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s http://localhost:$PORT/health >/dev/null 2>&1; then
            print_success "Application is healthy and responding"
            break
        else
            if [ $attempt -eq $max_attempts ]; then
                print_error "Application health check failed after $max_attempts attempts"
                print_warning "Checking logs..."
                docker logs $CONTAINER_NAME
                exit 1
            fi
            echo "Health check attempt $attempt/$max_attempts failed, retrying in 2 seconds..."
            sleep 2
            ((attempt++))
        fi
    done
}

show_info() {
    print_step "Deployment Information"
    echo -e "Application URL: ${GREEN}http://localhost:$PORT${NC}"
    echo -e "Container Name: ${GREEN}$CONTAINER_NAME${NC}"
    echo -e "Image Name: ${GREEN}$IMAGE_NAME${NC}"
    echo ""
    echo "Useful commands:"
    echo "  View logs:    docker logs $CONTAINER_NAME"
    echo "  Stop app:     $DOCKER_COMPOSE_CMD down"
    echo "  Restart app:  $DOCKER_COMPOSE_CMD restart"
    echo "  Update app:   $0"
}

main() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════╗"
    echo "║     Bookmark Frontend Deployment       ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_docker
    check_docker_compose
    cleanup
    build_image
    deploy
    check_health
    show_info
    
    print_success "Deployment completed successfully! 🚀"
}

case "${1:-}" in
    "clean")
        print_step "Clean deployment (removing all containers and images)"
        cleanup
        ;;
    "logs")
        docker logs -f $CONTAINER_NAME
        ;;
    "stop")
        print_step "Stopping application"
        $DOCKER_COMPOSE_CMD down
        print_success "Application stopped"
        ;;
    "restart")
        print_step "Restarting application"
        $DOCKER_COMPOSE_CMD restart
        print_success "Application restarted"
        ;;
    "status")
        print_step "Application Status"
        $DOCKER_COMPOSE_CMD ps
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  (no args)  Deploy the application"
        echo "  clean      Clean deployment (remove containers and images)"
        echo "  logs       Show application logs"
        echo "  stop       Stop the application"
        echo "  restart    Restart the application"
        echo "  status     Show application status"
        echo "  help       Show this help message"
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac