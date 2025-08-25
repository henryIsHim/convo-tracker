import { Search, User } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar,  AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Chat } from "@/types/chat"
import { cn } from "@/lib/utils"
import { AiBadge } from "./ai-badge"

interface ChatSidebarProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onAiToggle: (chatId: string) => void
  pendingApprovals: { contact_id: number, approval_status: string }[]
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onChatSelect,
  searchQuery,
  onSearchChange,
  onAiToggle,
  pendingApprovals,
}: ChatSidebarProps) {
  const [showNeedsActionOnly, setShowNeedsActionOnly] = useState(true)

  // Get contact IDs that have pending approvals
  const contactsWithPendingActions = new Set(
    pendingApprovals.map(approval => approval.contact_id.toString())
  )

  // Filter chats based on search and needs action toggle
  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    
    const needsAction = contactsWithPendingActions.has(chat.id)
    
    if (showNeedsActionOnly) {
      return matchesSearch && needsAction
    }
    
    return matchesSearch
  })

  // Only show red dot if there are actually filtered chats that need action
  const chatsNeedingAction = chats.filter(chat => contactsWithPendingActions.has(chat.id))
  const hasPendingActions = chatsNeedingAction.length > 0

  return (
    <div className="flex flex-col h-full border-r border-border bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="mb-3 flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-xl shadow-sm"
          />
          <h1 className="text-2xl font-semibold">Issa AI</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-gradient-to-r from-slate-50 to-slate-100 border border-border rounded-xl text-sm shadow-sm focus:shadow-md transition-all duration-200"
          />
        </div>

        {/* Needs Action Toggle */}
        <div className="flex gap-1 mt-3">
          <Button
            variant={showNeedsActionOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNeedsActionOnly(true)}
            className={cn(
              "flex-1 text-xs h-7 relative",
              showNeedsActionOnly 
                ? "bg-red-100 hover:bg-red-200 text-red-600 border border-red-300" 
                : "border-red-500 text-red-500 hover:bg-red-50"
            )}
          >
            Needs action
            {hasPendingActions && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </Button>
          <Button
            variant={!showNeedsActionOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNeedsActionOnly(false)}
            className={cn(
              "flex-1 text-xs h-7",
              !showNeedsActionOnly 
                ? "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300" 
                : "border-green-500 text-green-600 hover:bg-green-50"
            )}
          >
            All
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 overscroll-none custom-scrollbar">
        <div className="h-full">
          {filteredChats.length === 0 && showNeedsActionOnly ? (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-96">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">All caught up!</h3>
              <p className="text-xs text-gray-500">No pending AI responses need approval at the moment.</p>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center min-h-96">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No conversations found</h3>
              <p className="text-xs text-gray-500">Try adjusting your search or check back later.</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={cn(
                "flex items-center gap-3 py-2 px-4 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                selectedChatId === chat.id && "bg-gradient-to-r from-slate-100 to-slate-50"
              )}
            >
              {/* Avatar */}
              <div className="relative">
                <Avatar className="h-10 w-10 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-muted-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                {contactsWithPendingActions.has(chat.id) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-0 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm truncate leading-tight">{chat.user.name}</h3>
                    <p className="text-xs text-foreground leading-tight">ID: {chat.user.id}</p>
                  </div>
                  <AiBadge 
                    isActive={chat.aiActive}
                    onClick={() => onAiToggle(chat.id)}
                    className="flex-shrink-0 ml-3 mt-0.5"
                  />
                </div>
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}