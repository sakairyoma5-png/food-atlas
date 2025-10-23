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

### 実装中
- 🔄 データスキーマ設計
- 🔄 データベースセットアップ
- 🔄 バックエンドAPI実装
- 🔄 OpenAI統合（チャット機能）
- 🔄 認証システム（Replit Auth）

### 未実装
- ⏳ レシピ保存・管理機能
- ⏳ ログ記録・表示機能
- ⏳ 地域情報取得
- ⏳ 文化的豆知識システム

## 最近の変更

### 2025-10-23
- フッターコンポーネントを追加（サービスリンク、サポート、法的情報、SNSアイコン）
- SNSアイコン（X, Instagram, Facebook）を実装

## ユーザー設定

- 言語: 日本語
- 認証方式: Replit Auth（Google、GitHub、メール/パスワード）
- データ永続化: PostgreSQLデータベース使用
- AI統合: Replit AI Integrationsを使用（APIキー不要、Replitクレジットで課金）

## 注意事項

- モック認証: App.tsxで`useState(false)`を使用。`true`に変更するとログイン状態のプレビュー可能
- モックデータ: 各コンポーネントに`//todo: remove mock functionality`コメントあり
- 開発環境: インメモリストレージ（MemStorage）使用中、本番環境ではPostgreSQLに切り替え

## 次のステップ

1. データスキーマの完成（会話、レシピ、ログ、地域情報）
2. PostgreSQLデータベースのセットアップ
3. OpenAI統合でAIチャット機能の実装
4. Replit Authで認証システムの実装
5. バックエンドAPIの完成
6. フロントエンドとバックエンドの接続
