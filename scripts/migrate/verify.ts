/**
 * Food Atlas データ整合性検証スクリプト
 * ソースDBとターゲットDBのテーブルごとのレコード数を比較します
 *
 * 使い方:
 *   SOURCE_DB_URL=<neon_url> TARGET_DB_URL=<supabase_url> npx tsx scripts/migrate/verify.ts
 *
 * 環境変数:
 *   SOURCE_DB_URL - ソースDB（省略時は DATABASE_URL）
 *   TARGET_DB_URL - ターゲットDB（必須）
 */

import postgres from "postgres";

const SOURCE_URL = process.env.SOURCE_DB_URL || process.env.DATABASE_URL!;
const TARGET_URL = process.env.TARGET_DB_URL!;

if (!SOURCE_URL || !TARGET_URL) {
  console.error("❌ SOURCE_DB_URL と TARGET_DB_URL の両方を設定してください");
  process.exit(1);
}

const TABLES = [
  "users",
  "regions",
  "conversations",
  "messages",
  "recipes",
  "food_logs",
  "user_subscriptions",
  "meal_plans",
];

async function getCount(sql: ReturnType<typeof postgres>, table: string): Promise<number> {
  const rows = await sql`SELECT count(*)::int as cnt FROM ${sql(table)}`;
  return rows[0].cnt;
}

async function main() {
  console.log("🔍 Food Atlas データ整合性検証");
  console.log(`📤 ソース: ${SOURCE_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log(`📥 ターゲット: ${TARGET_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log();

  const sourceSql = postgres(SOURCE_URL, {
    max: 3,
    ssl: SOURCE_URL.includes("sslmode=require") ? "require" : false,
  });
  const targetSql = postgres(TARGET_URL, {
    max: 3,
    ssl: TARGET_URL.includes("sslmode=require") ? "require" : false,
  });

  console.log("テーブル名              ソース   ターゲット  状態");
  console.log("─".repeat(60));

  let allMatch = true;

  for (const table of TABLES) {
    const [srcCount, tgtCount] = await Promise.all([
      getCount(sourceSql, table).catch(() => -1),
      getCount(targetSql, table).catch(() => -1),
    ]);

    const status = srcCount === tgtCount ? "✅ 一致" : srcCount === -1 ? "⚠️  ソースエラー" : tgtCount === -1 ? "❌ ターゲットエラー" : `❌ 不一致 (差: ${tgtCount - srcCount})`;

    if (srcCount !== tgtCount) allMatch = false;

    const paddedTable = table.padEnd(22);
    const paddedSrc = String(srcCount === -1 ? "ERROR" : srcCount).padStart(7);
    const paddedTgt = String(tgtCount === -1 ? "ERROR" : tgtCount).padStart(10);

    console.log(`${paddedTable} ${paddedSrc} ${paddedTgt}  ${status}`);
  }

  console.log("─".repeat(60));

  await sourceSql.end();
  await targetSql.end();

  if (allMatch) {
    console.log("\n✅ 全テーブルのレコード数が一致しています。移行成功！");
  } else {
    console.log("\n⚠️  一部のテーブルでレコード数が一致しません。");
    console.log("   ユーザーIDリマップを使用した場合、対応するSupabaseユーザーがいないレコードはスキップされます。");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ 検証エラー:", err);
  process.exit(1);
});
