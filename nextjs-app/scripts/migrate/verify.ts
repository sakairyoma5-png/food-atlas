/**
 * Food Atlas データ整合性検証スクリプト
 * ソースDBとターゲットDBのテーブルごとのレコード数を比較します
 *
 * 使い方（nextjs-app ディレクトリから実行）:
 *   SOURCE_DB_URL=<neon_url> TARGET_DB_URL=<supabase_url> npm run migrate:verify
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
] as const;

async function getCount(
  sql: ReturnType<typeof postgres>,
  table: string
): Promise<number> {
  const rows = await sql`SELECT count(*)::int as cnt FROM ${sql(table)}`;
  return rows[0].cnt;
}

async function main() {
  console.log("🔍 Food Atlas データ整合性検証");
  console.log(`📤 ソース: ${SOURCE_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log(`📥 ターゲット: ${TARGET_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log();

  const sourceSsl =
    SOURCE_URL.includes("neon.tech") || SOURCE_URL.includes("sslmode=require");
  const targetSsl =
    TARGET_URL.includes("supabase.com") ||
    TARGET_URL.includes("sslmode=require");

  const sourceSql = postgres(SOURCE_URL, {
    max: 3,
    ssl: sourceSsl ? "require" : false,
  });
  const targetSql = postgres(TARGET_URL, {
    max: 3,
    ssl: targetSsl ? "require" : false,
  });

  console.log(
    "テーブル名              ソース   ターゲット  状態"
  );
  console.log("─".repeat(60));

  let allMatch = true;

  for (const table of TABLES) {
    const [srcCount, tgtCount] = await Promise.all([
      getCount(sourceSql, table).catch(() => -1),
      getCount(targetSql, table).catch(() => -1),
    ]);

    let status: string;
    if (srcCount === -1) status = "⚠️  ソースエラー";
    else if (tgtCount === -1) status = "❌ ターゲットエラー";
    else if (srcCount === tgtCount) status = "✅ 一致";
    else {
      status = `❌ 不一致 (差: ${tgtCount - srcCount})`;
      allMatch = false;
    }

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
    console.log(
      "   REMAP_USERS=true を使用した場合、対応するSupabaseユーザーがいないレコードはスキップされます。"
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ 検証エラー:", err);
  process.exit(1);
});
