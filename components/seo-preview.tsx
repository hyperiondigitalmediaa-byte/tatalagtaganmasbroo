"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SEOPreviewProps {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  focusKeyword?: string
}

export function SEOPreview({
  title,
  metaTitle,
  metaDescription,
  slug,
  focusKeyword,
}: SEOPreviewProps) {
  const displayTitle = metaTitle || title || "Judul Artikel"
  const displayDescription =
    metaDescription || "Deskripsi artikel akan muncul di sini..."
  const displayUrl = `portalberita.com/${slug || "artikel-slug"}`

  // Calculate SEO score
  const calculateScore = () => {
    let score = 0
    const checks = []

    // Title length (50-60 optimal)
    if (displayTitle.length >= 50 && displayTitle.length <= 60) {
      score += 25
      checks.push({ label: "Title length", status: "good" })
    } else if (displayTitle.length > 0) {
      score += 10
      checks.push({ label: "Title length", status: "warning" })
    } else {
      checks.push({ label: "Title length", status: "error" })
    }

    // Description length (150-160 optimal)
    if (
      displayDescription.length >= 150 &&
      displayDescription.length <= 160
    ) {
      score += 25
      checks.push({ label: "Description length", status: "good" })
    } else if (displayDescription.length > 0) {
      score += 10
      checks.push({ label: "Description length", status: "warning" })
    } else {
      checks.push({ label: "Description length", status: "error" })
    }

    // Focus keyword in title
    if (
      focusKeyword &&
      displayTitle.toLowerCase().includes(focusKeyword.toLowerCase())
    ) {
      score += 25
      checks.push({ label: "Keyword in title", status: "good" })
    } else if (focusKeyword) {
      checks.push({ label: "Keyword in title", status: "warning" })
    }

    // Focus keyword in description
    if (
      focusKeyword &&
      displayDescription.toLowerCase().includes(focusKeyword.toLowerCase())
    ) {
      score += 25
      checks.push({ label: "Keyword in description", status: "good" })
    } else if (focusKeyword) {
      checks.push({ label: "Keyword in description", status: "warning" })
    }

    return { score, checks }
  }

  const { score, checks } = calculateScore()

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600"
    if (score >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Bagus"
    if (score >= 50) return "Cukup"
    return "Perlu Perbaikan"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>SEO Preview</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">SEO Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <Badge
              variant={score >= 75 ? "default" : score >= 50 ? "secondary" : "destructive"}
            >
              {getScoreLabel(score)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Search Preview */}
        <div className="border rounded-lg p-4 bg-white">
          <p className="text-xs text-gray-600 mb-1">{displayUrl}</p>
          <h3 className="text-xl text-blue-600 hover:underline cursor-pointer mb-1">
            {displayTitle}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {displayDescription}
          </p>
        </div>

        {/* SEO Checks */}
        <div className="space-y-2">
          <p className="text-sm font-medium">SEO Checklist:</p>
          <div className="grid grid-cols-2 gap-2">
            {checks.map((check, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm"
              >
                {check.status === "good" && (
                  <span className="text-green-600">✓</span>
                )}
                {check.status === "warning" && (
                  <span className="text-yellow-600">⚠</span>
                )}
                {check.status === "error" && (
                  <span className="text-red-600">✗</span>
                )}
                <span className="text-muted-foreground">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {score < 75 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-medium text-yellow-800 mb-1">
              Tips untuk meningkatkan SEO:
            </p>
            <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
              {displayTitle.length < 50 && (
                <li>Panjangkan meta title (optimal: 50-60 karakter)</li>
              )}
              {displayTitle.length > 60 && (
                <li>Perpendek meta title (optimal: 50-60 karakter)</li>
              )}
              {displayDescription.length < 150 && (
                <li>
                  Panjangkan meta description (optimal: 150-160 karakter)
                </li>
              )}
              {displayDescription.length > 160 && (
                <li>
                  Perpendek meta description (optimal: 150-160 karakter)
                </li>
              )}
              {focusKeyword &&
                !displayTitle.toLowerCase().includes(focusKeyword.toLowerCase()) && (
                  <li>Masukkan focus keyword di meta title</li>
                )}
              {focusKeyword &&
                !displayDescription
                  .toLowerCase()
                  .includes(focusKeyword.toLowerCase()) && (
                  <li>Masukkan focus keyword di meta description</li>
                )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
