#!/bin/bash

# Development script for Promptify monorepo

echo "🚀 Starting Promptify development environment..."

# Function to start both services in development mode
start_services() {
    echo "🔧 Starting development servers..."
    
    # Start backend in background
    echo "🐍 Starting FastAPI backend..."
    cd backend
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python3 -m venv venv
    fi
    source venv/bin/activate
    echo "📥 Installing backend dependencies..."
    pip install -r requirements.txt
    echo "🚀 Starting FastAPI server on port 8000..."
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend in background
    echo "⚛️ Starting Next.js frontend..."
    cd frontend
    echo "📥 Installing frontend dependencies..."
    pnpm install
    echo "🚀 Starting Next.js server on port 3000..."
    pnpm dev &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Development servers started!"
    echo "Frontend: http://localhost:3000"
    echo "Backend: http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all servers..."
    
    # Function to cleanup on exit
    cleanup() {
        echo "🛑 Stopping servers..."
        kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
        echo "✅ Servers stopped"
        exit 0
    }
    
    # Trap Ctrl+C
    trap cleanup INT
    
    # Wait for user to press Ctrl+C
    wait
}

# Function to start only backend
start_backend() {
    echo "🐍 Starting FastAPI backend..."
    cd backend
    if [ ! -d "venv" ]; then
        echo "📦 Creating virtual environment..."
        python3 -m venv venv
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
        echo "  all      - Start both services (default)"
        exit 1
        ;;
esac 