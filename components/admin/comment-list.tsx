"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, X, Eye, Flag, Ban, AlertTriangle, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"

interface Comment {
  id: string
  content: string
  status: string
  isSpam: boolean
  spamScore: number
  createdAt: Date
  user: {
    name: string
    email: string
    reputation: number
    isBanned: boolean
  }
  article: {
    title: string
    slug: string
  }
  _count: {
    reports: number
    replies: number
  }
}

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  const router = useRouter()
  const [filter, setFilter] = useState<string>("all")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const filteredComments = comments.filter(comment => {
    if (filter === "all") return true
    if (filter === "pending") return comment.status === "PENDING"
    if (filter === "approved") return comment.status === "APPROVED"
    if (filter === "spam") return comment.isSpam || comment.status === "SPAM"
    if (filter === "reported") return comment._count.reports > 0
    return true
  })

  const handleUpdateStatus = async (commentId: string, newStatus: string) => {
    setIsUpdating(commentId)
    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        toast.success("Status komentar berhasil diupdate!", {
          description: "Perubahan telah disimpan",
          duration: 3000,
        })
        router.refresh()
      } else {
        toast.error("Gagal mengupdate status", {
          description: "Terjadi kesalahan saat mengupdate",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  const handleBanUser = async (userId: string, commentId: string) => {
    if (!confirm("Ban user ini? User tidak akan bisa berkomentar lagi.")) return

    setIsUpdating(commentId)
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "POST"
      })

      if (res.ok) {
        toast.success("User berhasil di-ban!", {
          description: "User tidak dapat berkomentar lagi",
          duration: 3000,
        })
        router.refresh()
      } else {
        toast.error("Gagal ban user", {
          description: "Terjadi kesalahan",
          duration: 4000,
        })
      }
    } catch (error) {
      toast.error("Terjadi kesalahan", {
        description: "Silakan coba lagi nanti",
        duration: 4000,
      })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Filter:</span>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua ({comments.length})</SelectItem>
            <SelectItem value="pending">Menunggu Review ({comments.filter(c => c.status === "PENDING").length})</SelectItem>
            <SelectItem value="approved">Disetujui ({comments.filter(c => c.status === "APPROVED").length})</SelectItem>
            <SelectItem value="spam">Spam ({comments.filter(c => c.isSpam || c.status === "SPAM").length})</SelectItem>
            <SelectItem value="reported">Dilaporkan ({comments.filter(c => c._count.reports > 0).length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <p>Tidak ada komentar</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-semibold text-sm sm:text-base">{comment.user.name}</span>
                      <span className="text-xs text-muted-foreground">({comment.user.email})</span>
                      {comment.user.isBanned && (
                        <Badge variant="destructive" className="text-xs">BANNED</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Rep: {comment.user.reputation}
                      </Badge>
                    </div>
                    <Link 
                      href={`/${comment.article.slug}`}
                      target="_blank"
                      className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {comment.article.title}
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={
                        comment.status === "APPROVED" ? "default" :
                        comment.status === "PENDING" ? "secondary" :
                        "destructive"
                      }
                      className="text-xs"
                    >
                      {comment.status}
                    </Badge>
                    {comment.isSpam && (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        SPAM ({comment.spamScore})
                      </Badge>
                    )}
                    {comment._count.reports > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        <Flag className="h-3 w-3 mr-1" />
                        {comment._count.reports} Report
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
                    {comment.content}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: idLocale })}</span>
                    {comment._count.replies > 0 && (
                      <span>{comment._count.replies} balasan</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {comment.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(comment.id, "APPROVED")}
                          disabled={isUpdating === comment.id}
                          className="text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateStatus(comment.id, "REJECTED")}
                          disabled={isUpdating === comment.id}
                          className="text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Tolak
                        </Button>
                      </>
                    )}
                    
                    {comment.status === "APPROVED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(comment.id, "REJECTED")}
                        disabled={isUpdating === comment.id}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Sembunyikan
                      </Button>
                    )}

                    {(comment.status === "REJECTED" || comment.status === "SPAM") && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(comment.id, "APPROVED")}
                        disabled={isUpdating === comment.id}
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Pulihkan
                      </Button>
                    )}

                    {!comment.user.isBanned && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBanUser(comment.user.email, comment.id)}
                        disabled={isUpdating === comment.id}
                        className="text-xs"
                      >
                        <Ban className="h-3 w-3 mr-1" />
                        Ban User
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
