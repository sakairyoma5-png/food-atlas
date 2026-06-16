import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import RecipeDetail from "@/components/recipe-detail"
import AffiliateLinksSection from "@/components/affiliate-links-section"
import { getRecipeById } from "@/lib/db/queries"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "レシピ詳細 | Food Atlas",
}

export default async function RecipePage({
  params,
}: {
  params: { id: string }
}) {
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
