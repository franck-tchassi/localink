// nav-main.tsx
"use client"

import {
  IconChartBar,
  IconCreditCard,
  IconFileText,
  IconSettings,
  IconStars,
  IconUsers,
} from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FileCode2, LayoutDashboard, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useRef, useState } from "react"

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Navigation",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Generator",
        url: "/dashboard/generator",
        icon: FileCode2,
        badge: "New",
      },
      {
        title: "Clients",
        url: "/dashboard/clients",
        icon: IconUsers,
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Subscription",
        url: "/dashboard/account/subscription",
        icon: IconCreditCard,
        highlight: true,
      },
      {
        title: "Upgrade Plan",
        url: "/dashboard/account/billing",
        icon: IconStars,
        badge: "Pro",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "Configuration",
        url: "/dashboard/profile",
        icon: IconSettings,
      },
    ],
  },
]



export function NavMain() {
  const pathname = usePathname()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)

  useEffect(() => {
    const scrollElement = scrollAreaRef.current
    if (!scrollElement) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
      setScrollProgress(progress)
      setShowScrollIndicator(scrollHeight > clientHeight)
    }

    scrollElement.addEventListener('scroll', handleScroll)
    return () => scrollElement.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative h-[calc(100vh-65px)]">
      {/* Barre de progression verticale */}
      {showScrollIndicator && (
        <div className="absolute right-0 top-0 h-full w-1.5 bg-gray-200 rounded-full z-10">
          <div 
            className="bg-blue-500 w-full rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
      )}

      <ScrollArea 
        ref={scrollAreaRef}
        className="h-full w-full pr-3" // Ajout de padding pour éviter le chevauchement
      >
        <div className="space-y-6 py-4">
          {navSections.map((section: any) => (
            <SidebarGroup key={section.title}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center">
                <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-1 mr-2" />
                {section.title}
                <span className="bg-gradient-to-r from-transparent via-gray-300 to-transparent h-px flex-1 ml-2" />
              </h3>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item: any) => (
                    <Link 
                      href={item.url} 
                      key={item.title}
                      className={cn(
                        "group relative mx-2 flex items-center rounded-lg px-3 py-2 transition-all",
                        "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
                        pathname === item.url 
                          ? "bg-primary/10 font-medium text-primary shadow-inner" 
                          : "text-muted-foreground",
                        item.highlight && "bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100"
                      )}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          className="w-full gap-3 cursor-pointer"
                        >
                          {item.icon && (
                            <item.icon className={cn(
                              "h-5 w-5 shrink-0 transition-all",
                              item.highlight ? "text-blue-500" : "text-current",
                              pathname === item.url && !item.highlight ? "text-primary" : ""
                            )} />
                          )}
                          <span className="flex-1 truncate text-left">{item.title}</span>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === "Pro" ? "default" : "secondary"}
                              className="ml-auto"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {item.highlight && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Zap className="h-3 w-3 text-yellow-500 fill-yellow-300 animate-pulse" />
                        </span>
                      )}
                    </Link>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}