import { prisma } from "@/lib/prisma"
import { BannerForm } from "@/components/admin/banner-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

async function getBanner(id: string) {
  const banner = await prisma.banner.findUnique({
    where: { id }
  })
  return banner
}

export default async function EditBannerPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const banner = await getBanner(id)

  if (!banner) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/banner">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Banner</h1>
          <p className="text-muted-foreground">Ubah banner iklan</p>
        </div>
      </div>

      <BannerForm banner={banner} />
    </div>
  )
}
