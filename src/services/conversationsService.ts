const BASE_URL = 'http://localhost:8080'

export const conversationsService = {
  async getAllConversations(page: number = 1, limit: number = 20) {
    // Handle multi-page requests if limit > 20
    if (limit > 20) {
      const allConversations = []
      let currentPage = 1
      const maxPages = Math.min(50, Math.ceil(limit / 20))
      
      while (currentPage <= maxPages) {
        const response = await fetch(`${BASE_URL}/api/conversations?page=${currentPage}&limit=20`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${await response.text()}`)
        }
        
        const data = await response.json()
        if (!data.data || !Array.isArray(data.data)) break
        
        allConversations.push(...data.data)
        if (allConversations.length >= limit) break
        currentPage++
      }
      
      return {
        data: allConversations.slice(0, limit),
        total: allConversations.length,
        page: 1,
        page_size: allConversations.length,
        total_pages: 1
      }
    }

    // Single page request
    const response = await fetch(`${BASE_URL}/api/conversations?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  },

  async getConversationHistory(contactId: string, limit: number = 100) {
    const response = await fetch(`${BASE_URL}/api/conversations/${contactId}/history?limit=${limit}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  },

  async updateAiStatus(contactId: string, aiActive: boolean) {
    const response = await fetch(`${BASE_URL}/api/conversations/${contactId}/ai-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ai_active: aiActive })
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  }
}