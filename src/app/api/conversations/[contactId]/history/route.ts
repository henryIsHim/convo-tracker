import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:8080'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const { contactId } = await params
    
    const response = await fetch(`${BASE_URL}/api/conversations/${contactId}/history?limit=${limit}`)
    
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch conversation history' }, 
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}