import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { detectSpam, checkRateLimit } from "@/lib/spam-detector"
import { sendEmail, emailTemplates } from "@/lib/email"
import { verifyTurnstile } from "@/lib/turnstile"
import { validateData, commentSchema } from "@/lib/validation-schemas"
import { sanitizeCommentContent } from "@/lib/html-sanitizer"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Anda harus login untuk berkomentar" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validate input with Zod
    const validation = validateData(commentSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    const { content, articleId, parentId, captchaToken } = validation.data

    // Sanitize comment content
    const sanitizedContent = sanitizeCommentContent(content)

    // Verify CAPTCHA
    if (captchaToken) {
      const isCaptchaValid = await verifyTurnstile(captchaToken)
      if (!isCaptchaValid) {
        return NextResponse.json(
          { error: "Verifikasi CAPTCHA gagal. Silakan coba lagi." },
          { status: 400 }
        )
      }
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is banned
    if (user.isBanned) {
      return NextResponse.json(
        { error: "Akun Anda telah diblokir karena melanggar aturan" },
        { status: 403 }
      )
    }

    // Rate limiting
    if (!checkRateLimit(user.id, 5, 3600000)) {
      return NextResponse.json(
        { error: "Anda terlalu banyak berkomentar. Tunggu 1 jam." },
        { status: 429 }
      )
    }

    // Spam detection
    const spamCheck = detectSpam(content)
    
    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Determine comment status
    let status: "PENDING" | "APPROVED" | "SPAM" = "PENDING"
    
    // Auto-approve for trusted users (reputation >= 10)
    if (user.reputation >= 10 && !spamCheck.isSpam) {
      status = "APPROVED"
    }
    
    // Auto-reject if spam score is very high
    if (spamCheck.score >= 100) {
      status = "SPAM"
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: sanitizedContent.trim(),
        articleId,
        userId: user.id,
        parentId: parentId || null,
        status,
        isSpam: spamCheck.isSpam,
        spamScore: spamCheck.score,
        ipAddress,
        userAgent
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        article: {
          select: {
            title: true,
            slug: true
          }
        }
      }
    })

    // Send email notification to admin (async, don't wait)
    if (status === "PENDING" && process.env.ADMIN_EMAIL) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const emailData = emailTemplates.newComment({
        articleTitle: comment.article.title,
        articleUrl: `${baseUrl}/${comment.article.slug}`,
        commentAuthor: comment.user.name,
        commentContent: comment.content,
        adminUrl: `${baseUrl}/admin/komentar`
      })
      
      sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      }).catch(err => console.error('Failed to send email:', err))
    }

    return NextResponse.json({
      success: true,
      comment,
      message: status === "APPROVED" 
        ? "Komentar berhasil dipublikasikan" 
        : "Komentar Anda sedang ditinjau oleh moderator",
      spamCheck: spamCheck.isSpam ? {
        score: spamCheck.score,
        reasons: spamCheck.reasons
      } : null
    })

  } catch (error) {
    console.error("Comment creation error:", error)
    return NextResponse.json(
      { error: "Gagal membuat komentar" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json(
        { error: "Article ID required" },
        { status: 400 }
      )
    }

    // Get approved comments only
    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        status: "APPROVED",
        parentId: null // Only top-level comments
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        replies: {
          where: {
            status: "APPROVED"
          },
          include: {
            user: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ comments })

  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json(
      { error: "Gagal mengambil komentar" },
      { status: 500 }
    )
  }
}
