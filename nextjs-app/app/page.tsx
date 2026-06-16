import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import LandingPage from "@/components/landing-page"

export const metadata: Metadata = {
  title: {
    absolute: "Food Atlas - 会話で探す、世界中の料理",
  },
  description:
    "AIと会話するだけで世界中の料理を発見。レシピ詳細・食文化・食事ログ・月間献立プランを一つのアプリで楽しめる食の探索プラットフォーム。",
  openGraph: {
    title: "Food Atlas - 会話で探す、世界中の料理",
    description:
      "AIと会話するだけで世界中の料理を発見。レシピ詳細・食文化・食事ログ・月間献立プランを一つのアプリで楽しめる食の探索プラットフォーム。",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://food-atlas.vercel.app",
    siteName: "Food Atlas",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food Atlas - 会話で探す、世界中の料理",
    description:
      "AIと会話するだけで世界中の料理を発見。レシピ詳細・食文化・食事ログ・月間献立プランを一つのアプリで。",
  },
}

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/home")
  }

  return <LandingPage />
}
