import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { BackButton } from "@/components/back-button"

export const dynamic = 'force-dynamic'

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

  return categories
}

export default async function NotFound() {
  const popularCategories = await getPopularCategories()
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-slate-200 dark:text-slate-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🔍</div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.
            Mungkin link-nya salah atau halaman sudah dihapus.
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
              Lihat Semua Artikel
            </Link>
          </Button>
        </div>

        {/* Popular Categories - Dynamic */}
        {popularCategories.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Atau coba kategori populer:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {popularCategories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="px-4 py-2 bg-white dark:bg-slate-800 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
                >
                  {category.name}
                  <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500">
                    ({category._count.articles})
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="pt-4">
          <BackButton />
        </div>
      </div>
    </div>
  )
}
