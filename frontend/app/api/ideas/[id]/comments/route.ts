import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/${params.id}/comments`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch comments')
    }

    const comments = await response.json()
    return NextResponse.json(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/api/v1/ideas/${params.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: data.content,
        idea_id: params.id,
        user_session: data.user_session,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to add comment')
    }

    const comment = await response.json()
    return NextResponse.json(comment)
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
} 