import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl?: string
}

export function Pagination({ currentPage, totalPages, baseUrl = "/" }: PaginationProps) {
  // Always show pagination, even if only 1 page (for UI consistency)
  const pages = totalPages || 1
  
  const getPageUrl = (page: number) => {
    if (page === 1) return baseUrl
    return `${baseUrl}?page=${page}`
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const showEllipsis = pages > 7

    if (!showEllipsis) {
      // Show all pages if 7 or less
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Show first page, current page with neighbors, and last page
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push(-1) // Ellipsis
        pageNumbers.push(pages)
      } else if (currentPage >= pages - 2) {
        // Near end
        pageNumbers.push(1)
        pageNumbers.push(-1) // Ellipsis
        for (let i = pages - 4; i <= pages; i++) {
          pageNumbers.push(i)
        }
      } else {
        // Middle
        pageNumbers.push(1)
        pageNumbers.push(-1) // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push(-2) // Ellipsis
        pageNumbers.push(pages)
      }
    }

    return pageNumbers.map((page, index) => {
      if (page === -1 || page === -2) {
        return (
          <span key={`ellipsis-${index}`} className="px-4 py-2 text-gray-400">
            ...
          </span>
        )
      }

      const isActive = page === currentPage

      return (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isActive
              ? "text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
          }`}
          style={isActive ? { backgroundColor: 'var(--color-primary)' } : undefined}
        >
          {page}
        </Link>
      )
    })
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-16">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Sebelumnya</span>
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {renderPageNumbers()}
      </div>

      {/* Next Button */}
      {currentPage < pages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        >
          <span className="hidden sm:inline">Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
