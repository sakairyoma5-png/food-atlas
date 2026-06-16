# Food Atlas — Supabase データ移行スクリプト

NeonPostgreSQLからSupabase PostgreSQLへのデータ移行スクリプトです。
**全スクリプトは `nextjs-app/` ディレクトリから実行します。**

## 必要な準備

- Node.js 18+（依存パッケージは workspace root の node_modules を使用）
- SupabaseプロジェクトのDirect Connection URL

## 移行手順

### ステップ1: スキーマ適用

Supabase SQL エディタで `nextjs-app/lib/db/migrations/0000_initial.sql` の内容を実行してください。

または Drizzle を使う場合:
```bash
cd nextjs-app
DATABASE_URL="postgresql://postgres.<project-id>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres" \
  npm run db:push
```

### ステップ2: データエクスポート（オプション）

データは `scripts/migrate/data/` に既にエクスポート済みです。
再エクスポートが必要な場合:
```bash
cd nextjs-app
SOURCE_DB_URL="$NEON_DATABASE_URL" npm run migrate:export
```

### ステップ3: データインポート

```bash
cd nextjs-app

# Supabase の接続文字列（Direct Connection を推奨）
export TARGET_DB_URL="postgresql://postgres.<project-id>:<password>@db.<project-id>.supabase.co:5432/postgres"

# インポート実行（ユーザーIDをそのまま保持する場合）
npm run migrate:import

# ユーザーIDを Supabase Auth UUID にリマップする場合（推奨）
REMAP_USERS=true npm run migrate:import
```

> **REMAP_USERS=true について**
> Supabase Auth のユーザーをメールアドレスで照合し、Replit Auth ID（例: "47471549"）を
> Supabase UUID に変換します。事前に移行対象ユーザーが Supabase Auth でサインイン済みである必要があります。

### ステップ4: 整合性検証

```bash
cd nextjs-app
SOURCE_DB_URL="$NEON_DATABASE_URL" \
  TARGET_DB_URL="postgresql://postgres.<project-id>:<password>@db.<project-id>.supabase.co:5432/postgres" \
  npm run migrate:verify
```

## npm スクリプト一覧

| コマンド | 説明 |
|---------|------|
| `npm run migrate:export` | ソースDBからJSONエクスポート |
| `npm run migrate:import` | JSONからターゲットDBにインポート |
| `npm run migrate:verify` | ソース/ターゲットのレコード数比較 |

## 環境変数

| 変数 | 説明 |
|------|------|
| `SOURCE_DB_URL` | エクスポート/検証のソースDB（省略時: `DATABASE_URL`） |
| `TARGET_DB_URL` | インポート/検証のターゲットDB（必須） |
| `DATA_DIR` | データディレクトリパス（省略時: `../../scripts/migrate/data`） |
| `REMAP_USERS` | `"true"` でユーザーIDをSupabase Auth UUIDにリマップ |

## ユーザーID マッピングについて

既存データのユーザーIDはReplit Auth形式（例: `47471549`, `f3d1Dz`）です。
Supabase Auth ではUUID形式（例: `a1b2c3d4-...`）が使用されます。

| モード | ユーザーID | 推奨場面 |
|--------|-----------|---------|
| `REMAP_USERS=false`（デフォルト） | Replit IDをそのまま使用 | スキーマ検証・初期テスト |
| `REMAP_USERS=true` | Supabase Auth UUIDに変換 | 本番移行 |

## Vercel 環境変数設定

移行完了後、Vercel に以下の環境変数を設定:

```
DATABASE_URL=postgresql://postgres.<project-id>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=eyJ...（Supabase Dashboard > Settings > API > anon key）
```

## データ保存先

エクスポートしたJSONデータは `scripts/migrate/data/` に保存されています（プロジェクトルートからの相対パス）。
