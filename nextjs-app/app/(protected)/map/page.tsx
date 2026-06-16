import type { Metadata } from "next"
import WorldMap from "@/components/world-map"

export const metadata: Metadata = {
  title: "世界地図",
  description: "世界の地図から地域の料理を探索しましょう",
  openGraph: {
    title: "世界地図 | Food Atlas",
    description: "インタラクティブな世界地図をクリックして各地域の郷土料理・食文化を視覚的に探索できます。",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "世界地図 | Food Atlas",
    description: "インタラクティブな世界地図をクリックして各地域の郷土料理・食文化を視覚的に探索できます。",
  },
}

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WorldMap />
    </div>
  )
}
