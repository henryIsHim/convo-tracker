import { NextRequest } from 'next/server'

const BASE_URL = 'http://localhost:8080'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const requestedLimit = parseInt(searchParams.get('limit') || '20')
    
    // If requesting more than 20, fetch multiple pages
    if (requestedLimit > 20) {
      const allConversations = []
      let currentPage = 1
      let totalPages = 1
      const maxPages = Math.min(50, Math.ceil(requestedLimit / 20)) // Limit to 50 pages max
      
      do {
        console.log(`Fetching page ${currentPage}...`)
        const response = await fetch(`${BASE_URL}/api/conversations?page=${currentPage}&limit=20`)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Failed to fetch page ${currentPage}:`, response.status, errorText)
          return Response.json(
            { 
              error: `External API error at page ${currentPage}: ${response.status}`,
              details: errorText
            }, 
            { status: response.status }
          )
        }
        
        const data = await response.json()
        
        if (!data.data || !Array.isArray(data.data)) {
          console.error(`Invalid data structure at page ${currentPage}:`, data)
          break
        }
        
        allConversations.push(...data.data)
        totalPages = data.total_pages
        currentPage++
        
        // Stop if we've fetched enough conversations or hit max pages
        if (allConversations.length >= requestedLimit || currentPage > maxPages) {
          break
        }
        
      } while (currentPage <= totalPages)
      
      // Return combined result
      return Response.json({
        data: allConversations.slice(0, requestedLimit),
        total: allConversations.length,
        page: 1,
        page_size: allConversations.length,
        total_pages: 1
      })
    } else {
      // Single page request
      const page = searchParams.get('page') || '1'
      const response = await fetch(`${BASE_URL}/api/conversations?page=${page}&limit=20`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Single page request failed:`, response.status, errorText)
        return Response.json(
          { 
            error: 'External API is currently unavailable',
            details: errorText
          }, 
          { status: response.status }
        )
      }
      
      const data = await response.json()
      return Response.json(data)
    }
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}