"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import { Globe, MessageSquare, BookOpen, MapPin, CalendarDays, ChevronRight, Star } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AIチャットで料理を探索",
    description: "「インドの辛くない料理が食べたい」「フランスの家庭料理を知りたい」など、自然な会話で世界中の料理を発見。",
  },
  {
    icon: MapPin,
    title: "インタラクティブ世界地図",
    description: "世界地図をクリックして、各地域の食文化と名物料理を視覚的に探索できます。",
  },
  {
    icon: BookOpen,
    title: "詳細レシピと食文化",
    description: "食材、調理手順、栄養情報、食文化の背景まで。代替食材のアドバイスも提供します。",
  },
  {
    icon: CalendarDays,
    title: "月間献立プラン（プレミアム）",
    description: "予算と好みに合わせた1ヶ月分の献立を自動生成。買い物リストも同時に作成。",
  },
]

const testimonials = [
  {
    name: "田中 美咲",
    text: "子供が偏食で困っていたところ、Food Atlasで料理の背景を学んで興味を持ってくれました！",
    rating: 5,
  },
  {
    name: "佐藤 健太",
    text: "料理初心者ですが、AIがわかりやすく教えてくれるので毎日新しい料理に挑戦しています。",
    rating: 5,
  },
  {
    name: "山田 花子",
    text: "世界地図から料理を探す機能が楽しすぎて、気づいたら3時間使っていました笑",
    rating: 5,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={null} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--chart-4)) 0%, transparent 50%)`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1" data-testid="badge-hero">
              AIで世界の食文化を発見
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              会話で探す、<br />
              <span className="text-primary">世界中の料理</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AIと会話しながら世界150か国以上の料理を発見。
              レシピ、食文化、月間献立まで、あなたの料理ライフをサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" asChild data-testid="button-hero-start">
                <Link href="/login">
                  無料で始める
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild data-testid="button-hero-demo">
                <Link href="/login">
                  デモを見る
                </Link>
              </Button>
            </div>
          </div>

          {/* Demo preview */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
              <div className="border-b px-4 py-3 flex items-center gap-2 bg-muted/30">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Food Atlas AI</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                    あ
                  </div>
                  <div className="bg-muted rounded-lg rounded-tl-none px-3 py-2 text-sm max-w-xs">
                    タイ料理でおすすめの辛くないレシピを教えて
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary text-primary-foreground rounded-lg rounded-tr-none px-3 py-2 text-sm max-w-xs">
                    パッタイはいかがでしょう？タイの代表的な炒め麺料理で、辛さを控えめに作ることができます。ナンプラーとタマリンドの甘酸っぱいソースが特徴です。
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              料理探索をもっと楽しく
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Food Atlasは料理の探索から記録まで、すべての料理体験をサポートします
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate" data-testid={`card-feature-${feature.title}`}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              ユーザーの声
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} data-testid={`card-testimonial-${testimonial.name}`}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{testimonial.text}</p>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            今すぐ料理の旅を始めよう
          </h2>
          <p className="text-primary-foreground/80">
            無料で始めて、世界中の料理を発見しましょう。
          </p>
          <Button variant="outline" size="lg" asChild data-testid="button-cta-start">
            <Link href="/login">
              無料で始める
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
