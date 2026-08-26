"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

export function AdSenseHorizontal() {
  const adRef = useRef<HTMLModElement>(null)
  const isAdPushed = useRef(false)
  const [showDummy, setShowDummy] = useState(true)

  useEffect(() => {
    if (adRef.current && !isAdPushed.current) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
        isAdPushed.current = true
        // Hide dummy after AdSense loads
        setTimeout(() => setShowDummy(false), 1000)
      } catch (err) {
        console.error("AdSense error:", err)
      }
    }
  }, [])

  return (
    <div className="my-6">
      {/* Dummy Ad for Testing - Remove when AdSense is active */}
      {showDummy && (
        <div className="relative w-full h-[90px] bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center gap-4 px-8">
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
              <span className="text-2xl">📢</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">Google AdSense - Iklan Horizontal</h3>
              <p className="text-white/90 text-sm">Ganti ca-pub-XXX dengan Publisher ID Anda untuk menampilkan iklan asli</p>
            </div>
            <div className="bg-white text-blue-600 px-6 py-2 rounded-full font-bold text-sm">
              728x90
            </div>
          </div>
        </div>
      )}
      
      {/* Real AdSense Code */}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="1234567890"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}
