import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Transform frontend data to backend format
    const backendData = {
      project_idea: data.project_idea,
      detected_stack: data.detected_stack,
      recommended_tool: data.recommended_tool,
      dev_structure: data.dev_structure,
      infra_tools: data.infra_tools,
      generated_prompt: data.generated_prompt,
      final_prompt: data.final_prompt,
      is_finalized: data.is_finalized || false,
      user_session: data.user_session,
    }

    console.log("Sending to backend:", backendData)

    const response = await fetch(`${BACKEND_URL}/api/v1/prompts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendData),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSession = searchParams.get("session")

    let url = `${BACKEND_URL}/api/v1/prompts/`
    if (userSession) {
      url += `?session=${userSession}`
    }

    console.log("Fetching from backend:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 })
  }
}
