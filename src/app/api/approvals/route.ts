import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    // Get all pending approvals
    const response = await fetch(`${BASE_URL}/api/approvals`)
    
    if (!response.ok) {
      const errorText = await response.text()
      return Response.json(
        { error: 'Failed to fetch approvals', details: errorText }, 
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