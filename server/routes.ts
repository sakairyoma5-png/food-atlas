// Blueprint: javascript_log_in_with_replit
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { openai, DEFAULT_MODEL, SYSTEM_PROMPT, extractRecipeData, generateMealPlan } from "./openai";
import { 
  insertConversationSchema,
  insertMessageSchema,
  insertRecipeSchema,
  insertFoodLogSchema,
  insertMealPlanSchema,
} from "@shared/schema";
import { z } from "zod";

// Validation schemas for API endpoints
const chatCompletionSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1),
});

const recipeSaveSchema = z.object({
  isSaved: z.boolean(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes (unprotected - allows checking auth status)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Conversation routes
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertConversationSchema.parse({ ...req.body, userId });
      const conversation = await storage.createConversation(data);
      res.json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.get("/api/conversations/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      if (conversation.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Message routes
  app.get("/api/conversations/:id/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversation = await storage.getConversation(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      if (conversation.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      const messages = await storage.getMessagesByConversationId(req.params.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Chat completion route
  app.post("/api/chat/completion", isAuthenticated, async (req: any, res) => {
    try {
      const validatedBody = chatCompletionSchema.parse(req.body);
      const { conversationId, message } = validatedBody;
      const userId = req.user.claims.sub;

      // Get or create conversation
      let conversation;
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation) {
          return res.status(404).json({ message: "Conversation not found" });
        }
        // Verify conversation ownership
        if (conversation.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        conversation = await storage.createConversation({
          userId,
          title: message.substring(0, 50),
        });
      }

      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        role: "user",
        content: message,
      });

      // Get conversation history
      const messages = await storage.getMessagesByConversationId(conversation.id);
      
      // Call OpenAI
      const completion = await openai.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          ...messages.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
        ],
        max_completion_tokens: 8192,
      });

      const assistantMessage = completion.choices[0].message.content || "";

      // Extract recipe data from assistant message
      const { text, recipes } = extractRecipeData(assistantMessage);

      // Save assistant message (text only, without JSON)
      await storage.createMessage({
        conversationId: conversation.id,
        role: "assistant",
        content: text,
      });

      // Save recipes if any were extracted
      const savedRecipes = [];
      for (const recipeData of recipes) {
        try {
          const recipe = await storage.createRecipe({
            userId,
            conversationId: conversation.id,
            name: recipeData.name,
            region: recipeData.region,
            description: recipeData.description,
            ingredients: recipeData.ingredients,
            instructions: recipeData.instructions,
            cookingTime: recipeData.cookingTime,
            difficulty: recipeData.difficulty,
            servings: recipeData.servings,
            nutrition: recipeData.nutrition,
            isSaved: false,
          });
          savedRecipes.push(recipe);
        } catch (err) {
          console.error("Failed to save recipe:", err);
        }
      }

      res.json({
        conversationId: conversation.id,
        message: text,
        recipes: savedRecipes,
      });
    } catch (error) {
      console.error("Error in chat completion:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to complete chat" });
    }
  });

  // Recipe routes
  app.get("/api/recipes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversationId = req.query.conversationId as string | undefined;
      
      let recipes;
      if (conversationId) {
        // Verify conversation ownership
        const conversation = await storage.getConversation(conversationId);
        if (!conversation || conversation.userId !== userId) {
          return res.status(403).json({ message: "Access denied" });
        }
        recipes = await storage.getRecipesByConversationId(conversationId);
      } else {
        recipes = await storage.getRecipesByUserId(userId);
      }
      
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  app.get("/api/recipes/saved", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipes = await storage.getSavedRecipesByUserId(userId);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      res.status(500).json({ message: "Failed to fetch saved recipes" });
    }
  });

  app.get("/api/recipes/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (recipe.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ message: "Failed to fetch recipe" });
    }
  });

  app.post("/api/recipes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertRecipeSchema.parse({ ...req.body, userId });
      const recipe = await storage.createRecipe(data);
      res.json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create recipe" });
    }
  });

  app.patch("/api/recipes/:id/save", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedBody = recipeSaveSchema.parse(req.body);
      const { isSaved } = validatedBody;
      
      // Verify recipe ownership before updating
      const existingRecipe = await storage.getRecipe(req.params.id);
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      if (existingRecipe.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const recipe = await storage.updateRecipeSaveStatus(req.params.id, isSaved);
      res.json(recipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update recipe" });
    }
  });

  // Food log routes
  app.get("/api/logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getFoodLogsByUserId(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching food logs:", error);
      res.status(500).json({ message: "Failed to fetch food logs" });
    }
  });

  app.post("/api/logs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertFoodLogSchema.parse({ ...req.body, userId });
      const log = await storage.createFoodLog(data);
      res.json(log);
    } catch (error) {
      console.error("Error creating food log:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create food log" });
    }
  });

  app.delete("/api/logs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify food log ownership before deleting
      const existingLog = await storage.getFoodLog(req.params.id);
      if (!existingLog) {
        return res.status(404).json({ message: "Food log not found" });
      }
      if (existingLog.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteFoodLog(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting food log:", error);
      res.status(500).json({ message: "Failed to delete food log" });
    }
  });

  // Region routes (public)
  app.get("/api/regions", async (req, res) => {
    try {
      const regions = await storage.getAllRegions();
      res.json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  app.get("/api/regions/:id", async (req, res) => {
    try {
      const region = await storage.getRegion(req.params.id);
      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }
      res.json(region);
    } catch (error) {
      console.error("Error fetching region:", error);
      res.status(500).json({ message: "Failed to fetch region" });
    }
  });

  // Meal plan routes
  app.get("/api/meal-plans", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const mealPlans = await storage.getMealPlansByUserId(userId);
      res.json(mealPlans);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  app.get("/api/meal-plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const mealPlan = await storage.getMealPlan(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      if (mealPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(mealPlan);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
      res.status(500).json({ message: "Failed to fetch meal plan" });
    }
  });

  app.post("/api/meal-plans/generate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { budget, preferences, startDate, endDate } = req.body;

      if (!budget || budget <= 0) {
        return res.status(400).json({ message: "Invalid budget" });
      }

      // Check if user has premium access for this feature
      const subscription = await storage.getUserSubscription(userId);
      const isPremium = subscription?.plan === "premium" && subscription?.status === "active";

      // Enforce premium requirement for meal plan generation
      if (!isPremium) {
        return res.status(403).json({ 
          message: "この機能はプレミアムプラン限定です",
          requiresPremium: true,
        });
      }

      // Generate meal plan using OpenAI
      const generatedPlan = await generateMealPlan(budget, preferences);

      // Calculate dates if not provided
      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

      // Save meal plan to database
      const mealPlanData = {
        userId,
        title: `${budget.toLocaleString()}円の月間献立プラン`,
        budget,
        startDate: start,
        endDate: end,
        recipes: generatedPlan.recipes || [],
        shoppingList: generatedPlan.shoppingList || [],
        totalEstimatedCost: generatedPlan.estimatedCost || budget,
        notes: generatedPlan.tips || "",
        isPremium,
      };

      const validation = insertMealPlanSchema.safeParse(mealPlanData);
      
      if (!validation.success) {
        console.error("Meal plan validation failed:", validation.error.errors);
        console.error("Generated data:", JSON.stringify(generatedPlan, null, 2));
        return res.status(400).json({ 
          message: "献立プランの生成に失敗しました。もう一度お試しください。", 
          errors: validation.error.errors 
        });
      }

      const mealPlan = await storage.createMealPlan(validation.data);

      res.json(mealPlan);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "献立プランの生成に失敗しました" });
    }
  });

  app.delete("/api/meal-plans/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Verify meal plan ownership before deleting
      const existingPlan = await storage.getMealPlan(req.params.id);
      if (!existingPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      if (existingPlan.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      await storage.deleteMealPlan(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting meal plan:", error);
      res.status(500).json({ message: "Failed to delete meal plan" });
    }
  });

  // User subscription routes
  app.get("/api/subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let subscription = await storage.getUserSubscription(userId);
      
      // Create default free subscription if it doesn't exist
      if (!subscription) {
        subscription = await storage.createUserSubscription({
          userId,
          plan: "free",
          status: "active",
        });
      }
      
      res.json(subscription);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
