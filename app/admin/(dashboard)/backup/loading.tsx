export default function BackupLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center p-4 border rounded">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
