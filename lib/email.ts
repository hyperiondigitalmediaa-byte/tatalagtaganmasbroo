import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Portal Berita'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

// Email templates
export const emailTemplates = {
  newComment: (data: {
    articleTitle: string
    articleUrl: string
    commentAuthor: string
    commentContent: string
    adminUrl: string
  }) => ({
    subject: `Komentar Baru: ${data.articleTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .comment-box { background: white; padding: 20px; border-left: 4px solid #ef4444; margin: 20px 0; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📬 Komentar Baru</h1>
          </div>
          <div class="content">
            <p>Halo Admin,</p>
            <p>Ada komentar baru di artikel <strong>${data.articleTitle}</strong></p>
            
            <div class="comment-box">
              <p><strong>Dari:</strong> ${data.commentAuthor}</p>
              <p><strong>Komentar:</strong></p>
              <p>${data.commentContent}</p>
            </div>

            <a href="${data.adminUrl}" class="button">Lihat & Moderasi Komentar</a>
            
            <p style="margin-top: 30px;">
              <a href="${data.articleUrl}" style="color: #3b82f6;">Lihat Artikel →</a>
            </p>
          </div>
          <div class="footer">
            <p>Email otomatis dari Portal Berita</p>
            <p>Jangan balas email ini</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Komentar Baru di: ${data.articleTitle}
      
      Dari: ${data.commentAuthor}
      Komentar: ${data.commentContent}
      
      Lihat artikel: ${data.articleUrl}
      Moderasi: ${data.adminUrl}
    `
  }),

  commentApproved: (data: {
    userName: string
    articleTitle: string
    articleUrl: string
    commentContent: string
  }) => ({
    subject: `Komentar Anda Disetujui: ${data.articleTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Komentar Disetujui</h1>
          </div>
          <div class="content">
            <p>Halo ${data.userName},</p>
            <p>Komentar Anda di artikel <strong>${data.articleTitle}</strong> telah disetujui dan sekarang terlihat oleh publik.</p>
            
            <p><em>"${data.commentContent}"</em></p>

            <a href="${data.articleUrl}#comments" class="button">Lihat Komentar</a>
            
            <p style="margin-top: 30px; color: #6b7280;">
              Terima kasih telah berpartisipasi dalam diskusi!
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Halo ${data.userName},
      
      Komentar Anda di artikel "${data.articleTitle}" telah disetujui.
      
      Lihat komentar: ${data.articleUrl}#comments
    `
  })
}
