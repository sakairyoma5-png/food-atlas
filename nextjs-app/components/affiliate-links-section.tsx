"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ShoppingCart, Book } from "lucide-react"

interface AffiliateLinksSectionProps {
  recipeName: string
  ingredients: string[]
  region: string
}

export default function AffiliateLinksSection({
  recipeName,
  ingredients,
  region,
}: AffiliateLinksSectionProps) {
  const generateAmazonLink = (query: string) => {
    const tag = "foodatlas-22"
    const encodedQuery = encodeURIComponent(query)
    return `https://www.amazon.co.jp/s?k=${encodedQuery}&tag=${tag}`
  }

  const generateRakutenLink = (query: string) => {
    const encodedQuery = encodeURIComponent(query)
    return `https://search.rakuten.co.jp/search/mall/${encodedQuery}/`
  }

  const mainIngredients = ingredients.slice(0, 3)

  const recommendedProducts = [
    {
      title: `${region}料理の調味料セット`,
      description: "本格的な味を再現するための調味料",
      amazonQuery: `${region} 調味料セット`,
    },
    {
      title: `${recipeName}のレシピ本`,
      description: "詳しい作り方と文化的背景を学べる一冊",
      amazonQuery: `${region} 料理 レシピ本`,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <CardTitle>材料を購入</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            必要な材料をオンラインで簡単に購入できます
          </p>
          <div className="space-y-3">
            {mainIngredients.map((ingredient, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <span className="font-medium">{ingredient}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    data-testid={`button-amazon-${index}`}
                  >
                    <a
                      href={generateAmazonLink(ingredient)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Amazon
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    data-testid={`button-rakuten-${index}`}
                  >
                    <a
                      href={generateRakutenLink(ingredient)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      楽天
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <CardTitle>おすすめ商品</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedProducts.map((product, index) => (
            <div
              key={index}
              className="p-4 border border-border rounded-lg hover-elevate"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{product.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      asChild
                      data-testid={`button-product-amazon-${index}`}
                    >
                      <a
                        href={generateAmazonLink(product.amazonQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Amazonで見る
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      data-testid={`button-product-rakuten-${index}`}
                    >
                      <a
                        href={generateRakutenLink(product.amazonQuery)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        楽天で見る
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center p-4 bg-muted/30 rounded-lg">
        <p>
          ※ これらは参考リンクです。購入による収益の一部は、このサービスの運営に活用されます。
        </p>
      </div>
    </div>
  )
}
