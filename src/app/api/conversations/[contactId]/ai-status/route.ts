import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:8080'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const { contactId } = await params
    const { aiActive } = await request.json()
    
    // Forward the request to the external API
    const response = await fetch(`${BASE_URL}/api/conversations/${contactId}/ai-status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ai_active: aiActive })
    })
    
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to update AI status' }, 
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