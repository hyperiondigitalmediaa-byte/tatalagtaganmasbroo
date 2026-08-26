"use client"

import { useState, useEffect } from "react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Send, Flag, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { TurnstileWidget } from "@/components/turnstile"

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
  }
  replies?: Comment[]
}

interface CommentSectionProps {
  articleId: string
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const { data: session, status } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  // Load comments
  useEffect(() => {
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?articleId=${articleId}`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch (error) {
      console.error("Failed to load comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      setMessage({
        type: "error",
        text: "Anda harus login untuk berkomentar",
      })
      return
    }

    const content = replyTo ? replyContent : newComment

    if (content.trim().length < 3) {
      setMessage({
        type: "error",
        text: "Komentar terlalu pendek (minimal 3 karakter)",
      })
      return
    }

    if (!captchaToken) {
      setMessage({
        type: "error",
        text: "Silakan selesaikan verifikasi CAPTCHA",
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          articleId,
          parentId: replyTo,
          captchaToken,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: data.message })
        setNewComment("")
        setReplyContent("")
        setReplyTo(null)
        setCaptchaToken(null) // Reset CAPTCHA

        // Refresh comments if auto-approved
        if (data.comment.status === "APPROVED") {
          fetchComments()
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Gagal mengirim komentar",
        })
        setCaptchaToken(null) // Reset CAPTCHA
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan. Silakan coba lagi.",
      })
      setCaptchaToken(null) // Reset CAPTCHA
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReport = async (commentId: string) => {
    if (!session) {
      alert("Anda harus login untuk melaporkan komentar")
      return
    }

    const reason = prompt("Alasan melaporkan komentar ini:")
    if (!reason || reason.trim().length < 5) {
      alert("Alasan terlalu pendek")
      return
    }

    try {
      const res = await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() })
      })

      const data = await res.json()
      
      if (res.ok) {
        alert(data.message)
      } else {
        alert(data.error || "Gagal melaporkan komentar")
      }
    } catch (error) {
      alert("Terjadi kesalahan")
    }
  }

  return (
    <div className="mt-8 sm:mt-12">
      <div className="border-l-4 pl-3 sm:pl-4 mb-6" style={{ borderColor: 'var(--color-primary)' }}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          Komentar ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {status === "authenticated" ? (
        <div className="bg-white rounded-lg border p-4 sm:p-6 mb-6">
          <form onSubmit={handleSubmitComment}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Tulis komentar Anda... (minimal 3 karakter)"
              className="min-h-[100px] mb-3"
              maxLength={1000}
            />

            {/* CAPTCHA */}
            <div className="mb-3 flex justify-center">
              <TurnstileWidget
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => {
                  setCaptchaToken(null)
                  setMessage({
                    type: "error",
                    text: "Verifikasi CAPTCHA gagal. Silakan coba lagi.",
                  })
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {newComment.length}/1000 karakter
              </span>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  newComment.trim().length < 3 ||
                  !captchaToken
                }
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
              </Button>
            </div>
          </form>

          {message && (
            <Alert className={`mt-4 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 sm:p-8 mb-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Bergabung dalam Diskusi</h3>
          <p className="text-sm text-gray-600 mb-6">
            Login dengan Google untuk berkomentar dan berinteraksi dengan pembaca lain
          </p>
          <Button 
            onClick={() => {
              // Use NextAuth signIn function
              signIn("google", { callbackUrl: window.location.pathname })
            }}
            className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm gap-3 px-6 py-6 text-base font-semibold"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Masuk dengan Google
          </Button>
          <p className="text-xs text-gray-500 mt-4">
            Dengan masuk, Anda menyetujui syarat dan ketentuan kami
          </p>
        </div>
      )}

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50 animate-pulse" />
          <p>Memuat komentar...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada komentar</p>
          <p className="text-sm mt-2">Jadilah yang pertama berkomentar!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={(id) => setReplyTo(id)}
              onReport={handleReport}
              replyTo={replyTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmitComment}
              isSubmitting={isSubmitting}
              session={session}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onReply: (id: string) => void
  onReport: (id: string) => void
  replyTo: string | null
  replyContent: string
  setReplyContent: (content: string) => void
  onSubmitReply: (e: React.FormEvent) => void
  isSubmitting: boolean
  session: any
}

function CommentItem({
  comment,
  onReply,
  onReport,
  replyTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  isSubmitting,
  session
}: CommentItemProps) {
  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6">
      <div className="flex gap-3 sm:gap-4">
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
          <AvatarFallback className="text-white text-xs sm:text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
            {comment.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="font-semibold text-sm sm:text-base text-gray-900">{comment.user.name}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: idLocale })}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReport(comment.id)}
              className="text-gray-400 h-8 w-8 p-0"
              title="Laporkan komentar"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = ''
              }}
            >
              <Flag className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words mb-3">
            {comment.content}
          </p>
          
          {session && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
              className="text-xs sm:text-sm"
            >
              <Reply className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Balas
            </Button>
          )}

          {/* Reply Form */}
          {replyTo === comment.id && (
            <form onSubmit={onSubmitReply} className="mt-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Tulis balasan..."
                className="min-h-[80px] mb-2 text-sm"
                maxLength={1000}
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSubmitting || replyContent.trim().length < 3}>
                  <Send className="h-3 w-3 mr-1" />
                  Kirim
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => onReply("")}>
                  Batal
                </Button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 sm:pl-6 border-l-2 border-gray-200">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2 sm:gap-3">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gray-600 text-white text-xs font-bold">
                      {reply.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs sm:text-sm text-gray-900">{reply.user.name}</p>
                    <p className="text-xs text-gray-500 mb-1">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: idLocale })}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
