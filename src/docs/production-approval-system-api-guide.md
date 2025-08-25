# Production Approval System API Guide

**Base URL**: `https://issa-isabel-795554406820.asia-southeast1.run.app`

## Quick Reference

### **System Status**
```bash
# Check approval system status
GET /api/approvals/system/status
```

### **Approval Management**
```bash
# List pending approvals
GET /api/approvals

# Get specific approval
GET /api/approvals/{messageID}

# Approve/reject response
PUT /api/approvals/{messageID}
```

### **AI Control System (Read Only)**
```bash
# Check AI processing status
GET /api/ai/processing

# Check production mode
GET /api/ai/master

# Check contact AI status
GET /api/ai/contact/{contactID}
```

---

## Detailed API Reference

### 1. System Status

#### **Get Approval System Status**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/system/status
```

**Response:**
```json
{
  "approval_system_enabled": true,
  "status": "success"
}
```

### 2. Approval Management

#### **List Pending Approvals**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals
```

**Response:**
```json
{
  "approvals": [
    {
      "id": 1,
      "message_id": 12345,
      "contact_id": 999,
      "ai_response": "The DTV visa costs 5,000 THB for 5 years...",
      "approval_status": "pending",
      "created_at": "2025-08-22T09:30:00.000Z",
      "updated_at": "2025-08-22T09:30:00.000Z"
    }
  ],
  "status": "success"
}
```

#### **Get Specific Approval**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/{messageID}
```

**Response (Pending):**
```json
{
  "approval": {
    "id": 1,
    "message_id": 12345,
    "contact_id": 999,
    "ai_response": "The DTV visa costs 5,000 THB for 5 years...",
    "approval_status": "pending",
    "created_at": "2025-08-22T09:30:00.000Z",
    "updated_at": "2025-08-22T09:30:00.000Z"
  },
  "status": "success"
}
```

**Response (Approved):**
```json
{
  "approval": {
    "id": 1,
    "message_id": 12345,
    "contact_id": 999,
    "ai_response": "The DTV visa costs 5,000 THB for 5 years...",
    "approval_status": "approved",
    "approved_by": "admin_user",
    "approved_at": "2025-08-22T09:35:00.000Z",
    "created_at": "2025-08-22T09:30:00.000Z",
    "updated_at": "2025-08-22T09:35:00.000Z"
  },
  "status": "success"
}
```

**Response (Rejected):**
```json
{
  "approval": {
    "id": 1,
    "message_id": 12345,
    "contact_id": 999,
    "ai_response": "The DTV visa costs 5,000 THB for 5 years...",
    "approval_status": "rejected",
    "created_at": "2025-08-22T09:30:00.000Z",
    "updated_at": "2025-08-22T09:40:00.000Z"
  },
  "status": "success"
}
```

#### **Approve/Reject Response**
```http
PUT https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/{messageID}
Content-Type: application/json

{
  "status": "approved",
  "approved_by": "admin_user"
}
```

**Response:**
```json
{
  "message": "Approval updated successfully",
  "status": "approved"
}
```

### 3. AI Control System (Read Only)

#### **Get AI Processing Status**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/ai/processing
```

**Response:**
```json
{
  "ai_processing_enabled": true,
  "status": "success"
}
```

#### **Get Production Mode Status**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/ai/master
```

**Response:**
```json
{
  "production_mode": true,
  "status": "success"
}
```

#### **Get Contact AI Status**
```http
GET https://issa-isabel-795554406820.asia-southeast1.run.app/api/ai/contact/{contactID}
```

**Response:**
```json
{
  "ai_will_respond": true,
  "contact_id": 999,
  "individual_ai_enabled": true,
  "production_mode": true,
  "status": "success"
}
```

---

## Frontend Integration Examples

### **JavaScript/Fetch Examples**

#### **Get Pending Approvals**
```javascript
const getPendingApprovals = async () => {
  try {
    const response = await fetch('https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals');
    const data = await response.json();
    return data.approvals || [];
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return [];
  }
};
```

#### **Approve Response**
```javascript
const approveResponse = async (messageId, approvedBy) => {
  try {
    const response = await fetch(`https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'approved',
        approved_by: approvedBy
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error approving response:', error);
    throw error;
  }
};
```

#### **Reject Response**
```javascript
const rejectResponse = async (messageId, rejectedBy) => {
  try {
    const response = await fetch(`https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'rejected',
        approved_by: rejectedBy
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error rejecting response:', error);
    throw error;
  }
};
```

#### **Get System Status**
```javascript
const getSystemStatus = async () => {
  try {
    const [approvalStatus, aiProcessing, productionMode] = await Promise.all([
      fetch('https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/system/status').then(r => r.json()),
      fetch('https://issa-isabel-795554406820.asia-southeast1.run.app/api/ai/processing').then(r => r.json()),
      fetch('https://issa-isabel-795554406820.asia-southeast1.run.app/api/ai/master').then(r => r.json())
    ]);

    return {
      approvalSystem: approvalStatus.approval_system_enabled,
      aiProcessing: aiProcessing.ai_processing_enabled,
      productionMode: productionMode.production_mode
    };
  } catch (error) {
    console.error('Error fetching system status:', error);
    throw error;
  }
};
```

### **React Hook Example**
```javascript
import { useState, useEffect } from 'react';

const useApprovalSystem = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals');
      const data = await response.json();
      setApprovals(data.approvals || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveResponse = async (messageId, approvedBy) => {
    try {
      const response = await fetch(`https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved', approved_by: approvedBy })
      });
      await fetchApprovals(); // Refresh list
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectResponse = async (messageId, rejectedBy) => {
    try {
      const response = await fetch(`https://issa-isabel-795554406820.asia-southeast1.run.app/api/approvals/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', approved_by: rejectedBy })
      });
      await fetchApprovals(); // Refresh list
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return { approvals, loading, error, approveResponse, rejectResponse, refreshApprovals: fetchApprovals };
};
```

---

## Status Codes

- **200**: Success
- **400**: Bad Request (invalid parameters)
- **404**: Not Found (approval not found)
- **500**: Internal Server Error

## Error Responses

```
{
  "error": "Error message description"
}
```

---

## Production Notes

- **Base URL**: `https://issa-isabel-795554406820.asia-southeast1.run.app`
- **Default Status**: New approvals start with `"pending"` status
- **Null Fields**: `approved_by` and `approved_at` are omitted from JSON when null
- **Real-time**: Use polling or WebSocket for real-time updates
- **Rate Limiting**: Implement appropriate rate limiting in your frontend
- **Error Handling**: Always handle network errors and API errors gracefully
- **Read Only**: AI control endpoints are read-only for frontend use

---

**Ready for Frontend Integration!** :rocket: