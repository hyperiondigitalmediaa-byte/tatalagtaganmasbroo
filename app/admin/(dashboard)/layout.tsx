import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/admin/login")
  }

  // Block USER role from accessing admin dashboard
  if ((session.user as any)?.role === "USER") {
    redirect("/")
  }

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-3 sm:p-4 lg:p-6 bg-slate-50/50 overflow-x-hidden">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </SessionProvider>
  )
}
