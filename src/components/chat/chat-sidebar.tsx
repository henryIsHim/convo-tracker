import { Search, User } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Avatar,  AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Chat } from "@/types/chat"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  chats: Chat[]
  selectedChatId?: string
  onChatSelect: (chatId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ChatSidebar({
  chats,
  selectedChatId,
  onChatSelect,
  searchQuery,
  onSearchChange,
}: ChatSidebarProps) {
  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <h1 className="text-2xl font-semibold">Chats</h1>
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
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 overscroll-none custom-scrollbar">
        <div>
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={cn(
                "flex items-center gap-3 py-2 px-4 cursor-pointer transition-all duration-200 hover:bg-muted/50",
                selectedChatId === chat.id && "bg-gradient-to-r from-slate-100 to-slate-50"
              )}
            >
              {/* Avatar */}
              <div>
                <Avatar className="h-10 w-10 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-muted-foreground">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-0">
                  <h3 className="font-medium text-sm truncate leading-tight">{chat.user.name}</h3>
                  <p className="text-xs text-foreground leading-tight">ID: {chat.user.id}</p>
                </div>
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}