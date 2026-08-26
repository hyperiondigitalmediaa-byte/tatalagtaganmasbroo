"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => window.history.back()}
      className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Kembali ke halaman sebelumnya
    </Button>
  )
}
