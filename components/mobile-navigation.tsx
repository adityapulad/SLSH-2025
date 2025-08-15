"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Map, User, Users, QrCode, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      isActive: pathname === "/",
    },
    {
      icon: Map,
      label: "Map",
      path: "/map",
      isActive: pathname === "/map",
    },
    {
      icon: QrCode,
      label: "Scan",
      path: "/scan",
      isActive: pathname === "/scan",
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      isActive: pathname === "/profile",
    },
    {
      icon: Users,
      label: "Community",
      path: "/events",
      isActive: pathname === "/events",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="grid grid-cols-5 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => router.push(item.path)}
              className={cn(
                "flex flex-col items-center py-2 px-1 h-16 rounded-none border-0 active:scale-95 transition-all duration-200",
                item.isActive ? "text-green-600 bg-green-50" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <Icon className={cn("h-5 w-5 mb-1", item.isActive && "text-green-600")} />
              <span className={cn("text-xs font-medium", item.isActive && "text-green-600")}>{item.label}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
