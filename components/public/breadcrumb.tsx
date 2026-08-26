import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": item.href ? `${baseUrl}${item.href}` : undefined
      }))
    ]
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb UI */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          {/* Home */}
          <li className="flex items-center gap-2">
            <Link 
              href="/" 
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
          </li>

          {/* Breadcrumb Items */}
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <>
                    <Link 
                      href={item.href}
                      className="hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  <span className={isLast ? "font-medium text-foreground" : ""}>
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
