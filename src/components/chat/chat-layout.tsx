"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatWindow } from "./chat-window"
import { Chat, Message } from "@/types/chat"
import { cn } from "@/lib/utils"

// Mock data
const mockChats: Chat[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "Jacquenetta Slowgrave",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "2",
    user: {
      id: "2",
      name: "Nickola Peever",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "3",
    user: {
      id: "3",
      name: "Farand Hume",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "4",
    user: {
      id: "4",
      name: "Ossie Peasey",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "5",
    user: {
      id: "5",
      name: "Hall Negri",
      avatar: ""
    },
    lastMessage: ""
  }
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "I know how important this file is to you. You can trust me :) me :)",
      timestamp: new Date(Date.now() - 300000),
      isCurrentUser: false
    },
    {
      id: "2", 
      senderId: "current",
      content: "I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :) know how important this file is to you. You can trust me :)",
      timestamp: new Date(Date.now() - 180000),
      isCurrentUser: true
    },
    {
      id: "3",
      senderId: "1", 
      content: "I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :) know how important this file is to you. You can trust me :)",
      timestamp: new Date(Date.now() - 60000),
      isCurrentUser: false
    }
  ],
  "2": [
    {
      id: "4",
      senderId: "2",
      content: "Sounds perfect! I've been wanting to try that place for a while.",
      timestamp: new Date(Date.now() - 400000),
      isCurrentUser: false
    },
    {
      id: "5",
      senderId: "current",
      content: "Great! How about tomorrow at 7 PM?",
      timestamp: new Date(Date.now() - 200000),
      isCurrentUser: true
    }
  ],
  "3": [
    {
      id: "6",
      senderId: "3",
      content: "How about 7 PM at the new Italian place downtown?",
      timestamp: new Date(Date.now() - 500000),
      isCurrentUser: false
    },
    {
      id: "7",
      senderId: "current",
      content: "That sounds perfect! See you there.",
      timestamp: new Date(Date.now() - 300000),
      isCurrentUser: true
    }
  ],
  "4": [
    {
      id: "8",
      senderId: "4",
      content: "Hey Bonnie, yes, definitely! What time works best for you?",
      timestamp: new Date(Date.now() - 600000),
      isCurrentUser: false
    },
    {
      id: "9",
      senderId: "current",
      content: "Anytime after 6 PM works for me!",
      timestamp: new Date(Date.now() - 400000),
      isCurrentUser: true
    }
  ],
  "5": [
    {
      id: "10",
      senderId: "5",
      content: "No worries at all! I'll grab a table and wait for you.",
      timestamp: new Date(Date.now() - 700000),
      isCurrentUser: false
    },
    {
      id: "11",
      senderId: "current",
      content: "Thanks for understanding! Should be there in 10 minutes.",
      timestamp: new Date(Date.now() - 500000),
      isCurrentUser: true
    }
  ]
}

export function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState<string>()
  const [searchQuery, setSearchQuery] = useState("")

  const selectedChat = mockChats.find(chat => chat.id === selectedChatId)
  const messages = selectedChatId ? mockMessages[selectedChatId] || [] : []

  // Generate chats with actual last messages from message history
  const chatsWithLastMessages = mockChats.map(chat => {
    const chatMessages = mockMessages[chat.id] || []
    const lastMessage = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null
    return {
      ...chat,
      lastMessage: lastMessage ? lastMessage.content : "No messages yet"
    }
  })


  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hidden on mobile when chat is selected */}
      <div className={cn(
        "w-80 flex-shrink-0 border-r border-border",
        selectedChatId ? "hidden md:block" : "block"
      )}>
        <ChatSidebar
          chats={chatsWithLastMessages}
          selectedChatId={selectedChatId}
          onChatSelect={setSelectedChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Window - Full width on mobile when chat is selected */}
      <div className={cn(
        "flex-1",
        !selectedChatId ? "hidden md:block" : "block"
      )}>
        <ChatWindow
          user={selectedChat?.user || null}
          messages={messages}
          onBack={() => setSelectedChatId(undefined)}
        />
      </div>
    </div>
  )
}