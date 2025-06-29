from fastapi import APIRouter

from app.api.v1.endpoints import prompts, analyze, ideas

api_router = APIRouter()

api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(ideas.router, prefix="/ideas", tags=["ideas"]) 