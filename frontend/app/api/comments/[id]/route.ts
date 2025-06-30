import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/comments/${params.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete comment')
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
} 