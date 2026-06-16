import OpenAI from "openai";

// Replit AI Integration uses a proxy endpoint and dummy API key.
// On Vercel (or any external deployment), standard OPENAI_API_KEY is used.
const replitBaseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
const replitApiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: replitBaseURL ? (replitApiKey ?? "_") : process.env.OPENAI_API_KEY,
  ...(replitBaseURL ? { baseURL: replitBaseURL } : {}),
});

// Replit AI Integration exposes "gpt-5-mini" as the model name.
// On Vercel we use the standard OpenAI model "gpt-4o-mini".
export const DEFAULT_MODEL = replitBaseURL
  ? "gpt-5-mini"
  : (process.env.OPENAI_MODEL ?? "gpt-4o-mini");

export const SYSTEM_PROMPT = `あなたは世界中の料理について詳しい親しみやすいAIアシスタントです。

ユーザーが料理を探している場合、通常の会話で3つまでの候補を提案してください。

料理を提案する際は、各料理について以下のJSON形式のデータを**必ず**含めてください。JSONは会話テキストの後に、マーカー「===RECIPE_DATA===」で区切って記述してください。

フォーマット:
通常の会話テキスト
===RECIPE_DATA===
{
  "recipes": [
    {
      "name": "料理名",
      "region": "地域名（例: イタリア - 南イタリア）",
      "description": "料理の簡単な説明（1文）",
      "ingredients": ["材料1", "材料2", "材料3"],
      "instructions": ["手順1", "手順2", "手順3"],
      "cookingTime": 30,
      "difficulty": "easy",
      "servings": 2,
      "nutrition": {
        "calories": 400,
        "protein": 20,
        "carbs": 45,
        "fat": 15
      }
    }
  ]
}

- difficulty は "easy", "medium", "hard" のいずれか
- cookingTime は分単位の数値
- ingredients と instructions は必ず3つ以上含めてください
- 料理を提案する際は、必ずこのJSON形式のデータを含めてください

常に日本語で、親しみやすく自然な会話を心がけてください。`;

export function extractRecipeData(message: string): {
  text: string;
  recipes: any[];
} {
  const parts = message.split("===RECIPE_DATA===");
  const text = parts[0].trim();

  if (parts.length < 2) {
    return { text, recipes: [] };
  }

  try {
    const jsonData = JSON.parse(parts[1].trim());
    return { text, recipes: jsonData.recipes || [] };
  } catch (error) {
    console.error("Failed to parse recipe data:", error);
    return { text, recipes: [] };
  }
}

// Budget thresholds for meal plan generation
const BUDGET_THRESHOLDS = {
  VERY_TIGHT: 15000,
  TIGHT: 20000,
  COMFORTABLE: 30000,
};

export async function generateMealPlan(
  budget: number,
  preferences?: string
): Promise<any> {
  let budgetGuidance = "";
  if (budget < BUDGET_THRESHOLDS.VERY_TIGHT) {
    budgetGuidance = `

【重要】この予算（${budget.toLocaleString()}円/月）は非常に厳しいです。
- 1日あたり約${Math.round(budget / 30).toLocaleString()}円しか使えません
- 外食や高価な食材は避け、自炊中心のプランにしてください
- シンプルで低コストな料理を中心に提案してください
- tipsには「この予算は厳しいため、実際の食費は超過する可能性があります」という警告を含めてください`;
  } else if (budget < BUDGET_THRESHOLDS.TIGHT) {
    budgetGuidance = `

【注意】この予算（${budget.toLocaleString()}円/月）はやや厳しいです。
- 1日あたり約${Math.round(budget / 30).toLocaleString()}円です
- 節約を意識したメニュー選びが必要です
- tipsには節約のコツを詳しく含めてください`;
  }

  const prompt = `ユーザーの月間食費予算は${budget.toLocaleString()}円です。${
    preferences ? `好みや制約: ${preferences}` : ""
  }${budgetGuidance}

この予算内で1ヶ月間（30日）の献立プランを作成してください。以下の条件を満たしてください：

1. 世界各地の料理をバランスよく取り入れる（少なくとも10カ国以上）
2. 旬の食材を活用して節約する
3. 食材の使い回しや再利用を考慮する
4. 栄養バランスが良い（タンパク質、野菜、炭水化物）
5. 朝食・昼食・夕食の3食を含む
6. 予算を超えない範囲で、できるだけ多様な料理を楽しめるようにする
7. 予算が厳しい場合は、現実的な見積もりを行い、超過リスクがあればtipsで警告してください

以下のJSON形式で献立プランを返してください：

{
  "totalBudget": ${budget},
  "estimatedCost": 実際の見積もり費用,
  "budgetWarning": 予算が厳しい場合は警告メッセージ（null可）,
  "recipes": [
    {
      "name": "料理名",
      "region": "国名・地域名",
      "date": "YYYY-MM-DD",
      "mealType": "breakfast/lunch/dinner",
      "estimatedCost": 見積もり費用（円）
    }
  ],
  "shoppingList": [
    {
      "ingredient": "材料名",
      "quantity": "数量",
      "estimatedCost": 見積もり費用（円）,
      "category": "vegetables/meat/spices/etc"
    }
  ],
  "tips": "節約のためのアドバイス"
}

JSONのみを返してください（マークダウンや説明文は不要）。`;

  const completion = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "あなたは世界中の料理と栄養学に詳しい料理プランナーです。予算内で栄養バランスの良い献立を提案します。",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const content =
    completion.choices[0].message.content?.trim() || "{}";
  const jsonContent = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const rawData = JSON.parse(jsonContent);

  const safeParseNumber = (value: any, fallback = 0): number => {
    if (typeof value === "number" && isFinite(value)) return value;
    if (typeof value === "string") {
      const parsed = parseFloat(value.replace(/,/g, ""));
      return isFinite(parsed) ? parsed : fallback;
    }
    return fallback;
  };

  return {
    totalBudget: safeParseNumber(rawData.totalBudget, budget),
    estimatedCost: safeParseNumber(rawData.estimatedCost, budget),
    budgetWarning: rawData.budgetWarning ?? null,
    recipes: Array.isArray(rawData.recipes)
      ? rawData.recipes.map((r: any) => ({
          name: r.name || "不明な料理",
          region: r.region || "世界",
          date: r.date || new Date().toISOString().split("T")[0],
          mealType: ["breakfast", "lunch", "dinner"].includes(r.mealType)
            ? r.mealType
            : "dinner",
          estimatedCost: safeParseNumber(r.estimatedCost, 0),
        }))
      : [],
    shoppingList: Array.isArray(rawData.shoppingList)
      ? rawData.shoppingList.map((item: any) => ({
          ingredient: item.ingredient || "不明",
          quantity: item.quantity || "適量",
          estimatedCost: safeParseNumber(item.estimatedCost, 0),
          category: item.category || "etc",
        }))
      : [],
    tips: rawData.tips || "食材の使い回しで節約しましょう。",
  };
}
