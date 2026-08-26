"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"

interface FloatingAdsProps {
  banners: Array<{
    id: string
    title: string
    type: string
    imageUrl: string | null
    adCode: string | null
    linkUrl: string | null
    position: string
  }>
}

export function FloatingAds({ banners }: FloatingAdsProps) {
  const [closedAds, setClosedAds] = useState<string[]>([])
  const scriptContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const leftBanner = banners.find(b => b.position === "FLOATING_LEFT" && !closedAds.includes(b.id))
  const rightBanner = banners.find(b => b.position === "FLOATING_RIGHT" && !closedAds.includes(b.id))

  useEffect(() => {
    // Execute scripts for floating ads
    banners.forEach(banner => {
      if (banner.type === "SCRIPT" && banner.adCode && scriptContainerRefs.current[banner.id]) {
        const container = scriptContainerRefs.current[banner.id]
        if (container && container.children.length === 0) {
          container.innerHTML = banner.adCode
          
          const scripts = container.getElementsByTagName("script")
          Array.from(scripts).forEach((script) => {
            try {
              const newScript = document.createElement("script")
              Array.from(script.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value)
              })
              
              const scriptContent = script.textContent || ""
              if (scriptContent.includes("adsbygoogle")) {
                newScript.textContent = `
                  try {
                    ${scriptContent}
                  } catch (e) {
                    console.warn('Floating ad script error:', e.message);
                  }
                `
              } else {
                newScript.textContent = scriptContent
              }
              
              script.parentNode?.replaceChild(newScript, script)
            } catch (err) {
              console.warn("Floating ad script error:", err)
            }
          })
        }
      }
    })
  }, [banners])

  const handleClose = (bannerId: string) => {
    setClosedAds(prev => [...prev, bannerId])
  }

  const renderFloatingAd = (banner: typeof leftBanner, side: "left" | "right") => {
    if (!banner) return null

    // Calculate position to be very close to content
    // max-w-7xl = 1280px + padding xl:px-24 = 96px each side
    // Total = 1280px + 192px = 1472px
    // Make it closer by reducing gap to just 4px
    const sideStyle = side === "left" 
      ? { left: "calc((100vw - 1472px) / 2 + 4px)" }
      : { right: "calc((100vw - 1472px) / 2 + 4px)" }

    return (
      <div
        key={banner.id}
        className="fixed top-32 z-40 hidden xl:block"
        style={{ width: "160px", ...sideStyle }}
      >
        <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Close Button */}
          <button
            onClick={() => handleClose(banner.id)}
            className="absolute top-1 right-1 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            aria-label="Tutup iklan"
          >
            <X className="h-3 w-3" />
          </button>

          {/* Ad Content */}
          {banner.type === "IMAGE" && banner.imageUrl ? (
            banner.linkUrl ? (
              <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer">
                <div className="relative w-full h-[600px]">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-[600px]">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              </div>
            )
          ) : banner.type === "SCRIPT" && banner.adCode ? (
            <div
              ref={(el) => { scriptContainerRefs.current[banner.id] = el }}
              className="w-[160px] min-h-[600px]"
            />
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <>
      {renderFloatingAd(leftBanner, "left")}
      {renderFloatingAd(rightBanner, "right")}
    </>
  )
}
