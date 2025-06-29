from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import get_db, Idea, Comment
import uuid

router = APIRouter()

# Pydantic models
class CommentCreate(BaseModel):
    content: str
    idea_id: str
    user_session: str

class CommentResponse(BaseModel):
    id: str
    idea_id: str
    content: str
    user_session: str
    created_at: str

class IdeaCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    tags: List[str] = []
    user_session: str

class IdeaResponse(BaseModel):
    id: str
    title: str
    description: str
    category: Optional[str] = None
    tags: List[str] = []
    user_session: str
    created_at: str
    updated_at: str
    comments: List[CommentResponse] = []

class IdeaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

@router.get("/", response_model=List[IdeaResponse])
async def get_ideas(session: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all ideas for a user session"""
    query = db.query(Idea)
    if session:
        query = query.filter(Idea.user_session == session)
    
    ideas = query.all()
    
    # Convert to response format
    result = []
    for idea in ideas:
        idea_dict = {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "category": idea.category,
            "tags": idea.tags or [],
            "user_session": idea.user_session,
            "created_at": idea.created_at.isoformat(),
            "updated_at": idea.updated_at.isoformat(),
            "comments": [
                {
                    "id": comment.id,
                    "idea_id": comment.idea_id,
                    "content": comment.content,
                    "user_session": comment.user_session,
                    "created_at": comment.created_at.isoformat()
                }
                for comment in idea.comments
            ]
        }
        result.append(idea_dict)
    
    return result

@router.post("/", response_model=IdeaResponse)
async def create_idea(idea: IdeaCreate, db: Session = Depends(get_db)):
    """Create a new idea"""
    db_idea = Idea(
        title=idea.title,
        description=idea.description,
        category=idea.category,
        tags=idea.tags,
        user_session=idea.user_session
    )
    
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    
    return {
        "id": db_idea.id,
        "title": db_idea.title,
        "description": db_idea.description,
        "category": db_idea.category,
        "tags": db_idea.tags or [],
        "user_session": db_idea.user_session,
        "created_at": db_idea.created_at.isoformat(),
        "updated_at": db_idea.updated_at.isoformat(),
        "comments": []
    }

@router.get("/{idea_id}", response_model=IdeaResponse)
async def get_idea(idea_id: str, db: Session = Depends(get_db)):
    """Get a specific idea by ID"""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    return {
        "id": idea.id,
        "title": idea.title,
        "description": idea.description,
        "category": idea.category,
        "tags": idea.tags or [],
        "user_session": idea.user_session,
        "created_at": idea.created_at.isoformat(),
        "updated_at": idea.updated_at.isoformat(),
        "comments": [
            {
                "id": comment.id,
                "idea_id": comment.idea_id,
                "content": comment.content,
                "user_session": comment.user_session,
                "created_at": comment.created_at.isoformat()
            }
            for comment in idea.comments
        ]
    }

@router.put("/{idea_id}", response_model=IdeaResponse)
async def update_idea(idea_id: str, idea_update: IdeaUpdate, db: Session = Depends(get_db)):
    """Update a specific idea"""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    # Update only provided fields
    if idea_update.title is not None:
        idea.title = idea_update.title
    if idea_update.description is not None:
        idea.description = idea_update.description
    if idea_update.category is not None:
        idea.category = idea_update.category
    if idea_update.tags is not None:
        idea.tags = idea_update.tags
    
    idea.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(idea)
    
    return {
        "id": idea.id,
        "title": idea.title,
        "description": idea.description,
        "category": idea.category,
        "tags": idea.tags or [],
        "user_session": idea.user_session,
        "created_at": idea.created_at.isoformat(),
        "updated_at": idea.updated_at.isoformat(),
        "comments": [
            {
                "id": comment.id,
                "idea_id": comment.idea_id,
                "content": comment.content,
                "user_session": comment.user_session,
                "created_at": comment.created_at.isoformat()
            }
            for comment in idea.comments
        ]
    }

@router.delete("/{idea_id}")
async def delete_idea(idea_id: str, db: Session = Depends(get_db)):
    """Delete a specific idea"""
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    db.delete(idea)  # This will also delete comments due to cascade
    db.commit()
    return {"message": "Idea deleted successfully"}

@router.post("/{idea_id}/comments", response_model=CommentResponse)
async def add_comment(idea_id: str, comment: CommentCreate, db: Session = Depends(get_db)):
    """Add a comment to an idea"""
    # Check if idea exists
    idea = db.query(Idea).filter(Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    
    db_comment = Comment(
        idea_id=idea_id,
        content=comment.content,
        user_session=comment.user_session
    )
    
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return {
        "id": db_comment.id,
        "idea_id": db_comment.idea_id,
        "content": db_comment.content,
        "user_session": db_comment.user_session,
        "created_at": db_comment.created_at.isoformat()
    }

@router.get("/{idea_id}/comments", response_model=List[CommentResponse])
async def get_comments(idea_id: str, db: Session = Depends(get_db)):
    """Get all comments for an idea"""
    comments = db.query(Comment).filter(Comment.idea_id == idea_id).all()
    return [
        {
            "id": comment.id,
            "idea_id": comment.idea_id,
            "content": comment.content,
            "user_session": comment.user_session,
            "created_at": comment.created_at.isoformat()
        }
        for comment in comments
    ]

@router.delete("/comments/{comment_id}")
async def delete_comment(comment_id: str, db: Session = Depends(get_db)):
    """Delete a comment"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"} 