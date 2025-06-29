from sqlalchemy import create_engine, Column, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from datetime import datetime
import uuid
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://promptify:password@localhost:5432/promptify")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Idea(Base):
    __tablename__ = "ideas"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    tags = Column(ARRAY(String), default=[])
    user_session = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    comments = relationship("Comment", back_populates="idea", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    idea_id = Column(String, ForeignKey("ideas.id"), nullable=False)
    content = Column(Text, nullable=False)
    user_session = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    idea = relationship("Idea", back_populates="comments")

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_idea = Column(Text, nullable=False)
    detected_stack = Column(Text, nullable=False)  # JSON string
    recommended_tool = Column(String, nullable=False)
    dev_structure = Column(Text, nullable=False)  # JSON string
    infra_tools = Column(Text, nullable=False)  # JSON string
    generated_prompt = Column(Text, nullable=False)
    final_prompt = Column(Text, nullable=False)
    is_finalized = Column(String, default="false")  # Store as string
    user_session = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine) 