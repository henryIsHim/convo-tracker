import { NextRequest } from 'next/server'
import { conversationsController } from '@/controllers/conversationsController'

export async function GET(request: NextRequest) {
  return conversationsController.getAllConversations(request)
}