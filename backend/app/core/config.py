from pydantic_settings import BaseSettings
from typing import Optional
import os

def clean_database_url(url: str) -> str:
    """Clean DATABASE_URL by removing any prefixes that might be added by deployment platforms"""
    if not url:
        return url
    
    # Remove common prefixes that might be accidentally added
    prefixes_to_remove = ["DATABASE_URL=", "database_url=", "POSTGRES_URL=", "postgres_url="]
    
    for prefix in prefixes_to_remove:
        if url.startswith(prefix):
            cleaned_url = url[len(prefix):]
            print(f"DEBUG: Cleaned DATABASE_URL from '{url}' to '{cleaned_url}'")
            return cleaned_url
    
    return url

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Promptify API"
    
    # Database Settings
    _raw_database_url: Optional[str] = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/promptify")
    
    @property
    def DATABASE_URL(self) -> Optional[str]:
        return clean_database_url(self._raw_database_url) if self._raw_database_url else None
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # OpenAI Settings
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # CORS Settings
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    
    @property
    def BACKEND_CORS_ORIGINS(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 