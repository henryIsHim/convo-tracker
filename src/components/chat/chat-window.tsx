import { ArrowLeft, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatUser, Message } from "@/types/chat"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
  user: ChatUser | null
  messages: Message[]
  onBack?: () => void
}

export function ChatWindow({ user, messages, onBack }: ChatWindowProps) {

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No chat selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Choose a conversation from the sidebar to see the chat history.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Back button for mobile */}
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 md:hidden"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Avatar className="h-10 w-10 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-muted-foreground">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-foreground">ID: {user.id}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 overscroll-none custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              {!message.isCurrentUser && (
                <Avatar className="h-8 w-8 mt-1 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={cn(
                  "rounded-xl text-base shadow-sm transition-all duration-200 hover:shadow-md",
                  message.isCurrentUser
                    ? "bg-gradient-to-br from-slate-800 to-slate-900 text-primary-foreground ml-2 px-3 py-2"
                    : "bg-gradient-to-br from-slate-50 to-slate-100 mr-2 px-3 py-2 shadow-slate-200/50"
                )}
              >
                {/* Response Type - Only for outgoing messages */}
                {message.isCurrentUser && message.responseType && (
                  <div className="mb-1">
                    <span className={cn(
                      "text-sm font-medium",
                      message.responseType === "ai" 
                        ? "text-blue-400" 
                        : "text-green-400"
                    )}>
                      {message.responseType === "ai" ? "ai_response" : "human_response"}
                    </span>
                  </div>
                )}
                
                <p className="break-words">{message.content}</p>
                <span
                  className={cn(
                    "text-sm mt-1 block",
                    message.isCurrentUser
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground"
                  )}
                >
                  {message.timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

    </div>
  )
}