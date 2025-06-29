from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.services.openai_service import openai_service

router = APIRouter()

# Pydantic models for request/response
class AnalyzeRequest(BaseModel):
    text: str
    analysis_type: str = "general"  # general, sentiment, keywords, etc.
    options: Optional[Dict[str, Any]] = {}

class ProjectAnalyzeRequest(BaseModel):
    project_idea: str
    language: str = "en"
    custom_data: Optional[Dict[str, Any]] = None

class TechStack(BaseModel):
    frontend: List[str]
    backend: List[str]
    database: List[str]
    deployment: List[str]
    additional: List[str]

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

class AITool(BaseModel):
    name: str
    description: str
    bestFor: List[str]
    promptStyle: str

class ProjectAnalyzeResponse(BaseModel):
    detectedStack: TechStack
    recommendedTool: AITool
    devStructure: DevStructure
    infraTools: InfraTools
    generatedPrompt: str
    reasoning: str

class AnalyzeResponse(BaseModel):
    text: str
    analysis_type: str
    results: Dict[str, Any]
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = {}

@router.post("/", response_model=AnalyzeResponse)
async def analyze_text(request: AnalyzeRequest):
    """Analyze text based on the specified analysis type"""
    
    # Mock analysis logic (replace with actual AI/ML models)
    results = {}
    
    if request.analysis_type == "sentiment":
        # Mock sentiment analysis
        results = {
            "sentiment": "positive",
            "score": 0.8,
            "emotions": {
                "joy": 0.7,
                "anger": 0.1,
                "sadness": 0.1,
                "fear": 0.1
            }
        }
    elif request.analysis_type == "keywords":
        # Mock keyword extraction
        words = request.text.lower().split()
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        results = {
            "keywords": sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5],
            "total_words": len(words),
            "unique_words": len(word_freq)
        }
    elif request.analysis_type == "readability":
        # Mock readability analysis
        sentences = request.text.split('.')
        words = request.text.split()
        
        results = {
            "readability_score": 7.5,
            "grade_level": "7th-8th grade",
            "sentence_count": len(sentences),
            "word_count": len(words),
            "avg_words_per_sentence": len(words) / max(len(sentences), 1)
        }
    else:
        # General analysis
        results = {
            "character_count": len(request.text),
            "word_count": len(request.text.split()),
            "sentence_count": len(request.text.split('.')),
            "paragraph_count": len(request.text.split('\n\n')),
            "language": "detected_language"
        }
    
    return AnalyzeResponse(
        text=request.text,
        analysis_type=request.analysis_type,
        results=results,
        confidence=0.85,
        metadata={
            "processing_time": "0.123s",
            "model_version": "1.0.0"
        }
    )

@router.post("/project", response_model=ProjectAnalyzeResponse)
async def analyze_project(request: ProjectAnalyzeRequest):
    """Analyze project idea and provide comprehensive recommendations"""
    
    # If custom_data is provided, generate prompt based on edited data
    if request.custom_data:
        return _generate_prompt_from_custom_data(request.project_idea, request.custom_data)
    
    # Check if OpenAI service is available
    if not openai_service:
        raise HTTPException(
            status_code=503,
            detail="OpenAI service is not available. Please configure OPENAI_API_KEY in environment variables."
        )
    
    try:
        # Use OpenAI service for project analysis
        analysis_result = await openai_service.analyze_project(
            project_idea=request.project_idea,
            language=request.language
        )
        
        # Convert the analysis result to response models
        detected_stack = TechStack(**analysis_result["detectedStack"])
        recommended_tool = AITool(**analysis_result["recommendedTool"])
        dev_structure = DevStructure(**analysis_result["devStructure"])
        infra_tools = InfraTools(**analysis_result["infraTools"])
        
        return ProjectAnalyzeResponse(
            detectedStack=detected_stack,
            recommendedTool=recommended_tool,
            devStructure=dev_structure,
            infraTools=infra_tools,
            generatedPrompt=analysis_result["generatedPrompt"],
            reasoning=analysis_result["reasoning"]
        )
        
    except Exception as e:
        # Fallback to mock analysis if OpenAI fails
        print(f"OpenAI analysis failed: {e}")
        return _get_mock_analysis(request.project_idea)

def _generate_prompt_from_custom_data(project_idea: str, custom_data: Dict[str, Any]) -> ProjectAnalyzeResponse:
    """Generate a new prompt based on edited data"""
    
    # Generate a new prompt based on the custom data
    detected_stack = custom_data.get("detectedStack", {})
    recommended_tool = custom_data.get("recommendedTool", {})
    dev_structure = custom_data.get("devStructure", {})
    infra_tools = custom_data.get("infraTools", {})
    
    # Create new prompt based on updated data
    new_prompt = f"""Create a {project_idea} application using the following specifications:

**Tech Stack:**
- Frontend: {', '.join(detected_stack.get('frontend', []))}
- Backend: {', '.join(detected_stack.get('backend', []))}
- Database: {', '.join(detected_stack.get('database', []))}
- Additional: {', '.join(detected_stack.get('additional', []))}

**Recommended AI Tool:** {recommended_tool.get('name', '')}
{recommended_tool.get('description', '')}

**Development Structure:** {dev_structure.get('name', '')}
{dev_structure.get('description', '')}

**Infrastructure:**
- Containerization: {', '.join(infra_tools.get('containerization', []))}
- Orchestration: {', '.join(infra_tools.get('orchestration', []))}
- CI/CD: {', '.join(infra_tools.get('cicd', []))}
- Monitoring: {', '.join(infra_tools.get('monitoring', []))}
- Hosting: {', '.join(infra_tools.get('hosting', []))}

**Requirements:**
1. Implement the core functionality described in the project idea
2. Set up the recommended development structure
3. Configure the suggested infrastructure tools
4. Include proper error handling and validation
5. Add comprehensive documentation

**Deliverables:**
- Complete application code
- Infrastructure configuration files
- Development setup instructions
- Deployment guide

Please provide a detailed implementation plan and code structure."""

    return ProjectAnalyzeResponse(
        detectedStack=TechStack(**detected_stack),
        recommendedTool=AITool(**recommended_tool),
        devStructure=DevStructure(**dev_structure),
        infraTools=InfraTools(**infra_tools),
        generatedPrompt=new_prompt,
        reasoning="Generated prompt based on user-edited specifications"
    )

def _get_mock_analysis(project_idea: str) -> ProjectAnalyzeResponse:
    """Fallback mock analysis when OpenAI service fails"""
    project_idea_lower = project_idea.lower()
    
    # Mock tech stack detection
    detected_stack = TechStack(
        frontend=["React", "Next.js", "TypeScript"] if "react" in project_idea_lower or "frontend" in project_idea_lower else ["Vue.js", "Nuxt.js"],
        backend=["FastAPI", "Python"] if "python" in project_idea_lower or "api" in project_idea_lower else ["Node.js", "Express"],
        database=["PostgreSQL", "Redis"] if "database" in project_idea_lower else ["MongoDB"],
        deployment=["Vercel", "Docker"] if "deploy" in project_idea_lower else ["Netlify"],
        additional=["Tailwind CSS", "ESLint", "Prettier"]
    )
    
    # Mock AI tool recommendation
    if "ui" in project_idea_lower or "component" in project_idea_lower:
        recommended_tool = AITool(
            name="v0.dev",
            description="Best for React/Next.js UI component development",
            bestFor=["UI Components", "React Applications", "Design Systems"],
            promptStyle="Component-focused with specific requirements"
        )
    elif "fullstack" in project_idea_lower or "full-stack" in project_idea_lower:
        recommended_tool = AITool(
            name="Cursor.ai",
            description="Optimal for full-stack application development",
            bestFor=["Full-stack Apps", "File Structure", "Code Integration"],
            promptStyle="Detailed file structure and implementation"
        )
    else:
        recommended_tool = AITool(
            name="Claude Dev",
            description="Great for complex logic and architecture",
            bestFor=["Complex Logic", "Architecture Design", "Step-by-step Development"],
            promptStyle="Analytical and structured approach"
        )
    
    # Mock development structure recommendation
    if "microservice" in project_idea_lower or "micro-service" in project_idea_lower:
        dev_structure = DevStructure(
            type="microservices",
            name="Microservices Architecture",
            description="Independent, distributed services architecture",
            pros=["High scalability", "Technology diversity", "Independent deployment", "Fault isolation"],
            cons=["Complex coordination", "Network overhead", "Debugging complexity", "Higher operational cost"],
            bestFor=["Large-scale applications", "Multiple teams", "High availability requirements"]
        )
    elif "monorepo" in project_idea_lower or "mono repo" in project_idea_lower:
        dev_structure = DevStructure(
            type="monorepo",
            name="Monorepo Structure",
            description="Single repository managing multiple projects and packages",
            pros=["Unified tooling", "Easy refactoring", "Shared dependencies", "Atomic commits"],
            cons=["Large repository size", "Build complexity", "Access control challenges"],
            bestFor=["Multiple related projects", "Shared components", "Consistent tooling"]
        )
    elif "separate" in project_idea_lower or ("frontend" in project_idea_lower and "backend" in project_idea_lower):
        dev_structure = DevStructure(
            type="separated",
            name="Separated Frontend/Backend",
            description="Complete separation of frontend and backend codebases",
            pros=["Clear separation", "Independent scaling", "Technology flexibility", "Team autonomy"],
            cons=["Coordination overhead", "Duplicate configurations", "API versioning complexity"],
            bestFor=["Different tech stacks", "Separate teams", "Independent deployment cycles"]
        )
    else:
        dev_structure = DevStructure(
            type="single-repo",
            name="Single Repository",
            description="Traditional single application structure",
            pros=["Simple setup", "Easy debugging", "Unified deployment", "Lower complexity"],
            cons=["Limited scalability", "Technology coupling", "Single point of failure"],
            bestFor=["Small to medium projects", "Single team", "Rapid prototyping"]
        )
    
    # Mock infrastructure tools recommendation
    infra_tools = InfraTools(
        containerization=["Docker", "Docker Compose"] if "docker" in project_idea else ["Docker"],
        orchestration=["Kubernetes", "Docker Swarm"] if "kubernetes" in project_idea or "k8s" in project_idea else ["Docker Compose"],
        cicd=["GitHub Actions", "GitLab CI"] if "github" in project_idea else ["Jenkins", "CircleCI"],
        monitoring=["Prometheus", "Grafana", "Sentry"] if "monitoring" in project_idea else ["Basic logging"],
        hosting=["AWS", "Vercel", "Netlify"] if "aws" in project_idea else ["Vercel", "Netlify"]
    )
    
    # Mock prompt generation
    generated_prompt = f"""
Create a {project_idea} application using the following specifications:

**Tech Stack:**
- Frontend: {', '.join(detected_stack.frontend)}
- Backend: {', '.join(detected_stack.backend)}
- Database: {', '.join(detected_stack.database)}

**Development Structure:** {dev_structure.name}
{dev_structure.description}

**Infrastructure:**
- Containerization: {', '.join(infra_tools.containerization)}
- Orchestration: {', '.join(infra_tools.orchestration)}
- CI/CD: {', '.join(infra_tools.cicd)}
- Hosting: {', '.join(infra_tools.hosting)}

**Requirements:**
1. Implement the core functionality described in the project idea
2. Set up the recommended development structure
3. Configure the suggested infrastructure tools
4. Include proper error handling and validation
5. Add comprehensive documentation

**Deliverables:**
- Complete application code
- Infrastructure configuration files
- Development setup instructions
- Deployment guide

Please provide a detailed implementation plan and code structure.
    """.strip()
    
    reasoning = f"Based on the project requirements, I recommend {recommended_tool.name} for development, {dev_structure.name} for project organization, and a modern containerized infrastructure setup. This combination provides the best balance of development efficiency, scalability, and maintainability for your specific use case."
    
    return ProjectAnalyzeResponse(
        detectedStack=detected_stack,
        recommendedTool=recommended_tool,
        devStructure=dev_structure,
        infraTools=infra_tools,
        generatedPrompt=generated_prompt,
        reasoning=reasoning
    )

@router.get("/types")
async def get_analysis_types():
    """Get available analysis types"""
    return {
        "types": [
            {
                "id": "general",
                "name": "General Analysis",
                "description": "Basic text statistics and information"
            },
            {
                "id": "sentiment",
                "name": "Sentiment Analysis",
                "description": "Analyze emotional tone and sentiment"
            },
            {
                "id": "keywords",
                "name": "Keyword Extraction",
                "description": "Extract key terms and phrases"
            },
            {
                "id": "readability",
                "name": "Readability Analysis",
                "description": "Assess text complexity and reading level"
            }
        ]
    } 