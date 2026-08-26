"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { ShareButtons } from "./share-buttons"

interface ArticleActionsProps {
  url: string
  title: string
}

export function ArticleActions({ url, title }: ArticleActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <ShareButtons url={url} title={title} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        Cetak
      </Button>
    </div>
  )
}
