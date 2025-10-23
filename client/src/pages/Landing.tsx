import { Button } from "@/components/ui/button";
import { Globe, MapPin, BookOpen, ListChecks } from "lucide-react";
import { Link } from "wouter";
import heroImg from "@assets/generated_images/International_dishes_overhead_shot_05962886.png";

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
            <Link href="/login">
              <a>
                <Button
                  size="lg"
                  variant="default"
                  data-testid="button-get-started"
                >
                  今すぐ始める
                </Button>
              </a>
            </Link>
            <Link href="/login">
              <a>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/10 backdrop-blur border-white/30 text-white hover:bg-background/20"
                  data-testid="button-login-hero"
                >
                  ログイン
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">
            Food Atlasでできること
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
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            今すぐ世界の料理の旅を始めましょう
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            無料でアカウントを作成して、世界中の料理を探索しましょう
          </p>
          <Link href="/login">
            <a>
              <Button size="lg" variant="default" data-testid="button-signup-cta">
                無料で始める
              </Button>
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
