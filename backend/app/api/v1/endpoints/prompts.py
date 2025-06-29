from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.core.database import get_db, Prompt
from datetime import datetime
import uuid

router = APIRouter()

# Pydantic models for request/response
class DetectedStack(BaseModel):
    frontend: List[str]
    backend: List[str]
    database: List[str]
    additional: List[str]

class RecommendedTool(BaseModel):
    name: str
    description: str
    bestFor: List[str]
    promptStyle: str

class DevStructure(BaseModel):
    type: str
    name: str
    description: str
    pros: List[str]
    cons: List[str]
    bestFor: List[str]

class InfraTools(BaseModel):
    containerization: List[str]
    orchestration: List[str]
    cicd: List[str]
    monitoring: List[str]
    hosting: List[str]

class PromptCreate(BaseModel):
    project_idea: str
    detected_stack: DetectedStack
    recommended_tool: RecommendedTool
    dev_structure: DevStructure
    infra_tools: InfraTools
    generated_prompt: str
    final_prompt: str
    is_finalized: bool = False
    user_session: str

class PromptResponse(BaseModel):
    id: str
    project_idea: str
    detected_stack: DetectedStack
    recommended_tool: str
    dev_structure: DevStructure
    infra_tools: InfraTools
    generated_prompt: str
    final_prompt: str
    is_finalized: bool
    user_session: str
    created_at: str
    updated_at: str

class PromptUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

@router.get("/", response_model=List[PromptResponse])
async def get_prompts(session: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all prompts for a user session"""
    import json
    
    query = db.query(Prompt)
    if session:
        query = query.filter(Prompt.user_session == session)
    
    prompts = query.all()
    
    result = []
    for prompt in prompts:
        prompt_dict = {
            "id": prompt.id,
            "project_idea": prompt.project_idea,
            "detected_stack": json.loads(prompt.detected_stack),
            "recommended_tool": prompt.recommended_tool,
            "dev_structure": json.loads(prompt.dev_structure),
            "infra_tools": json.loads(prompt.infra_tools),
            "generated_prompt": prompt.generated_prompt,
            "final_prompt": prompt.final_prompt,
            "is_finalized": prompt.is_finalized == "true",
            "user_session": prompt.user_session,
            "created_at": prompt.created_at.isoformat(),
            "updated_at": prompt.updated_at.isoformat()
        }
        result.append(prompt_dict)
    
    return result

@router.post("/", response_model=PromptResponse)
async def create_prompt(prompt: PromptCreate, db: Session = Depends(get_db)):
    """Create a new prompt"""
    import json
    
    db_prompt = Prompt(
        project_idea=prompt.project_idea,
        detected_stack=json.dumps(prompt.detected_stack.dict()),
        recommended_tool=prompt.recommended_tool.name,
        dev_structure=json.dumps(prompt.dev_structure.dict()),
        infra_tools=json.dumps(prompt.infra_tools.dict()),
        generated_prompt=prompt.generated_prompt,
        final_prompt=prompt.final_prompt,
        is_finalized="true" if prompt.is_finalized else "false",
        user_session=prompt.user_session
    )
    
    db.add(db_prompt)
    db.commit()
    db.refresh(db_prompt)
    
    return {
        "id": db_prompt.id,
        "project_idea": db_prompt.project_idea,
        "detected_stack": json.loads(db_prompt.detected_stack),
        "recommended_tool": db_prompt.recommended_tool,
        "dev_structure": json.loads(db_prompt.dev_structure),
        "infra_tools": json.loads(db_prompt.infra_tools),
        "generated_prompt": db_prompt.generated_prompt,
        "final_prompt": db_prompt.final_prompt,
        "is_finalized": db_prompt.is_finalized == "true",
        "user_session": db_prompt.user_session,
        "created_at": db_prompt.created_at.isoformat(),
        "updated_at": db_prompt.updated_at.isoformat()
    }

@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(prompt_id: str, db: Session = Depends(get_db)):
    """Get a specific prompt by ID"""
    import json
    
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    return {
        "id": prompt.id,
        "project_idea": prompt.project_idea,
        "detected_stack": json.loads(prompt.detected_stack),
        "recommended_tool": prompt.recommended_tool,
        "dev_structure": json.loads(prompt.dev_structure),
        "infra_tools": json.loads(prompt.infra_tools),
        "generated_prompt": prompt.generated_prompt,
        "final_prompt": prompt.final_prompt,
        "is_finalized": prompt.is_finalized == "true",
        "user_session": prompt.user_session,
        "created_at": prompt.created_at.isoformat(),
        "updated_at": prompt.updated_at.isoformat()
    }

@router.delete("/{prompt_id}")
async def delete_prompt(prompt_id: str, db: Session = Depends(get_db)):
    """Delete a specific prompt"""
    prompt = db.query(Prompt).filter(Prompt.id == prompt_id).first()
    if not prompt:
        raise HTTPException(status_code=404, detail="Prompt not found")
    
    db.delete(prompt)
    db.commit()
    return {"message": "Prompt deleted successfully"} 