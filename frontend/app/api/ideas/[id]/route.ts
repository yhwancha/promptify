import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log("Deleting idea from backend:", id)

    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`)
    }

    const result = await response.json()
    console.log("Backend response:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Delete idea error:", error)
    return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 })
  }
} 