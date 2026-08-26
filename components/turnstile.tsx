"use client"

import { Turnstile } from "@marsidev/react-turnstile"

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void
  onError?: () => void
}

export function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  console.log("🔑 Turnstile Site Key:", siteKey)

  if (!siteKey) {
    console.error("❌ NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined!")
    return null
  }

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      onError={onError}
      options={{
        theme: "light",
        size: "normal",
      }}
    />
  )
}
