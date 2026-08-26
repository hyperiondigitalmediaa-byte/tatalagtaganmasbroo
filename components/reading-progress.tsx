"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100

      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener("scroll", updateProgress)
    updateProgress() // Initial calculation

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
      <div
        className="h-full transition-all duration-150 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: "var(--color-primary)",
        }}
      />
    </div>
  )
}
