import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BannerAd } from "./banner-ad"

async function getSidebarData() {
  const [popularArticles, sidebarBanners] = await Promise.all([
    // Popular Articles
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
        views: true
      },
      orderBy: { views: "desc" },
      take: 6
    }),

    // Sidebar Banners
    prisma.banner.findMany({
      where: {
        isActive: true,
        position: "SIDEBAR"
      },
      select: {
        id: true,
        title: true,
        type: true,
        imageUrl: true,
        adCode: true,
        linkUrl: true
      },
      orderBy: { order: "asc" }
    })
  ])

  return { popularArticles, sidebarBanners }
}

export async function Sidebar() {
  const { popularArticles, sidebarBanners } = await getSidebarData()

  return (
    <aside className="lg:col-span-4 space-y-6">
      {/* Popular Articles */}
      <div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
            <h2 className="text-xl text-gray-900 font-bold">Terpopuler</h2>
            <Link 
              href="/index" 
              className="text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ color: 'var(--color-primary)' }}
            >
              INDEKS →
            </Link>
          </div>

          <div className="space-y-0 divide-y divide-gray-100">
            {popularArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/${article.slug}`}
                className="group flex gap-4 py-4 first:pt-0 hover:bg-gray-50 px-2 -mx-2 rounded transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-3">
                    {article.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Banners */}
      {sidebarBanners.length > 0 ? (
        <div className="space-y-6">
          {sidebarBanners.map((banner) => (
            <BannerAd key={banner.id} banner={banner} variant="sidebar" />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 text-center border border-blue-100">
          <p className="text-sm text-gray-500 mb-2">Advertisement</p>
          <div className="w-full h-64 bg-white/50 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Ad Space 300x250</p>
          </div>
        </div>
      )}
    </aside>
  )
}
