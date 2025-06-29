import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectIdea, language = "en" } = await request.json()

    if (!projectIdea) {
      return NextResponse.json({ error: "Project idea is required" }, { status: 400 })
    }

    console.log("Analyzing project idea:", projectIdea, "Language:", language)

    // Call backend API
    // Use BACKEND_URL for server-side (Docker), fallback to localhost for development
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000"
    const response = await fetch(`${backendUrl}/api/v1/analyze/project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_idea: projectIdea,
        language: language,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || `Backend API error: ${response.status}`)
    }

    const analysisResult = await response.json()
    console.log("Analysis completed:", analysisResult)

    return NextResponse.json(analysisResult)
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
