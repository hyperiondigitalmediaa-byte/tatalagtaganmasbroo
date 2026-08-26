"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (!gaId) return

    // Initialize dataLayer first
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }

    // Make gtag available globally
    window.gtag = gtag

    // Load gtag script
    const script1 = document.createElement("script")
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script1.async = true
    script1.onload = () => {
      gtag("js", new Date())
      gtag("config", gaId, {
        page_path: window.location.pathname,
      })
    }
    document.head.appendChild(script1)
  }, [gaId])

  return null
}
