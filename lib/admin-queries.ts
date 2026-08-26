import { prisma } from './prisma'
import { getAdminCached, adminCacheKeys } from './admin-cache'

// Optimized queries untuk admin dengan caching

export async function getCategoriesForAdmin() {
  return getAdminCached(
    adminCacheKeys.categories(),
    async () => {
      return prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: { articles: true }
          }
        },
        orderBy: { name: 'asc' }
      })
    }
  )
}

export async function getUsersForDropdown() {
  return getAdminCached(
    adminCacheKeys.users(),
    async () => {
      return prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        orderBy: { name: 'asc' }
      })
    }
  )
}

export async function getTagsForAdmin() {
  return getAdminCached(
    adminCacheKeys.tags(),
    async () => {
      return prisma.tag.findMany({
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: { name: 'asc' }
      })
    }
  )
}

export async function getMenusForAdmin() {
  return getAdminCached(
    adminCacheKeys.menus(),
    async () => {
      return prisma.menu.findMany({
        select: {
          id: true,
          label: true,
          url: true,
          type: true,
          parentId: true,
          isActive: true,
          order: true
        },
        orderBy: { order: 'asc' }
      })
    }
  )
}

export async function getSocialMediaForAdmin() {
  return getAdminCached(
    adminCacheKeys.socialMedia(),
    async () => {
      return prisma.socialMedia.findMany({
        select: {
          id: true,
          platform: true,
          url: true,
          isActive: true,
          order: true
        },
        orderBy: { order: 'asc' }
      })
    }
  )
}

// Query optimization untuk artikel list
export async function getArticlesForAdmin(params: {
  page?: number
  limit?: number
  status?: string
  categoryId?: string
  search?: string
}) {
  const { page = 1, limit = 20, status, categoryId, search } = params
  
  const where: any = {}
  
  if (status && status !== 'ALL') {
    where.status = status
  }
  
  if (categoryId) {
    where.categoryId = categoryId
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } }
    ]
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        views: true,
        featuredImage: true,
        publishedAt: true,
        createdAt: true,
        author: {
          select: {
            name: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.article.count({ where })
  ])

  return {
    articles,
    total,
    pages: Math.ceil(total / limit)
  }
}
