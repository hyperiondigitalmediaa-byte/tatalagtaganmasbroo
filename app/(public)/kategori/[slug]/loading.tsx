export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-64"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles Grid - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Skeleton */}
            <div className="flex justify-center gap-2 mt-8 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
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
