"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, AlertTriangle, CheckCircle } from "lucide-react"

export default function BackupPage() {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)

  const handleBackup = async () => {
    setIsBackingUp(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/backup")
      
      if (!response.ok) {
        throw new Error("Backup failed")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `backup-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setMessage({ type: "success", text: "Backup berhasil diunduh!" })
    } catch (error) {
      setMessage({ type: "error", text: "Gagal membuat backup" })
    } finally {
      setIsBackingUp(false)
    }
  }

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsRestoring(true)
    setMessage(null)

    try {
      const text = await file.text()
      const backup = JSON.parse(text)

      const response = await fetch("/api/admin/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backup),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Restore failed")
      }

      setMessage({ 
        type: "success", 
        text: `Backup berhasil direstore! ${JSON.stringify(data.results)}` 
      })
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: error instanceof Error ? error.message : "Gagal restore backup" 
      })
    } finally {
      setIsRestoring(false)
      // Reset input
      event.target.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground mt-2">
          Kelola backup database Anda
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Backup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup Database
            </CardTitle>
            <CardDescription>
              Download semua data dalam format JSON
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Backup akan mencakup:
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Semua artikel & kategori</li>
                <li>Komentar & user</li>
                <li>Banner & menu</li>
                <li>Halaman custom</li>
              </ul>
            </div>
            <Button 
              onClick={handleBackup} 
              disabled={isBackingUp}
              className="w-full"
            >
              <Database className="mr-2 h-4 w-4" />
              {isBackingUp ? "Membuat Backup..." : "Download Backup"}
            </Button>
          </CardContent>
        </Card>

        {/* Restore Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Restore Database
            </CardTitle>
            <CardDescription>
              Upload file backup untuk restore data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Peringatan!</strong> Restore akan menimpa data yang sudah ada. 
                Pastikan Anda sudah backup data saat ini.
              </AlertDescription>
            </Alert>
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                disabled={isRestoring}
                className="hidden"
                id="restore-file"
              />
              <label htmlFor="restore-file">
                <Button 
                  asChild
                  variant="outline"
                  disabled={isRestoring}
                  className="w-full cursor-pointer"
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {isRestoring ? "Restoring..." : "Upload Backup File"}
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tips Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>✅ Lakukan backup secara rutin (minimal 1x seminggu)</p>
          <p>✅ Simpan file backup di tempat yang aman (Google Drive, Dropbox, dll)</p>
          <p>✅ Test restore di environment development sebelum production</p>
          <p>✅ Backup sebelum melakukan update besar atau migrasi</p>
          <p>⚠️ File backup berisi data sensitif, jangan share ke publik</p>
        </CardContent>
      </Card>
    </div>
  )
}
