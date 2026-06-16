/**
 * Food Atlas データインポートスクリプト
 * JSONファイルからSupabase DBにデータをインポートします
 *
 * 使い方（nextjs-app ディレクトリから実行）:
 *   TARGET_DB_URL=<supabase_connection_string> npm run migrate:import
 *
 * 環境変数:
 *   TARGET_DB_URL  - インポート先DBの接続文字列（必須）
 *   DATA_DIR       - データディレクトリ（省略時は ../../scripts/migrate/data）
 *   REMAP_USERS    - "true" にすると Supabase Auth UUID へのユーザーIDリマップを有効化
 *
 * ユーザーIDリマップについて:
 *   既存データのユーザーIDはReplit Auth形式（例: "47471549"）です。
 *   SupabaseではユーザーIDはUUID形式になります。
 *   REMAP_USERS=true の場合、auth.users テーブルのメールアドレスで照合して
 *   IDを自動変換します。対応するSupabaseユーザーがいない場合はスキップされます。
 */

import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { Client } = require("pg");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TARGET_URL = process.env.TARGET_DB_URL;
const DATA_DIR =
  process.env.DATA_DIR ||
  path.resolve(__dirname, "../../../scripts/migrate/data");
const REMAP_USERS = process.env.REMAP_USERS === "true";

if (!TARGET_URL) {
  console.error("❌ TARGET_DB_URL を設定してください");
  console.error("   例: TARGET_DB_URL=postgresql://... npm run migrate:import");
  process.exit(1);
}

function loadTable(tableName) {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  ${tableName}.json が見つかりません。スキップします。`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function val(v) {
  if (v === null || v === undefined) return null;
  return v;
}

async function buildUserIdMap(client, users) {
  const map = new Map();
  console.log("  🔑 Supabase Auth ユーザーとメールアドレスでマッピング中...");
  for (const user of users) {
    if (!user.email) continue;
    try {
      const res = await client.query(
        "SELECT id::text FROM auth.users WHERE email = $1 LIMIT 1",
        [user.email]
      );
      if (res.rows.length > 0) {
        map.set(user.id, res.rows[0].id);
        console.log(`    ✅ ${user.email}: ${user.id} → ${res.rows[0].id}`);
      } else {
        console.log(`    ⚠️  ${user.email}: Supabase Auth に対応ユーザーなし。スキップ。`);
      }
    } catch {
      // auth.users へのアクセス権がない場合は ID をそのまま使用
      map.set(user.id, user.id);
    }
  }
  return map;
}

async function main() {
  console.log("🚀 Food Atlas データインポート開始");
  console.log(`📂 データ元: ${DATA_DIR}`);
  console.log(`🔗 ターゲット: ${TARGET_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log(`👤 ユーザーIDリマップ: ${REMAP_USERS ? "有効" : "無効"}`);
  console.log();

  const ssl =
    TARGET_URL.includes("supabase.com") ||
    TARGET_URL.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : false;

  const client = new Client({ connectionString: TARGET_URL, ssl: ssl || undefined });
  await client.connect();

  const users = loadTable("users");
  const regionsData = loadTable("regions");
  const conversationsData = loadTable("conversations");
  const messagesData = loadTable("messages");
  const recipesData = loadTable("recipes");
  const foodLogsData = loadTable("food_logs");
  const subscriptionsData = loadTable("user_subscriptions");
  const mealPlansData = loadTable("meal_plans");

  // ユーザーIDマッピング構築
  let idMap = new Map();
  if (REMAP_USERS) {
    idMap = await buildUserIdMap(client, users);
  } else {
    for (const u of users) {
      idMap.set(u.id, u.id);
    }
  }

  console.log("📥 インポート中...");

  // 1. users
  console.log("  👤 users...");
  let usersCount = 0;
  for (const user of users) {
    const newId = idMap.get(user.id) || user.id;
    try {
      await client.query(
        `INSERT INTO users (id, username, email, display_name, first_name, last_name, profile_image_url, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
         ON CONFLICT (id) DO UPDATE SET
           username = EXCLUDED.username,
           email = EXCLUDED.email,
           display_name = EXCLUDED.display_name,
           updated_at = EXCLUDED.updated_at`,
        [newId, val(user.username), val(user.email), val(user.display_name),
         val(user.first_name), val(user.last_name), val(user.profile_image_url),
         val(user.created_at), val(user.updated_at)]
      );
      usersCount++;
    } catch (err) {
      console.warn(`    ⚠️  ユーザー ${user.email}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${usersCount} 件`);

  // 2. regions
  console.log("  🌍 regions...");
  let regionsCount = 0;
  for (const r of regionsData) {
    try {
      await client.query(
        `INSERT INTO regions (id, name, name_ja, country, continent, description, cultural_info, sample_dishes)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (name) DO UPDATE SET
           name_ja = EXCLUDED.name_ja,
           country = EXCLUDED.country,
           continent = EXCLUDED.continent,
           description = EXCLUDED.description`,
        [r.id, r.name, val(r.name_ja), val(r.country), val(r.continent),
         val(r.description), val(r.cultural_info),
         val(r.sample_dishes)]
      );
      regionsCount++;
    } catch (err) {
      console.warn(`    ⚠️  地域 ${r.name}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${regionsCount} 件`);

  // 3. conversations
  console.log("  💬 conversations...");
  let convCount = 0;
  for (const row of conversationsData) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (REMAP_USERS && !idMap.has(row.user_id)) continue;
    try {
      await client.query(
        `INSERT INTO conversations (id, user_id, title, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, userId, val(row.title), val(row.created_at), val(row.updated_at)]
      );
      convCount++;
    } catch (err) {
      console.warn(`    ⚠️  会話 ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${convCount} 件`);

  // 4. messages
  console.log("  📨 messages...");
  let msgCount = 0;
  for (const row of messagesData) {
    try {
      await client.query(
        `INSERT INTO messages (id, conversation_id, role, content, created_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, row.conversation_id, row.role, row.content, val(row.created_at)]
      );
      msgCount++;
    } catch (err) {
      console.warn(`    ⚠️  メッセージ ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${msgCount} 件`);

  // 5. recipes
  console.log("  🍳 recipes...");
  let recipeCount = 0;
  for (const row of recipesData) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (REMAP_USERS && row.user_id && !idMap.has(row.user_id)) continue;
    try {
      await client.query(
        `INSERT INTO recipes (id, conversation_id, user_id, region_id, name, region, description,
           ingredients, instructions, cooking_time, difficulty, servings, alternatives,
           nutrition, image_url, cultural_facts, is_saved, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, val(row.conversation_id), val(userId), val(row.region_id),
         row.name, val(row.region), val(row.description),
         val(row.ingredients),
         val(row.instructions),
         val(row.cooking_time), val(row.difficulty), val(row.servings),
         row.alternatives !== null && row.alternatives !== undefined ? JSON.stringify(row.alternatives) : null,
         row.nutrition !== null && row.nutrition !== undefined ? JSON.stringify(row.nutrition) : null,
         val(row.image_url),
         val(row.cultural_facts),
         val(row.is_saved), val(row.created_at)]
      );
      recipeCount++;
    } catch (err) {
      console.warn(`    ⚠️  レシピ ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${recipeCount} 件`);

  // 6. food_logs
  console.log("  📝 food_logs...");
  let logCount = 0;
  for (const row of foodLogsData) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (REMAP_USERS && !idMap.has(row.user_id)) continue;
    try {
      await client.query(
        `INSERT INTO food_logs (id, user_id, recipe_id, region_id, dish_name, region, type,
           rating, notes, image_url, date, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, userId, val(row.recipe_id), val(row.region_id),
         row.dish_name, val(row.region), val(row.type),
         val(row.rating), val(row.notes), val(row.image_url),
         val(row.date), val(row.created_at)]
      );
      logCount++;
    } catch (err) {
      console.warn(`    ⚠️  食事ログ ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${logCount} 件`);

  // 7. user_subscriptions
  console.log("  💳 user_subscriptions...");
  let subCount = 0;
  for (const row of subscriptionsData) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (REMAP_USERS && !idMap.has(row.user_id)) continue;
    try {
      await client.query(
        `INSERT INTO user_subscriptions (id, user_id, plan, status, stripe_customer_id,
           stripe_subscription_id, current_period_start, current_period_end,
           grace_period_end, last_payment_date, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (user_id) DO UPDATE SET
           plan = EXCLUDED.plan, status = EXCLUDED.status, updated_at = EXCLUDED.updated_at`,
        [row.id, userId, row.plan, row.status,
         val(row.stripe_customer_id), val(row.stripe_subscription_id),
         val(row.current_period_start), val(row.current_period_end),
         val(row.grace_period_end), val(row.last_payment_date),
         val(row.created_at), val(row.updated_at)]
      );
      subCount++;
    } catch (err) {
      console.warn(`    ⚠️  サブスクリプション ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${subCount} 件`);

  // 8. meal_plans
  console.log("  📅 meal_plans...");
  let planCount = 0;
  for (const row of mealPlansData) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (REMAP_USERS && !idMap.has(row.user_id)) continue;
    try {
      await client.query(
        `INSERT INTO meal_plans (id, user_id, title, budget, start_date, end_date,
           recipes, shopping_list, total_estimated_cost, notes, is_premium, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
         ON CONFLICT (id) DO NOTHING`,
        [row.id, userId, row.title, val(row.budget),
         val(row.start_date), val(row.end_date),
         row.recipes ? JSON.stringify(row.recipes) : null,
         row.shopping_list ? JSON.stringify(row.shopping_list) : null,
         val(row.total_estimated_cost), val(row.notes),
         val(row.is_premium), val(row.created_at), val(row.updated_at)]
      );
      planCount++;
    } catch (err) {
      console.warn(`    ⚠️  献立プラン ${row.id}: ${err.message}`);
    }
  }
  console.log(`     ✅ ${planCount} 件`);

  console.log("\n📊 インポート結果:");
  console.log(`   users:              ${usersCount} 件`);
  console.log(`   regions:            ${regionsCount} 件`);
  console.log(`   conversations:      ${convCount} 件`);
  console.log(`   messages:           ${msgCount} 件`);
  console.log(`   recipes:            ${recipeCount} 件`);
  console.log(`   food_logs:          ${logCount} 件`);
  console.log(`   user_subscriptions: ${subCount} 件`);
  console.log(`   meal_plans:         ${planCount} 件`);

  await client.end();
  console.log("\n✅ インポート完了！");
  console.log("\n次のステップ: verify を実行して整合性を確認してください");
  console.log("  SOURCE_DB_URL=<neon_url> TARGET_DB_URL=<supabase_url> npm run migrate:verify");
}

main().catch((err) => {
  console.error("❌ インポートエラー:", err);
  process.exit(1);
});
