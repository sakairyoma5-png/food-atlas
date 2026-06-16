import { db } from "./index";
import {
  conversations,
  messages,
  recipes,
  regions,
  type InsertConversation,
  type InsertMessage,
  type InsertRecipe,
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
  const result = await db
    .insert(conversations)
    .values(data)
    .returning();
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
