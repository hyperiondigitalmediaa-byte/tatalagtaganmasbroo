import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function getPopularCategories() {
  const categories = await prisma.category.findMany({
    where: {
      articles: {
        some: {
          status: "PUBLISHED"
        }
      }
    },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISHED"
            }
          }
        }
      }
    },
    orderBy: {
      articles: {
        _count: "desc"
      }
    },
    take: 4
  })

  return categories as Array<{
    id: string
    name: string
    slug: string
    _count: {
      articles: number
    }
  }>
}

export default async function ArticleNotFound() {
  const popularCategories = await getPopularCategories()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center">
            <FileText className="w-16 h-16 text-slate-400" strokeWidth={1.5} />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Maaf, artikel yang Anda cari tidak ditemukan. 
            Mungkin artikel sudah dihapus atau URL-nya salah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/artikel">
              <FileText className="mr-2 h-5 w-5" />
              Lihat Artikel Lainnya
            </Link>
          </Button>
        </div>

        {/* Popular Categories - Dynamic */}
        {popularCategories.length > 0 && (
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Atau coba kategori populer:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {popularCategories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  {category.name}
                  <span className="ml-1.5 text-xs text-gray-400">
                    ({category._count.articles})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
