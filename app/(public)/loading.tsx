export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-[280px] sm:h-[350px] md:h-[400px] lg:h-[500px] bg-gray-200 rounded-sm mb-4"></div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Article Cards Skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-sm shadow-sm p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-sm flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-sm shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded-sm"></div>
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
