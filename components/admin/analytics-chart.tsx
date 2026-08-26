"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface AnalyticsChartProps {
  data: Array<{ date: string; views: number }>
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
    views: item.views,
  }))

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Views 7 Hari Terakhir</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
