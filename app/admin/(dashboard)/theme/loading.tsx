export default function ThemeLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )
}
