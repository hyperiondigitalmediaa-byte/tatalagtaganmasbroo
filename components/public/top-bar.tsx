"use client"

import { useEffect, useState } from "react"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

interface SocialMedia {
  id: string
  platform: string
  url: string
}

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: MessageCircle,
  whatsapp: MessageCircle,
}

export function TopBar() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])

  useEffect(() => {
    fetch("/api/social-media")
      .then((res) => res.json())
      .then((data) => setSocialMedia(data))
      .catch((err) => console.error("Error loading social media:", err))
  }, [])

  // Get current date in Indonesian format
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div
      className="text-white py-1.5"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 flex items-center justify-between text-sm">
        {/* Left: Social Media Icons */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium hidden sm:inline">
            Ikuti Kami:
          </span>
          <div className="flex items-center gap-2">
            {socialMedia.map((item) => {
              const Icon = platformIcons[item.platform] || MessageCircle
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-300 transition-colors"
                  aria-label={item.platform}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Right: Date */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="hidden sm:inline">📅</span>
          <time suppressHydrationWarning>{currentDate}</time>
        </div>
      </div>
    </div>
  )
}
