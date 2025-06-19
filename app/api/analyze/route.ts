import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

const analysisSchema = z.object({
  detectedStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    deployment: z.array(z.string()),
    additional: z.array(z.string()),
  }),
  recommendedTool: z.object({
    name: z.enum(["v0.dev", "Cursor.ai", "GPT Engineer", "Claude Dev"]),
    description: z.string(),
    bestFor: z.array(z.string()),
    promptStyle: z.string(),
  }),
  generatedPrompt: z.string(),
  reasoning: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const { projectIdea, language = "en" } = await request.json()

    if (!projectIdea) {
      return NextResponse.json({ error: "Project idea is required" }, { status: 400 })
    }

    console.log("Analyzing project idea:", projectIdea, "Language:", language)

    const prompts = {
      ko: `
        당신은 소프트웨어 개발 전문가입니다. 다음 프로젝트 아이디어를 분석하고 추천사항을 제공해주세요:

        프로젝트 아이디어: "${projectIdea}"

        다음 사항들을 분석해주세요:
        1. 가장 적합한 기술 스택 (구체적인 프레임워크/라이브러리 포함)
        2. 이 프로젝트에 가장 적합한 AI 코딩 도구
        3. 선택한 도구의 스타일에 맞춘 상세하고 실행 가능한 프롬프트 생성

        AI 도구 가이드라인:
        - v0.dev: React/Next.js UI 컴포넌트에 최적화, 구체적인 컴포넌트 요청 필요
        - Cursor.ai: 풀스택 애플리케이션에 최적화, 상세한 파일 구조 선호
        - GPT Engineer: 처음부터 완전한 애플리케이션 구축에 최적화, 고수준 설명 선호
        - Claude Dev: 복잡한 로직과 아키텍처에 최적화, 단계별 분석 선호

        생성된 프롬프트는 상세하고 구체적이며 선택한 도구에서 실행 가능해야 합니다.
        구체적인 요구사항, 기술 스택, 기능, UI/UX 고려사항을 포함해주세요.

        응답은 반드시 영어로 작성해주세요.
      `,
      en: `
        You are a software development expert. Please analyze the following project idea and provide recommendations:

        Project idea: "${projectIdea}"

        Please analyze the following:
        1. The most suitable tech stack (including specific frameworks/libraries)
        2. The best AI coding tool for this project
        3. Generate a detailed, actionable prompt tailored to the selected tool's style

        AI Tool Guidelines:
        - v0.dev: Best for React/Next.js UI components, requires specific component requests
        - Cursor.ai: Best for full-stack applications, prefers detailed file structure
        - GPT Engineer: Best for complete applications from scratch, likes high-level descriptions
        - Claude Dev: Best for complex logic and architecture, prefers step-by-step breakdowns

        The generated prompt should be detailed, specific, and actionable for the chosen tool.
        Include specific requirements, tech stack, features, and UI/UX considerations.

        Please respond in English.
      `,
    }

    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: analysisSchema,
      prompt: prompts[language as keyof typeof prompts] || prompts.en,
      temperature: 0.7,
    })

    console.log("Analysis completed:", object)

    return NextResponse.json(object)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze project",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
