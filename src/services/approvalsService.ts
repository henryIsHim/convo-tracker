const BASE_URL = 'http://localhost:8080'

export const approvalsService = {
  async getAllApprovals() {
    const response = await fetch(`${BASE_URL}/api/approvals`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  },

  async getApprovalById(messageId: string) {
    const response = await fetch(`${BASE_URL}/api/approvals/${messageId}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  },

  async updateApproval(messageId: string, status: string, approvedBy: string) {
    const response = await fetch(`${BASE_URL}/api/approvals/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, approved_by: approvedBy })
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    return response.json()
  }
}