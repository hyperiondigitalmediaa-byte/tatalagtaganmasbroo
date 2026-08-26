"use client"

import { useEffect, useState } from "react"
import { AnalyticsCard } from "@/components/admin/analytics-card"
import { AnalyticsChart } from "@/components/admin/analytics-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Eye,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"

interface AnalyticsData {
  overview: {
    totalArticles: number
    publishedArticles: number
    totalViews: number
    totalComments: number
    totalUsers: number
    recentArticles: number
  }
  topArticles: Array<{
    id: string
    title: string
    slug: string
    views: number
    publishedAt: string
    category: { name: string }
  }>
  articlesByCategory: Array<{ name: string; count: number }>
  viewsByDay: Array<{ date: string; views: number }>
  recentComments: Array<{
    id: string
    content: string
    createdAt: string
    user: { name: string }
    article: { title: string; slug: string }
  }>
  articlesByStatus: Array<{ status: string; count: number }>
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/admin/analytics")
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="space-y-4 md:space-y-6">
        <p>Gagal memuat data analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-3xl font-bold truncate">Dashboard Analytics</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Ringkasan statistik dan performa website
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <AnalyticsCard
          title="Total Artikel"
          value={analytics.overview.totalArticles}
          description={`${analytics.overview.publishedArticles} dipublikasi`}
          icon={FileText}
        />
        <AnalyticsCard
          title="Total Views"
          value={analytics.overview.totalViews}
          description="Semua artikel"
          icon={Eye}
        />
        <AnalyticsCard
          title="Total Komentar"
          value={analytics.overview.totalComments}
          description="Komentar disetujui"
          icon={MessageSquare}
        />
        <AnalyticsCard
          title="Total Users"
          value={analytics.overview.totalUsers}
          description="Pengguna terdaftar"
          icon={Users}
        />
      </div>

      {/* Chart and Top Articles */}
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <AnalyticsChart data={analytics.viewsByDay} />

        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Artikel Terpopuler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/${article.slug}`}
                      target="_blank"
                      className="text-sm font-medium hover:underline line-clamp-2"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {article.category.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Articles by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Artikel per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.articlesByCategory.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <Badge variant="outline">{cat.count} artikel</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Komentar Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.recentComments.map((comment) => (
                <div key={comment.id} className="border-b pb-3 last:border-0">
                  <p className="text-sm line-clamp-2 mb-1">{comment.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{comment.user.name}</span>
                    <span>•</span>
                    <Link
                      href={`/${comment.article.slug}`}
                      target="_blank"
                      className="hover:underline line-clamp-1"
                    >
                      {comment.article.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
