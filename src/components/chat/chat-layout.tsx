"use client"

import { useState, useEffect } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { Chat, Message } from "@/types/chat"
import { cn } from "@/lib/utils"

// API interfaces
interface ApiMessage {
  id: number
  message_id: number
  contact_id: number
  direction: 'in' | 'out' | 'ai_response'
  text: string
  timestamp: number
  created_at: string
}

interface ApiConversation {
  id: number
  contact_id: number
  contact_name: string
  assignee_id: number
  assignee_name: string
  channel_id: number
  channel_name: string
  ai_active: boolean
  created_at: string
  updated_at: string
  messages?: ApiMessage[]
}

// Transform API data to match current types
function transformApiToChat(apiConversation: ApiConversation): Chat {
  const lastMessage = apiConversation.messages && apiConversation.messages.length > 0 
    ? apiConversation.messages[0].text 
    : "No messages yet"

  return {
    id: apiConversation.contact_id.toString(),
    user: {
      id: apiConversation.contact_id.toString(),
      name: apiConversation.contact_name,
      avatar: ""
    },
    lastMessage,
    aiActive: apiConversation.ai_active
  }
}

function transformApiToMessage(apiMessage: ApiMessage): Message {
  const isCurrentUser = apiMessage.direction === 'out' || apiMessage.direction === 'ai_response'
  
  return {
    id: apiMessage.id.toString(),
    senderId: isCurrentUser ? "current" : apiMessage.contact_id.toString(),
    content: apiMessage.text,
    timestamp: new Date(apiMessage.timestamp),
    isCurrentUser,
    responseType: apiMessage.direction === 'ai_response' ? 'ai' : (isCurrentUser ? 'human' : undefined),
    aiStatus: apiMessage.direction === 'ai_response' ? 'sent' : undefined,
    knowledgeBaseId: apiMessage.direction === 'ai_response' ? 'KB_025' : undefined
  }
}


export function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState<string>()
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])

  // Fetch conversations and pending approvals on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch conversations
        const conversationsResponse = await fetch('/api/conversations?page=1&limit=100')
        const conversationsData = await conversationsResponse.json()
        const transformedChats = conversationsData.data.map(transformApiToChat)
        setChats(transformedChats)

        // Fetch pending approvals
        try {
          const approvalsResponse = await fetch('/api/approvals')
          const approvalsData = await approvalsResponse.json()
          if (approvalsData.approvals) {
            // Store all approvals (pending, approved, rejected)
            setPendingApprovals(approvalsData.approvals)
          }
        } catch (approvalError) {
          console.error('Error fetching approvals:', approvalError)
          setPendingApprovals([])
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch messages when chat is selected or pending approvals change
  useEffect(() => {
    if (selectedChatId) {
      const fetchMessages = async () => {
        try {
          // Only show loading spinner when switching chats, not on approval updates
          if (!messages.length) {
            setMessagesLoading(true)
          }
          
          // Fetch conversation history
          const response = await fetch(`/api/conversations/${selectedChatId}/history?limit=50`)
          const data = await response.json()
          let transformedMessages: Message[] = []
          
          if (data.data && data.data.messages) {
            transformedMessages = data.data.messages.map(transformApiToMessage)
          }
          
          // Get all approvals for this contact
          const approvalsForContact = pendingApprovals
            .filter((approval: any) => approval.contact_id.toString() === selectedChatId)
          
          // Create a Set of message IDs that have approvals to avoid duplicates
          const approvalMessageIds = new Set(approvalsForContact.map((approval: any) => approval.message_id.toString()))
          
          // Filter out regular messages that have corresponding approvals to prevent duplicates
          transformedMessages = transformedMessages.filter(msg => {
            // If this is an AI response message that has an approval, filter it out
            if (msg.responseType === 'ai' && approvalMessageIds.has(msg.id)) {
              return false
            }
            return true
          })
          
          // Add approval-based messages
          const approvalMessages = approvalsForContact.map((approval: any) => {
            const status = approval.approval_status
            let aiStatus: 'pending' | 'sent' | 'rejected'
            
            if (status === 'pending') {
              aiStatus = 'pending'
            } else if (status === 'approved') {
              aiStatus = 'sent'
            } else {
              aiStatus = 'rejected'
            }
            
            return {
              id: `${status}_${approval.message_id}`,
              senderId: "current",
              content: approval.ai_response,
              timestamp: new Date(approval.updated_at || approval.created_at),
              isCurrentUser: true,
              responseType: 'ai' as const,
              aiStatus,
              knowledgeBaseId: 'KB_025'
            }
          })
          
          // Show all approval messages including rejected ones
          const visibleApprovalMessages = approvalMessages
          
          transformedMessages = [...transformedMessages, ...visibleApprovalMessages]
          
          // Sort by timestamp and set messages
          transformedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
          setMessages(transformedMessages)
          
        } catch (error) {
          console.error('Error fetching messages:', error)
        } finally {
          setMessagesLoading(false)
        }
      }

      fetchMessages()
    } else {
      setMessages([])
    }
  }, [selectedChatId, pendingApprovals])

  const selectedChat = chats.find(chat => chat.id === selectedChatId)

  const handleApproveMessage = async (messageId: string) => {
    try {
      // Extract the actual message ID from pending prefixed IDs
      const actualMessageId = messageId.startsWith('pending_') 
        ? messageId.replace('pending_', '') 
        : messageId
      
      console.log('Approving message:', actualMessageId)
      
      const payload = { 
        status: 'approved',
        approved_by: 'admin_user'
      }
      console.log('Approval payload:', payload)
      
      // Call the approval API
      const response = await fetch(`/api/approvals/${actualMessageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        console.log('Approval successful, refreshing data...')
        
        // Immediately update local approval status to show as sent
        setPendingApprovals(prevApprovals => 
          prevApprovals.map(approval => 
            approval.message_id.toString() === actualMessageId 
              ? { ...approval, approval_status: 'approved', updated_at: new Date().toISOString() }
              : approval
          )
        )
        
        // Small delay to ensure server has processed the update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check the specific message that was just approved
        const specificMessageResponse = await fetch(`/api/approvals/${actualMessageId}`)
        if (specificMessageResponse.ok) {
          const specificData = await specificMessageResponse.json()
          console.log(`Specific message ${actualMessageId} after approval:`, specificData)
        }
        
        // Refresh pending approvals to get latest data
        const approvalsResponse = await fetch('/api/approvals')
        if (approvalsResponse.ok) {
          const approvalsData = await approvalsResponse.json()
          console.log('Full approvals response:', approvalsData)
          console.log('Updated approvals data:', approvalsData.approvals)
          if (approvalsData.approvals) {
            setPendingApprovals(approvalsData.approvals)
          } else if (approvalsData.approvals === null) {
            // Don't clear all approvals when API returns null after approval
            // Keep existing approvals to maintain proper message state tracking
            console.log('API returned null approvals after approval, keeping existing approval data')
          }
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to approve message:', response.status, errorText)
        alert('Failed to approve message. Please try again.')
      }
    } catch (error) {
      console.error('Error approving message:', error)
      alert('Error approving message. Please check your connection and try again.')
    }
  }

  const handleRejectMessage = async (messageId: string) => {
    try {
      // Extract the actual message ID from pending prefixed IDs
      const actualMessageId = messageId.startsWith('pending_') 
        ? messageId.replace('pending_', '') 
        : messageId
      
      console.log('Rejecting message:', actualMessageId)
      
      const payload = { 
        status: 'rejected',
        approved_by: 'admin_user'
      }
      console.log('Rejection payload:', payload)
      
      // Call the approval API
      const response = await fetch(`/api/approvals/${actualMessageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('Rejection response status:', response.status)

      if (response.ok) {
        console.log('Rejection successful, refreshing data...')
        
        // Immediately update local approval status to hide the message
        setPendingApprovals(prevApprovals => 
          prevApprovals.map(approval => 
            approval.message_id.toString() === actualMessageId 
              ? { ...approval, approval_status: 'rejected' }
              : approval
          )
        )
        
        // Small delay to ensure server has processed the update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check the specific message that was just rejected
        const specificMessageResponse = await fetch(`/api/approvals/${actualMessageId}`)
        if (specificMessageResponse.ok) {
          const specificData = await specificMessageResponse.json()
          console.log(`Specific message ${actualMessageId} after rejection:`, specificData)
          
          // Verify the status is actually rejected
          if (specificData.approval && specificData.approval.approval_status !== 'rejected') {
            console.error('WARNING: Message was not properly rejected!', specificData.approval.approval_status)
          } else {
            console.log('✅ Message successfully marked as rejected')
          }
        } else {
          console.error('Failed to fetch rejected message details')
        }
        
        // Refresh pending approvals to get latest data
        const approvalsResponse = await fetch('/api/approvals')
        if (approvalsResponse.ok) {
          const approvalsData = await approvalsResponse.json()
          console.log('Full approvals response after rejection:', approvalsData)
          console.log('Updated approvals data after rejection:', approvalsData.approvals)
          if (approvalsData.approvals) {
            setPendingApprovals(approvalsData.approvals)
          } else if (approvalsData.approvals === null) {
            // Don't clear all approvals when API returns null after rejection
            // Keep existing approvals to maintain rejected message tracking
            console.log('API returned null approvals after rejection, keeping existing approval data')
          }
        }
      } else {
        const errorText = await response.text()
        console.error('Failed to reject message:', response.status, errorText)
        alert('Failed to reject message. Please try again.')
      }
    } catch (error) {
      console.error('Error rejecting message:', error)
      alert('Error rejecting message. Please check your connection and try again.')
    }
  }

  const handleAiToggle = async (chatId: string) => {
    try {
      const chatToUpdate = chats.find(chat => chat.id === chatId)
      if (!chatToUpdate) return

      const newAiStatus = !chatToUpdate.aiActive

      // Optimistically update the UI
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, aiActive: newAiStatus }
            : chat
        )
      )

      // TODO: Make API call to update AI status on the server when endpoint is ready
      // const response = await fetch(`/api/conversations/${chatId}/ai-status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ aiActive: newAiStatus })
      // })
      // if (!response.ok) {
      //   setChats(prevChats => 
      //     prevChats.map(chat => 
      //       chat.id === chatId 
      //         ? { ...chat, aiActive: !newAiStatus }
      //         : chat
      //     )
      //   )
      //   console.error('Failed to update AI status')
      // }
    } catch (error) {
      console.error('Error toggling AI status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div className={cn(
        "w-80 flex-shrink-0 border-r border-border",
        selectedChatId ? "hidden md:block" : "block"
      )}>
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAiToggle={handleAiToggle}
          pendingApprovals={pendingApprovals}
        />
      </div>

      {/* Chat Window - Full width on mobile when chat is selected */}
      <div className={cn(
        "flex-1 h-full",
        !selectedChatId ? "hidden md:block" : "block"
      )}>
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : (
          <ChatWindow
            user={selectedChat?.user || null}
            messages={messages}
            onBack={() => setSelectedChatId(undefined)}
            aiActive={selectedChat?.aiActive}
            onAiToggle={selectedChatId ? () => handleAiToggle(selectedChatId) : undefined}
            onApproveMessage={handleApproveMessage}
            onRejectMessage={handleRejectMessage}
          />
        )}
      </div>
    </div>
  )
}