import { Search } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
            className="rounded-full"
          />
          <h1 className="text-2xl font-semibold">Chats</h1>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chats search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-muted/50 border border-border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 overscroll-none">
        <div>
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={cn(
                "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 mx-0",
                selectedChatId === chat.id && "bg-muted"
              )}
            >
              {/* Avatar */}
              <div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={chat.user.avatar} alt={chat.user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {chat.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate mb-1">{chat.user.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
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