"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Link from "next/link"
import Image from "next/image"
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
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/hero-food.png"
          alt="世界の料理"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
            Food Atlas
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            会話で探す、世界中の料理。<br />
            あなただけの料理の旅を記録しましょう。
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" variant="default" asChild data-testid="button-get-started">
              <Link href="/login">今すぐ始める</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white/10 backdrop-blur border-white/30 text-white"
              data-testid="button-login-hero"
            >
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Conversation Demo */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              会話するだけで、あなたにピッタリの料理が見つかる
            </h2>
            <p className="text-lg text-muted-foreground">
              時間や材料、気分を伝えるだけ。AIが最適な料理を提案します
            </p>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-start">
              <Card className="max-w-[80%]">
                <CardContent className="p-4">
                  <p className="text-sm">こんにちは！今日はどんな料理を作りたいですか？</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end">
              <Card className="max-w-[80%] bg-primary text-primary-foreground">
                <CardContent className="p-4">
                  <p className="text-sm">イタリア料理で、30分以内に作れるものがいいです</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-start">
              <Card className="max-w-[80%]">
                <CardContent className="p-4">
                  <p className="text-sm mb-3">素晴らしい選択ですね！イタリアの簡単なレシピを3つご提案します：</p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">カポナータ (15分)</Badge>
                    <Badge variant="secondary" className="text-xs">ペンネアラビアータ (20分)</Badge>
                    <Badge variant="secondary" className="text-xs">カプレーゼサラダ (10分)</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
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

      {/* Dish Gallery */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              世界の料理を探索しよう
            </h2>
            <p className="text-muted-foreground">150か国以上の料理があなたを待っています</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-md overflow-hidden">
              <Image src="/caponata.png" alt="イタリア カポナータ" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-bold text-lg">カポナータ</p>
                <p className="text-sm text-white/80">イタリア</p>
              </div>
            </div>
            <div className="relative h-64 rounded-md overflow-hidden">
              <Image src="/thai.png" alt="タイ バジル炒め" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-bold text-lg">バジル炒め</p>
                <p className="text-sm text-white/80">タイ</p>
              </div>
            </div>
            <div className="relative h-64 rounded-md overflow-hidden">
              <Image src="/indian.png" alt="インド バターチキン" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-bold text-lg">バターチキン</p>
                <p className="text-sm text-white/80">インド</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">ユーザーの声</h2>
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
          <Button
            variant="outline"
            size="lg"
            asChild
            data-testid="button-cta-start"
            className="bg-white/10 backdrop-blur border-white/30 text-white"
          >
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
