import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RecipeDetail from "@/components/recipe-detail"
import AffiliateLinksSection from "@/components/affiliate-links-section"
import { getRecipeById } from "@/lib/db/queries"
import { createClient } from "@/lib/supabase/server"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      title: "レシピ詳細",
      description: "Food Atlasのレシピ詳細ページです。",
    }
  }

  const recipe = await getRecipeById(params.id).catch(() => null)

  if (!recipe || recipe.userId !== user.id) {
    return {
      title: "レシピ詳細",
      description: "Food Atlasのレシピ詳細ページです。",
    }
  }

  const description = recipe.description
    ? recipe.description.slice(0, 150)
    : `${recipe.region}の料理「${recipe.name}」のレシピ。調理時間${recipe.cookingTime ?? "—"}分。`

  return {
    title: `${recipe.name}のレシピ`,
    description,
    openGraph: {
      title: `${recipe.name}のレシピ | Food Atlas`,
      description,
      type: "article",
      ...(recipe.imageUrl ? { images: [{ url: recipe.imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipe.name}のレシピ | Food Atlas`,
      description,
      ...(recipe.imageUrl ? { images: [recipe.imageUrl] } : {}),
    },
  }
}

export default async function RecipePage({ params }: Props) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const recipe = await getRecipeById(params.id)

  if (!recipe || recipe.userId !== user.id) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild data-testid="button-back">
          <Link href="/home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Link>
        </Button>
      </div>

      <RecipeDetail recipe={recipe} />

      <div className="mt-8">
        <AffiliateLinksSection
          recipeName={recipe.name}
          ingredients={recipe.ingredients}
          region={recipe.region}
        />
      </div>
    </div>
  )
}
