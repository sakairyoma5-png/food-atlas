import type { Metadata } from "next"
import { Inter, Playfair_Display, Caveat } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://food-atlas.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Food Atlas - 会話で探す、世界中の料理",
    template: "%s | Food Atlas",
  },
  description:
    "AIと会話しながら世界中の料理を探索。レシピ詳細、食文化の知識、食事ログ、月間献立プランを一つのアプリで。",
  openGraph: {
    title: "Food Atlas - 会話で探す、世界中の料理",
    description:
      "AIと会話しながら世界中の料理を探索。レシピ詳細、食文化の知識、食事ログ、月間献立プランを一つのアプリで。",
    url: siteUrl,
    siteName: "Food Atlas",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Atlas - 会話で探す、世界中の料理",
    description:
      "AIと会話しながら世界中の料理を探索。レシピ詳細、食文化の知識、食事ログ、月間献立プランを一つのアプリで。",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-sans: ${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, sans-serif;
            --font-serif: ${playfair.style.fontFamily}, Georgia, serif;
            --font-accent: ${caveat.style.fontFamily}, cursive;
            --font-mono: Menlo, Monaco, monospace;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
