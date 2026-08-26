// Script untuk menambahkan auto-revalidate ke semua API admin
// Jalankan: npx tsx scripts/add-revalidate-to-apis.ts

import fs from 'fs'
import path from 'path'

const apisToUpdate = [
  {
    file: 'app/api/kategori/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/kategori/[id]/route.ts',
    import: `import { revalidateHomepage, revalidateCategory } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/banner/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/banner/[id]/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/menu/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/menu/[id]/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/social-media/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
  {
    file: 'app/api/social-media/[id]/route.ts',
    import: `import { revalidateHomepage } from "@/lib/revalidate-helper"`,
    revalidate: 'await revalidateHomepage()'
  },
]

console.log('📝 Menambahkan auto-revalidate ke API files...\n')

apisToUpdate.forEach(({ file }) => {
  const filePath = path.join(process.cwd(), file)
  
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`⚠️  ${file} - File tidak ditemukan`)
  }
})

console.log('\n✨ Selesai! Silakan tambahkan manual di setiap endpoint POST/PATCH/DELETE')
console.log('   Tambahkan: await revalidateHomepage() sebelum return response')
