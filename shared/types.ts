// Shared types between frontend and backend

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface PromptCreate {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface PromptUpdate {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface AnalyzeRequest {
  text: string;
  analysis_type: string;
  options?: Record<string, any>;
}

export interface ProjectAnalyzeRequest {
  project_idea: string;
  language?: string;
}

export interface DevStructure {
  type: "monorepo" | "microservices" | "separated" | "single-repo";
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

export interface InfraTools {
  containerization: string[];
  orchestration: string[];
  cicd: string[];
  monitoring: string[];
  hosting: string[];
}

export interface AnalyzeResponse {
  text: string;
  analysis_type: string;
  results: Record<string, any>;
  confidence?: number;
  metadata?: Record<string, any>;
}

export interface ProjectAnalyzeResponse {
  detectedStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    deployment: string[];
    additional: string[];
  };
  recommendedTool: {
    name: string;
    description: string;
    bestFor: string[];
    promptStyle: string;
  };
  devStructure: DevStructure;
  infraTools: InfraTools;
  generatedPrompt: string;
  reasoning: string;
}

export interface AnalysisType {
  id: string;
  name: string;
  description: string;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
} 