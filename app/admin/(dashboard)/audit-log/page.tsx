"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuditLog {
  id: string
  userId: string | null
  action: string
  resource: string | null
  resourceId: string | null
  details: any
  ipAddress: string | null
  userAgent: string | null
  status: string
  errorMessage: string | null
  createdAt: string
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({
    action: "",
    status: "",
    search: "",
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/admin/audit-log")
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (filter.action && log.action !== filter.action) return false
    if (filter.status && log.status !== filter.status) return false
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return (
        log.action.toLowerCase().includes(searchLower) ||
        log.resource?.toLowerCase().includes(searchLower) ||
        log.ipAddress?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)))

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 overflow-x-hidden">
      <div className="flex items-center gap-2 min-w-0">
        <Shield className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold truncate">Audit Log</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Riwayat aktivitas admin dan sistem
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter</CardTitle>
          <CardDescription>Filter log berdasarkan kriteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari..."
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                className="pl-9"
              />
            </div>

            <Select
              value={filter.action || "all"}
              onValueChange={(value) =>
                setFilter({ ...filter, action: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aksi</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter.status || "all"}
              onValueChange={(value) =>
                setFilter({ ...filter, status: value === "all" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(filter.action || filter.status || filter.search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilter({ action: "", status: "", search: "" })}
              className="mt-4"
            >
              Reset Filter
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Riwayat Aktivitas</CardTitle>
          <CardDescription>
            {filteredLogs.length} dari {logs.length} log
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Tidak ada log
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.action}</span>
                      </TableCell>
                      <TableCell>
                        {log.resource && (
                          <div className="text-sm">
                            <div>{log.resource}</div>
                            {log.resourceId && (
                              <div className="text-xs text-muted-foreground">
                                ID: {log.resourceId.substring(0, 8)}...
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {log.ipAddress || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "SUCCESS" ? "default" : "destructive"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada log
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                    <Badge
                      variant={
                        log.status === "SUCCESS" ? "default" : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </div>

                  {log.resource && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Resource: </span>
                      {log.resource}
                    </div>
                  )}

                  {log.ipAddress && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">IP: </span>
                      {log.ipAddress}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
