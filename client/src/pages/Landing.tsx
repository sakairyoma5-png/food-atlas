import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin, BookOpen, ListChecks, Sparkles, Clock, ChefHat, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import heroImg from "@assets/generated_images/International_dishes_overhead_shot_05962886.png";
import caponataImg from "@assets/generated_images/Italian_caponata_dish_c8849bba.png";
import thaiImg from "@assets/generated_images/Thai_basil_stir-fry_dish_cacb8d40.png";
import indianImg from "@assets/generated_images/Indian_butter_chicken_curry_792b4e83.png";

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <img
          src={heroImg}
          alt="世界の料理"
          className="w-full h-full object-cover"
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
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="default"
              asChild
              data-testid="button-get-started"
            >
              <Link href="/login">
                今すぐ始める
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-background/10 backdrop-blur border-white/30 text-white hover:bg-background/20"
              data-testid="button-login-hero"
            >
              <Link href="/login">
                ログイン
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Conversation Demo Section */}
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
              <Card className="max-w-[80%] bg-card">
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
              <Card className="max-w-[80%] bg-card">
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

      {/* Recipe Examples Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              世界中の料理から、今日の一品を
            </h2>
            <p className="text-lg text-muted-foreground">
              代替食材や栄養情報も一緒に。料理初心者でも安心です
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover-elevate">
              <div className="relative aspect-[4/3]">
                <img src={caponataImg} alt="カポナータ" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-display font-semibold">カポナータ</h3>
                  <p className="text-sm">イタリア - 南イタリア</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>15分</span>
                  </div>
                  <Badge className="bg-chart-2 text-white">簡単</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  シチリアの伝統的な野菜料理。代替食材：ズッキーニでも可
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover-elevate">
              <div className="relative aspect-[4/3]">
                <img src={thaiImg} alt="ガパオライス" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-display font-semibold">ガパオライス</h3>
                  <p className="text-sm">タイ</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>20分</span>
                  </div>
                  <Badge className="bg-chart-4 text-white">普通</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  バジルの香りが食欲をそそる。栄養：420kcal/人
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover-elevate">
              <div className="relative aspect-[4/3]">
                <img src={indianImg} alt="バターチキン" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-display font-semibold">バターチキン</h3>
                  <p className="text-sm">インド - 北インド</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>30分</span>
                  </div>
                  <Badge className="bg-chart-4 text-white">普通</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  まろやかなトマトクリームソース。ナンと一緒に
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Facts Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              料理と一緒に、食文化も学べる
            </h2>
            <p className="text-lg text-muted-foreground">
              各料理の背景や豆知識で、世界の食文化を深く知る
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">カポナータの由来</h3>
                    <p className="text-sm text-muted-foreground font-accent">
                      カポナータは揚げ焼き野菜に甘酸っぱい味付けをする郷土料理。シチリアの夏の定番で、地方により砂糖や松の実を加えることも。
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">出典: Food Atlas編集部</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-2">ガパオの意味</h3>
                    <p className="text-sm text-muted-foreground font-accent">
                      「ガパオ」はタイ語でホーリーバジルのこと。本場では鶏肉が定番ですが、豚肉や海鮮でアレンジすることも多いです。
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">出典: Food Atlas編集部</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Food Atlasの特徴
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">会話で探索</h3>
              <p className="text-muted-foreground">
                AIと会話しながら、好みに合った料理を見つけられます
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">世界地図から選択</h3>
              <p className="text-muted-foreground">
                地域ごとの郷土料理を地図から探索できます
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">詳しいレシピ</h3>
              <p className="text-muted-foreground">
                代替食材や栄養情報付きのレシピで料理をサポート
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <ListChecks className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">マイログ</h3>
              <p className="text-muted-foreground">
                作った料理や食べた料理を記録して、料理の旅を振り返れます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            今すぐ世界の料理の旅を始めましょう
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            無料でアカウントを作成して、世界中の料理を探索しましょう
          </p>
          <Button size="lg" variant="default" asChild data-testid="button-signup-cta">
            <Link href="/login">
              無料で始める
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
