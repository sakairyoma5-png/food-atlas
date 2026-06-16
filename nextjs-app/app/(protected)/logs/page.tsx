import type { Metadata } from "next"
import MyLogs from "@/components/my-logs"

export const metadata: Metadata = {
  title: "マイログ",
  description: "あなたの食事ログを確認・管理しましょう",
  openGraph: {
    title: "マイログ | Food Atlas",
    description: "作った料理・食べた料理を記録して、あなただけの料理の旅を振り返りましょう。",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "マイログ | Food Atlas",
    description: "作った料理・食べた料理を記録して、あなただけの料理の旅を振り返りましょう。",
  },
}

export default function LogsPage() {
  return <MyLogs />
}
