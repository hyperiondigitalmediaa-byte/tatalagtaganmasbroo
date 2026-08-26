"use client"

import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Format date consistently on client side
function formatDate(dateString: string | Date | null) {
  if (!dateString) return ""
  const date = new Date(dateString)
  const dateStr = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const timeStr = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
  return `${dateStr} - ${timeStr} WIB`
}

interface Article {
  id: string
  slug: string
  title: string
  featuredImage: string | null
  publishedAt: string | Date | null
  category: {
    name: string
    slug: string
  }
}

interface ArticleSliderProps {
  articles: Article[]
}

export function ArticleSlider({ articles }: ArticleSliderProps) {
  const [mounted, setMounted] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      slidesToScroll: 1
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  if (articles.length === 0) return null

  // Prevent hydration mismatch by not rendering interactive elements until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <div className="overflow-hidden rounded-sm">
            <div className="flex">
              <div className="flex-[0_0_100%] min-w-0">
                <Link
                  href={`/${articles[0].slug}`}
                  className="group block relative overflow-hidden h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
                >
                  <div className="relative w-full h-full">
                    {articles[0].featuredImage ? (
                      <Image
                        src={articles[0].featuredImage}
                        alt={articles[0].title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <Badge className="mb-3 uppercase" style={{ backgroundColor: 'var(--color-primary)' }}>
                      {articles[0].category.name}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2 line-clamp-2">
                      {articles[0].title}
                    </h2>
                    {articles[0].publishedAt && (
                      <p className="text-sm text-gray-300" suppressHydrationWarning>
                        {formatDate(articles[0].publishedAt)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {articles.slice(0, 5).map((article, index) => (
            <div
              key={article.id}
              className={`relative overflow-hidden rounded-sm h-20 ${
                index === 0 ? "ring-4" : "ring-2 ring-gray-200"
              }`}
              style={index === 0 ? { borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as any : undefined}
            >
              <div className="relative w-full h-full">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                )}
                <div className={`absolute inset-0 ${index === 0 ? "bg-black/20" : "bg-black/50"}`} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xs font-bold ${index === 0 ? "text-white text-sm" : "text-white/80"}`}>
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Slider */}
      <div className="relative">
        <div className="overflow-hidden rounded-sm" ref={emblaRef}>
          <div className="flex">
            {articles.map((article) => (
              <div key={article.id} className="flex-[0_0_100%] min-w-0">
                <Link
                  href={`/${article.slug}`}
                  className="group block relative overflow-hidden h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px]"
                >
                  <div className="relative w-full h-full">
                    {article.featuredImage ? (
                      <Image
                        src={article.featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <Badge className="mb-3 uppercase" style={{ backgroundColor: 'var(--color-primary)' }}>
                      {article.category.name}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2 line-clamp-2 transition-colors">
                      {article.title}
                    </h2>
                    {article.publishedAt && (
                      <p className="text-sm text-gray-300" suppressHydrationWarning>
                        {formatDate(article.publishedAt)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Thumbnails Slider */}
      <div className="grid grid-cols-5 gap-3">
        {articles.map((article, index) => (
          <button
            key={article.id}
            onClick={() => scrollTo(index)}
            className={`group relative overflow-hidden rounded-sm h-20 transition-all ${
              index === selectedIndex
                ? "ring-4 scale-105"
                : "ring-2 ring-gray-200 hover:ring-gray-400"
            }`}
            style={index === selectedIndex ? { borderColor: 'var(--color-primary)', '--tw-ring-color': 'var(--color-primary)' } as any : undefined}
          >
            <div className="relative w-full h-full">
              {article.featuredImage ? (
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
              )}
              <div className={`absolute inset-0 transition-all ${
                index === selectedIndex
                  ? "bg-black/20"
                  : "bg-black/50 group-hover:bg-black/30"
              }`} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold transition-all ${
                index === selectedIndex
                  ? "text-white text-sm"
                  : "text-white/80"
              }`}>
                {index + 1}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
