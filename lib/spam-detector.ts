// Spam Detection Utility

// Blacklist kata-kata spam/judi Indonesia
const SPAM_KEYWORDS = [
  'slot', 'togel', 'judi', 'casino', 'poker', 'bandar',
  'gacor', 'maxwin', 'bonus', 'deposit', 'withdraw',
  'daftar', 'login', 'promo', 'jackpot', 'menang',
  'situs', 'agen', 'terpercaya', 'resmi', 'official',
  'link', 'klik', 'daftar sekarang', 'gabung sekarang',
  'whatsapp', 'wa', 'telegram', 'line',
  'obat', 'viagra', 'cialis', 'pil', 'kuat',
  'pinjaman', 'kredit', 'dana', 'cepat', 'mudah'
]

// Regex patterns
const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|id|co\.id|xyz|info|biz|me|io))/gi
const PHONE_PATTERN = /(\+?62|0)8[0-9]{8,11}/g
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const REPEATED_CHARS = /(.)\1{4,}/g // 5+ karakter sama berturut-turut
const EXCESSIVE_CAPS = /[A-Z]{10,}/g // 10+ huruf kapital berturut-turut

export interface SpamCheckResult {
  isSpam: boolean
  score: number
  reasons: string[]
}

export function detectSpam(content: string): SpamCheckResult {
  let score = 0
  const reasons: string[] = []

  // Normalize content
  const normalizedContent = content.toLowerCase().trim()

  // 1. Check spam keywords
  const foundKeywords = SPAM_KEYWORDS.filter(keyword => 
    normalizedContent.includes(keyword.toLowerCase())
  )
  if (foundKeywords.length > 0) {
    score += foundKeywords.length * 15
    reasons.push(`Mengandung kata spam: ${foundKeywords.join(', ')}`)
  }

  // 2. Check URLs
  const urls = content.match(URL_PATTERN)
  if (urls && urls.length > 0) {
    score += urls.length * 25
    reasons.push(`Mengandung ${urls.length} link`)
  }

  // 3. Check phone numbers
  const phones = content.match(PHONE_PATTERN)
  if (phones && phones.length > 0) {
    score += phones.length * 30
    reasons.push(`Mengandung nomor telepon`)
  }

  // 4. Check email addresses
  const emails = content.match(EMAIL_PATTERN)
  if (emails && emails.length > 0) {
    score += emails.length * 20
    reasons.push(`Mengandung email`)
  }

  // 5. Check repeated characters (aaaaaaa)
  if (REPEATED_CHARS.test(content)) {
    score += 10
    reasons.push('Karakter berulang berlebihan')
  }

  // 6. Check excessive caps (SPAM SPAM SPAM)
  if (EXCESSIVE_CAPS.test(content)) {
    score += 15
    reasons.push('Terlalu banyak huruf kapital')
  }

  // 7. Check content length
  if (content.length < 3) {
    score += 20
    reasons.push('Komentar terlalu pendek')
  }

  // 8. Check if content is only symbols/numbers
  const alphaCount = (content.match(/[a-zA-Z]/g) || []).length
  if (alphaCount < 3) {
    score += 25
    reasons.push('Tidak ada teks yang berarti')
  }

  // 9. Check excessive punctuation (!!!!!!)
  const punctuationCount = (content.match(/[!?.,;:]{3,}/g) || []).length
  if (punctuationCount > 0) {
    score += 10
    reasons.push('Tanda baca berlebihan')
  }

  // Determine if spam (threshold: 50)
  const isSpam = score >= 50

  return {
    isSpam,
    score,
    reasons
  }
}

// Rate limiting helper
const commentTimestamps = new Map<string, number[]>()

export function checkRateLimit(userId: string, maxComments: number = 5, windowMs: number = 3600000): boolean {
  const now = Date.now()
  const userTimestamps = commentTimestamps.get(userId) || []
  
  // Remove old timestamps outside the window
  const recentTimestamps = userTimestamps.filter(ts => now - ts < windowMs)
  
  // Check if user exceeded limit
  if (recentTimestamps.length >= maxComments) {
    return false // Rate limit exceeded
  }
  
  // Add new timestamp
  recentTimestamps.push(now)
  commentTimestamps.set(userId, recentTimestamps)
  
  return true // OK to proceed
}

// Clean up old timestamps periodically
setInterval(() => {
  const now = Date.now()
  for (const [userId, timestamps] of commentTimestamps.entries()) {
    const recent = timestamps.filter(ts => now - ts < 3600000)
    if (recent.length === 0) {
      commentTimestamps.delete(userId)
    } else {
      commentTimestamps.set(userId, recent)
    }
  }
}, 600000) // Clean up every 10 minutes
