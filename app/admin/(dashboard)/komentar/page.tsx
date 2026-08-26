import { prisma } from "@/lib/prisma"
import { CommentList } from "@/components/admin/comment-list"

async function getComments() {
  const comments = await prisma.comment.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          reputation: true,
          isBanned: true
        }
      },
      article: {
        select: {
          title: true,
          slug: true
        }
      },
      _count: {
        select: {
          reports: true,
          replies: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 100
  })

  return comments
}

export default async function KomentarPage() {
  const comments = await getComments()

  const pendingCount = comments.filter(c => c.status === "PENDING").length
  const spamCount = comments.filter(c => c.isSpam || c.status === "SPAM").length
  const reportedCount = comments.filter(c => c._count.reports > 0).length

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">Moderasi Komentar</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Kelola dan moderasi komentar dari pembaca
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground">Total Komentar</p>
          <p className="text-xl sm:text-2xl font-bold mt-1">{comments.length}</p>
        </div>
        <div className="bg-yellow-50 border-yellow-200 rounded-lg border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-yellow-700">Menunggu Review</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-yellow-700">{pendingCount}</p>
        </div>
        <div className="bg-red-50 border-red-200 rounded-lg border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-700">Spam Terdeteksi</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-red-700">{spamCount}</p>
        </div>
        <div className="bg-orange-50 border-orange-200 rounded-lg border p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-orange-700">Dilaporkan</p>
          <p className="text-xl sm:text-2xl font-bold mt-1 text-orange-700">{reportedCount}</p>
        </div>
      </div>

      <CommentList comments={comments} />
    </div>
  )
}
