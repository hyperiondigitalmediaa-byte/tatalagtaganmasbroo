"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Widget {
  id: string
  type: string
  title: string
  config: any
}

interface SidebarClientProps {
  widgets: Widget[]
  isSticky: boolean
  data: {
    popularArticles: any[]
    latestArticles: any[]
    categories: any[]
  }
}

export function SidebarClient({ widgets, isSticky, data }: SidebarClientProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const adsContainerRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/cari?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Execute script tags in ads
  useEffect(() => {
    const adsContainers = document.querySelectorAll('.ads-container')
    adsContainers.forEach((container) => {
      const scripts = container.querySelectorAll('script')
      scripts.forEach((script) => {
        const newScript = document.createElement('script')
        Array.from(script.attributes).forEach((attr) => {
          newScript.setAttribute(attr.name, attr.value)
        })
        newScript.textContent = script.textContent
        script.parentNode?.replaceChild(newScript, script)
      })
    })
  }, [widgets])

  const renderWidget = (widget: Widget) => {
    const limit = widget.config?.limit || 5

    switch (widget.type) {
      case "search":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{widget.title}</h3>
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )

      case "trending":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
              {widget.title}
            </h3>
            <div className="space-y-0 divide-y divide-gray-100">
              {data.popularArticles.slice(0, limit).map((article, index) => (
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
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-3">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )

      case "latest":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
              {widget.title}
            </h3>
            <div className="space-y-4">
              {data.latestArticles.slice(0, limit).map((article) => (
                <Link
                  key={article.id}
                  href={`/${article.slug}`}
                  className="group block hover:bg-gray-50 p-2 -m-2 rounded transition-colors"
                >
                  <div className="flex gap-3">
                    {article.featuredImage && (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:opacity-80 transition-opacity line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(article.publishedAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )

      case "categories":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
              {widget.title}
            </h3>
            <div className="space-y-2">
              {data.categories.slice(0, limit).map((category) => (
                <Link
                  key={category.id}
                  href={`/kategori/${category.slug}`}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded transition-colors group"
                >
                  <span className="text-sm font-medium text-gray-900 group-hover:opacity-80">
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {category._count.articles}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )

      case "tags":
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b-2" style={{ borderColor: 'var(--color-primary)' }}>
              {widget.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {/* Tags will be implemented later */}
              <span className="text-sm text-gray-500">Coming soon...</span>
            </div>
          </div>
        )

      case "newsletter":
        return (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{widget.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Dapatkan update artikel terbaru langsung ke email Anda
            </p>
            <form className="space-y-2">
              <Input type="email" placeholder="Email Anda" />
              <Button className="w-full">Subscribe</Button>
            </form>
          </div>
        )

      case "ads":
        const adMode = widget.config?.mode || "code"
        const adSize = widget.config?.size || "300x250"
        
        // Mode: Image Banner
        if (adMode === "image" && widget.config?.imageUrl) {
          const imageUrl = widget.config.imageUrl
          const linkUrl = widget.config.linkUrl || "#"
          const openNewTab = widget.config.openNewTab ?? true

          return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="text-center py-1 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Advertisement</span>
              </div>
              <Link
                href={linkUrl}
                target={openNewTab ? "_blank" : "_self"}
                rel={openNewTab ? "noopener noreferrer" : ""}
                className="block"
              >
                <Image
                  src={imageUrl}
                  alt="Advertisement"
                  width={300}
                  height={250}
                  className="w-full h-auto"
                  style={{ display: "block" }}
                />
              </Link>
            </div>
          )
        }
        
        // Mode: Custom Code
        const adCode = widget.config?.adCode
        if (adCode) {
          const [width, height] = adSize === "auto" 
            ? ["100%", "auto"] 
            : adSize.split("x").map((s: string) => `${s}px`)

          return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="text-center py-1 bg-gray-50 border-b border-gray-200">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Advertisement</span>
              </div>
              <div 
                dangerouslySetInnerHTML={{ __html: adCode }}
                className="ads-container flex items-center justify-center"
                style={{
                  minHeight: height === "auto" ? "250px" : height,
                  width: "100%"
                }}
              />
            </div>
          )
        }
        
        // Placeholder
        const [placeholderWidth, placeholderHeight] = adSize === "auto"
          ? ["100%", "250px"]
          : adSize.split("x").map((s: string) => `${s}px`)

        return (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center border border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Advertisement</p>
            <div 
              className="bg-white rounded-lg flex items-center justify-center mx-auto"
              style={{
                width: placeholderWidth === "100%" ? "100%" : placeholderWidth,
                height: placeholderHeight,
                maxWidth: "100%"
              }}
            >
              <p className="text-gray-400 text-sm">Ad Space {adSize}</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <aside className={`space-y-6 ${isSticky ? 'lg:sticky lg:top-6 lg:self-start' : ''}`}>
      {widgets.map((widget) => (
        <div key={widget.id}>
          {renderWidget(widget)}
        </div>
      ))}
    </aside>
  )
}
