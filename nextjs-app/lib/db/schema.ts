import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").unique(),
  email: varchar("email").unique(),
  displayName: text("display_name"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const regions = pgTable("regions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  nameJa: text("name_ja"),
  country: text("country"),
  continent: text("continent"),
  description: text("description"),
  culturalInfo: text("cultural_info"),
  sampleDishes: text("sample_dishes").array(),
});

export const insertRegionSchema = createInsertSchema(regions).omit({ id: true });
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id")
    .notNull()
    .references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

const alternativeIngredientSchema = z.object({
  original: z.string(),
  alternatives: z.array(z.string()),
  reason: z.string().optional(),
});

const nutritionSchema = z.object({
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
  fiber: z.number().optional(),
});

export type AlternativeIngredient = z.infer<typeof alternativeIngredientSchema>;
export type Nutrition = z.infer<typeof nutritionSchema>;

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").references(() => conversations.id),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  regionId: varchar("region_id").references(() => regions.id),
  name: text("name").notNull(),
  region: text("region").notNull(),
  description: text("description"),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  cookingTime: integer("cooking_time"),
  difficulty: text("difficulty"),
  servings: integer("servings"),
  alternatives: jsonb("alternatives").$type<AlternativeIngredient[]>(),
  nutrition: jsonb("nutrition").$type<Nutrition>(),
  imageUrl: text("image_url"),
  culturalFacts: text("cultural_facts").array(),
  isSaved: boolean("is_saved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes)
  .omit({ id: true, createdAt: true })
  .extend({
    alternatives: z.array(alternativeIngredientSchema).optional(),
    nutrition: nutritionSchema.optional(),
  });

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export const foodLogs = pgTable("food_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  recipeId: varchar("recipe_id").references(() => recipes.id),
  regionId: varchar("region_id").references(() => regions.id),
  dishName: text("dish_name").notNull(),
  region: text("region"),
  type: text("type").notNull(),
  rating: integer("rating"),
  notes: text("notes"),
  imageUrl: text("image_url"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFoodLogSchema = createInsertSchema(foodLogs).omit({
  id: true,
  createdAt: true,
});

export type InsertFoodLog = z.infer<typeof insertFoodLogSchema>;
export type FoodLog = typeof foodLogs.$inferSelect;

export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  gracePeriodEnd: timestamp("grace_period_end"),
  lastPaymentDate: timestamp("last_payment_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertUserSubscriptionSchema = createInsertSchema(
  userSubscriptions
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertUserSubscription = z.infer<
  typeof insertUserSubscriptionSchema
>;
export type UserSubscription = typeof userSubscriptions.$inferSelect;

const mealPlanRecipeSchema = z.object({
  recipeId: z.string().optional(),
  name: z.string(),
  region: z.string(),
  date: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  estimatedCost: z.number().optional(),
});

const shoppingListItemSchema = z.object({
  ingredient: z.string(),
  quantity: z.string().optional(),
  estimatedCost: z.number().optional(),
  category: z.string().optional(),
  affiliateLink: z.string().optional(),
});

export type MealPlanRecipe = z.infer<typeof mealPlanRecipeSchema>;
export type ShoppingListItem = z.infer<typeof shoppingListItemSchema>;

export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  budget: integer("budget").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  recipes: jsonb("recipes").$type<MealPlanRecipe[]>().notNull(),
  shoppingList: jsonb("shopping_list").$type<ShoppingListItem[]>(),
  totalEstimatedCost: integer("total_estimated_cost"),
  notes: text("notes"),
  isPremium: boolean("is_premium").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const insertMealPlanSchema = createInsertSchema(mealPlans)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    recipes: z.array(mealPlanRecipeSchema),
    shoppingList: z.array(shoppingListItemSchema).optional(),
  });

export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
