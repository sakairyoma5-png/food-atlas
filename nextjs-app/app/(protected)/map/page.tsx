import type { Metadata } from "next"
import WorldMap from "@/components/world-map"

export const metadata: Metadata = {
  title: "世界地図",
  description: "世界の地図から地域の料理を探索しましょう",
}

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <WorldMap />
    </div>
  )
}
