# Food Atlas

会話で探す、世界中の料理。AIとの対話を通じて料理を発見し、レシピを学び、調理体験を記録するWebアプリケーション。

## プロジェクト概要

**コンセプト**: ユーザーがAIと会話しながら世界中の料理を探索し、レシピの詳細を学び、調理や食事の体験をログとして記録できるサービス。

**主な機能**:
- AIチャット機能で料理を探索（3ターン以内に3つの候補を提示、無制限の絞り込み）
- レシピ詳細表示（代替材料、栄養情報含む）
- 世界地図から地域を選択
- 文化的な豆知識の表示
- 調理・食事体験のログ記録

**将来の拡張予定**:
- 食事計画機能
- 食材購入連携
- レストラン予約
- 季節の食材フォーラム
- ネイティブアプリ移行

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite + Wouter + TailwindCSS + shadcn/ui
- **バックエンド**: Express + Node.js
- **データベース**: PostgreSQL (Neon)
- **AI**: OpenAI API (Replit統合)
- **認証**: Replit Auth
- **デザイン**: Playfair Display（見出し）、Inter（本文）、Caveat（手書き風）

## デザインシステム

**カラーパレット**（食をテーマにした温かみのある配色）:
- Primary: オリーブグリーン系
- Secondary: テラコッタオレンジ
- Accent: ゴールデンイエロー
- Background: クリーム/ベージュ系

**参考デザイン**: Tasty + Airbnb + Duolingoの美学

## プロジェクト構成

### フロントエンド（完成）
- `client/src/pages/`: Landing, Login, Home, MapView, MyLogs, RecipeDetailPage
- `client/src/components/`: Header, Footer, ChatInterface, RecipeCard, RecipeDetail, RegionSelector, FoodLogCard, ComparisonTray, CulturalFactToast, QuickActionChips

### バックエンド（実装中）
- `server/routes.ts`: APIルート
- `server/storage.ts`: ストレージインターフェース
- `shared/schema.ts`: データスキーマ

## 現在の実装状態

### 完了
- ✅ デザインガイドライン作成
- ✅ UIコンポーネントライブラリ構築
- ✅ 全ページのフロントエンド実装
- ✅ ランディングページの完成（会話デモ、レシピ例、文化的豆知識セクション含む）
- ✅ フッターコンポーネント（SNSアイコン付き）
- ✅ データスキーマ設計（会話、メッセージ、レシピ、ログ、地域）
- ✅ PostgreSQLデータベースセットアップ（21地域のシードデータ含む）
- ✅ バックエンドAPI実装（認証、会話、レシピ、ログ、地域）
- ✅ OpenAI統合（GPT-5-mini、Replit AI Integrations）
- ✅ 認証システム（Replit Auth、セッション管理）
- ✅ フロントエンド・バックエンド統合
- ✅ セキュリティ検証（会話所有権チェック、リクエストボディ検証）
- ✅ ブラウザエラー修正（<a>タグの入れ子問題解決）

### 実装中
- ⏳ AI会話からのレシピ自動抽出・保存機能

### 未実装
- ⏳ レシピ手動保存・管理機能
- ⏳ 地域情報取得API
- ⏳ 文化的豆知識システム
- ⏳ レシピの代替材料提案
- ⏳ 栄養情報計算

## 最近の変更

### 2025-10-24
- ログイン404エラーの修正：
  - すべてのログインリンクを`/login`から`/api/login`に変更
  - Landing、Header、Footerコンポーネントの修正
  - Footer内の<a>入れ子問題を解消
  - 未使用のwouterインポートを削除
- フードログ削除エンドポイントのセキュリティ強化（所有権検証追加）

### 2025-10-23
- フッターコンポーネントを追加（サービスリンク、サポート、法的情報、SNSアイコン）
- SNSアイコン（X, Instagram, Facebook）を実装
- データスキーマの完成（会話、メッセージ、レシピ、ログ、地域）
- PostgreSQLデータベースのセットアップと初期化（21地域のシードデータ含む）
- 全バックエンドAPIエンドポイントの実装
- OpenAI GPT-5-miniとの統合（Replit AI Integrations使用）
- Replit Authによる認証フローの実装（セッション管理含む）
- フロントエンド・バックエンドの完全統合
- セキュリティ強化：
  - 会話、メッセージ、レシピ、フードログの所有権検証
  - すべての認証済みエンドポイントで403/404エラーハンドリング
  - リクエストボディ検証（Zod使用）
- ブラウザコンソールエラーの完全修正（Header、LandingページのLink/Button構造修正）
- クエリパラメータサポートの追加（lib/queryClient.ts）

## ユーザー設定

- 言語: 日本語
- 認証方式: Replit Auth（Google、GitHub、メール/パスワード）
- データ永続化: PostgreSQLデータベース使用
- AI統合: Replit AI Integrationsを使用（APIキー不要、Replitクレジットで課金）

## 注意事項

- 認証: Replit Authを使用（Google、GitHub、Apple、X、メール/パスワード対応）
- データベース: PostgreSQLデータベースを使用（Neon-backed）
- セキュリティ: すべてのAPIエンドポイントで所有権検証を実装済み
- レシピ保存: 現在、レシピの自動保存機能は未実装（将来の拡張予定）
- 会話履歴: 会話の再開機能は未実装（将来の拡張予定）

## 次のステップ

1. AI会話からのレシピ自動抽出・保存機能の実装
   - システムプロンプトの最適化（JSON形式での応答）
   - レシピデータの解析・保存ロジック
2. レシピ手動保存機能の追加
   - チャットインターフェースに「保存」ボタン追加
   - 保存済みレシピページの実装
3. 地域情報取得APIの実装
4. 文化的豆知識システムの実装
5. エンドツーエンドテスト
6. パフォーマンス最適化
