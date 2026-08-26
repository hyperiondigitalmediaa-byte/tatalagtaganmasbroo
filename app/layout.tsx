import { Inter, Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import Script from "next/script";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Metadata configuration
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Portal Berita - Website Berita Terkini",
    template: "%s | Portal Berita"
  },
  description: "Website berita terkini dan terpercaya",
  keywords: ["berita", "news", "portal berita", "berita terkini", "indonesia"],
  authors: [{ name: "Portal Berita" }],
  creator: "Portal Berita",
  publisher: "Portal Berita",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Portal Berita',
    title: 'Portal Berita - Website Berita Terkini',
    description: 'Website berita terkini dan terpercaya',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal Berita - Website Berita Terkini',
    description: 'Website berita terkini dan terpercaya',
  },
}

// Default theme
const DEFAULT_THEME = {
  primaryColor: "#dc2626", // red-600 - warna merah default
  secondaryColor: "#10b981", // green-500
  accentColor: "#f59e0b", // amber-500
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontFamily: "Inter",
};

async function getTheme() {
  // Skip database query during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return DEFAULT_THEME;
  }
  
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { category: "theme" },
    });

    const theme: Record<string, string> = { ...DEFAULT_THEME };
    settings.forEach((setting: any) => {
      theme[setting.key] = setting.value;
    });

    return theme;
  } catch (error) {
    console.error("Error loading theme:", error);
    return DEFAULT_THEME;
  }
}

async function getSiteSettings() {
  // Skip database query during build time
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return {
      siteName: "Portal Berita",
      siteDescription: "Website berita terkini dan terpercaya",
      faviconUrl: "",
    };
  }
  
  try {
    const settings = await prisma.siteSettings.findMany({
      where: { category: "general" },
    });

    const result: Record<string, string> = {
      siteName: "Portal Berita",
      siteDescription: "Website berita terkini dan terpercaya",
      faviconUrl: "",
    };

    settings.forEach((setting: any) => {
      result[setting.key] = setting.value;
    });

    return result;
  } catch (error) {
    console.error("Error loading site settings:", error);
    return {
      siteName: "Portal Berita",
      siteDescription: "Website berita terkini dan terpercaya",
      faviconUrl: "",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = await getTheme();
  const siteSettings = await getSiteSettings();

  return (
    <html lang="id">
      <head>
        <title>{siteSettings.siteName} - Website Berita Terkini</title>
        <meta name="description" content={siteSettings.siteDescription} />
        {siteSettings.faviconUrl && (
          <>
            <link rel="icon" type="image/png" sizes="32x32" href={siteSettings.faviconUrl} />
            <link rel="icon" type="image/png" sizes="16x16" href={siteSettings.faviconUrl} />
            <link rel="shortcut icon" href={siteSettings.faviconUrl} />
          </>
        )}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${theme.primaryColor};
              --color-secondary: ${theme.secondaryColor};
              --color-accent: ${theme.accentColor};
              --color-background: ${theme.backgroundColor};
              --color-text: ${theme.textColor};
              --font-family: ${theme.fontFamily};
            }
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JTPLZKCR8Z"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JTPLZKCR8Z');
          `}
        </Script>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
