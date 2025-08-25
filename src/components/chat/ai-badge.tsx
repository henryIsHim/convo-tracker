import { cn } from "@/lib/utils"

interface AiBadgeProps {
  isActive: boolean
  onClick?: () => void
  className?: string
  variant?: 'sidebar' | 'header'
}

export function AiBadge({ isActive, onClick, className, variant = 'sidebar' }: AiBadgeProps) {
  const sizeClasses = variant === 'header' 
    ? "w-23 h-9 text-sm px-2 rounded border" 
    : "w-6 h-4 rounded border text-[10px]"
    
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-medium font-bold transition-colors duration-200 cursor-pointer select-none",
        sizeClasses,
        isActive 
          ? "bg-green-100 text-green-700 border-green-400 hover:bg-green-150" 
          : "bg-gray-100 text-gray-600 border-gray-400 hover:bg-gray-150",
        variant === 'header' && "border",
        className
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
    >
      {variant === 'header' ? 'AI enabled' : 'AI'}
    </div>
  )
}