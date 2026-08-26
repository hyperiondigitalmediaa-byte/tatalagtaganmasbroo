export default function BuatArtikelLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Title */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Slug */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Featured Image */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-48 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Content Editor */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-96 bg-gray-200 rounded w-full"></div>
            </div>

            {/* Excerpt */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-12 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
