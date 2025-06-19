export type Language = "ko" | "en"

export interface Translations {
  // Navigation
  home: string
  history: string
  backToHome: string

  // Main page
  title: string
  subtitle: string
  describeProject: string
  describeProjectDesc: string
  placeholder: string
  generatePrompt: string
  analyzing: string
  characters: string

  // Features
  smartAnalysis: string
  smartAnalysisDesc: string
  toolMatching: string
  toolMatchingDesc: string
  customPrompts: string
  customPromptsDesc: string

  // Results page
  analysisResults: string
  projectIdea: string
  generatedPrompt: string
  generatedPromptDesc: string
  copyPrompt: string
  savePrompt: string
  saving: string
  saved: string
  copied: string

  // Tech stack
  recommendedTool: string
  detectedTechStack: string
  frontend: string
  backend: string
  database: string
  deployment: string
  additional: string
  bestFor: string
  aiReasoning: string

  // History page
  projectHistory: string
  projectHistoryDesc: string
  noProjects: string
  noProjectsDesc: string
  createFirstPrompt: string
  createdOn: string
  techStack: string

  // Errors
  errorAnalyzing: string
  errorSaving: string
  errorCopying: string
  errorLoading: string

  // Common
  loading: string
  error: string
  success: string
}

export const translations: Record<Language, Translations> = {
  ko: {
    // Navigation
    home: "홈",
    history: "히스토리",
    backToHome: "홈으로 돌아가기",

    // Main page
    title: "AI 프롬프트 생성기",
    subtitle: "프로젝트 아이디어를 v0.dev, Cursor.ai, GPT Engineer 등 AI 코딩 도구용 프롬프트로 변환해드립니다",
    describeProject: "프로젝트 아이디어를 설명해주세요",
    describeProjectDesc: "자연어로 프로젝트에 대해 설명해주세요. 간단하게 또는 자세하게 모두 가능합니다.",
    placeholder:
      "예시: 실시간 협업 기능이 있는 할일 관리 앱을 만들고 싶습니다. 사용자 인증, 드래그 앤 드롭 기능, 모바일 반응형이 필요하고, 사용자들이 프로젝트를 생성하고 작업을 할당하며 마감일을 설정하고 알림을 받을 수 있어야 합니다.",
    generatePrompt: "프롬프트 생성하기",
    analyzing: "분석 중...",
    characters: "글자",

    // Features
    smartAnalysis: "스마트 분석",
    smartAnalysisDesc: "AI가 아이디어를 분석하여 완벽한 기술 스택과 개발 방향을 추천합니다",
    toolMatching: "도구 매칭",
    toolMatchingDesc: "프로젝트 요구사항에 따라 가장 적합한 AI 코딩 도구를 추천받으세요",
    customPrompts: "맞춤 프롬프트",
    customPromptsDesc: "각 AI 도구의 특성과 스타일에 최적화된 맞춤형 프롬프트를 생성합니다",

    // Results page
    analysisResults: "분석 결과",
    projectIdea: "프로젝트 아이디어",
    generatedPrompt: "생성된 프롬프트",
    generatedPromptDesc: "필요에 따라 프롬프트를 수정한 후 저장하거나 복사하세요.",
    copyPrompt: "프롬프트 복사",
    savePrompt: "프롬프트 저장",
    saving: "저장 중...",
    saved: "저장됨!",
    copied: "복사됨!",

    // Tech stack
    recommendedTool: "추천 도구",
    detectedTechStack: "감지된 기술 스택",
    frontend: "프론트엔드",
    backend: "백엔드",
    database: "데이터베이스",
    deployment: "배포",
    additional: "추가 도구",
    bestFor: "최적 용도:",
    aiReasoning: "AI 추천 이유",

    // History page
    projectHistory: "프로젝트 히스토리",
    projectHistoryDesc: "이전에 생성한 프롬프트들을 확인하고 관리하세요",
    noProjects: "저장된 프로젝트가 없습니다",
    noProjectsDesc: "첫 번째 AI 프롬프트를 생성해보세요.",
    createFirstPrompt: "첫 프롬프트 만들기",
    createdOn: "생성일:",
    techStack: "기술 스택",

    // Errors
    errorAnalyzing: "분석에 실패했습니다. 다시 시도해주세요.",
    errorSaving: "프롬프트 저장에 실패했습니다. 다시 시도해주세요.",
    errorCopying: "클립보드 복사에 실패했습니다.",
    errorLoading: "저장된 분석 결과를 불러올 수 없습니다.",

    // Common
    loading: "로딩 중...",
    error: "오류",
    success: "성공",
  },
  en: {
    // Navigation
    home: "Home",
    history: "History",
    backToHome: "Back to Home",

    // Main page
    title: "AI Prompt Generator",
    subtitle:
      "Transform your project ideas into ready-to-use prompts for AI coding tools like v0.dev, Cursor.ai, and GPT Engineer",
    describeProject: "Describe Your Project Idea",
    describeProjectDesc: "Tell us about your project in natural language. Be as detailed or as brief as you like.",
    placeholder:
      "Example: I want to build a task management app with real-time collaboration, user authentication, drag-and-drop functionality, and mobile responsiveness. Users should be able to create projects, assign tasks, set deadlines, and receive notifications.",
    generatePrompt: "Generate Prompt",
    analyzing: "Analyzing...",
    characters: "characters",

    // Features
    smartAnalysis: "Smart Analysis",
    smartAnalysisDesc: "AI analyzes your idea to recommend the perfect tech stack and development approach",
    toolMatching: "Tool Matching",
    toolMatchingDesc: "Get recommendations for the best AI coding tool based on your project requirements",
    customPrompts: "Custom Prompts",
    customPromptsDesc: "Generate tailored prompts optimized for each AI tool's specific style and capabilities",

    // Results page
    analysisResults: "Analysis Results",
    projectIdea: "Your Project Idea",
    generatedPrompt: "Generated Prompt",
    generatedPromptDesc: "Edit this prompt to better match your needs, then save or copy it.",
    copyPrompt: "Copy Prompt",
    savePrompt: "Save Prompt",
    saving: "Saving...",
    saved: "Saved!",
    copied: "Copied!",

    // Tech stack
    recommendedTool: "Recommended Tool",
    detectedTechStack: "Detected Tech Stack",
    frontend: "Frontend",
    backend: "Backend",
    database: "Database",
    deployment: "Deployment",
    additional: "Additional",
    bestFor: "Best for:",
    aiReasoning: "AI Reasoning",

    // History page
    projectHistory: "Project History",
    projectHistoryDesc: "View and manage your previously generated prompts",
    noProjects: "No projects yet",
    noProjectsDesc: "Start by creating your first AI prompt from a project idea.",
    createFirstPrompt: "Create Your First Prompt",
    createdOn: "Created on",
    techStack: "Tech Stack",

    // Errors
    errorAnalyzing: "Failed to analyze project. Please try again.",
    errorSaving: "Failed to save prompt. Please try again.",
    errorCopying: "Failed to copy prompt.",
    errorLoading: "Failed to load stored analysis result.",

    // Common
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
}
