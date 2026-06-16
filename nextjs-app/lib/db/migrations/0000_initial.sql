-- Food Atlas — initial schema migration
-- Generated from lib/db/schema.ts
-- Run with: npm run db:push   (or npm run db:migrate after npm run db:generate)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users (mirrors Supabase auth.users by id)
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" text UNIQUE,
  "email" varchar UNIQUE,
  "display_name" text,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Regions
CREATE TABLE IF NOT EXISTS "regions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL UNIQUE,
  "name_ja" text,
  "country" text,
  "continent" text,
  "description" text,
  "cultural_info" text,
  "sample_dishes" text[]
);

-- Conversations
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL REFERENCES "users"("id"),
  "title" text,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Messages
CREATE TABLE IF NOT EXISTS "messages" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversation_id" varchar NOT NULL REFERENCES "conversations"("id"),
  "role" text NOT NULL,
  "content" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Recipes
CREATE TABLE IF NOT EXISTS "recipes" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversation_id" varchar REFERENCES "conversations"("id"),
  "user_id" varchar NOT NULL REFERENCES "users"("id"),
  "region_id" varchar REFERENCES "regions"("id"),
  "name" text NOT NULL,
  "region" text NOT NULL,
  "description" text,
  "ingredients" text[] NOT NULL,
  "instructions" text[] NOT NULL,
  "cooking_time" integer,
  "difficulty" text,
  "servings" integer,
  "alternatives" jsonb,
  "nutrition" jsonb,
  "image_url" text,
  "cultural_facts" text[],
  "is_saved" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Food Logs
CREATE TABLE IF NOT EXISTS "food_logs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL REFERENCES "users"("id"),
  "recipe_id" varchar REFERENCES "recipes"("id"),
  "region_id" varchar REFERENCES "regions"("id"),
  "dish_name" text NOT NULL,
  "region" text,
  "type" text NOT NULL,
  "rating" integer,
  "notes" text,
  "image_url" text,
  "date" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- User Subscriptions
CREATE TABLE IF NOT EXISTS "user_subscriptions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL UNIQUE REFERENCES "users"("id"),
  "plan" text NOT NULL DEFAULT 'free',
  "status" text NOT NULL DEFAULT 'active',
  "stripe_customer_id" varchar,
  "stripe_subscription_id" varchar,
  "current_period_start" timestamp,
  "current_period_end" timestamp,
  "grace_period_end" timestamp,
  "last_payment_date" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Meal Plans
CREATE TABLE IF NOT EXISTS "meal_plans" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL REFERENCES "users"("id"),
  "title" text NOT NULL,
  "budget" integer NOT NULL,
  "start_date" timestamp NOT NULL,
  "end_date" timestamp NOT NULL,
  "recipes" jsonb NOT NULL,
  "shopping_list" jsonb,
  "total_estimated_cost" integer,
  "notes" text,
  "is_premium" boolean NOT NULL DEFAULT false,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
