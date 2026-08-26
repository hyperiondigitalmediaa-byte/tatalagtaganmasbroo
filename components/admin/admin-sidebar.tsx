"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users,
  Settings,
  Newspaper,
  Image,
  Menu,
  FileType,
  MessageCircle,
  Database,
  Palette,
  Share2,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    roles: ["ADMIN", "EDITOR"]
  },
  {
    title: "Artikel",
    icon: FileText,
    href: "/admin/artikel",
    roles: ["ADMIN", "EDITOR"]
  },
  {
    title: "Kategori",
    icon: FolderOpen,
    href: "/admin/kategori",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Menu",
    icon: Menu,
    href: "/admin/menu",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Halaman",
    icon: FileType,
    href: "/admin/halaman",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Banner",
    icon: Image,
    href: "/admin/banner",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Komentar",
    icon: MessageCircle,
    href: "/admin/komentar",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Backup",
    icon: Database,
    href: "/admin/backup",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Theme",
    icon: Palette,
    href: "/admin/theme",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Sidebar",
    icon: Newspaper,
    href: "/admin/sidebar",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Social Media",
    icon: Share2,
    href: "/admin/sosial-media",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Audit Log",
    icon: Shield,
    href: "/admin/audit-log",
    roles: ["ADMIN"] // Only ADMIN
  },
  {
    title: "Pengaturan",
    icon: Settings,
    href: "/admin/pengaturan",
    roles: ["ADMIN", "EDITOR"]
  }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const userRole = (session?.user as any)?.role || "EDITOR" // Default to EDITOR if not loaded yet

  // Filter menu based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Newspaper className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold">News Admin</h2>
            <p className="text-xs text-muted-foreground">Portal Berita</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
