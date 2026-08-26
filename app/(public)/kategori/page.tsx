import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Breadcrumb } from "@/components/public/breadcrumb"
import { FolderOpen, FileText } from "lucide-react"

// Force dynamic rendering to avoid build-time database queries
export const dynamic = 'force-dynamic'

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true }
      }
    },
    orderBy: { name: "asc" }
  })

  return categories
}

export const metadata = {
  title: "Semua Kategori - Portal Berita",
  description: "Jelajahi semua kategori berita yang tersedia"
}

export const revalidate = 60

export default async function AllCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-6">
          <Breadcrumb items={[{ label: "Kategori" }]} />

          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Semua Kategori</h1>
            <p className="text-gray-600 mt-2">Jelajahi berita berdasarkan kategori</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <FolderOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>{category._count.articles} artikel</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
