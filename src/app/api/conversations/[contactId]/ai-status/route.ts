import { NextRequest } from 'next/server'
import { conversationsController } from '@/controllers/conversationsController'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  const { contactId } = await params
  return conversationsController.updateAiStatus(request, contactId)
}