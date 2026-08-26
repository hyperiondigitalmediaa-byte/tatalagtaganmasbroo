import { prisma } from "@/lib/prisma"
import { MenuForm } from "@/components/admin/menu-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getMenu(id: string) {
  const menu = await prisma.menu.findUnique({
    where: { id }
  })
  return menu
}

async function getParentMenus(currentMenuId: string) {
  const menus = await prisma.menu.findMany({
    where: { 
      parentId: null,
      NOT: { id: currentMenuId } // Exclude current menu to prevent circular reference
    },
    orderBy: { order: "asc" },
    select: { id: true, label: true }
  })
  return menus
}

export default async function EditMenuPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [menu, parentMenus] = await Promise.all([
    getMenu(id),
    getParentMenus(id)
  ])

  if (!menu) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/menu">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Menu</h1>
          <p className="text-muted-foreground">Ubah menu navigasi</p>
        </div>
      </div>

      <MenuForm menu={menu} parentMenus={parentMenus} />
    </div>
  )
}
