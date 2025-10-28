import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, BookOpen, Lock } from "lucide-react";

interface ComingSoonFeature {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "準備中" | "交渉中" | "計画中";
}

export default function ComingSoonSection() {
  const features: ComingSoonFeature[] = [
    {
      title: "食材配送連携",
      description: "献立リストから直接オンラインで食材を購入。Oisix、楽天西友、AmazonFreshなどと連携予定です。",
      icon: ShoppingCart,
      status: "交渉中",
    },
    {
      title: "レストラン予約",
      description: "気になる料理を実際に食べに行く。地域のレストランを検索して、簡単に予約できるようになります。",
      icon: MapPin,
      status: "準備中",
    },
    {
      title: "料理教室・イベント",
      description: "世界の料理を学べる体験イベントや料理教室を開催。食を通じた文化交流の場を提供します。",
      icon: BookOpen,
      status: "計画中",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "準備中":
        return "bg-chart-2 text-white";
      case "交渉中":
        return "bg-chart-4 text-white";
      case "計画中":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section className="bg-muted/30 py-16" data-testid="section-coming-soon">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-display font-bold">近日公開予定</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            さらに便利で楽しい機能を続々と追加していきます。
            ビジネスパートナーとの提携により、料理体験をより豊かにします。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative overflow-hidden"
              data-testid={`card-coming-soon-${index}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>

              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            これらの機能は、外部企業との提携が完了次第、順次公開予定です。
            <br />
            最新情報はニュースレターでお知らせします。
          </p>
        </div>
      </div>
    </section>
  );
}
