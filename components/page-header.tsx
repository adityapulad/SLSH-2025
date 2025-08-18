"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, User, MoreVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  showBack?: boolean
  rightAction?: "settings" | "profile" | "menu" | ReactNode
  onRightAction?: () => void
  className?: string
}

export function PageHeader({ title, showBack = true, rightAction, onRightAction, className = "" }: PageHeaderProps) {
  const router = useRouter()

  const getRightActionIcon = () => {
    switch (rightAction) {
      case "settings":
        return <Settings className="h-4 w-4" />
      case "profile":
        return <User className="h-4 w-4" />
      case "menu":
        return <MoreVertical className="h-4 w-4" />
      default:
        return rightAction
    }
  }

  return (
    <div className={`bg-white border-b border-gray-200 sticky top-0 z-30 safe-area-pt ${className}`}>
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="h-10 px-3 active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        ) : (
          <div className="w-10" />
        )}

        <h1 className="font-semibold text-base sm:text-lg text-center truncate px-2">{title}</h1>

        {rightAction ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRightAction}
            className="h-10 w-10 p-0 active:scale-95 transition-transform"
          >
            {getRightActionIcon()}
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  )
}
