import type { Metadata } from "next"
import LoginForm from "@/components/login-form"
import { Globe } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "ログイン | Food Atlas",
  description: "Food Atlasにログインして世界の料理を探索しましょう",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-2xl font-display font-bold">Food Atlas</span>
          </Link>
          <h1 className="text-2xl font-display font-bold">ようこそ</h1>
          <p className="text-muted-foreground mt-2">アカウントにログインしてください</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            トップページに戻る
          </Link>
        </p>
      </div>
    </div>
  )
}
