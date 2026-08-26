import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/public/navbar"
import { Footer } from "@/components/public/footer"
import { BannerAd } from "@/components/public/banner-ad"
import { FloatingAds } from "@/components/public/floating-ads"
import { TrendingTicker } from "@/components/public/trending-ticker"
import { TopBar } from "@/components/public/top-bar"

async function getCategories() {
  // Skip database query during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [];
  }
  
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })
  return categories
}

async function getMenus() {
  // Skip database query during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [];
  }
  
  const menus = await prisma.menu.findMany({
    where: { 
      isActive: true,
      parentId: null // Only top-level menus
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { order: "asc" }
      }
    },
    orderBy: { order: "asc" }
  })
  return menus
}

async function getHeaderBanner() {
  const banner = await prisma.banner.findFirst({
    where: {
      isActive: true,
      position: "HEADER"
    },
    orderBy: { order: "asc" }
  })
  return banner
}

async function getFloatingBanners() {
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      position: {
        in: ["FLOATING_LEFT", "FLOATING_RIGHT"]
      }
    },
    select: {
      id: true,
      title: true,
      type: true,
      imageUrl: true,
      adCode: true,
      linkUrl: true,
      position: true
    },
    orderBy: { order: "asc" }
  })
  return banners
}

async function getTrendingArticles() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      title: true,
      views: true
    },
    orderBy: { views: "desc" },
    take: 10
  })
  return articles
}

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { category: "general" },
    })

    const result: Record<string, string> = {
      siteName: "Portal Berita",
      logoUrl: "",
    }

    settings.forEach((setting: any) => {
      result[setting.key] = setting.value
    })

    return result
  } catch (error) {
    return {
      siteName: "Portal Berita",
      logoUrl: "",
    }
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [categories, menus, headerBanner, floatingBanners, trendingArticles, siteSettings] = await Promise.all([
    getCategories(),
    getMenus(),
    getHeaderBanner(),
    getFloatingBanners(),
    getTrendingArticles(),
    getSiteSettings()
  ])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar with Social Media & Date */}
      <TopBar />
      
      <Navbar 
        categories={categories} 
        menus={menus} 
        logoUrl={siteSettings.logoUrl}
        siteName={siteSettings.siteName}
      />
      
      {/* Trending Ticker */}
      <TrendingTicker articles={trendingArticles} />
      
      {/* Header Banner - Large banner below navbar */}
      {headerBanner && (
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <BannerAd banner={headerBanner} variant="horizontal" />
          </div>
        </div>
      )}
      
      {/* Floating Ads */}
      {floatingBanners.length > 0 && (
        <FloatingAds banners={floatingBanners} />
      )}
      
      <main className="flex-1">
        {children}
      </main>
      <Footer categories={categories} />
    </div>
  )
}
