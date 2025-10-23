import RegionSelector from "@/components/RegionSelector";

export default function MapView() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <RegionSelector />
      </div>
    </div>
  );
}
