import { NextRequest } from 'next/server'
import { conversationsService } from '@/services/conversationsService'

export const conversationsController = {
  async getAllConversations(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')

      const data = await conversationsService.getAllConversations(page, limit)
      return Response.json(data)
    } catch (error) {
      console.error('Get all conversations error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  async getConversationHistory(request: NextRequest, contactId: string) {
    try {
      const { searchParams } = new URL(request.url)
      const limit = parseInt(searchParams.get('limit') || '100')

      const data = await conversationsService.getConversationHistory(contactId, limit)
      return Response.json(data)
    } catch (error) {
      console.error('Get conversation history error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  async updateAiStatus(request: NextRequest, contactId: string) {
    try {
      const { aiActive } = await request.json()
      
      if (typeof aiActive !== 'boolean') {
        return Response.json({ error: 'aiActive must be a boolean' }, { status: 400 })
      }

      const data = await conversationsService.updateAiStatus(contactId, aiActive)
      return Response.json(data)
    } catch (error) {
      console.error('Update AI status error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}