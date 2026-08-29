import { NextAuthConfig } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { checkRateLimit } from "@/lib/rate-limit"

export const authOptions: NextAuthConfig = {
  providers: [
    // Google OAuth for public users (comments)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER", // Default role USER for Google users (only comments)
          googleId: profile.sub,
        }
      },
    }),
    
    // Credentials for admin login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        captchaToken: { label: "CAPTCHA Token", type: "text" }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi")
        }

        // Verify CAPTCHA token (skip in development/localhost)
        // TEMPORARILY DISABLED - Enable after Turnstile domain configuration
        /*
        const captchaToken = credentials.captchaToken as string
        const isDevelopment = process.env.NODE_ENV === 'development'
        
        if (captchaToken && !isDevelopment) {
          const secretKey = process.env.TURNSTILE_SECRET_KEY
          if (secretKey) {
            try {
              const response = await fetch(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    secret: secretKey,
                    response: captchaToken,
                  }),
                }
              )
              const data = await response.json()
              if (!data.success) {
                throw new Error("Verifikasi CAPTCHA gagal")
              }
            } catch (error) {
              console.error("CAPTCHA verification error:", error)
              throw new Error("Verifikasi CAPTCHA gagal")
            }
          }
        }
        */

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user || !user.password) {
          throw new Error("Email atau password salah")
        }

        const isPasswordValid = bcrypt.compareSync(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error("Email atau password salah")
        }

        // Only allow admin/editor to login via credentials
        if (user.role !== "ADMIN" && user.role !== "EDITOR") {
          throw new Error("Akses ditolak")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as string,
          image: (user as any).image || null,
        }
      }
    })
  ],
  
  pages: {
    signIn: "/admin/login", // Admin login page
  },
  
  session: {
    strategy: "jwt",
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.image = user.image
        
        // Save Google ID if signing in with Google
        if (account?.provider === "google") {
          token.googleId = account.providerAccountId
          
          // Create or update user in database
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })
          
          if (!existingUser) {
            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || "User",
                image: user.image,
                googleId: account.providerAccountId,
                role: "USER",
                emailVerified: new Date(),
              } as any
            })
            token.id = newUser.id
            token.role = (newUser as any).role
          } else {
            // Update existing user with Google info if needed
            if (!(existingUser as any).googleId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  image: user.image,
                  emailVerified: new Date(),
                } as any
              })
            }
            token.id = existingUser.id
            token.role = existingUser.role as string
          }
        }
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).role = token.role as string
        session.user.image = token.image as string
      }
      return session
    },
    
    async signIn({ user, account }) {
      // Allow Google sign-in for public users
      if (account?.provider === "google") {
        // Check if user is banned
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })
        
        if (existingUser?.isBanned) {
          return false
        }
        
        return true
      }
      
      // Allow credentials sign-in for admin
      return true
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
}
