#!/bin/bash

# Development script for Promptify monorepo

echo "🚀 Starting Promptify development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Function to start services
start_services() {
    echo "📦 Starting services with Docker Compose..."
    docker-compose up --build
}

# Function to start only backend
start_backend() {
    echo "🐍 Starting FastAPI backend..."
    cd backend
    if [ ! -d "venv" ]; then
        echo "Creating virtual environment..."
        python -m venv venv
    fi
    source venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Function to start only frontend
start_frontend() {
    echo "⚛️ Starting Next.js frontend..."
    cd frontend
    pnpm install
    pnpm dev
}

# Parse command line arguments
case "$1" in
    "backend")
        start_backend
        ;;
    "frontend")
        start_frontend
        ;;
    "all"|"")
        start_services
        ;;
    *)
        echo "Usage: $0 [backend|frontend|all]"
        echo "  backend  - Start only FastAPI backend"
        echo "  frontend - Start only Next.js frontend"
        echo "  all      - Start all services with Docker Compose (default)"
        exit 1
        ;;
esac 