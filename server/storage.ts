// Blueprint: javascript_database
import { 
  users, 
  conversations,
  messages,
  recipes,
  foodLogs,
  regions,
  type User, 
  type InsertUser,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Recipe,
  type InsertRecipe,
  type FoodLog,
  type InsertFoodLog,
  type Region,
  type InsertRegion,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation operations
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUserId(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, title: string): Promise<Conversation | undefined>;

  // Message operations
  getMessagesByConversationId(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Recipe operations
  getRecipe(id: string): Promise<Recipe | undefined>;
  getRecipesByUserId(userId: string): Promise<Recipe[]>;
  getSavedRecipesByUserId(userId: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipeSaveStatus(id: string, isSaved: boolean): Promise<Recipe | undefined>;

  // Food log operations
  getFoodLog(id: string): Promise<FoodLog | undefined>;
  getFoodLogsByUserId(userId: string): Promise<FoodLog[]>;
  createFoodLog(foodLog: InsertFoodLog): Promise<FoodLog>;
  deleteFoodLog(id: string): Promise<void>;

  // Region operations
  getRegion(id: string): Promise<Region | undefined>;
  getRegionByName(name: string): Promise<Region | undefined>;
  getAllRegions(): Promise<Region[]>;
  createRegion(region: InsertRegion): Promise<Region>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Conversation operations
  async getConversation(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getConversationsByUserId(userId: string): Promise<Conversation[]> {
    return db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async updateConversation(id: string, title: string): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  // Message operations
  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    return db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  // Recipe operations
  async getRecipe(id: string): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe || undefined;
  }

  async getRecipesByUserId(userId: string): Promise<Recipe[]> {
    return db
      .select()
      .from(recipes)
      .where(eq(recipes.userId, userId))
      .orderBy(desc(recipes.createdAt));
  }

  async getSavedRecipesByUserId(userId: string): Promise<Recipe[]> {
    return db
      .select()
      .from(recipes)
      .where(and(eq(recipes.userId, userId), eq(recipes.isSaved, true)))
      .orderBy(desc(recipes.createdAt));
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db
      .insert(recipes)
      .values(insertRecipe)
      .returning();
    return recipe;
  }

  async updateRecipeSaveStatus(id: string, isSaved: boolean): Promise<Recipe | undefined> {
    const [recipe] = await db
      .update(recipes)
      .set({ isSaved })
      .where(eq(recipes.id, id))
      .returning();
    return recipe || undefined;
  }

  // Food log operations
  async getFoodLog(id: string): Promise<FoodLog | undefined> {
    const [foodLog] = await db.select().from(foodLogs).where(eq(foodLogs.id, id));
    return foodLog || undefined;
  }

  async getFoodLogsByUserId(userId: string): Promise<FoodLog[]> {
    return db
      .select()
      .from(foodLogs)
      .where(eq(foodLogs.userId, userId))
      .orderBy(desc(foodLogs.date));
  }

  async createFoodLog(insertFoodLog: InsertFoodLog): Promise<FoodLog> {
    const [foodLog] = await db
      .insert(foodLogs)
      .values(insertFoodLog)
      .returning();
    return foodLog;
  }

  async deleteFoodLog(id: string): Promise<void> {
    await db.delete(foodLogs).where(eq(foodLogs.id, id));
  }

  // Region operations
  async getRegion(id: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.id, id));
    return region || undefined;
  }

  async getRegionByName(name: string): Promise<Region | undefined> {
    const [region] = await db.select().from(regions).where(eq(regions.name, name));
    return region || undefined;
  }

  async getAllRegions(): Promise<Region[]> {
    return db.select().from(regions).orderBy(regions.name);
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const [region] = await db
      .insert(regions)
      .values(insertRegion)
      .returning();
    return region;
  }
}

export const storage = new DatabaseStorage();
