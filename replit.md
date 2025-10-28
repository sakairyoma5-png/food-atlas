# Food Atlas

## Overview

Food Atlas is a web application designed to allow users to explore global cuisine through AI-driven conversation. Users can discover recipes, learn cooking techniques, and log their culinary experiences. The project aims to provide a rich, interactive platform for food enthusiasts, with future ambitions to integrate meal planning, ingredient purchasing, and restaurant reservations. It seeks to combine the aesthetics of popular platforms like Tasty, Airbnb, and Duolingo.

## User Preferences

- 言語: 日本語
- 認証方式: Replit Auth（Google、GitHub、メール/パスワード）
- データ永続化: PostgreSQLデータベース使用
- AI統合: Replit AI Integrationsを使用（APIキー不要、Replitクレジットで課金）

## System Architecture

The application is built with a modern web stack:

-   **Frontend**: React, TypeScript, Vite, Wouter for routing, TailwindCSS for styling, and shadcn/ui for UI components.
    -   **UI/UX**: Features a warm, food-themed color palette (Olive Green, Terracotta Orange, Golden Yellow, Cream/Beige). Uses Playfair Display for headings, Inter for body text, and Caveat for a handwritten feel.
    -   **Key Features**: AI chat for recipe exploration, recipe detail pages (including affiliate links), an interactive world map for regional selection, and a food logging system.
-   **Backend**: Express.js with Node.js. Handles API routes, authentication, and data persistence.
-   **Database**: PostgreSQL, hosted on Neon.
-   **AI**: OpenAI API (GPT-5-mini) integrated via Replit AI Integrations for conversational capabilities and meal plan generation.
-   **Authentication**: Replit Auth for user management and session handling.
-   **Monetization**: Implemented through affiliate links on recipe pages and a premium subscription model for advanced features like budget-based meal plan generation.

## External Dependencies

-   **OpenAI API**: Used for AI chat functionality (recipe discovery, meal plan generation).
-   **PostgreSQL (Neon)**: Primary database for all application data.
-   **Replit Auth**: Authentication service for user login.
-   **react-simple-maps**: Library for rendering the interactive world map.
-   **Stripe**: Planned integration for payment processing for premium subscriptions.
-   **Amazon & Rakuten**: Integrated for affiliate links on recipe detail pages.