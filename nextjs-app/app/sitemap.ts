import type { MetadataRoute } from "next"
import { getAllRecipesForSitemap } from "@/lib/db/queries"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://food-atlas.vercel.app"

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  let recipeRoutes: MetadataRoute.Sitemap = []
  try {
    const recipeRows = await getAllRecipesForSitemap()
    recipeRoutes = recipeRows.map((r) => ({
      url: `${baseUrl}/recipe/${r.id}`,
      lastModified: r.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    // DB unavailable at build time — skip dynamic routes gracefully
  }

  return [...staticRoutes, ...recipeRoutes]
}
