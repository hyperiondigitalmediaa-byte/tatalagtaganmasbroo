import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { UserForm } from "@/components/admin/user-form"

export default async function BuatUserPage() {
  const session = await auth()

  // Only ADMIN can access this page
  if (!session || (session.user as any)?.role !== "ADMIN") {
    redirect("/admin")
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tambah User Baru</h1>
        <p className="text-muted-foreground mt-2">
          Buat akun admin atau editor baru
        </p>
      </div>

      <UserForm />
    </div>
  )
}
