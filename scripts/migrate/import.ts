/**
 * Food Atlas データインポートスクリプト
 * JSONファイルからSupabase DBにデータをインポートします
 *
 * 使い方:
 *   TARGET_DB_URL=<supabase_connection_string> npx tsx scripts/migrate/import.ts
 *
 * 環境変数:
 *   TARGET_DB_URL  - インポート先DBの接続文字列（必須）
 *   DATA_DIR       - データディレクトリ（省略時は scripts/migrate/data）
 *   REMAP_USERS    - "true" にすると Supabase Auth UUID へのユーザーIDリマップを有効化
 *
 * ユーザーIDリマップについて:
 *   既存データのユーザーIDはReplit Auth形式（例: "47471549"）です。
 *   SupabaseではユーザーIDはUUID形式になります。
 *   REMAP_USERS=true の場合、auth.users テーブルのメールアドレスで照合して
 *   IDを自動変換します。対応するSupabaseユーザーがいない場合はスキップされます。
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";

const TARGET_URL = process.env.TARGET_DB_URL!;
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const REMAP_USERS = process.env.REMAP_USERS === "true";

if (!TARGET_URL) {
  console.error("❌ TARGET_DB_URL を設定してください");
  console.error("   例: TARGET_DB_URL=postgresql://... npx tsx scripts/migrate/import.ts");
  process.exit(1);
}

function loadTable<T>(tableName: string): T[] {
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️  ${tableName}.json が見つかりません。スキップします。`);
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

async function buildUserIdMap(sql: ReturnType<typeof postgres>, users: any[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  console.log("  🔑 Supabase Authユーザーとメールアドレスでマッピング中...");
  for (const user of users) {
    if (!user.email) continue;
    try {
      // Supabase の auth.users テーブルを検索
      const rows = await sql`
        SELECT id FROM auth.users WHERE email = ${user.email} LIMIT 1
      `;
      if (rows.length > 0) {
        map.set(user.id, rows[0].id);
        console.log(`    ✅ ${user.email}: ${user.id} → ${rows[0].id}`);
      } else {
        console.log(`    ⚠️  ${user.email}: Supabase Authに対応ユーザーなし。スキップ。`);
      }
    } catch {
      // auth.usersへのアクセス権がない場合はIDをそのまま使用
      map.set(user.id, user.id);
    }
  }
  return map;
}

async function upsertUsers(sql: ReturnType<typeof postgres>, users: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const user of users) {
    const newId = idMap.get(user.id) || user.id;
    try {
      await sql`
        INSERT INTO users (id, username, email, display_name, first_name, last_name, profile_image_url, created_at, updated_at)
        VALUES (
          ${newId}, ${user.username}, ${user.email}, ${user.display_name},
          ${user.first_name}, ${user.last_name}, ${user.profile_image_url},
          ${user.created_at}, ${user.updated_at}
        )
        ON CONFLICT (id) DO UPDATE SET
          username = EXCLUDED.username,
          email = EXCLUDED.email,
          display_name = EXCLUDED.display_name,
          updated_at = EXCLUDED.updated_at
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  ユーザー ${user.email} のインポートをスキップ: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertRegions(sql: ReturnType<typeof postgres>, regions: any[]) {
  let inserted = 0;
  for (const r of regions) {
    try {
      await sql`
        INSERT INTO regions (id, name, name_ja, country, continent, description, cultural_info, sample_dishes)
        VALUES (${r.id}, ${r.name}, ${r.name_ja}, ${r.country}, ${r.continent}, ${r.description}, ${r.cultural_info}, ${r.sample_dishes})
        ON CONFLICT (name) DO UPDATE SET
          name_ja = EXCLUDED.name_ja,
          country = EXCLUDED.country,
          continent = EXCLUDED.continent,
          description = EXCLUDED.description,
          cultural_info = EXCLUDED.cultural_info,
          sample_dishes = EXCLUDED.sample_dishes
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  地域 ${r.name} のインポートをスキップ: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertConversations(sql: ReturnType<typeof postgres>, rows: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const row of rows) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (!idMap.has(row.user_id) && REMAP_USERS) {
      console.warn(`    ⚠️  会話 ${row.id}: ユーザー ${row.user_id} がマップに存在しません。スキップ。`);
      continue;
    }
    try {
      await sql`
        INSERT INTO conversations (id, user_id, title, created_at, updated_at)
        VALUES (${row.id}, ${userId}, ${row.title}, ${row.created_at}, ${row.updated_at})
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  会話 ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertMessages(sql: ReturnType<typeof postgres>, rows: any[]) {
  let inserted = 0;
  for (const row of rows) {
    try {
      await sql`
        INSERT INTO messages (id, conversation_id, role, content, created_at)
        VALUES (${row.id}, ${row.conversation_id}, ${row.role}, ${row.content}, ${row.created_at})
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  メッセージ ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertRecipes(sql: ReturnType<typeof postgres>, rows: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const row of rows) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (!idMap.has(row.user_id) && REMAP_USERS) {
      console.warn(`    ⚠️  レシピ ${row.id}: ユーザー ${row.user_id} がマップに存在しません。スキップ。`);
      continue;
    }
    try {
      await sql`
        INSERT INTO recipes (id, conversation_id, user_id, region_id, name, region, description,
          ingredients, instructions, cooking_time, difficulty, servings, alternatives,
          nutrition, image_url, cultural_facts, is_saved, created_at)
        VALUES (
          ${row.id}, ${row.conversation_id}, ${userId}, ${row.region_id}, ${row.name},
          ${row.region}, ${row.description}, ${row.ingredients}, ${row.instructions},
          ${row.cooking_time}, ${row.difficulty}, ${row.servings}, ${row.alternatives},
          ${row.nutrition}, ${row.image_url}, ${row.cultural_facts}, ${row.is_saved}, ${row.created_at}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  レシピ ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertFoodLogs(sql: ReturnType<typeof postgres>, rows: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const row of rows) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (!idMap.has(row.user_id) && REMAP_USERS) continue;
    try {
      await sql`
        INSERT INTO food_logs (id, user_id, recipe_id, region_id, dish_name, region, type,
          rating, notes, image_url, date, created_at)
        VALUES (
          ${row.id}, ${userId}, ${row.recipe_id}, ${row.region_id}, ${row.dish_name},
          ${row.region}, ${row.type}, ${row.rating}, ${row.notes}, ${row.image_url},
          ${row.date}, ${row.created_at}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  食事ログ ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertUserSubscriptions(sql: ReturnType<typeof postgres>, rows: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const row of rows) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (!idMap.has(row.user_id) && REMAP_USERS) continue;
    try {
      await sql`
        INSERT INTO user_subscriptions (id, user_id, plan, status, stripe_customer_id,
          stripe_subscription_id, current_period_start, current_period_end,
          grace_period_end, last_payment_date, created_at, updated_at)
        VALUES (
          ${row.id}, ${userId}, ${row.plan}, ${row.status}, ${row.stripe_customer_id},
          ${row.stripe_subscription_id}, ${row.current_period_start}, ${row.current_period_end},
          ${row.grace_period_end}, ${row.last_payment_date}, ${row.created_at}, ${row.updated_at}
        )
        ON CONFLICT (user_id) DO UPDATE SET
          plan = EXCLUDED.plan,
          status = EXCLUDED.status,
          updated_at = EXCLUDED.updated_at
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  サブスクリプション ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function upsertMealPlans(sql: ReturnType<typeof postgres>, rows: any[], idMap: Map<string, string>) {
  let inserted = 0;
  for (const row of rows) {
    const userId = idMap.get(row.user_id) || row.user_id;
    if (!idMap.has(row.user_id) && REMAP_USERS) continue;
    try {
      await sql`
        INSERT INTO meal_plans (id, user_id, title, budget, start_date, end_date,
          recipes, shopping_list, total_estimated_cost, notes, is_premium, created_at, updated_at)
        VALUES (
          ${row.id}, ${userId}, ${row.title}, ${row.budget}, ${row.start_date}, ${row.end_date},
          ${sql.json(row.recipes)}, ${row.shopping_list ? sql.json(row.shopping_list) : null},
          ${row.total_estimated_cost}, ${row.notes}, ${row.is_premium}, ${row.created_at}, ${row.updated_at}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      inserted++;
    } catch (err: any) {
      console.warn(`    ⚠️  献立プラン ${row.id}: ${err.message}`);
    }
  }
  return inserted;
}

async function main() {
  console.log("🚀 Food Atlas データインポート開始");
  console.log(`📂 データ元: ${DATA_DIR}`);
  console.log(`🔗 ターゲット: ${TARGET_URL.replace(/:([^:@]+)@/, ":***@")}`);
  console.log(`👤 ユーザーIDリマップ: ${REMAP_USERS ? "有効" : "無効"}`);
  console.log();

  const sql = postgres(TARGET_URL, {
    max: 5,
    ssl: TARGET_URL.includes("sslmode=require") ? "require" : false,
  });

  // データ読み込み
  const users = loadTable<any>("users");
  const regionsData = loadTable<any>("regions");
  const conversationsData = loadTable<any>("conversations");
  const messagesData = loadTable<any>("messages");
  const recipesData = loadTable<any>("recipes");
  const foodLogsData = loadTable<any>("food_logs");
  const subscriptionsData = loadTable<any>("user_subscriptions");
  const mealPlansData = loadTable<any>("meal_plans");

  // ユーザーIDマッピング
  let idMap = new Map<string, string>();
  if (REMAP_USERS) {
    idMap = await buildUserIdMap(sql, users);
  } else {
    // リマップなし: IDはそのまま使用
    for (const u of users) {
      idMap.set(u.id, u.id);
    }
  }

  // FK順序に従ってインポート
  console.log("📥 インポート中...");

  console.log("  👤 users...");
  const usersCount = await upsertUsers(sql, users, idMap);
  console.log(`     ✅ ${usersCount} 件`);

  console.log("  🌍 regions...");
  const regionsCount = await upsertRegions(sql, regionsData);
  console.log(`     ✅ ${regionsCount} 件`);

  console.log("  💬 conversations...");
  const convCount = await upsertConversations(sql, conversationsData, idMap);
  console.log(`     ✅ ${convCount} 件`);

  console.log("  📨 messages...");
  const msgCount = await upsertMessages(sql, messagesData);
  console.log(`     ✅ ${msgCount} 件`);

  console.log("  🍳 recipes...");
  const recipeCount = await upsertRecipes(sql, recipesData, idMap);
  console.log(`     ✅ ${recipeCount} 件`);

  console.log("  📝 food_logs...");
  const logCount = await upsertFoodLogs(sql, foodLogsData, idMap);
  console.log(`     ✅ ${logCount} 件`);

  console.log("  💳 user_subscriptions...");
  const subCount = await upsertUserSubscriptions(sql, subscriptionsData, idMap);
  console.log(`     ✅ ${subCount} 件`);

  console.log("  📅 meal_plans...");
  const planCount = await upsertMealPlans(sql, mealPlansData, idMap);
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

  await sql.end();
  console.log("\n✅ インポート完了！");
  console.log("\n次のステップ: verify.ts を実行して整合性を確認してください");
  console.log("  SOURCE_DB_URL=<neon_url> TARGET_DB_URL=<supabase_url> npx tsx scripts/migrate/verify.ts");
}

main().catch((err) => {
  console.error("❌ インポートエラー:", err);
  process.exit(1);
});
