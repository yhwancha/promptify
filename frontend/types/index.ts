export interface TechStack {
  frontend: string[]
  backend: string[]
  database: string[]
  deployment: string[]
  additional: string[]
}

export interface DevStructure {
  type: "monorepo" | "microservices" | "separated" | "single-repo"
  name: string
  description: string
  pros: string[]
  cons: string[]
  bestFor: string[]
}

export interface InfraTools {
  containerization: string[]
  orchestration: string[]
  cicd: string[]
  monitoring: string[]
  hosting: string[]
}

export interface AITool {
  name: string
  description: string
  bestFor: string[]
  promptStyle: string
}

export interface AnalysisResult {
  detectedStack: TechStack
  recommendedTool: AITool
  devStructure: DevStructure
  infraTools: InfraTools
  generatedPrompt: string
  reasoning: string
}

export interface IdeaComment {
  id: string
  idea_id: string
  content: string
  created_at: string
  user_session: string
}

export interface SavedIdea {
  id: string
  created_at: string
  updated_at: string
  title: string
  description: string
  category?: string
  tags: string[]
  user_session: string
  comments?: IdeaComment[]
}

export interface SavedPrompt {
  id: string
  created_at: string
  project_idea: string
  detected_stack: TechStack
  recommended_tool: string
  dev_structure: DevStructure
  infra_tools: InfraTools
  generated_prompt: string
  final_prompt?: string
  is_finalized: boolean
  idea_id?: string // 연결된 아이디어 ID
}
