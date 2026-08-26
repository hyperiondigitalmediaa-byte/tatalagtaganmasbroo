"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"

interface BannerAdProps {
  banner: {
    id: string
    title: string
    type: string
    imageUrl: string | null
    adCode: string | null
    linkUrl: string | null
  }
  variant?: "horizontal" | "sidebar"
}

export function BannerAd({ banner, variant = "horizontal" }: BannerAdProps) {
  const scriptContainerRef = useRef<HTMLDivElement>(null)
  const isScriptExecuted = useRef(false)

  useEffect(() => {
    if (banner.type === "SCRIPT" && banner.adCode && scriptContainerRef.current && !isScriptExecuted.current) {
      // Clear previous content
      scriptContainerRef.current.innerHTML = banner.adCode
      
      // Execute scripts in the ad code with error handling
      const scripts = scriptContainerRef.current.getElementsByTagName("script")
      Array.from(scripts).forEach((script) => {
        try {
          const newScript = document.createElement("script")
          Array.from(script.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value)
          })
          
          // Wrap script content with try-catch to prevent AdSense errors
          const scriptContent = script.textContent || ""
          if (scriptContent.includes("adsbygoogle")) {
            // Check if there are adsbygoogle elements before pushing
            newScript.textContent = `
              try {
                ${scriptContent}
              } catch (e) {
                console.warn('Ad script error (safe to ignore):', e.message);
              }
            `
          } else {
            newScript.textContent = scriptContent
          }
          
          script.parentNode?.replaceChild(newScript, script)
        } catch (err) {
          console.warn("Script execution error:", err)
        }
      })
      
      isScriptExecuted.current = true
    }
  }, [banner.type, banner.adCode])

  // Render script-based ad
  if (banner.type === "SCRIPT" && banner.adCode) {
    return (
      <div 
        className={`overflow-hidden rounded-lg ${
          variant === "sidebar" 
            ? "w-full max-w-[300px] min-h-[250px] mx-auto" // 300x250 for sidebar ads
            : "w-full min-h-[90px]" // Full width for horizontal ads (728x90 or larger)
        }`}
      >
        <div 
          ref={scriptContainerRef} 
          className={variant === "sidebar" ? "w-[300px] h-[250px]" : "w-full min-h-[90px]"}
        />
      </div>
    )
  }

  // Render image-based ad
  if (banner.type === "IMAGE" && banner.imageUrl) {
    const content = (
      <div 
        className={`relative w-full overflow-hidden rounded-lg ${
          variant === "sidebar" 
            ? "h-[250px]" // Fixed height 250px for sidebar (300x250)
            : "h-[120px]" // Larger height for horizontal banner (728x90 or 970x90)
        }`}
      >
        <Image
          src={banner.imageUrl}
          alt={banner.title}
          fill
          className="object-cover"
          priority={variant === "horizontal"}
        />
      </div>
    )

    if (banner.linkUrl) {
      return (
        <Link href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-90 transition-opacity">
          {content}
        </Link>
      )
    }

    return content
  }

  return null
}
