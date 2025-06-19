export interface TechStack {
  frontend: string[]
  backend: string[]
  database: string[]
  deployment: string[]
  additional: string[]
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
  generatedPrompt: string
  reasoning: string
}

export interface SavedPrompt {
  id: string
  created_at: string
  project_idea: string
  detected_stack: TechStack
  recommended_tool: string
  generated_prompt: string
  final_prompt?: string
  is_finalized: boolean
}
