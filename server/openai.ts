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

ユーザーが料理を探している場合、通常の会話で3つまでの候補を提案してください。レシピの詳細を求められたら、材料、手順、調理時間、難易度を含めて回答してください。

常に日本語で、親しみやすく自然な会話を心がけてください。`;

