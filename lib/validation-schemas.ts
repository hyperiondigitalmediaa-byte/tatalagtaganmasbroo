/**
 * Zod Validation Schemas
 * Centralized validation for API endpoints
 */

import { z } from 'zod'

// ============================================
// ARTICLE SCHEMAS
// ============================================

export const articleSchema = z.object({
  title: z.string()
    .min(10, 'Judul minimal 10 karakter')
    .max(200, 'Judul maksimal 200 karakter'),
  
  slug: z.string()
    .min(5, 'Slug minimal 5 karakter')
    .max(200, 'Slug maksimal 200 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  
  content: z.string()
    .min(100, 'Konten minimal 100 karakter'),
  
  excerpt: z.string()
    .max(500, 'Excerpt maksimal 500 karakter')
    .optional(),
  
  featuredImage: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
  
  categoryId: z.string().cuid('Category ID tidak valid'),
  
  tags: z.array(z.string().cuid()).optional(),
  
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
  
  scheduledAt: z.string().datetime().optional().nullable(),
  
  showViews: z.boolean().optional(),
  
  // SEO fields
  metaTitle: z.string().max(60, 'Meta title maksimal 60 karakter').optional().or(z.literal('')),
  metaDescription: z.string().max(160, 'Meta description maksimal 160 karakter').optional().or(z.literal('')),
  metaKeywords: z.string().max(200, 'Meta keywords maksimal 200 karakter').optional().or(z.literal('')),
  
  // Open Graph
  ogTitle: z.string().max(60).optional().or(z.literal('')),
  ogDescription: z.string().max(160).optional().or(z.literal('')),
  ogImage: z.string().url().optional().or(z.literal('')),
})

export const articleUpdateSchema = articleSchema.partial()

// ============================================
// COMMENT SCHEMAS
// ============================================

export const commentSchema = z.object({
  content: z.string()
    .min(3, 'Komentar minimal 3 karakter')
    .max(1000, 'Komentar maksimal 1000 karakter'),
  
  articleId: z.string().cuid('Article ID tidak valid'),
  
  parentId: z.string().cuid().optional().nullable(),
  
  captchaToken: z.string().optional(),
})

export const commentUpdateSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
})

// ============================================
// USER SCHEMAS
// ============================================

export const userCreateSchema = z.object({
  name: z.string()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  
  email: z.string()
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password maksimal 100 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung angka'),
  
  role: z.enum(['ADMIN', 'EDITOR', 'USER']),
})

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).max(100).optional(),
  role: z.enum(['ADMIN', 'EDITOR', 'USER']).optional(),
  isBanned: z.boolean().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi'),
  captchaToken: z.string().optional(),
})

// ============================================
// CATEGORY SCHEMAS
// ============================================

export const categorySchema = z.object({
  name: z.string()
    .min(2, 'Nama kategori minimal 2 karakter')
    .max(50, 'Nama kategori maksimal 50 karakter'),
  
  slug: z.string()
    .min(2, 'Slug minimal 2 karakter')
    .max(50, 'Slug maksimal 50 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
  
  description: z.string().max(200).optional(),
})

// ============================================
// TAG SCHEMAS
// ============================================

export const tagSchema = z.object({
  name: z.string()
    .min(2, 'Nama tag minimal 2 karakter')
    .max(30, 'Nama tag maksimal 30 karakter'),
  
  slug: z.string()
    .min(2, 'Slug minimal 2 karakter')
    .max(30, 'Slug maksimal 30 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh huruf kecil, angka, dan dash'),
})

// ============================================
// SETTINGS SCHEMAS
// ============================================

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2).max(100).optional(),
  siteDescription: z.string().max(500).optional(),
  siteUrl: z.string().url({ message: 'URL tidak valid' }).optional(),
  contactEmail: z.string().email({ message: 'Email tidak valid' }).optional(),
  socialMedia: z.record(z.string(), z.string().url({ message: 'URL tidak valid' })).optional(),
})

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Warna harus format hex (#RRGGBB)' }),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Warna harus format hex (#RRGGBB)' }).optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, { message: 'Warna harus format hex (#RRGGBB)' }).optional(),
})

// ============================================
// BANNER SCHEMAS
// ============================================

export const bannerSchema = z.object({
  title: z.string().min(2).max(100),
  type: z.enum(['IMAGE', 'CODE']),
  position: z.enum(['HEADER', 'SIDEBAR', 'ARTICLE_LIST', 'ARTICLE_CONTENT', 'FOOTER']),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url().optional(),
  adCode: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

// ============================================
// SOCIAL MEDIA SCHEMAS
// ============================================

export const socialMediaSchema = z.object({
  platform: z.string().min(2).max(50),
  url: z.string().url('URL tidak valid'),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().min(0).optional(),
})

// ============================================
// MENU SCHEMAS
// ============================================

export const menuSchema = z.object({
  label: z.string().min(1).max(50),
  url: z.string().min(1).max(200),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
  openInNewTab: z.boolean().optional(),
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate data against schema and return formatted errors
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  // Format Zod errors into user-friendly object
  const errors: Record<string, string> = {}
  result.error.issues.forEach((err: z.ZodIssue) => {
    const path = err.path.join('.')
    errors[path] = err.message
  })
  
  return { success: false, errors }
}

/**
 * Validate and throw error if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data)
}
