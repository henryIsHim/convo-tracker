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
  },
  {
    id: "6",
    user: {
      id: "6",
      name: "Sarah Mitchell",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "7",
    user: {
      id: "7",
      name: "Alex Rodriguez",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "8",
    user: {
      id: "8",
      name: "Emily Chen",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "9",
    user: {
      id: "9",
      name: "Michael Johnson",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "10",
    user: {
      id: "10",
      name: "Jessica Brown",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "11",
    user: {
      id: "11",
      name: "David Wilson",
      avatar: ""
    },
    lastMessage: ""
  },
  {
    id: "12",
    user: {
      id: "12",
      name: "Lisa Thompson",
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
      content: "Hey! How's the project coming along?",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false
    },
    {
      id: "2", 
      senderId: "current",
      content: "It's going well! I've completed about 70% of the tasks. Should be ready for review by tomorrow.",
      timestamp: new Date(Date.now() - 1740000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "3",
      senderId: "1", 
      content: "That's great progress! Any blockers I should know about?",
      timestamp: new Date(Date.now() - 1680000),
      isCurrentUser: false
    },
    {
      id: "4",
      senderId: "current",
      content: "Actually, yes. I'm having some issues with the database integration. The API responses are inconsistent.",
      timestamp: new Date(Date.now() - 1620000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "5",
      senderId: "1",
      content: "I see. Have you checked the connection timeout settings? Sometimes that causes intermittent issues.",
      timestamp: new Date(Date.now() - 1560000),
      isCurrentUser: false
    },
    {
      id: "6",
      senderId: "current",
      content: "Good point! Let me verify the timeout configuration and also check the error logs for more details.",
      timestamp: new Date(Date.now() - 1500000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "7",
      senderId: "1",
      content: "Perfect. Also, make sure you're using the latest version of the SDK. We updated it last week.",
      timestamp: new Date(Date.now() - 1440000),
      isCurrentUser: false
    },
    {
      id: "8",
      senderId: "current",
      content: "Oh, I wasn't aware of the update! I'll download the latest version right now. Thanks for the heads up.",
      timestamp: new Date(Date.now() - 1380000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "9",
      senderId: "1",
      content: "No problem! The new version has better error handling and improved performance. Should solve your issues.",
      timestamp: new Date(Date.now() - 1320000),
      isCurrentUser: false
    },
    {
      id: "10",
      senderId: "current",
      content: "Excellent! I've updated the SDK and the database connections are much more stable now. The timeout issues are resolved.",
      timestamp: new Date(Date.now() - 1260000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "11",
      senderId: "1",
      content: "Awesome! Glad that worked out. How are the unit tests looking?",
      timestamp: new Date(Date.now() - 1200000),
      isCurrentUser: false
    },
    {
      id: "12",
      senderId: "current",
      content: "Test coverage is at 85% and all existing tests are passing. I'm adding a few more edge cases today.",
      timestamp: new Date(Date.now() - 1140000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "13",
      senderId: "1",
      content: "Great! 85% is solid coverage. Don't forget to test the error scenarios we discussed in the planning meeting.",
      timestamp: new Date(Date.now() - 1080000),
      isCurrentUser: false
    },
    {
      id: "14",
      senderId: "current",
      content: "Absolutely! I've already covered network failures and invalid responses. Working on timeout scenarios now.",
      timestamp: new Date(Date.now() - 1020000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "15",
      senderId: "1",
      content: "Perfect! You're really on top of this. The client will be impressed with the thoroughness.",
      timestamp: new Date(Date.now() - 960000),
      isCurrentUser: false
    },
    {
      id: "16",
      senderId: "current",
      content: "Thanks! I want to make sure everything is bulletproof before the demo. Quality is our top priority.",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "17",
      senderId: "1",
      content: "I appreciate that approach. By the way, have you prepared the presentation slides for the demo?",
      timestamp: new Date(Date.now() - 840000),
      isCurrentUser: false
    },
    {
      id: "18",
      senderId: "current",
      content: "Working on them now! I'll have a draft ready by end of day and will share it with the team for feedback.",
      timestamp: new Date(Date.now() - 780000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "19",
      senderId: "1",
      content: "Sounds like a plan! Make sure to include the performance metrics and before/after comparisons.",
      timestamp: new Date(Date.now() - 720000),
      isCurrentUser: false
    },
    {
      id: "20",
      senderId: "current",
      content: "Good reminder! I'll add a section showing the 40% performance improvement and the reduced error rates.",
      timestamp: new Date(Date.now() - 660000),
      isCurrentUser: true,
      responseType: "human"
    },
    {
      id: "21",
      senderId: "1",
      content: "Excellent! Those numbers really tell the story. The client will love seeing the tangible improvements.",
      timestamp: new Date(Date.now() - 600000),
      isCurrentUser: false
    },
    {
      id: "22",
      senderId: "current",
      content: "Definitely! Visual charts always make a stronger impact than just talking about the improvements.",
      timestamp: new Date(Date.now() - 540000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "23",
      senderId: "1",
      content: "I know how important this file is to you. You can trust me :) me :)",
      timestamp: new Date(Date.now() - 300000),
      isCurrentUser: false
    },
    {
      id: "24", 
      senderId: "current",
      content: "I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :) know how important this file is to you. You can trust me :)",
      timestamp: new Date(Date.now() - 180000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "25",
      senderId: "1", 
      content: "I know how important this file is to you. You can trust me :) I know how important this file is to you. You can trust me :) know how important this file is to you. You can trust me :)",
      timestamp: new Date(Date.now() - 60000),
      isCurrentUser: false
    },
    {
      id: "26",
      senderId: "current",
      content: "Thanks for clarifying that! I understand the importance now.",
      timestamp: new Date(Date.now() - 30000),
      isCurrentUser: true,
      responseType: "human"
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
      isCurrentUser: true,
      responseType: "ai"
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
      isCurrentUser: true,
      responseType: "human"
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
      isCurrentUser: true,
      responseType: "ai"
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
      isCurrentUser: true,
      responseType: "human"
    }
  ],
  "6": [
    {
      id: "12",
      senderId: "6",
      content: "Hey, are you available for a quick call today?",
      timestamp: new Date(Date.now() - 120000),
      isCurrentUser: false
    },
    {
      id: "13",
      senderId: "current",
      content: "Sure! I'm free after 3 PM. What works best for you?",
      timestamp: new Date(Date.now() - 60000),
      isCurrentUser: true,
      responseType: "human"
    }
  ],
  "7": [
    {
      id: "14",
      senderId: "current",
      content: "The project requirements have been updated. Please review the new specifications.",
      timestamp: new Date(Date.now() - 480000),
      isCurrentUser: true,
      responseType: "ai"
    },
    {
      id: "15",
      senderId: "7",
      content: "Got it! I'll review them and get back to you by tomorrow.",
      timestamp: new Date(Date.now() - 420000),
      isCurrentUser: false
    }
  ],
  "8": [
    {
      id: "16",
      senderId: "8",
      content: "Can you help me with the deployment process?",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: false
    },
    {
      id: "17",
      senderId: "current",
      content: "Of course! Let me walk you through the steps. First, make sure you have access to the staging environment.",
      timestamp: new Date(Date.now() - 840000),
      isCurrentUser: true,
      responseType: "human"
    }
  ],
  "9": [
    {
      id: "18",
      senderId: "current",
      content: "The weekly report has been generated and is ready for your review.",
      timestamp: new Date(Date.now() - 1200000),
      isCurrentUser: true,
      responseType: "ai"
    }
  ],
  "10": [
    {
      id: "19",
      senderId: "10",
      content: "Thanks for the quick turnaround on the bug fix!",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false
    },
    {
      id: "20",
      senderId: "current",
      content: "You're welcome! Let me know if you encounter any other issues.",
      timestamp: new Date(Date.now() - 1740000),
      isCurrentUser: true,
      responseType: "human"
    }
  ],
  "11": [
    {
      id: "21",
      senderId: "current",
      content: "I've scheduled our meeting for next Tuesday at 2 PM. Please confirm if this works for you.",
      timestamp: new Date(Date.now() - 2400000),
      isCurrentUser: true,
      responseType: "ai"
    }
  ],
  "12": [
    {
      id: "22",
      senderId: "12",
      content: "Could you send me the latest design mockups?",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false
    },
    {
      id: "23",
      senderId: "current",
      content: "Absolutely! I'll email them to you within the next hour.",
      timestamp: new Date(Date.now() - 3540000),
      isCurrentUser: true,
      responseType: "human"
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