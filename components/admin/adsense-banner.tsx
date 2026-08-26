"use client"

import { useEffect, useRef } from "react"

interface AdSenseBannerProps {
  dataAdSlot: string
  dataAdFormat?: string
  dataFullWidthResponsive?: boolean
  className?: string
}

export function AdSenseBanner({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = ""
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isAdPushed = useRef(false)

  useEffect(() => {
    if (adRef.current && !isAdPushed.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        isAdPushed.current = true
      } catch (err) {
        console.warn("AdSense error (safe to ignore):", err)
      }
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      />
    </div>
  )
}
