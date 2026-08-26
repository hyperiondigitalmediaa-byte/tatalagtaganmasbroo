import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Newspaper, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="text-center space-y-8 p-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-3xl shadow-2xl">
          <Newspaper className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Portal Berita
          </h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Website berita terkini dan terpercaya. Kelola konten berita Anda dengan mudah.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/admin">
              Masuk ke Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/admin/login">
              Login Admin
            </Link>
          </Button>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>Built with Next.js, Prisma, and Neon Database</p>
        </div>
      </div>
    </div>
  )
}
