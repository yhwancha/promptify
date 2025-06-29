import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("Sending idea to backend:", data)

    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Save idea error:", error)
    return NextResponse.json({ error: "Failed to save idea" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSession = searchParams.get("session")

    let url = `${BACKEND_URL}/api/v1/ideas/`
    if (userSession) {
      url += `?session=${userSession}`
    }

    console.log("Fetching ideas from backend:", url)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Fetch ideas error:", error)
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    console.log("Updating idea in backend:", { id, updateData })

    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Update idea error:", error)
    return NextResponse.json({ error: "Failed to update idea" }, { status: 500 })
  }
} 