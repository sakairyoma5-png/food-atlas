import type { Metadata } from "next"
import MyLogs from "@/components/my-logs"

export const metadata: Metadata = {
  title: "マイログ | Food Atlas",
  description: "あなたの食事ログを確認・管理しましょう",
}

export default function LogsPage() {
  return <MyLogs />
}
