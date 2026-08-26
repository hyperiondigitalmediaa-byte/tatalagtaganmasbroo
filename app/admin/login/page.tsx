"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TurnstileWidget } from "@/components/turnstile"
import { Newspaper, Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [isLocalhost, setIsLocalhost] = useState(false)
  
  // Disable Turnstile in localhost - use useEffect to avoid hydration mismatch
  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1'
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Check rate limit first
      const rateLimitCheck = await fetch("/api/auth/login-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const rateLimitData = await rateLimitCheck.json()

      if (!rateLimitData.allowed) {
        setError(rateLimitData.error)
        setCaptchaToken(null)
        setIsLoading(false)
        return
      }

      // Proceed with login
      const result = await signIn("credentials", {
        email,
        password,
        captchaToken,
        redirect: false,
      })

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.")
        setCaptchaToken(null) // Reset CAPTCHA
        setIsLoading(false)
      } else {
        // Redirect on success
        window.location.href = "/admin"
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setCaptchaToken(null) // Reset CAPTCHA
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Newspaper className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold">Portal Admin</CardTitle>
          <CardDescription className="text-base">
            Masuk ke dashboard untuk mengelola berita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@news.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11"
              />
            </div>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {/* Cloudflare Turnstile CAPTCHA - Disabled in localhost */}
            {!isLocalhost && (
              <div className="flex justify-center">
                <TurnstileWidget
                  onSuccess={(token) => setCaptchaToken(token)}
                  onError={() => setCaptchaToken(null)}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading || (!isLocalhost && !captchaToken)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo: admin@news.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
