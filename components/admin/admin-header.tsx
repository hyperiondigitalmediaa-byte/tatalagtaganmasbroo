"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, User, Settings, Menu, Bell } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

interface Notification {
  id: string
  content: string
  createdAt: string
  user: { name: string }
  article: { title: string; slug: string }
}

export function AdminHeader() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds for new comments
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications")
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <SidebarTrigger>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SidebarTrigger>
          <div className="hidden sm:block">
            <h1 className="text-xl font-semibold">Dashboard Admin</h1>
            <p className="text-sm text-muted-foreground">Kelola konten berita Anda</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-semibold">Dashboard</h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-4">
          {/* Notification Bell */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Komentar Baru</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-muted-foreground">{unreadCount} baru</span>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Tidak ada komentar baru
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <Link
                      key={notif.id}
                      href={`/${notif.article.slug}#comments`}
                      onClick={() => setIsOpen(false)}
                    >
                      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                        <div className="flex items-start justify-between w-full gap-2">
                          <p className="text-sm font-medium line-clamp-1">{notif.user.name}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                              locale: idLocale,
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{notif.content}</p>
                        <p className="text-xs text-blue-600 line-clamp-1">📄 {notif.article.title}</p>
                      </DropdownMenuItem>
                    </Link>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <Link href="/admin/komentar" onClick={() => setIsOpen(false)}>
                    <DropdownMenuItem className="justify-center text-sm font-medium text-primary cursor-pointer">
                      Lihat Semua Komentar
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 gap-2 px-2 sm:px-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {session?.user?.name ? getInitials(session.user.name) : "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{session?.user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(session?.user as any)?.role || "Admin"}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
