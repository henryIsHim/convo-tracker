export interface ChatUser {
  id: string
  name: string
  avatar: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  isCurrentUser: boolean
  responseType?: 'human' | 'ai' // Only for outgoing messages
  aiStatus?: 'sent' | 'pending' | 'rejected' // For AI messages: sent = already sent, pending = needs approval, rejected = rejected
  knowledgeBaseId?: string // For pending AI responses
}

export interface Chat {
  id: string
  user: ChatUser
  lastMessage: string
  aiActive: boolean
}