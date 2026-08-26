import { prisma } from "@/lib/prisma"
import { PageForm } from "@/components/admin/page-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getPage(id: string) {
  const page = await prisma.page.findUnique({
    where: { id }
  })
  return page
}

export default async function EditHalamanPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const page = await getPage(id)

  if (!page) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/halaman">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Halaman</h1>
          <p className="text-muted-foreground">Ubah halaman statis</p>
        </div>
      </div>

      <PageForm page={page} />
    </div>
  )
}
