import { Globe } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span className="text-lg font-display font-bold">Food Atlas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              会話で探す、世界中の料理。あなただけの料理の旅を記録しましょう。
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">サービス</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/login">
                  <a className="hover:text-foreground transition-colors">料理を探す</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className="hover:text-foreground transition-colors">世界地図</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className="hover:text-foreground transition-colors">マイログ</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">サポート</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  ヘルプセンター
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  お問い合わせ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  よくある質問
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">法的情報</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  利用規約
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  プライバシーポリシー
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  特定商取引法に基づく表記
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 Food Atlas. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
