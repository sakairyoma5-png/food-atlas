/**
 * Food Atlas データエクスポートスクリプト
 * ソースDB（Neon/ローカル）からJSON形式でデータをエクスポートします
 *
 * 使い方（nextjs-app ディレクトリから実行）:
 *   SOURCE_DB_URL=<source_connection_string> npm run migrate:export
 *
 * 環境変数:
 *   SOURCE_DB_URL - エクスポート元DBの接続文字列（省略時は DATABASE_URL を使用）
 *   OUTPUT_DIR    - 出力ディレクトリ（省略時は ../../scripts/migrate/data）
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_URL = process.env.SOURCE_DB_URL || process.env.DATABASE_URL!;
const OUTPUT_DIR =
  process.env.OUTPUT_DIR ||
  path.resolve(__dirname, "../../scripts/migrate/data");

if (!SOURCE_URL) {
  console.error("❌ SOURCE_DB_URL または DATABASE_URL を設定してください");
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

async function main() {
  console.log("🚀 Food Atlas データエクスポート開始");
  console.log(`📂 出力先: ${OUTPUT_DIR}`);
  console.log(`🔗 ソース: ${SOURCE_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const isNeon = SOURCE_URL.includes("neon.tech") || SOURCE_URL.includes("sslmode=require");
  const sql = postgres(SOURCE_URL, {
    max: 5,
    ssl: isNeon ? "require" : false,
  });

  const counts: Record<string, number> = {};

  for (const table of TABLES) {
    try {
      const rows = await sql`SELECT * FROM ${sql(table)}`;
      const outputPath = path.join(OUTPUT_DIR, `${table}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2), "utf-8");
      counts[table] = rows.length;
      console.log(`  ✅ ${table}: ${rows.length} 件`);
    } catch (err: any) {
      console.error(`  ❌ ${table}: エラー - ${err.message}`);
    }
  }

  const meta = {
    exportedAt: new Date().toISOString(),
    sourceUrl: SOURCE_URL.replace(/:([^:@]+)@/, ":***@"),
    counts,
  };
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "_meta.json"),
    JSON.stringify(meta, null, 2)
  );

  console.log("\n📊 エクスポート完了:");
  for (const [table, count] of Object.entries(counts)) {
    console.log(`   ${table}: ${count} 件`);
  }

  await sql.end();
  console.log("\n✅ エクスポート完了！");
  console.log(`📁 データ保存先: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("❌ エクスポートエラー:", err);
  process.exit(1);
});
