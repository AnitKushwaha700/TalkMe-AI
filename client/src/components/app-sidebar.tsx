"use client"

import * as React from "react"
import {
  Home,
  Mic,
  Settings,
  User,
  LayoutDashboard,
  GraduationCap,
  History,
  BookOpen,
  Lightbulb,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const data = {
  navMain: [
    {
      title: "Navigation",
      items: [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Practice",
          url: "/practice",
          icon: GraduationCap,
        },
        {
          title: "Voice Assistant",
          url: "/voice",
          icon: Mic,
        },
      ],
    },
    {
      title: "Review",
      items: [
        {
          title: "History",
          url: "/history",
          icon: History,
        },
        {
          title: "Grammar",
          url: "/grammar",
          icon: BookOpen,
        },
        {
          title: "Vocabulary",
          url: "/vocabulary",
          icon: Lightbulb,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Profile",
          url: "/profile",
          icon: User,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center gap-2">
          <Mic className="h-6 w-6 text-indigo-600" />
          TalkMe AI
        </h2>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        isActive={isActive} 
                        render={<Link href={item.url} />}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
