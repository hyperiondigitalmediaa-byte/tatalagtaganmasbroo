export default function AuditLogLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <th key={i} className="p-4"><div className="h-4 bg-gray-200 rounded"></div></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <tr key={i} className="border-b">
                <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                <td className="p-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="p-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                <td className="p-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                <td className="p-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                <td className="p-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
