import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, FileText, Search } from "lucide-react"

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <FileText className="w-16 h-16 text-slate-400 dark:text-slate-600" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Artikel Tidak Ditemukan
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Maaf, artikel yang Anda cari tidak ditemukan. 
            Mungkin artikel sudah dihapus atau URL-nya salah.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/artikel">
              <FileText className="mr-2 h-5 w-5" />
              Lihat Artikel Lainnya
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
