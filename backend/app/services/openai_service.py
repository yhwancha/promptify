import json
from typing import Dict, Any, Optional
from openai import OpenAI
from app.core.config import settings

class OpenAIService:
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is not set in environment variables")
        
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def analyze_project(self, project_idea: str, language: str = "en") -> Dict[str, Any]:
        """Analyze project idea using OpenAI GPT-4"""
        
        prompt = f"""
        You are a software development expert. Please analyze the following project idea and provide recommendations:

        Project Idea: "{project_idea}"

        Please analyze the following aspects:
        1. Most suitable tech stack (including specific frameworks/libraries)
        2. Best AI coding tool for this project
        3. Recommended development structure
        4. Recommended infrastructure tools
        5. Generate a detailed and executable prompt tailored to the selected tool's style

        AI Tool Guidelines:
        - v0.dev: Optimized for React/Next.js UI components, requires specific component requests
        - Cursor.ai: Optimized for full-stack applications, prefers detailed file structure
        - GPT Engineer: Optimized for building complete applications from scratch, prefers high-level descriptions
        - Claude Dev: Optimized for complex logic and architecture, prefers step-by-step analysis

        Development Structure Options:
        - monorepo: Managing multiple projects/packages in a single repository
        - microservices: Architecture separated into independent services
        - separated: Complete separation of frontend/backend
        - single-repo: Traditional single application structure

        Infrastructure Tool Categories:
        - containerization: Docker, Podman, etc.
        - orchestration: Docker Compose, Kubernetes, etc.
        - cicd: GitHub Actions, GitLab CI, Jenkins, etc.
        - monitoring: Prometheus, Grafana, Sentry, etc.
        - hosting: Vercel, Netlify, AWS, GCP, etc.

        {{
            "detectedStack": {{
                "frontend": ["tech1", "tech2"],
                "backend": ["tech1", "tech2"],
                "database": ["tech1", "tech2"],
                "deployment": ["tech1", "tech2"],
                "additional": ["tech1", "tech2"]
            }},
            "recommendedTool": {{
                "name": "tool_name",
                "description": "description",
                "bestFor": ["use1", "use2"],
                "promptStyle": "style description"
            }},
            "devStructure": {{
                "type": "structure_type",
                "name": "structure_name",
                "description": "description",
                "pros": ["pro1", "pro2"],
                "cons": ["con1", "con2"],
                "bestFor": ["best_use1", "best_use2"]
            }},
            "infraTools": {{
                "containerization": ["tool1", "tool2"],
                "orchestration": ["tool1", "tool2"],
                "cicd": ["tool1", "tool2"],
                "monitoring": ["tool1", "tool2"],
                "hosting": ["tool1", "tool2"]
            }},
            "generatedPrompt": "detailed prompt content",
            "reasoning": "reasoning for recommendations"
        }}
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a software development expert who provides detailed project analysis and recommendations."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Parse the JSON response
            content = response.choices[0].message.content
            
            # Try to extract JSON from the response
            try:
                # Find JSON content between curly braces
                start_idx = content.find('{')
                end_idx = content.rfind('}') + 1
                json_content = content[start_idx:end_idx]
                
                result = json.loads(json_content)
                return result
                
            except (json.JSONDecodeError, ValueError) as e:
                # If JSON parsing fails, return a fallback response
                return self._get_fallback_response(project_idea)
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Return fallback response on API error
            return self._get_fallback_response(project_idea)
    
    def _get_fallback_response(self, project_idea: str) -> Dict[str, Any]:
        """Fallback response when OpenAI API fails"""
        return {
            "detectedStack": {
                "frontend": ["React", "Next.js", "TypeScript"],
                "backend": ["FastAPI", "Python"],
                "database": ["PostgreSQL"],
                "deployment": ["Docker", "Vercel"],
                "additional": ["Tailwind CSS", "ESLint"]
            },
            "recommendedTool": {
                "name": "Cursor.ai",
                "description": "Optimal for full-stack application development",
                "bestFor": ["Full-stack Apps", "File Structure", "Code Integration"],
                "promptStyle": "Detailed file structure and implementation"
            },
            "devStructure": {
                "type": "monorepo",
                "name": "Monorepo Structure",
                "description": "Single repository managing multiple projects and packages",
                "pros": ["Unified tooling", "Easy refactoring", "Shared dependencies"],
                "cons": ["Large repository size", "Build complexity"],
                "bestFor": ["Multiple related projects", "Shared components"]
            },
            "infraTools": {
                "containerization": ["Docker", "Docker Compose"],
                "orchestration": ["Docker Compose"],
                "cicd": ["GitHub Actions"],
                "monitoring": ["Basic logging"],
                "hosting": ["Vercel", "Netlify"]
            },
            "generatedPrompt": f"Create a {project_idea} application with modern tech stack including React, Next.js, FastAPI, and PostgreSQL. Set up a monorepo structure with proper containerization using Docker.",
            "reasoning": "Based on modern web development best practices, this stack provides excellent developer experience and scalability."
        }

# Create a singleton instance
openai_service = OpenAIService() if settings.OPENAI_API_KEY else None 