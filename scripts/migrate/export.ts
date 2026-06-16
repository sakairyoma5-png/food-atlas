/**
 * Food Atlas データエクスポートスクリプト
 * ソースDB（Neon/ローカル）からJSON形式でデータをエクスポートします
 *
 * 使い方:
 *   SOURCE_DB_URL=<source_connection_string> npx tsx scripts/migrate/export.ts
 *
 * 環境変数:
 *   SOURCE_DB_URL - エクスポート元DBの接続文字列（省略時は DATABASE_URL を使用）
 *   OUTPUT_DIR    - 出力ディレクトリ（省略時は scripts/migrate/data）
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";

const SOURCE_URL = process.env.SOURCE_DB_URL || process.env.DATABASE_URL!;
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, "data");

if (!SOURCE_URL) {
  console.error("❌ SOURCE_DB_URL または DATABASE_URL を設定してください");
  process.exit(1);
}

async function exportTable(sql: ReturnType<typeof postgres>, tableName: string): Promise<any[]> {
  const rows = await sql`SELECT * FROM ${sql(tableName)} ORDER BY created_at ASC NULLS LAST`;
  return rows as any[];
}

async function main() {
  console.log("🚀 Food Atlas データエクスポート開始");
  console.log(`📂 出力先: ${OUTPUT_DIR}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const sql = postgres(SOURCE_URL, { max: 5, ssl: SOURCE_URL.includes("sslmode=require") ? "require" : false });

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

  const counts: Record<string, number> = {};

  for (const table of TABLES) {
    try {
      const rows = await exportTable(sql, table);
      const outputPath = path.join(OUTPUT_DIR, `${table}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2), "utf-8");
      counts[table] = rows.length;
      console.log(`  ✅ ${table}: ${rows.length} 件`);
    } catch (err: any) {
      console.error(`  ❌ ${table}: エラー - ${err.message}`);
    }
  }

  // メタデータを保存
  const meta = {
    exportedAt: new Date().toISOString(),
    sourceUrl: SOURCE_URL.replace(/:([^:@]+)@/, ":***@"),
    counts,
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, "_meta.json"), JSON.stringify(meta, null, 2));

  console.log("\n📊 エクスポート完了:");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`   ${table}: ${count} 件`);
  }

  await sql.end();
  console.log("\n✅ エクスポート完了！");
}

main().catch((err) => {
  console.error("❌ エクスポートエラー:", err);
  process.exit(1);
});
