import { NextRequest } from 'next/server'
import { approvalsService } from '@/services/approvalsService'

export const approvalsController = {
  async getAllApprovals() {
    try {
      const data = await approvalsService.getAllApprovals()
      return Response.json(data)
    } catch (error) {
      console.error('Get all approvals error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  async getApprovalById(messageId: string) {
    try {
      const data = await approvalsService.getApprovalById(messageId)
      return Response.json(data)
    } catch (error) {
      console.error('Get approval by ID error:', error)
      if (error instanceof Error && error.message.includes('HTTP 404')) {
        return Response.json({ error: 'Approval not found' }, { status: 404 })
      }
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  },

  async updateApproval(request: NextRequest, messageId: string) {
    try {
      const { status, approved_by } = await request.json()
      
      if (!status || !approved_by) {
        return Response.json({ error: 'Status and approved_by are required' }, { status: 400 })
      }

      if (status !== 'approved' && status !== 'rejected') {
        return Response.json({ error: 'Status must be approved or rejected' }, { status: 400 })
      }

      const data = await approvalsService.updateApproval(messageId, status, approved_by)
      return Response.json(data)
    } catch (error) {
      console.error('Update approval error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}