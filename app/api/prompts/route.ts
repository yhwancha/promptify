import { type NextRequest, NextResponse } from "next/server"

// 임시로 메모리에 저장 (실제 운영에서는 Supabase 사용)
const prompts: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newPrompt = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project_idea: data.projectIdea,
      detected_stack: data.detectedStack,
      recommended_tool: data.recommendedTool.name,
      generated_prompt: data.generatedPrompt,
      final_prompt: data.finalPrompt,
      is_finalized: data.isFinalized || false,
      user_session: data.userSession,
    }

    prompts.push(newPrompt)

    console.log("Prompt saved:", newPrompt.id)

    return NextResponse.json(newPrompt)
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSession = searchParams.get("session")

    const userPrompts = prompts.filter((p) => p.user_session === userSession)

    return NextResponse.json(userPrompts)
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 })
  }
}
