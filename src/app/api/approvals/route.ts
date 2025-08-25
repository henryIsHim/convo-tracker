import { approvalsController } from '@/controllers/approvalsController'

export async function GET() {
  return approvalsController.getAllApprovals()
}