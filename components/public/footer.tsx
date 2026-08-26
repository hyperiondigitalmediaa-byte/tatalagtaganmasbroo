"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Newspaper,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  MessageCircle,
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface FooterProps {
  categories: Category[]
}

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

const platformColors: Record<string, string> = {
  facebook: "hover:bg-blue-600",
  twitter: "hover:bg-blue-400",
  instagram: "hover:bg-pink-600",
  youtube: "hover:bg-red-600",
  linkedin: "hover:bg-blue-700",
  tiktok: "hover:bg-slate-600",
  whatsapp: "hover:bg-green-600",
}

export function Footer({ categories }: FooterProps) {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])

  useEffect(() => {
    fetch("/api/social-media")
      .then((res) => res.json())
      .then((data) => setSocialMedia(data))
      .catch((err) => console.error("Error loading social media:", err))
  }, [])

  return (
    <footer className="bg-slate-800 text-gray-300 border-t border-slate-700">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Portal Berita</h3>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Sumber berita terkini dan terpercaya. Menyajikan informasi akurat
              dan berimbang untuk Indonesia.
            </p>
            <div className="flex gap-3 flex-wrap">
              {socialMedia.map((item) => {
                const Icon = platformIcons[item.platform] || MessageCircle
                const colorClass =
                  platformColors[item.platform] || "hover:bg-slate-600"
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full bg-slate-700 ${colorClass} flex items-center justify-center transition-colors`}
                    aria-label={item.platform}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kategori</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/kategori/${category.slug}`}
                    className="text-sm hover:text-slate-300 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-slate-300 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-sm hover:text-slate-300 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="text-sm hover:text-slate-300 transition-colors">
                  Kontak
                </Link>
              </li>
              <li>
                <Link href="/redaksi" className="text-sm hover:text-slate-300 transition-colors">
                  Redaksi
                </Link>
              </li>
              <li>
                <Link href="/pedoman" className="text-sm hover:text-slate-300 transition-colors">
                  Pedoman Media Siber
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Portal Berita. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-slate-300 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-slate-300 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
