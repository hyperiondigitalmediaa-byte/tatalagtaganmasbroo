export default function ArticleLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content - 2 columns */}
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-sm p-8 animate-pulse">
              {/* Category & Date */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>

              {/* Title */}
              <div className="space-y-3 mb-6">
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-4/5"></div>
              </div>

              {/* Author & Views */}
              <div className="flex items-center gap-4 mb-6">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>

              {/* Featured Image */}
              <div className="w-full h-96 bg-gray-200 rounded-sm mb-8"></div>

              {/* Content */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex gap-2 mt-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded-full w-20"></div>
                ))}
              </div>
            </article>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
