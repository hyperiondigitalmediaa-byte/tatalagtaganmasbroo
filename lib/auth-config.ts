import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { verifyPassword } from "./auth"
import { verifyTurnstile } from "./turnstile"

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "CAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Verify CAPTCHA
        if (credentials.captchaToken) {
          const isCaptchaValid = await verifyTurnstile(
            credentials.captchaToken as string
          )
          if (!isCaptchaValid) {
            console.error("CAPTCHA verification failed")
            return null
          }
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          return null
        }

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        )

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role
      }
      return session
    }
  }
}
