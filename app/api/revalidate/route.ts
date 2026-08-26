import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  // Validate secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { path, revalidateAll } = body

    if (path) {
      revalidatePath(path, 'page')
      return NextResponse.json({ revalidated: true, path })
    }

    if (revalidateAll) {
      // Revalidate all important paths at once
      const paths = [
        '/',
        '/indeks',
        '/kategori',
      ]
      
      for (const p of paths) {
        revalidatePath(p, 'page')
      }
      
      // Also revalidate layout to force all pages
      revalidatePath('/', 'layout')
      
      return NextResponse.json({ 
        revalidated: true, 
        message: 'All paths revalidated',
        paths 
      })
    }

    // Default: Revalidate homepage and indeks
    revalidatePath('/', 'page')
    revalidatePath('/indeks', 'page')
    
    return NextResponse.json({ 
      revalidated: true, 
      message: 'Default paths revalidated' 
    })
  } catch (err) {
    return NextResponse.json({ 
      message: 'Error revalidating',
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}
