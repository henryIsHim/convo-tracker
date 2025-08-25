import { NextRequest } from 'next/server'
import { conversationsController } from '@/controllers/conversationsController'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params
  return conversationsController.getConversationHistory(request, contactId)
}