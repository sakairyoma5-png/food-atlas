# Food Atlas — Supabase データ移行ガイド

このディレクトリには、NeonPostgreSQLからSupabase PostgreSQLへのデータ移行に使用するJSONデータファイルが含まれています。
実行可能なスクリプトは `nextjs-app/scripts/migrate/` にあります。

## 現在のデータ状況（エクスポート済み）

```
scripts/migrate/data/
  users.json             12 件
  regions.json           21 件
  conversations.json      3 件
  messages.json          10 件
  recipes.json            3 件
  food_logs.json          0 件
  user_subscriptions.json 0 件
  meal_plans.json         0 件
  _meta.json             (メタデータ)
```

## 移行手順 → `nextjs-app/scripts/migrate/README.md` を参照

```
nextjs-app/
  scripts/migrate/
    README.md       ← 詳細な移行手順
    export.mjs      ← エクスポートスクリプト
    import.mjs      ← インポートスクリプト
    verify.mjs      ← 整合性検証スクリプト
```
