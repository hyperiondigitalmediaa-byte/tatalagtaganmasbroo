// Verify Cloudflare Turnstile token
export async function verifyTurnstile(token: string): Promise<boolean> {
  // Hardcode for now - will use env var in production
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAAB_dlXE_WzvGmr25WHUkzT9celk"

  if (!secretKey) {
    console.warn("⚠️ TURNSTILE_SECRET_KEY not set, skipping verification")
    return true
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
        }),
      }
    )

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("Turnstile verification error:", error)
    return false
  }
}
