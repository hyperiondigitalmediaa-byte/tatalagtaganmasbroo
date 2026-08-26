"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Menu, 
  X, 
  Search, 
  Newspaper,
  Home
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
}

interface MenuItem {
  id: string
  label: string
  url: string
  type: string
  openNewTab: boolean
  children?: MenuItem[]
}

interface NavbarProps {
  categories: Category[]
  menus: MenuItem[]
  logoUrl?: string
  siteName?: string
}

export function Navbar({ categories, menus, logoUrl, siteName = "Portal Berita" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/cari?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const isActive = (path: string) => pathname === path

  // Close search modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    
    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            {logoUrl ? (
              <div className="relative h-12 w-auto max-w-[200px] group-hover:scale-105 transition-transform">
                <img 
                  src={logoUrl} 
                  alt={siteName}
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-primary))' }}>
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">{siteName}</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Berita Terkini & Terpercaya</p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {menus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0
              const isHome = menu.label.toLowerCase() === 'home'
              
              if (hasChildren) {
                // Dropdown Menu
                return (
                  <div key={menu.id} className="relative group">
                    <button
                      className={cn(
                        "px-3 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap uppercase flex items-center gap-1.5",
                        "text-gray-800"
                      )}
                      style={{
                        ['--hover-color' as any]: 'var(--color-primary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)'
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = ''
                        e.currentTarget.style.backgroundColor = ''
                      }}
                    >
                      {menu.label}
                      <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Content */}
                    <div className="absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        {menu.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            target={child.openNewTab ? "_blank" : undefined}
                            rel={child.openNewTab ? "noopener noreferrer" : undefined}
                            className={cn(
                              "block px-4 py-2.5 text-sm font-semibold transition-colors uppercase",
                              isActive(child.url)
                                ? "border-l-4"
                                : "text-gray-700 hover:border-l-4"
                            )}
                            style={isActive(child.url) ? {
                              color: 'var(--color-primary)',
                              backgroundColor: 'var(--color-primary)10',
                              borderColor: 'var(--color-primary)'
                            } : undefined}
                            onMouseEnter={(e) => {
                              if (!isActive(child.url)) {
                                e.currentTarget.style.color = 'var(--color-primary)'
                                e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                                e.currentTarget.style.borderColor = 'var(--color-primary)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive(child.url)) {
                                e.currentTarget.style.color = ''
                                e.currentTarget.style.backgroundColor = ''
                                e.currentTarget.style.borderColor = ''
                              }
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              
              // Regular Menu with Home Icon
              return (
                <Link
                  key={menu.id}
                  href={menu.url}
                  target={menu.openNewTab ? "_blank" : undefined}
                  rel={menu.openNewTab ? "noopener noreferrer" : undefined}
                  className={cn(
                    "px-3 py-2 rounded-lg font-semibold transition-all text-sm whitespace-nowrap uppercase flex items-center gap-1.5",
                    isActive(menu.url)
                      ? "shadow-sm"
                      : "text-gray-800"
                  )}
                  style={isActive(menu.url) ? {
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary)10'
                  } : undefined}
                  onMouseEnter={(e) => {
                    if (!isActive(menu.url)) {
                      e.currentTarget.style.color = 'var(--color-primary)'
                      e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(menu.url)) {
                      e.currentTarget.style.color = ''
                      e.currentTarget.style.backgroundColor = ''
                    }
                  }}
                >
                  {isHome && <Home className="h-4 w-4" />}
                  {menu.label}
                </Link>
              )
            })}
          </div>

          {/* Search Icon Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex transition-colors"
              onClick={() => setIsSearchOpen(true)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                e.currentTarget.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = ''
                e.currentTarget.style.color = ''
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="max-w-7xl mx-auto px-8 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            {menus.map((menu) => {
              const hasChildren = menu.children && menu.children.length > 0
              const isHome = menu.label.toLowerCase() === 'home'
              
              return (
                <div key={menu.id}>
                  {hasChildren ? (
                    // Parent with submenu
                    <div>
                      <div className="px-4 py-3 font-bold text-gray-900 uppercase text-sm flex items-center gap-2">
                        {menu.label}
                      </div>
                      {menu.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          target={child.openNewTab ? "_blank" : undefined}
                          rel={child.openNewTab ? "noopener noreferrer" : undefined}
                          className={cn(
                            "block pl-8 pr-4 py-2.5 text-sm font-semibold transition-colors uppercase",
                            isActive(child.url)
                              ? "border-l-4"
                              : "text-gray-700"
                          )}
                          style={isActive(child.url) ? {
                            color: 'var(--color-primary)',
                            backgroundColor: 'var(--color-primary)10',
                            borderColor: 'var(--color-primary)'
                          } : undefined}
                          onClick={() => setIsOpen(false)}
                          onMouseEnter={(e) => {
                            if (!isActive(child.url)) {
                              e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                              e.currentTarget.style.color = 'var(--color-primary)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive(child.url)) {
                              e.currentTarget.style.backgroundColor = ''
                              e.currentTarget.style.color = ''
                            }
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    // Regular menu with Home icon
                    <Link
                      href={menu.url}
                      target={menu.openNewTab ? "_blank" : undefined}
                      rel={menu.openNewTab ? "noopener noreferrer" : undefined}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors uppercase",
                        isActive(menu.url)
                          ? "shadow-sm"
                          : "text-gray-800"
                      )}
                      style={isActive(menu.url) ? {
                        color: 'var(--color-primary)',
                        backgroundColor: 'var(--color-primary)10'
                      } : undefined}
                      onClick={() => setIsOpen(false)}
                      onMouseEnter={(e) => {
                        if (!isActive(menu.url)) {
                          e.currentTarget.style.backgroundColor = 'var(--color-primary)10'
                          e.currentTarget.style.color = 'var(--color-primary)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive(menu.url)) {
                          e.currentTarget.style.backgroundColor = ''
                          e.currentTarget.style.color = ''
                        }
                      }}
                    >
                      {isHome && <Home className="h-4 w-4" />}
                      {menu.label}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={(e) => {
              handleSearch(e)
              setIsSearchOpen(false)
            }}>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari berita, kategori, atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-16 py-7 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-100"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </form>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-500">
                Tekan <kbd className="px-2 py-1 bg-white border rounded text-xs font-semibold">Enter</kbd> untuk mencari atau <kbd className="px-2 py-1 bg-white border rounded text-xs font-semibold">Esc</kbd> untuk menutup
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
