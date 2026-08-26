// Helper untuk revalidate cache setelah update data

export async function revalidateAfterUpdate(paths: string[]) {
  if (process.env.NODE_ENV === 'production') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const secret = process.env.REVALIDATE_SECRET
      
      for (const path of paths) {
        await fetch(`${baseUrl}/api/revalidate?secret=${secret}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path })
        })
      }
    } catch (error) {
      console.error('Revalidate failed:', error)
    }
  }
}

// Revalidate homepage dan halaman terkait
export async function revalidateHomepage() {
  await revalidateAfterUpdate(['/'])
}

export async function revalidateArticle(slug: string) {
  // Revalidate semua halaman yang nampilin artikel
  await revalidateAfterUpdate([
    '/',           // Homepage (latest articles)
    '/indeks',     // Indeks page
    `/${slug}`,    // Detail page
    '/kategori',   // All kategori pages
  ])
  
  // Force revalidate all untuk memastikan artikel muncul di semua halaman
  if (process.env.NODE_ENV === 'production') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const secret = process.env.REVALIDATE_SECRET
      
      await fetch(`${baseUrl}/api/revalidate?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revalidateAll: true })
      })
    } catch (error) {
      console.error('Revalidate all failed:', error)
    }
  }
}

export async function revalidateCategory(slug: string) {
  await revalidateAfterUpdate(['/', `/kategori/${slug}`])
}

export async function revalidateSidebar() {
  // Revalidate semua halaman yang pakai sidebar
  // Gunakan layout revalidation untuk refresh semua halaman sekaligus
  await revalidateAfterUpdate([
    '/',           // Homepage
    '/indeks',     // Indeks page
    '/kategori',   // All kategori pages
  ])
  
  // Force revalidate dengan tag untuk semua halaman
  if (process.env.NODE_ENV === 'production') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const secret = process.env.REVALIDATE_SECRET
      
      // Revalidate all paths at once
      await fetch(`${baseUrl}/api/revalidate?secret=${secret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revalidateAll: true })
      })
    } catch (error) {
      console.error('Revalidate all failed:', error)
    }
  }
}
