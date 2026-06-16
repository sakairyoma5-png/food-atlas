import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Globe className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-display font-bold mb-2">404</h1>
      <p className="text-xl font-semibold mb-2">ページが見つかりません</p>
      <p className="text-muted-foreground mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Button asChild data-testid="button-back-home">
        <Link href="/">トップページに戻る</Link>
      </Button>
    </div>
  )
}
