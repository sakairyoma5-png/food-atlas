// Blueprint: javascript_openai_ai_integrations
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
export const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

export const DEFAULT_MODEL = "gpt-5-mini";

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

// レシピデータを抽出する関数
export function extractRecipeData(message: string): { text: string; recipes: any[] } {
  const parts = message.split('===RECIPE_DATA===');
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

// 予算ベースの献立プランを生成する関数
export async function generateMealPlan(budget: number, preferences?: string): Promise<any> {
  const prompt = `ユーザーの月間食費予算は${budget.toLocaleString()}円です。${preferences ? `好みや制約: ${preferences}` : ''}

この予算内で1ヶ月間（30日）の献立プランを作成してください。以下の条件を満たしてください：

1. 世界各地の料理をバランスよく取り入れる（少なくとも10カ国以上）
2. 旬の食材を活用して節約する
3. 食材の使い回しや再利用を考慮する
4. 栄養バランスが良い（タンパク質、野菜、炭水化物）
5. 朝食・昼食・夕食の3食を含む
6. 予算を超えない範囲で、できるだけ多様な料理を楽しめるようにする

以下のJSON形式で献立プランを返してください：

{
  "totalBudget": ${budget},
  "estimatedCost": 実際の見積もり費用,
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

  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: "あなたは世界中の料理と栄養学に詳しい料理プランナーです。予算内で栄養バランスの良い献立を提案します。" },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content?.trim() || "{}";
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    const rawData = JSON.parse(jsonContent);
    
    // Helper to safely parse numbers
    const safeParseNumber = (value: any, fallback: number = 0): number => {
      if (typeof value === 'number' && isFinite(value)) {
        return value;
      }
      if (typeof value === 'string') {
        // Remove commas and parse
        const cleaned = value.replace(/,/g, '');
        const parsed = parseFloat(cleaned);
        return isFinite(parsed) ? parsed : fallback;
      }
      return fallback;
    };
    
    // Coerce numeric strings to numbers and ensure required fields
    const normalizedData = {
      totalBudget: safeParseNumber(rawData.totalBudget, budget),
      estimatedCost: safeParseNumber(rawData.estimatedCost, budget),
      recipes: Array.isArray(rawData.recipes) ? rawData.recipes.map((recipe: any) => ({
        name: recipe.name || "不明な料理",
        region: recipe.region || "世界",
        date: recipe.date || new Date().toISOString().split('T')[0],
        mealType: ["breakfast", "lunch", "dinner"].includes(recipe.mealType) ? recipe.mealType : "dinner",
        estimatedCost: safeParseNumber(recipe.estimatedCost, 0),
      })) : [],
      shoppingList: Array.isArray(rawData.shoppingList) ? rawData.shoppingList.map((item: any) => ({
        ingredient: item.ingredient || "不明",
        quantity: item.quantity || "適量",
        estimatedCost: safeParseNumber(item.estimatedCost, 0),
        category: item.category || "etc",
      })) : [],
      tips: rawData.tips || "食材の使い回しで節約しましょう。",
    };
    
    return normalizedData;
  } catch (error) {
    console.error("Failed to generate meal plan:", error);
    throw error;
  }
}
