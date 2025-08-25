import { NextRequest } from 'next/server'
import { approvalsController } from '@/controllers/approvalsController'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params
  return approvalsController.updateApproval(request, messageId)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  const { messageId } = await params
  return approvalsController.getApprovalById(messageId)
}