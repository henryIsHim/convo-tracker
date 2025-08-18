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
}

export interface Chat {
  id: string
  user: ChatUser
  lastMessage: string
}