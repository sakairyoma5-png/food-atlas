import { db } from "./index";
import {
  conversations,
  messages,
  recipes,
  regions,
  foodLogs,
  userSubscriptions,
  mealPlans,
  type InsertConversation,
  type InsertMessage,
  type InsertRecipe,
  type InsertFoodLog,
  type InsertUserSubscription,
  type InsertMealPlan,
} from "./schema";
import { eq, and, desc } from "drizzle-orm";

// Conversation queries
export async function getConversationsByUserId(userId: string) {
  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt));
}

export async function getConversationById(id: string) {
  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createConversation(data: InsertConversation) {
  const result = await db.insert(conversations).values(data).returning();
  return result[0];
}

// Message queries
export async function getMessagesByConversationId(conversationId: string) {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

export async function createMessage(data: InsertMessage) {
  const result = await db.insert(messages).values(data).returning();
  return result[0];
}

// Recipe queries
export async function getRecipesByUserId(userId: string) {
  return db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(desc(recipes.createdAt));
}

export async function getSavedRecipesByUserId(userId: string) {
  return db
    .select()
    .from(recipes)
    .where(and(eq(recipes.userId, userId), eq(recipes.isSaved, true)))
    .orderBy(desc(recipes.createdAt));
}

export async function getRecipesByConversationId(conversationId: string) {
  return db
    .select()
    .from(recipes)
    .where(eq(recipes.conversationId, conversationId))
    .orderBy(desc(recipes.createdAt));
}

export async function getRecipeById(id: string) {
  const result = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createRecipe(data: InsertRecipe) {
  const result = await db.insert(recipes).values(data).returning();
  return result[0];
}

export async function updateRecipeSaveStatus(id: string, isSaved: boolean) {
  const result = await db
    .update(recipes)
    .set({ isSaved })
    .where(eq(recipes.id, id))
    .returning();
  return result[0];
}

// Region queries
export async function getAllRegions() {
  return db.select().from(regions);
}

export async function getRegionById(id: string) {
  const result = await db
    .select()
    .from(regions)
    .where(eq(regions.id, id))
    .limit(1);
  return result[0] ?? null;
}

// Food log queries
export async function getFoodLogsByUserId(userId: string) {
  return db
    .select()
    .from(foodLogs)
    .where(eq(foodLogs.userId, userId))
    .orderBy(desc(foodLogs.date));
}

export async function getFoodLogById(id: string) {
  const result = await db
    .select()
    .from(foodLogs)
    .where(eq(foodLogs.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createFoodLog(data: InsertFoodLog) {
  const result = await db.insert(foodLogs).values(data).returning();
  return result[0];
}

export async function deleteFoodLog(id: string) {
  await db.delete(foodLogs).where(eq(foodLogs.id, id));
}

// Subscription queries
export async function getUserSubscription(userId: string) {
  const result = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .limit(1);
  return result[0] ?? null;
}

export async function createUserSubscription(data: InsertUserSubscription) {
  const result = await db.insert(userSubscriptions).values(data).returning();
  return result[0];
}

export async function updateUserSubscription(
  userId: string,
  data: Partial<InsertUserSubscription>
) {
  const result = await db
    .update(userSubscriptions)
    .set(data)
    .where(eq(userSubscriptions.userId, userId))
    .returning();
  return result[0] ?? null;
}

// Meal plan queries
export async function getMealPlansByUserId(userId: string) {
  return db
    .select()
    .from(mealPlans)
    .where(eq(mealPlans.userId, userId))
    .orderBy(desc(mealPlans.createdAt));
}

export async function getMealPlanById(id: string) {
  const result = await db
    .select()
    .from(mealPlans)
    .where(eq(mealPlans.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createMealPlan(data: InsertMealPlan) {
  const result = await db.insert(mealPlans).values(data).returning();
  return result[0];
}

export async function deleteMealPlan(id: string) {
  await db.delete(mealPlans).where(eq(mealPlans.id, id));
}
