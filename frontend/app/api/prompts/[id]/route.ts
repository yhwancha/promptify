import { type NextRequest, NextResponse } from "next/server"

// 임시 메모리 저장소 (실제로는 외부 파일이나 DB에서 가져와야 함)
const prompts: any[] = []

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const promptIndex = prompts.findIndex((p) => p.id === params.id)

    if (promptIndex === -1) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 })
    }

    prompts[promptIndex] = {
      ...prompts[promptIndex],
      final_prompt: data.finalPrompt,
      is_finalized: data.isFinalized,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(prompts[promptIndex])
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Failed to update prompt" }, { status: 500 })
  }
}
