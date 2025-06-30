from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import create_tables

# Load environment variables
load_dotenv()

# Create database tables
create_tables()

app = FastAPI(
    title="Promptify API",
    description="Backend API for Promptify application",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to Promptify API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    ) 