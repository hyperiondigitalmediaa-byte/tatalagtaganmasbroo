export default function IndeksLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-96"></div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles List - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0 animate-pulse">
                    {/* Image Skeleton */}
                    <div className="w-56 h-36 bg-gray-200 rounded-xl flex-shrink-0"></div>
                    
                    {/* Content Skeleton */}
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                      <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>

                    {/* Arrow Skeleton */}
                    <div className="flex-shrink-0 flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="mt-8 flex justify-center gap-2 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
