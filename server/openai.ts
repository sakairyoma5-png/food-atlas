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
