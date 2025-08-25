import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:8080'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params
    const body = await request.json()
    
    // Forward the request to the external approval API
    const response = await fetch(`${BASE_URL}/api/approvals/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return Response.json(
        { error: 'Failed to update approval status', details: errorText }, 
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params
    
    // Get specific approval
    const response = await fetch(`${BASE_URL}/api/approvals/${messageId}`)
    
    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch approval' }, 
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