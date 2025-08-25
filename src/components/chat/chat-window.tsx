import { ArrowLeft, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChatUser, Message } from "@/types/chat"
import { cn } from "@/lib/utils"
import { AiBadge } from "./ai-badge"

interface ChatWindowProps {
  user: ChatUser | null
  messages: Message[]
  onBack?: () => void
  aiActive?: boolean
  onAiToggle?: () => void
  onApproveMessage?: (messageId: string) => void
  onRejectMessage?: (messageId: string) => void
}

export function ChatWindow({ user, messages, onBack, aiActive, onAiToggle, onApproveMessage, onRejectMessage }: ChatWindowProps) {

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
    <div className="flex flex-col h-full bg-background min-h-0">
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
          <div className="flex items-center gap-2">
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-foreground">ID: {user.id}</p>
            </div>
            {aiActive !== undefined && onAiToggle && (
              <AiBadge 
                isActive={aiActive}
                onClick={onAiToggle}
                variant="header"
                className="flex-shrink-0"
              />
            )}
          </div>
        </div>
        
        {/* View on Respond.io Button */}
        <Button
          onClick={() => {
            const url = `https://app.respond.io/space/278994/inbox/${user.id}`
            window.open(url, '_blank')
          }}
          size="sm"
          className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-4 rounded text-sm font-medium transition-colors h-7"
        >
          View on Respond.io
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pl-4 pr-1 py-4">
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
                  "rounded-xl text-base shadow-sm transition-all duration-200",
                  message.isCurrentUser
                    ? message.responseType === "ai"
                      ? message.aiStatus === "pending"
                        ? "bg-slate-800 text-white ml-2 px-4 py-3 border border-slate-600" // Task 4: Pending AI (dark)
                        : "bg-gray-300 text-black ml-2 px-3 py-2" // Task 3: Sent AI (darker gray with black text)
                      : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900 ml-2 px-3 py-2 shadow-slate-200/50"
                    : "bg-gradient-to-br from-slate-50 to-slate-100 mr-2 px-3 py-2 shadow-slate-200/50"
                )}
              >
                {/* Response Type - Only for outgoing messages */}
                {message.isCurrentUser && message.responseType && (
                  <div className="mb-2">
                    <span className={cn(
                      "text-sm font-medium",
                      message.responseType === "ai" 
                        ? message.aiStatus === "pending"
                          ? "text-blue-300" 
                          : "text-blue-600"
                        : "text-black"
                    )}>
                      {message.responseType === "ai" 
                        ? message.aiStatus === "pending" 
                          ? "ai_response" 
                          : "Issa AI"
                        : "Team"}
                    </span>
                  </div>
                )}
                
                <p className={cn(
                  "break-words",
                  message.responseType === "ai" && message.aiStatus === "pending" && "font-bold"
                )}>{message.content}</p>

                {/* Task 4: Approve/Reject buttons for pending AI messages */}
                {message.responseType === "ai" && message.aiStatus === "pending" && (
                  <div className="mt-3 flex justify-between items-end">
                    <span className={cn(
                      "text-sm",
                      "text-gray-400"
                    )}>
                      {message.timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      {message.knowledgeBaseId && (
                        <div className="text-xs text-gray-400">
                          Knowledge base ID: {message.knowledgeBaseId}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => onApproveMessage?.(message.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded h-6"
                        >
                          Approve and send
                        </Button>
                        <Button
                          onClick={() => onRejectMessage?.(message.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded h-6"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular timestamp for non-pending messages */}
                {!(message.responseType === "ai" && message.aiStatus === "pending") && (
                  <span
                    className={cn(
                      "text-sm mt-2 block",
                      message.isCurrentUser
                        ? message.responseType === "ai"
                          ? message.aiStatus === "pending"
                            ? "text-gray-400"
                            : "text-gray-500"
                          : "text-slate-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.isCurrentUser && message.aiStatus !== "pending" && "Sent "}
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}